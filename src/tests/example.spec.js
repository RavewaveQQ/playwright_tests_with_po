const { expect } = require('@playwright/test');
const { test } = require('../fixture');
const {faker} = require('@faker-js/faker')
const {numberOfProducts} = require('../utils/randomNumber')


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
        const priceList = await inventoryPage.chosenProducts(list);

        priceList.forEach(async (data, index) => {
            await expect(list.nth(index)).toHaveText(data);
        });
    })}
    
    test('Verification products in Shopping cart', async ({ inventoryPage, shopingCartPage }) => {
        await inventoryPage.addRandomProducts(numberOfProducts());
        await shopingCartPage.openShoppingCart();

        await test.step('Should products are displayed correctly', async () => {
            const productsInCart = await shopingCartPage.cartItems;
            const productData = await inventoryPage.chosenProducts(productsInCart);

            productData.forEach(async (data, index) => {
                await expect(productsInCart.nth(index)).toHaveText(data);
            });
        });
    });

    test('Should calculate total price after checkout', async ({inventoryPage, shopingCartPage, checkoutPage}) => {
        await inventoryPage.addRandomProducts(numberOfProducts());
        await shopingCartPage.openShoppingCart();

        await shopingCartPage.checkoutBtn.click();
        await checkoutPage.fillingCheckoutForm(faker.person.firstName(), faker.person.lastName(), faker.location.zipCode());

        const productsInCart = await shopingCartPage.cartItems;
        
        const productData = await inventoryPage.chosenProducts(productsInCart)
        productData.forEach(async (data, index) => {
            await expect(productsInCart.nth(index)).toHaveText(data);
        });


        const priceList = await checkoutPage.itemPrice;

        const checkOutAmount = await checkoutPage.totalAmount(priceList);
        const priceTotal = await checkoutPage.priceTotal.textContent();
        expect(checkOutAmount).toEqual(priceTotal);
    });
});
