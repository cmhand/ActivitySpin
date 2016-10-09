import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { DB } from "../../constants/db";
import { Activity } from "../../model/activity.interface";
import { CreateActivityPage } from "../create-activity/create-activity-page.component";
import { PantryPage } from "../pantry/pantry.component";

@Component({
	selector: "home-page",
	templateUrl: "./home-page.component.html"
})
export class HomePage {

	public activities = [];
	public currentActivity: Activity;
	public completedActivities: Array<Activity>;
	public toDo: Array<Activity> = [];
	public loading: boolean = true;

	constructor(
		public navCtrl: NavController,
		public storage: Storage
	) {}

	ionViewDidEnter() {
		this.kickoff();
		console.log("hit");
	}

	create() {
		this.navCtrl.push(CreateActivityPage);
	}

	pantry() {
		this.navCtrl.push(PantryPage);
	}

	private kickoff() {
		let p1 = this.storage.get(DB.activities).then((stored: Array<Activity>) => {
			if(stored && stored.length > 0) {
				this.activities = stored;
			}
		}).catch((e) => {
			console.log(e);
		});
		let p2 = this.storage.get(DB.currentActivity).then((activity: Activity) => {
			if(activity) {
				this.currentActivity = activity;
			}
		});
		let p3 = this.storage.get(DB.completedActivities).then((done: Array<Activity>) => {
			if(done) {
				this.completedActivities = done;
			} else {
				this.completedActivities = [];
			}
		});
		Promise.all([p1, p2, p3]).then(() => {
			if(this.activities.length > 0 && this.activities.length === this.completedActivities.length) {
				// ToDo, reset activities.
				return;
			}
			this.toDo = this.activities.filter((activity: Activity) => {
				let check = true;
				this.completedActivities.forEach((doneActivity: Activity) => {
					if(doneActivity.name === activity.name) {
						check = false;
					}
				});
				return check;
			});
			this.loading = false;
		});
	}
}