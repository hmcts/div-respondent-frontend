output "vaultName" {
  value = "${local.vaultName}"
}

output "vaultUri" {
  value = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}
