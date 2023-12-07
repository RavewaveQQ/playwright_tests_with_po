import {BasePage} from './Base.page';
import {CheckOutPage} from './Checkout.page';
import {InventoryPage} from './Inventory.page';
import {LoginPage} from './Login.page';
import {ShopingCartPage} from './ShopingCart.page';

export class App extends BasePage {
    readonly checkOutPage = new CheckOutPage(this.page);
    readonly inventoryPage = new InventoryPage(this.page);
    readonly loginPage = new LoginPage(this.page);
    readonly shopingCartPage = new ShopingCartPage(this.page);
}