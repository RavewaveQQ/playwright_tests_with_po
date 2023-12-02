const { expect } = require('@playwright/test');
const { test } = require('../fixture');
const {faker} = require('@faker-js/faker')
const {getRandomNumberOfProducts} = require('../utils/randomNumber')


test.describe('Swag Labs purchase flow', () => {
    test.beforeEach('Pre-login for tests', async ({loginPage, inventoryPage}) => {
            await loginPage.navigate();
            await loginPage.performLogin('standard_user', 'secret_sauce');
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


    const sortingOptions = [`az`, 'za', 'lohi', 'hilo']

    for (const option of sortingOptions) {
        test(`Should correct sorting with type: ${option}`, async ({inventoryPage}) => {
        await inventoryPage.sortingBtn.click();
        await inventoryPage.switchSorting(option);

        const list = await inventoryPage.itemsPrice;
        const priceList = await inventoryPage.getAllTextDataOfChosenProducts(list);

        priceList.forEach(async (data, index) => {
            await expect(list.nth(index)).toHaveText(data);
        });
    })}
    
    test('Verification products in Shopping cart', async ({ inventoryPage, shopingCartPage }) => {
        const selectedItems = await inventoryPage.addRandomProducts(getRandomNumberOfProducts());
        await shopingCartPage.openShoppingCart();

        await test.step('Should products are displayed correctly', async () => {
            const itemsInCart = await shopingCartPage.cartItems.all();
            const cartItemsData = await shopingCartPage.getAllTextDataCartItems(itemsInCart);

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

        const itemsInCheckOut = await shopingCartPage.cartItems.all();
        const checkOutItemsData = await shopingCartPage.getAllTextDataCartItems(itemsInCheckOut);
        
        selectedItems.forEach(async (data, index) => {
            expect(data).toMatchObject(checkOutItemsData[index]);
        });


        const priceList = await checkoutPage.itemPrice;

        const checkOutAmount = await checkoutPage.calculateTotalAmount(priceList);
        const priceTotal = await checkoutPage.priceTotal.textContent();
        expect(`Total: $${checkOutAmount}`).toEqual(priceTotal);
    });
});
