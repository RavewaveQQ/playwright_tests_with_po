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
        const item = await this.inventoryItems.all();

        while (selectedItem.length < amountProducts) {
            const randomItem = Math.floor(Math.random() * item.length - 1);
            if (!selectedItem.includes(randomItem)) {
                selectedItem.push(randomItem);
                await this.addItemToCartById(randomItem);
            }
        }
    }

    async validateChosenProducts(chosenProductsArray) {
        for (const product of await chosenProductsArray.all()) {
            let counterIds = 0;
            const eachItem = await product.nth(counterIds).textContent();
            await expect(product.nth(counterIds)).toHaveText(eachItem);
            counterIds += 1;
        }
    }
}
