import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { HomePage } from "../pages/home-page/home-page.component";
import { CreateActivityPage } from "../pages/create-activity/create-activity-page.component";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    // make HelloIonicPage the root (or first) page
    rootPage: any = HomePage;
    pages: Array<{title: string, component: any}>;

    constructor(public platform: Platform,
                public menu: MenuController) {
        this.initializeApp();

        // set our app's pages
        this.pages = [
            {title: 'Home', component: HomePage},
            {title: 'Create Activity', component: CreateActivityPage}
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        this.nav.setRoot(page.component);
    }
}
