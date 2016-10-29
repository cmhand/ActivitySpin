import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from "@ionic/storage";

import { HomePage } from "../pages/home-page/home-page.component";
import { CreateActivityPage } from "../pages/create-activity/create-activity-page.component";
import { PantryPage } from "../pages/pantry/pantry.component";
import { ActivitiesPage } from "../pages/activities/activities.component";

import { ViewActivityComponent } from "../components/view-activity/view-activity.component";
import { SelectPantryItemsComponent } from "../components/select-pantry-items/select-pantry-items.component";
import { SpinnerComponent } from "../components/spinner/spinner.component";
import { SelectFilterComponent } from "../components/select-filter/select-filter.component";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CreateActivityPage,
    PantryPage,
    ActivitiesPage,
    SelectPantryItemsComponent,
    SpinnerComponent,
    ViewActivityComponent,
    SelectFilterComponent
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
    ActivitiesPage,
    SelectPantryItemsComponent,
    ViewActivityComponent,
    SelectFilterComponent
  ],
  providers: [Storage]
})
export class AppModule {}
