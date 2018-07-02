// Infrastructural variables

variable "reform_team" {
  default = "div"
}

variable "reform_service_name" {
  default = "bfe"
}

variable "product" {
  type = "string"
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

variable "idam_authentication_web_url" {
  type = "string"
}

variable "idam_authentication_login_endpoint" {
  default = "/login"
}

variable "idam_api_url" {
  type = "string"
}

variable "service_auth_provider_url" {
  type = "string"
}

variable "frontend_service_name" {
  default = "divorce-respondent-frontend"
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
  default = "http://www.smartsurvey.co.uk/s/0QIL4"
}

variable "survey_feedback_done_url" {
  default = "http://www.smartsurvey.co.uk/s/8RR1T"
}

variable "deployment_namespace" {
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
