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

output "feature_idam" {
  value = "${var.feature_idam}"
}