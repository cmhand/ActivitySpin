import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { Activity } from "../../model/activity.interface";
import { SelectPantryItemsComponent } from "../../components/select-pantry-items/select-pantry-items.component";
import { DB } from "../../constants/db";

@Component({
    selector: "create-activity-page",
    templateUrl: "create-activity-page.component.html"
})
export class CreateActivityPage implements OnInit {
    public name: string;
    public instructions: string;
    public supplies: string[] = [];
    public age: string;
    public location: string;
    public supervision: boolean;

    private activities: Array<Activity>;

    constructor(private modalCtrl: ModalController,
                private storage: Storage,
                private navCtrl: NavController) {

    }

    ngOnInit() {
        this.storage.get("activities").then((a: Array<Activity>) => {
            if (a) {
                this.activities = a;
                console.log(a);
            } else {
                this.activities = [];
            }
        });
    }

    public selectSupplies() {
        let modal = this.modalCtrl.create(SelectPantryItemsComponent, {
            selectedItems: this.supplies
        });
        modal.onDidDismiss(data => {
            if (data) {
                this.supplies = data;
            }
        });
        modal.present();
    }

    public create() {
        this.activities.push({
            name: this.name,
            instructions: this.instructions,
            age: this.age,
            supervision: this.supervision,
            location: this.location,
            supplies: this.supplies
        });
        this.storage.set(DB.activities, this.activities).then(() => {
            this.navCtrl.pop();
        }).catch((e) => {
            console.log(e);
        });
    }
}