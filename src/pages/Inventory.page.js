const { expect } = require('@playwright/test');
const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    get headerTitle() { return this.page.locator('.title'); }

    get sortingBtn() { return this.page.locator('[data-test="product_sort_container"]'); }

    get inventoryItems() { return this.page.locator('.inventory_item'); }

    get inventoryItemsName() { return this.page.locator('.inventory_item_name'); }

    get itemsPrice() { return this.page.locator('.inventory_item_price'); }

    get itemDescription() {return this.page.locator('[class$="inventory_item_desc"]')}

    get addItemToCartBtns() { return this.page.locator('button[class^="btn btn"]'); }

    get cartItem() { return this.page.locator('.cart_item'); }

    async addItemToCartById(id) {
        await this.addItemToCartBtns.nth(id).click();
    };

    async getItemFromCartById(id) {
        await this.cartItem.nth(id);
    };

    async switchSorting(sortType) {
        await this.sortingBtn.selectOption(sortType);
    };

    async addRandomProducts(numberOfProducts) {
        const selectedItem = [];
        const addedIds = []
        const allItemBtns = await this.addItemToCartBtns.all();
        
        while (selectedItem.length < amountProducts) {
            const randomItemId = Math.floor(Math.random() * allItemBtns.length);
            if (!addedIds.includes(randomItemId)) {
            selectedItem.push({
                name: await this.getNameItemById(randomItemId),
                desc: await this.getDescriptionItemById(randomItemId),
                price: await this.getPriceItemById(randomItemId)
            });
            addedIds.push(randomItemId)
            await this.addItemToCartById(randomItemId);
            }
        };
        return selectedItem;
    };

    async getNameItemById(id){
        return await this.inventoryItemsName.nth(id).textContent();
    };

    async getDescriptionItemById(id){
        return await this.itemDescription.nth(id).textContent();
    };

    async getPriceItemById(id){
        return await this.itemsPrice.nth(id).textContent();
    };

    async getAllTitleOfProducts(){
        const productTitles = await this.inventoryItemsName.all();
        return Promise.all(productTitles.map(async title => await title.textContent()))
    };
    async getAllPriceOfProducts(){
        const productPrices = await this.itemsPrice.all();
        return Promise.all(productPrices.map(async price => await price.textContent()))
    };
};
