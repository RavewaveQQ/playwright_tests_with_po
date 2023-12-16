// eslint-disable-next-line import/no-extraneous-dependencies
import { test as base } from '@playwright/test';
import { App } from './pages/App';


type FixtureYet = {
    app: App
    login: string
}

export const test = base.extend<FixtureYet>({
    app: async ({page}, use) => {
        const app = new App(page)
        await use(app)
    },
    login: [async ({app}, use) => {
        await app.loginPage.navigate();
        await app.loginPage.performLogin('standard_user', 'secret_sauce');
        await use('')
    },{auto: true}]
})
