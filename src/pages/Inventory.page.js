const { expect } = require('@playwright/test');
const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    get headerTitle() { return this.page.locator('.title'); } //

    get sortingBtn() { return this.page.locator('[data-test="product_sort_container"]'); }

    get inventoryItems() { return this.page.locator('.inventory_item'); }

    get inventoryItemsName() { return this.page.locator('.inventory_item_name'); }

    get itemsPrice() { return this.page.locator('.inventory_item_price'); }

    get addItemToCartBtns() { return this.page.locator('[id^="add-to-cart"]'); }

    get cartItem() { return this.page.locator('.cart_item'); }

    async addItemToCartById(id) {
        await this.addItemToCartBtns.nth(id).click();
    }

    async getItemFromCartById(id) {
        await this.cartItem.nth(id);
    }

    async switchSorting(sortType) {
        await this.sortingBtn.selectOption(sortType);
    }

    async addRandomProducts(amountProducts) {
        const selectedItem = [];
        while (selectedItem.length < amountProducts) {
            const item = await this.addItemToCartBtns.all();
            const randomItem = Math.floor(Math.random() * item.length);
            selectedItem.push(randomItem);
            await this.addItemToCartById(randomItem);
        }
    }

    async getDataOfChosenProducts(chosenProductsArray) {
        let productData = [];
        for (const product of await chosenProductsArray.all()) {
            const eachItem = await product.textContent();
            productData.push(eachItem);
        }
        return productData;
    }
}
