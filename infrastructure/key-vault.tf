module "div-dn-vault" {
  source = "git@github.com:contino/moj-module-key-vault?ref=master"
  name = "div-dn-${var.env}"
  product = "${var.product}"
  env = "${var.env}"
  tenant_id = "${var.tenant_id}"
  object_id = "${var.jenkins_AAD_objectId}"
  resource_group_name = "${azurerm_resource_group.rg.name}"
  product_group_object_id = "faf6cf1a-ac66-4781-8190-0e388ef8d394"
}

output "vaultName" {
  value = "${module.div-dn-vault.key_vault_name}"
}