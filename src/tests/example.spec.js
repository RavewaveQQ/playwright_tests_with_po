// @ts-check
const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('', () => {

    test('Perform login', async ({ loginPage, inventoryPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');

        await expect(inventoryPage.headerTitle).toBeVisible();

        expect(await inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('Add and remove product from the cart', async ({ inventoryPage, shopingCartPage, loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');

        await inventoryPage.addItemToCartById(0);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('1');

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.cartItems.count()).toBeGreaterThanOrEqual(1);

        await shopingCartPage.removeCartItemById(0);
        await expect(shopingCartPage.cartItems).not.toBeAttached();
    });

    test('Perform and verify sorting on the Inventory page', async ({ inventoryPage, loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');

        await test.step('Sorting products list', async () => {
            await inventoryPage.sortingBtn.click();

            const sortList = inventoryPage.sortingBtn.locator('option');
            await expect(sortList).toHaveText([
                'Name (A to Z)',
                'Name (Z to A)',
                'Price (low to high)',
                'Price (high to low)']);

            await inventoryPage.switchSorting('hilo');
        });
        const list = inventoryPage.itemsPrice;
        const firstItem = await inventoryPage.inventoryItemsName.first().textContent();

        await test.step('Check the order items from High to Low', async () => {
            if (firstItem === 'Sauce Labs Fleece Jacket') {
                await inventoryPage.validateChosenProducts(list);
            }
        });
    });

    test('Verification products in Shopping cart', async ({ inventoryPage, shopingCartPage, loginPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');

        await inventoryPage.addRandomProducts(6);
        await shopingCartPage.openShoppingCart();

        await test.step('Should products are displayed correctly', async () => {
            const productsInCart = await shopingCartPage.cartItems;
            await inventoryPage.validateChosenProducts(productsInCart);
        });
    });

    test('Should calculate total price after checkout', async ({
        loginPage, inventoryPage, shopingCartPage, checkoutPage,
    }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');

        await inventoryPage.addRandomProducts(3);
        await shopingCartPage.openShoppingCart();

        await shopingCartPage.checkoutBtn.click();
        await checkoutPage.fillingCheckoutForm('John', 'Dow', '12345678');

        const productsInCart = await shopingCartPage.cartItems;
        await inventoryPage.validateChosenProducts(productsInCart);

        const priceList = await checkoutPage.itemPrice;

        const checkOutAmount = await checkoutPage.totalAmount(priceList);
        const priceTotal = await checkoutPage.priceTotal.textContent();
        expect(checkOutAmount).toEqual(priceTotal);
    });
});
