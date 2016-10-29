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
	private currentActivity: Activity;
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
		let name = this.activities[index].name;
		let title = "Delete Activity";
		let message = "Do you want to delete this activity? This action cannot be reversed.";
		let current = false;
		if(this.currentActivity && name === this.currentActivity.name) {
			current = true;
			title = "Delete Current Activity";
			message = "This is your current activity. If you delete it your current activity will be lost.";
		}
		let alert = this.alertCtrl.create({
			title: title,
		    message: message,
		    buttons: [
		      {
		        text: 'Cancel',
		        role: 'cancel'
		      },
		      {
		        text: 'Ok',
		        handler: () => { 
		        	this.deleteAndSave(index, current); 
		        }
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
		this.storage.get(DB.currentActivity)
			.then((activity: Activity) => {
				if(activity) {
					this.currentActivity = activity;
				}
			});
	}

	private deleteAndSave = (i: number, current: boolean) => {
		this.activities.splice(i, 1);
		if(current) {
			this.storage.set(DB.currentActivity, null);
		}
		this.storage.set(DB.activities, this.activities);
	};
}