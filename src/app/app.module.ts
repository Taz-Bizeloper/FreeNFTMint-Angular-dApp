import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConnectWalletBtnsComponent } from './connect-wallet-btns/connect-wallet-btns.component';
import { globalVars } from './global-variables';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
@NgModule({
  declarations: [
    AppComponent,
    ConnectWalletBtnsComponent,
    NavMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [globalVars],
  bootstrap: [AppComponent]
})
export class AppModule { }
