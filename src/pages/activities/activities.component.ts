import { Component } from '@angular/core';
import { NavController, AlertController } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { CreateActivityPage } from "../create-activity/create-activity-page.component";
import { DB } from "../../constants/db";
import { Activity } from "../../model/activity.interface";

@Component({
	selector: 'acitivities-page',
	templateUrl: 'activities.component.html'
})
export class ActivitiesPage {
	public activities: Array<Activity>;
	constructor(
		private storage: Storage,
		private navCtrl: NavController,
		private alertCtrl: AlertController
	) {}

	ionViewDidEnter() {
		this.getActivities();
	}

	viewActivity(activity: Activity) {
		this.navCtrl.push(CreateActivityPage, {
			"activity": activity
		});
	}

	delete(index: number) {
		let alert = this.alertCtrl.create({
			title: 'Delete Activity',
		    message: 'Do you want to delete this activity? This action cannot be reversed.',
		    buttons: [
		      {
		        text: 'No',
		        role: 'cancel'
		      },
		      {
		        text: 'Yes',
		        handler: this.deleteAndSave
		      }
		    ]
		});
		alert.present();
	}

	private getActivities() {
		this.storage.get(DB.activities)
			.then((activities: Array<Activity>) => {
				this.activities = activities;
			});
	}

	private deleteAndSave = (i: number) => {
		this.activities.splice(i, 1);
		this.storage.set(DB.activities, this.activities);
	};
}