import { expect } from '@playwright/test';
import { test } from '../fixture';
import { faker } from '@faker-js/faker';
import { getRandomNumberOfProducts } from '../utils/randomNumber';


test.describe('Swag Labs purchase flow', () => {

    test('Perform login', async ({ app }) => {
        await expect(app.inventoryPage.headerTitle).toBeVisible();
        expect(await app.inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('Add and remove product from the cart', async ({app}) => {
        await app.inventoryPage.addItemToCartById(0);
        expect(await app.inventoryPage.getNumberOfItemsInCart()).toBe('1');

        await app.inventoryPage.shopingCart.click();
        expect(await app.shopingCartPage.cartItems.count()).toBeGreaterThanOrEqual(1);

        await app.shopingCartPage.removeCartItemById(0);
        await expect(app.shopingCartPage.cartItems).not.toBeAttached();
    });

    test('Should have correct basic sorting list on the Inventory page', async ({ app}) => {
        await test.step('Sorting products list', async () => {
            await app.inventoryPage.sortingBtn.click();

            const sortList = app.inventoryPage.sortingBtn.locator('option');
            await expect(sortList).toHaveText([
                'Name (A to Z)',
                'Name (Z to A)',
                'Price (low to high)',
                'Price (high to low)']);
        });
    });


    const sortingType = [
        {sortingOption: `az`, getExpectedResult:(actualResult: any[]) =>  actualResult.sort((a: number, b: number) => a - b)}, 
        {sortingOption:'za', getExpectedResult:(actualResult: any[]) => actualResult.sort((a: number, b: number) => b - a)},
        {sortingOption:'lohi', getExpectedResult:(actualResult: any[]) => actualResult.sort((a: number, b: number) => a - b)}, 
        {sortingOption:'hilo', getExpectedResult:(actualResult: any[]) => actualResult.sort((a: number, b: number) => b - a)},
    ];

    for (const option of sortingType) {
        test(`Should correct sorting with type:${option.sortingOption}`, async ({app}) => {
        await app.inventoryPage.sortingBtn.click();
        await app.inventoryPage.switchSorting(option.sortingOption);

        const actualResult = (option.sortingOption === 'az' || option.sortingOption === 'za'
            ? await app.inventoryPage.getAllTitleOfProducts()
            : await app.inventoryPage.getAllPriceOfProducts())

            const expectedResult = option.getExpectedResult(actualResult)
            expect(actualResult).toEqual(expectedResult)
    })
}
    
    test('Verification products in Shopping cart', async ({ app }) => {
        const selectedItems = await app.inventoryPage.addRandomProducts(getRandomNumberOfProducts());
        await app.shopingCartPage.openShoppingCart();

        await test.step('Should products are displayed correctly', async () => {
            const cartItemsData = await app.shopingCartPage.getAllTextDataCartItems();

            selectedItems.forEach(async (data, index) => expect(data).toEqual(cartItemsData[index]));
        });
    });

    test('Should calculate total price after checkout', async ({ app }) => {
        const selectedItems = await app.inventoryPage.addRandomProducts(getRandomNumberOfProducts());
        await app.shopingCartPage.openShoppingCart();

        await app.shopingCartPage.checkoutBtn.click();
        await app.checkOutPage.fillingCheckoutForm(faker.person.firstName(), faker.person.lastName(), faker.location.zipCode());

        const checkOutItemsData = await app.shopingCartPage.getAllTextDataCartItems();
        
        selectedItems.forEach(async (data, index) => expect(data).toEqual(checkOutItemsData[index]));

        const checkOutAmount = await app.checkOutPage.calculateTotalAmount();
        const priceTotal = await app.checkOutPage.priceTotal.textContent();
        expect(`Total: $${checkOutAmount}`).toEqual(priceTotal);
    });
});
