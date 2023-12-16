import { Locator } from '@playwright/test';
import { BasePage } from './Base.page';

export class LoginPage extends BasePage {
    readonly userName: Locator = this.page.locator('#user-name'); 
    readonly password: Locator = this.page.locator('#password'); 
    readonly loginBtn: Locator = this.page.locator('#login-button'); 

    
    async performLogin(userName: string, password: string): Promise<void> {
        await this.userName.fill(userName);
        await this.password.fill(password);
        await this.loginBtn.click();
    }
}
