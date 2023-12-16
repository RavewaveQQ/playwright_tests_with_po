import { Locator } from '@playwright/test';
import { BasePage } from './Base.page';

export class CheckOutPage extends BasePage {

    readonly firstName: Locator = this.page.getByPlaceholder('First Name');
    readonly lastName: Locator = this.page.getByPlaceholder('Last Name'); 
    readonly postalCode: Locator = this.page.locator('#postal-code'); 
    readonly continueBtn: Locator = this.page.locator('#continue'); 
    readonly cancelBtn: Locator = this.page.locator('#cancel'); 
    readonly headerTitle: Locator = this.page.locator('.title'); 
    readonly itemPrice: Locator = this.page.locator('.inventory_item_price'); 
    readonly priceTotal: Locator = this.page.locator('.summary_total_label'); 

    
    async fillingCheckoutForm(name: string, lastName: string, zipCode: string): Promise<void> {
        await this.firstName.fill(name);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(zipCode);
        await this.continueBtn.click();
    }

    async calculateTotalAmount(): Promise<string> {
        let totalSum = 0;
        for (const price of await this.itemPrice.all()) {
            const counterIds = 0;
            const itemDataToText = await price.nth(counterIds).textContent();
            const textPriceToNumber = parseFloat(itemDataToText!.replace('$', '').trim());
            totalSum += textPriceToNumber;
        }
        const orderTax = (totalSum * 0.08).toFixed(2);
        const total = (totalSum + parseFloat(orderTax));
        return total.toFixed(2);
    }
}
