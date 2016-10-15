import { Component, OnInit } from "@angular/core";
import { ModalController, NavController, NavParams } from "ionic-angular";
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
    public editActivity: Activity;
    public valid: boolean = true;

    private activityIndex: number;
    private activities: Array<Activity>;

    constructor(private modalCtrl: ModalController,
                private storage: Storage,
                private navCtrl: NavController,
                private params: NavParams) {
    }

    ngOnInit() {
        let activity = this.params.get("activity");
        if(activity) {
            this.editActivity = activity;
            this.name = this.editActivity.name;
            this.age = this.editActivity.age;
            this.instructions = this.editActivity.instructions;
            this.location = this.editActivity.location;
            this.supervision = this.editActivity.supervision;
            this.supplies = this.editActivity.supplies;
        }
        this.storage.get("activities").then((a: Array<Activity>) => {
            if (a) {
                this.activities = a;
            } else {
                this.activities = [];
            }
            if(this.editActivity) {
                for(let i = 0; i < this.activities.length; i++) {
                    let activity = this.activities[i];
                    if(activity.name == this.editActivity.name) {
                        this.activityIndex = i;
                    }
                }
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

    public save() {
        if(this.isValid()) {
            this.activities[this.activityIndex] = {
                name: this.name,
                instructions: this.instructions,
                age: this.age,
                supervision: this.supervision,
                location: this.location,
                supplies: this.supplies
            };
            this.saveAndClose();
        }
    }

    public create() {
        if(this.isValid()) {
            this.activities.push({
                name: this.name,
                instructions: this.instructions,
                age: this.age,
                supervision: this.supervision,
                location: this.location,
                supplies: this.supplies
            });
            this.saveAndClose();
        }
    }

    public saveAndClose() {
        this.storage.set(DB.activities, this.activities).then(() => {
            this.navCtrl.pop();
        }).catch((e) => {
            console.log(e);
        });
    }

    private isValid() {
        let valid = true;
        let index = 0;
        this.activities.forEach((activity: Activity) => {
            if(activity.name == this.name) {
                if(this.activityIndex && this.activityIndex != index) {
                    valid = false;
                }
            }
            index += 1;
        });
        this.valid = valid;
        return valid;
    }
}