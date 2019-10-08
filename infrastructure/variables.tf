// Infrastructural variables

variable "reform_team" {
  default = "div"
}

variable "reform_service_name" {
  default = "rfe"
}

variable "product" {}

variable "raw_product" {
  default = "div"
}

variable "location" {
  default = "UK South"
}

variable "env" { }

variable "ilbIp" { }

variable "deployment_env" {
  type = "string"
}

variable "deployment_path" {
  default = "/opt/divorce/frontend"
}

variable "node_config_dir" {
  // for Unix
  // default = "/opt/divorce/frontend/config"

  // for Windows
  default = "D:\\home\\site\\wwwroot\\config"
}

variable "subscription" { }

variable "vault_section" {
  type = "string"
}

// CNP settings
variable "jenkins_AAD_objectId" {
  type                        = "string"
  description                 = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "tenant_id" {
  description = "(Required) The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. This is usually sourced from environemnt variables and not normally required to be specified."
}

variable "client_id" {
  description = "(Required) The object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies. This is usually sourced from environment variables and not normally required to be specified."
}

variable "uv_threadpool_size" {
  default = "64"
}

variable "node_env" {
  default = "production"
}

variable "node_path" {
  default = "."
}

variable "additional_host_name" {
  type = "string"
}

// Package details
variable "packages_name" {
  default = "frontend"
}

variable "packages_project" {
  default = "divorce"
}

variable "packages_environment" {
  type = "string"
}

variable "packages_version" {
  default = "-1"
}

variable "public_protocol" {
  default = "https"
}

variable "http_proxy" {
  default = "http://proxyout.reform.hmcts.net:8080/"
}

variable "no_proxy" {
  default = "localhost,127.0.0.0/8,127.0.0.1,127.0.0.1*,local.home,reform.hmcts.net,*.reform.hmcts.net,betaDevBdivorceAppLB.reform.hmcts.net,betaDevBccidamAppLB.reform.hmcts.net,*.internal,*.platform.hmcts.net"
}

variable "health_endpoint" {
  default = "/health"
}

variable "feature_idam" {
  default = true
}

variable "idam_authentication_web_url" {
  type = "string"
}

variable "idam_authentication_login_endpoint" {
  default = "/login"
}

variable "idam_api_url" {
  type = "string"
}
variable "frontend_service_name" {
  default = "divorce-respondent-frontend"
}

variable "decree_nisi_frontend_url" {
  type = "string"
}

variable "decree_absolute_frontend_url" {
  default = ""
}

variable "s2s_microservice_name" {
  default = "divorce_frontend"
}

variable "hpkp_max_age" {
  default = "86400"
}

variable "hpkp_shas" {
  default = "Naw+prhcXSIkbtYJ0t7vAD+Fc92DWL9UZevVfWBvids=,klO23nT2ehFDXCfx3eHTDRESMz3asj1muO+4aIdjiuY=,grX4Ta9HpZx6tSHkmCrvpApTQGo67CYDnvprLg5yRME="
}

variable "survey_feedback_url" {
  default = "https://www.smartsurvey.co.uk/s/Divorce_Feedback"
}

variable "survey_feedback_done_url" {
  default = "https://www.smartsurvey.co.uk/s/Divorce_ExitSurvey_Respondent"
}

variable "component" {
  type = "string"
}

variable "capacity" {
  default = "1"
}

variable "google_analytics_tracking_id" {}

variable "google_analytics_tracking_url" {
  default = "http://www.google-analytics.com/collect"
}

variable "rate_limiter_total" {
  default = "3600"
}

variable "rate_limiter_expire" {
  default = "3600000"
}

variable "rate_limiter_enabled" {
  default = false
}

variable "common_tags" {
  type = "map"
}

variable "website_local_cache_option" {
  type = "string"
  default = "Never"
}

variable "website_local_cache_sizeinmb" {
  type = "string"
  default = "0"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default     = ""
}

variable "evidence_management_download_endpoint" {
  default = "/emclientapi/version/1/download"
}

variable "feature_resp_solicitor_details" {
  default = true
}

variable "feature_webchat" {
  default = false
}

variable "webchat_chat_id" {
  type = "string"
  default = "3833071605d5d4518036a09.30917386"
}

variable "webchat_tenant" {
  type = "string"
  default = "aG1jdHNzdGFnaW5nMDE"
}

variable "webchat_button_no_agents" {
  type = "string"
  default = "7732814745cac6f4603c4d1.53357933"
}

variable "webchat_button_agents_busy" {
  type = "string"
  default = "2042157415cc19c95669039.65793052"
}

variable "webchat_button_service_closed" {
  type = "string"
  default = "20199488815cc1a89e0861d5.73103009"
}

variable "post_code_url" {
  default = "https://api.ordnancesurvey.co.uk/places/v1"
}

variable "node_version" {
  default = "10.15.2"
}
