import { Locator } from '@playwright/test';
import { BasePage } from './Base.page';

export class InventoryPage extends BasePage {
    readonly headerTitle: Locator = this.page.locator('.title');
    readonly sortingBtn: Locator = this.page.locator('[data-test="product_sort_container"]')
    readonly inventoryItems: Locator = this.page.locator('.inventory_item');
    readonly inventoryItemsName: Locator = this.page.locator('.inventory_item_name');
    readonly itemsPrice: Locator = this.page.locator('.inventory_item_price');
    readonly itemDescription: Locator = this.page.locator('[class$="inventory_item_desc"]');
    readonly addItemToCartBtns: Locator = this.page.locator('button[class^="btn btn"]');
    readonly cartItem: Locator = this.page.locator('.cart_item');
    readonly mainMenuBtn: Locator = this.page.locator('TBD');
    readonly shopingCart: Locator = this.page.locator('.shopping_cart_link'); 
    readonly shopingCartBadge: Locator = this.page.locator('.shopping_cart_badge');


    async getNumberOfItemsInCart() {
        return this.shopingCartBadge.textContent();
    }
    
    async addItemToCartById(id:number) {
        await this.addItemToCartBtns.nth(id).click();
    };

    async getItemFromCartById(id:number) {
        this.cartItem.nth(id);
    };

    async switchSorting(sortType: string) {
        await this.sortingBtn.selectOption(sortType);
    };

    async addRandomProducts(numberOfProducts: number) {
        const selectedItem: object[] = [];
        const addedIds: number[] = []
        const allItemBtns = await this.addItemToCartBtns.all();
        
        while (selectedItem.length < numberOfProducts) {
            const randomItemId:number = Math.floor(Math.random() * allItemBtns.length);
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

    async getNameItemById(id:number){
        return await this.inventoryItemsName.nth(id).textContent();
    };

    async getDescriptionItemById(id:number){
        return await this.itemDescription.nth(id).textContent();
    };

    async getPriceItemById(id:number){
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
