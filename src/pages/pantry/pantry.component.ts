import { Component, OnInit } from '@angular/core';
import { AlertController } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { DB } from "../../constants/DB";
import { Supply } from "../../model/supply.interface";

@Component({
    selector: 'pantry-page',
    templateUrl: './pantry.component.html'
})
export class PantryPage implements OnInit {
    public pantry: Supply[] = [];
    public newItem: string;

    private saving: boolean = false;

    constructor(private alertCtrl: AlertController,
                private storage: Storage) {
    }

    ngOnInit() {
        this.storage.get(DB.pantry).then((pantry: Array<Supply>) => {
            if (pantry) {
                this.pantry = pantry;
            } else {
                this.pantry = [];
            }
        });
    }

    ionViewCanLeave() {
        if(this.pantry.length > 0) {
            return this.save();
        }
    }

    public add() {
        if (!this.newItem) {
            return;
        }
        this.pantry.push({
            name: this.newItem,
            stocked: true
        });
        this.save().then(() => { this.newItem = ""; })
    }

    public toggle(item) {
        item.stocked = !item.stocked;
        if(!this.saving) {
            this.save();
            this.saving = true;
            setTimeout(() => {
                this.saving = false;
            }, 1000);
        }
    }

    public delete(item) {
        let alert = this.alertCtrl.create({
            title: 'Remove?',
            message: 'Do you want to remove ' + item.name + ' from your pantry?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.pantry.splice(this.pantry.indexOf(item), 1);
                        this.save();
                    }
                }
            ]
        });
        alert.present();
    }

    private save() {
        return this.storage.set(DB.pantry, this.pantry);
    }
}