const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class CheckOutPage extends BaseSwagLabPage {
    url = 'checkout-step-one.html';

    get firstName() { return this.page.getByPlaceholder('First Name'); }

    get lastName() { return this.page.getByPlaceholder('Last Name'); }

    get postalCode() { return this.page.locator('#postal-code'); }

    get continueBtn() { return this.page.locator('#continue'); }

    get cancelBtn() { return this.page.locator('#cancel'); }

    get headerTitle() { return this.page.locator('.title'); }

    get itemPrice() { return this.page.locator('.inventory_item_price'); }

    get priceTotal() { return this.page.locator('.summary_total_label'); }

    async fillingCheckoutForm(name, lastName, zipCode) {
        await this.firstName.fill(name);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(zipCode);
        await this.continueBtn.click();
    }

    async calculateTotalAmount(checkOutCartItem) {
        let totalSum = 0;
        for (const item of await checkOutCartItem.all()) {
            const counterIds = 0;
            const eachItem = await item.nth(counterIds).textContent();
            const price = parseFloat(eachItem.replace('$', '').trim());
            totalSum += price;
        }
        const orderTax = (totalSum * 0.08).toFixed(2);
        const total = (totalSum + parseFloat(orderTax));
        return total.toFixed(2);
    }
}
