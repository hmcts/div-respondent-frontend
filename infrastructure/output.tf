output "vaultName" {
    value = "${local.vaultName}"
}

output "vaultUri" {
  value = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}

output "reform_environment" {
  value = "${var.env}"
}

output "idam_api_url" {
  value = "${var.idam_api_url}"
}

output "idam_login_url" {
  value = "${var.idam_authentication_web_url}${var.idam_authentication_login_endpoint}"
}

output "feature_idam" {
  value = "${var.feature_idam}"
}