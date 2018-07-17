output "vaultUri" {
  value = "${local.vaultUri}"
  value = "${data.azurerm_key_vault.div_dn_vault.vault_uri}"
}
