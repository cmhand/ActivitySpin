import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from "@ionic/storage";

import { HomePage } from "../pages/home-page/home-page.component";
import { CreateActivityPage } from "../pages/create-activity/create-activity-page.component";
import { PantryPage } from "../pages/pantry/pantry.component";

import { SelectPantryItemsComponent } from "../components/select-pantry-items/select-pantry-items.component";
import { SpinnerComponent } from "../components/spinner/spinner.component";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CreateActivityPage,
    PantryPage,
    SelectPantryItemsComponent,
    SpinnerComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CreateActivityPage,
    PantryPage,
    SelectPantryItemsComponent
  ],
  providers: [Storage]
})
export class AppModule {}
