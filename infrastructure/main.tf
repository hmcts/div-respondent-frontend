provider "azurerm" {
  features {}
}

locals {
  aseName = "core-compute-${var.env}"
  local_env = (var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env
  public_hostname = "${var.product}-${var.component}-${var.env}.service.${local.aseName}.internal"
  previewVaultName = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName = (var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName
  div_cos_url              = "http://div-cos-${local.local_env}.service.core-compute-${local.local_env}.internal"
  div_cms_url              = "http://div-cms-${local.local_env}.service.core-compute-${local.local_env}.internal"
  div_fps_url              = "http://div-fps-${local.local_env}.service.core-compute-${local.local_env}.internal"
  div_emca_url             = "http://div-emca-${local.local_env}.service.core-compute-${local.local_env}.internal"
  asp_name = var.env == "prod" ? "div-rfe-prod" : "${var.raw_product}-${var.env}"
  asp_rg = var.env == "prod" ? "div-rfe-prod" : "${var.raw_product}-${var.env}"
  appinsights_name           = var.env == "preview" ? "${var.product}-${var.reform_service_name}-appinsights-${var.env}" : "${var.product}-${var.env}"
  appinsights_resource_group = var.env == "preview" ? "${var.product}-${var.reform_service_name}-${var.env}" : "${var.product}-${var.env}"
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name  = "core-infra-${var.env}"
}

resource "azurerm_key_vault_secret" "redis_connection_string" {
  name = "${var.component}-redis-connection-string"
  value = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
  key_vault_id = data.azurerm_key_vault.div_key_vault.id
}

module "redis-cache" {
  source   = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product  = var.env != "preview" ? "${var.product}-redis" : "${var.product}-${var.reform_service_name}-redis"
  location = var.location
  env      = var.env
  subnetid = data.azurerm_subnet.core_infra_redis_subnet.id
  common_tags = var.common_tags
}

data "azurerm_key_vault" "div_key_vault" {
  name                = local.vaultName
  resource_group_name = local.vaultName
}

data "azurerm_key_vault_secret" "idam_secret" {
  name      = "idam-secret"
  key_vault_id = data.azurerm_key_vault.div_key_vault.id
}

data "azurerm_key_vault_secret" "session_secret" {
  name      = "session-secret"
  key_vault_id = data.azurerm_key_vault.div_key_vault.id
}

data "azurerm_key_vault_secret" "redis_secret" {
  name      = "redis-secret"
  key_vault_id = data.azurerm_key_vault.div_key_vault.id
}

data "azurerm_key_vault_secret" "post_code_token" {
  name      = "os-places-token"
  key_vault_id = data.azurerm_key_vault.div_key_vault.id
}

data "azurerm_key_vault_secret" "launchdarkly_key" {
  name      = "launchdarkly-key"
  key_vault_id = data.azurerm_key_vault.div_key_vault.id
}

data "azurerm_key_vault_secret" "appinsights_secret" {
  name = "AppInsightsInstrumentationKey"
  key_vault_id = data.azurerm_key_vault.div_key_vault.id
}
