const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class ShopingCartPage extends BaseSwagLabPage {
    url = '/cart.html';

    cartItemSelector = '.cart_item_label';

    removeItemSelector = '[id^="remove"]';

    get cartIcon() { return this.page.locator('#shopping_cart_container')}

    get headerTitle() { return this.page.locator('.title')}

    get cartItems() { return this.page.locator('.cart_item_label')}

    get checkoutBtn() { return this.page.locator('#checkout')}

    get cartItemTitle() { return this.page.locator('.cart_item_label').locator('.inventory_item_name')}
    
    get cartItemDescription() { return this.page.locator('.cart_item_label').locator('.inventory_item_desc')}

    get cartItemPrice() { return this.page.locator('.cart_item_label').locator('.inventory_item_price')}

    // async below added to show the function returns a promise
    async getCartItemByName(name) { return this.page.locator(this.cartItemSelector, { hasText: name }); }

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    };

    async removeCartItemById(id) {
        await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    };

    async openShoppingCart() {
        await this.cartIcon.click();
    };

    async getNameCartItemById(id){
        return await this.cartItemTitle.nth(id).textContent();
    };

    async getDescriptionCartItemById(id){
        return await this.cartItemDescription.nth(id).textContent();
    };

    async getPriceCartItemById(id){
        return await this.cartItemPrice.nth(id).textContent();
    };

    async getAllTextDataCartItems(){
        const addedCartItems = []
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
