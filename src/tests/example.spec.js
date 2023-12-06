const { expect } = require('@playwright/test');
const { test } = require('../fixture');
const {faker} = require('@faker-js/faker')
const {getRandomNumberOfProducts} = require('../utils/randomNumber')


test.describe('Swag Labs purchase flow', () => {
    test.beforeEach('Pre-login for tests', async ({loginPage, inventoryPage}) => {
            await loginPage.navigate();
            await loginPage.performLogin('standard_user', 'secret_sauce');
    });

    test('Perform login', async ({ inventoryPage }) => {
        await expect(inventoryPage.headerTitle).toBeVisible();
        expect(await inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('Add and remove product from the cart', async ({ inventoryPage, shopingCartPage}) => {
        await inventoryPage.addItemToCartById(0);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('1');

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.cartItems.count()).toBeGreaterThanOrEqual(1);

        await shopingCartPage.removeCartItemById(0);
        await expect(shopingCartPage.cartItems).not.toBeAttached();
    });

    test('Should have correct basic sorting list on the Inventory page', async ({ inventoryPage}) => {
        await test.step('Sorting products list', async () => {
            await inventoryPage.sortingBtn.click();

            const sortList = inventoryPage.sortingBtn.locator('option');
            await expect(sortList).toHaveText([
                'Name (A to Z)',
                'Name (Z to A)',
                'Price (low to high)',
                'Price (high to low)']);
        });
    });


    const sortingType = [
        {sortingOption: `az`, getExpectedResult:(actualResult) =>  actualResult.sort((a, b) => a - b)}, 
        {sortingOption:'za', getExpectedResult:(actualResult) => actualResult.sort((a, b) => b - a)},
        {sortingOption:'lohi', getExpectedResult:(actualResult) => actualResult.sort((a, b) => a - b)}, 
        {sortingOption:'hilo', getExpectedResult:(actualResult) => actualResult.sort((a, b) => b - a)},
    ];

    for (const option of sortingType) {
        test(`Should correct sorting with type:${option.sortingOption}`, async ({inventoryPage}) => {
        await inventoryPage.sortingBtn.click();
        await inventoryPage.switchSorting(option.sortingOption);

        const actualResult = (option.sortingOption === 'az' || option.sortingOption === 'za'
            ? await inventoryPage.getAllTitleOfProducts()
            : await inventoryPage.getAllPriceOfProducts())

            const expectedResult = option.getExpectedResult(actualResult)
            expect(actualResult).toEqual(expectedResult)
    })
}
    
    test('Verification products in Shopping cart', async ({ inventoryPage, shopingCartPage }) => {
        const selectedItems = await inventoryPage.addRandomProducts(getRandomNumberOfProducts());
        await shopingCartPage.openShoppingCart();

        await test.step('Should products are displayed correctly', async () => {
            const cartItemsData = await shopingCartPage.getAllTextDataCartItems();

            selectedItems.forEach(async (data, index) => {
                expect(data).toMatchObject(cartItemsData[index]);
            });
        });
    });

    test('Should calculate total price after checkout', async ({inventoryPage, shopingCartPage, checkoutPage}) => {
        const selectedItems = await inventoryPage.addRandomProducts(getRandomNumberOfProducts());
        await shopingCartPage.openShoppingCart();

        await shopingCartPage.checkoutBtn.click();
        await checkoutPage.fillingCheckoutForm(faker.person.firstName(), faker.person.lastName(), faker.location.zipCode());

        const checkOutItemsData = await shopingCartPage.getAllTextDataCartItems();
        
        selectedItems.forEach(async (data, index) => {
            expect(data).toMatchObject(checkOutItemsData[index]);
        });

        const checkOutAmount = await checkoutPage.calculateTotalAmount();
        const priceTotal = await checkoutPage.priceTotal.textContent();
        expect(`Total: $${checkOutAmount}`).toEqual(priceTotal);
    });
});
