import { Locator } from '@playwright/test';
import { BasePage } from './Base.page';

export class ShopingCartPage extends BasePage {
    url = '/cart.html';

    cartItemSelector = '.cart_item_label';

    removeItemSelector = '[id^="remove"]';

    readonly cartIcon: Locator = this.page.locator('#shopping_cart_container')
    readonly headerTitle: Locator = this.page.locator('.title')
    readonly cartItems: Locator = this.page.locator('.cart_item_label')
    readonly checkoutBtn: Locator = this.page.locator('#checkout')
    readonly cartItemTitle: Locator = this.page.locator('.cart_item_label').locator('.inventory_item_name')
    readonly cartItemDescription: Locator = this.page.locator('.cart_item_label').locator('.inventory_item_desc')
    readonly cartItemPrice: Locator = this.page.locator('.cart_item_label').locator('.inventory_item_price')

    // async below added to show the function returns a promise
    async getCartItemByName(name: string): Promise<Locator> { 
        return this.page.locator(this.cartItemSelector, { hasText: name }); 
    };

    async removeCartItemByName(name: string): Promise<Locator> {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    };

    async removeCartItemById(id: number): Promise<void> {
        return await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    };

    async openShoppingCart(): Promise<void> {
       return await this.cartIcon.click();
    };

    async getNameCartItemById(id: number): Promise<string | null> {
        return await this.cartItemTitle.nth(id).textContent();
    };

    async getDescriptionCartItemById(id: number): Promise<string | null> {
        return await this.cartItemDescription.nth(id).textContent();
    };

    async getPriceCartItemById(id: number): Promise<string | null> {
        return await this.cartItemPrice.nth(id).textContent();
    };

    async getAllTextDataCartItems(): Promise<object[]> {
        const addedCartItems: object[] = []
        const itemsInCart = await this.cartItems.all();
        for(let i = 0; i < itemsInCart.length; i++){
            addedCartItems.push({
                name: await this.getNameCartItemById(i),
                desc: await this.getDescriptionCartItemById(i),
                price: await this.getPriceCartItemById(i)
            })
        }
        return addedCartItems;
    };
}
