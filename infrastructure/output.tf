output "vaultName" {
    value = "${local.vaultName}"
}

output "vaultUri" {
  value = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}

output "idam_api_url" {
  value = "${var.idam_api_url}"
}

output "case_maintenance_base_url" {
  value = "${local.div_cms_url}"
}

output "feature_idam" {
  value = "${var.feature_idam}"
}

output "reform_environment" {
  value = "${var.env}"
}
