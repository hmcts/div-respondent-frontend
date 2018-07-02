provider "vault" {
  address = "https://vault.reform.hmcts.net:6200"
}

data "vault_generic_secret" "frontend_secret" {
  path = "secret/${var.vault_section}/ccidam/service-auth-provider/api/microservice-keys/divorce-frontend"
}

data "vault_generic_secret" "idam_secret" {
  path = "secret/${var.vault_section}/ccidam/idam-api/oauth2/client-secrets/divorce"
}

data "vault_generic_secret" "post_code_token" {
  path = "secret/${var.vault_section}/divorce/postcode/token"
}

data "vault_generic_secret" "session_secret" {
  path = "secret/${var.vault_section}/divorce/session/secret"
}

data "vault_generic_secret" "redis_secret" {
  path = "secret/${var.vault_section}/divorce/session/redis-secret"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
  public_hostname = "div-bfe-${var.env}.service.${local.aseName}.internal"

  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"

  service_auth_provider_url = "http://rpe-service-auth-provider-${local.local_env}.service.core-compute-${local.local_env}.internal"
  case_progression_service_url = "http://div-cps-${local.local_env}.service.core-compute-${local.local_env}.internal"
  evidence_management_client_api_url = "http://div-emca-${local.local_env}.service.core-compute-${local.local_env}.internal"
}

module "redis-cache" {
  source   = "git@github.com:contino/moj-module-redis?ref=master"
  product  = "${var.env != "preview" ? "${var.product}-redis" : "${var.product}-${var.reform_service_name}-redis"}"
  location = "${var.location}"
  env      = "${var.env}"
  subnetid = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[1]}"
}

module "frontend" {
  source = "git@github.com:hmcts/moj-module-webapp.git?ref=master"
  product = "${var.product}-${var.reform_service_name}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  is_frontend  = "${var.env != "preview" ? 1: 0}"
  subscription = "${var.subscription}"
  additional_host_name = "${var.env != "preview" ? var.additional_host_name : "null"}"
  https_only = "true"
  capacity = "${var.capacity}"

  app_settings = {

    // Node specific vars
    NODE_ENV = "${var.node_env}"
    NODE_PATH = "${var.node_path}"
    WEBSITE_NODE_DEFAULT_VERSION = "8.9.4"

    BASE_URL = "${var.public_protocol}://${var.deployment_namespace}-${local.public_hostname}"

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
    IDAM_SECRET = "${data.vault_generic_secret.idam_secret.data["value"]}"

    // Service Auth
    SERVICE_AUTH_PROVIDER_URL = "${var.service_auth_provider_url}"
    SERVICE_AUTH_PROVIDER_HEALTHCHECK_URL = "${var.service_auth_provider_url}${var.health_endpoint}"
    MICROSERVICE_NAME = "${var.s2s_microservice_name}"
    MICROSERVICE_KEY = "${data.vault_generic_secret.frontend_secret.data["value"]}"

    // Redis Cloud
    REDISCLOUD_URL = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
    SESSION_SECRET = "${module.redis-cache.access_key}"

    // Encryption secrets
    SECRET ="${data.vault_generic_secret.session_secret.data["value"]}"

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
  }
}
