import {Page} from '@playwright/test';

export abstract class BasePage {
    constructor(protected page: Page) {
    }

    // async below added to show the function returns a promise
    async getUrl(): Promise<string> { return this.page.url(); }

    async navigate(): Promise<void> {
        await this.page.goto('/');
        await this.page.waitForLoadState('load');
    }
}
