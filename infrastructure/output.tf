output "vaultUri" {
  value = "${local.vaultUri}"
  value = "${data.azurerm_key_vault.div_key_vault.vault_uri}"
}
