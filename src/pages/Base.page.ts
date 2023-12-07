import {Page} from '@playwright/test';

export abstract class BasePage {
    constructor(protected page: Page) {
        this.page = page;
    }

    // async below added to show the function returns a promise
    async getUrl() { return this.page.url(); }

    async navigate() {
        await this.page.goto('/');
        await this.page.waitForLoadState('load');
    }
}
