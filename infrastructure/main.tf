locals {
  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
  public_hostname = "${var.product}-${var.component}-${var.env}.service.${local.aseName}.internal"
  previewVaultName = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"
  div_cos_url              = "http://div-cos-${local.local_env}.service.core-compute-${local.local_env}.internal"

  decree_nisi_frontend_url          = "${var.decree_nisi_frontend_url == "" ? "https://div-dn-${local.local_env}.service.core-compute-${local.local_env}.internal" : var.decree_nisi_frontend_url}"

  asp_name = "${var.env == "prod" ? "div-rfe-prod" : "${var.raw_product}-${var.env}"}"
  asp_rg = "${var.env == "prod" ? "div-rfe-prod" : "${var.raw_product}-${var.env}"}"
}

module "redis-cache" {
  source   = "git@github.com:hmcts/moj-module-redis?ref=master"
  product  = "${var.env != "preview" ? "${var.product}-redis" : "${var.product}-${var.reform_service_name}-redis"}"
  location = "${var.location}"
  env      = "${var.env}"
  subnetid = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[1]}"
  common_tags = "${var.common_tags}"
}

module "frontend" {
  source                        = "git@github.com:hmcts/moj-module-webapp.git?ref=master"
  product                       = "${var.product}-${var.reform_service_name}"
  location                      = "${var.location}"
  env                           = "${var.env}"
  ilbIp                         = "${var.ilbIp}"
  is_frontend                   = "${var.env != "preview" ? 1: 0}"
  subscription                  = "${var.subscription}"
  additional_host_name          = "${var.env != "preview" ? var.additional_host_name : "null"}"
  https_only                    = "true"
  capacity                      = "${var.capacity}"
  common_tags                   = "${var.common_tags}"
  asp_name                      = "${local.asp_name}"
  asp_rg                        = "${local.asp_rg}"

  app_settings = {

    // Node specific vars
    NODE_ENV = "${var.node_env}"
    NODE_PATH = "${var.node_path}"

    BASE_URL = "${var.public_protocol}://${local.public_hostname}"

    UV_THREADPOOL_SIZE = "${var.uv_threadpool_size}"
    NODE_CONFIG_DIR = "${var.node_config_dir}"

    // Logging vars
    REFORM_TEAM = "${var.reform_team}"
    REFORM_SERVICE_NAME = "${var.reform_service_name}"
    REFORM_ENVIRONMENT = "${var.env}"

    // Packages
    PACKAGES_NAME="${var.packages_name}"
    PACKAGES_PROJECT="${var.packages_project}"
    PACKAGES_ENVIRONMENT="${var.packages_environment}"
    PACKAGES_VERSION="${var.packages_version}"

    DEPLOYMENT_ENV="${var.deployment_env}"

    // Service name
    SERVICE_NAME="${var.frontend_service_name}"

    // IDAM
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_APP_HEALHCHECK_URL ="${var.idam_api_url}${var.health_endpoint}"
    IDAM_LOGIN_URL = "${var.idam_authentication_web_url}${var.idam_authentication_login_endpoint}"
    IDAM_AUTHENTICATION_HEALHCHECK_URL = "${var.idam_authentication_web_url}${var.health_endpoint}"
    IDAM_SECRET = "${data.azurerm_key_vault_secret.idam_secret.value}"

    // Redis Cloud
    REDISCLOUD_URL = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
    REDIS_ENCRYPTION_SECRET = "${data.azurerm_key_vault_secret.redis_secret.value}"

    // Encryption secrets
    SESSION_SECRET = "${data.azurerm_key_vault_secret.session_secret.value}"

    // Google Anayltics
    GOOGLE_ANALYTICS_ID           = "${var.google_analytics_tracking_id}"
    GOOGLE_ANALYTICS_TRACKING_URL = "${var.google_analytics_tracking_url}"

    // HPKP
    HPKP_MAX_AGE = "${var.hpkp_max_age}"
    HPKP_SHAS = "${var.hpkp_shas}"

    // Rate Limiter
    RATE_LIMITER_TOTAL  = "${var.rate_limiter_total}"
    RATE_LIMITER_EXPIRE = "${var.rate_limiter_expire}"
    RATE_LIMITER_ENABLED = "${var.rate_limiter_enabled}"

    GET_PETITION_URL = "${local.div_cos_url}/retrieve-aos-case"
    LINK_RESPONDENT_URL = "${local.div_cos_url}/link-respondent"
    SUBMIT_AOS_URL = "${local.div_cos_url}/submit-aos"

    // Feature toggling through config
    FEATURE_IDAM                               = "${var.feature_idam}"

    // Decree Nisi Frontend Url
    DECREE_NISI_FRONTEND_URL = "${local.decree_nisi_frontend_url}"
  }
}

data "azurerm_key_vault" "div_key_vault" {
  name                = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}

data "azurerm_key_vault_secret" "idam_secret" {
  name      = "idam-secret"
  vault_uri = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "session_secret" {
  name      = "session-secret"
  vault_uri = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "redis_secret" {
  name      = "redis-secret"
  vault_uri = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}
