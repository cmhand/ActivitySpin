import { Component } from "@angular/core";
import { NavController, ModalController, AlertController } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { DB } from "../../constants/db";
import { Activity } from "../../model/activity.interface";
import { CreateActivityPage } from "../create-activity/create-activity-page.component";
import { PantryPage } from "../pantry/pantry.component";
import { Supply } from "../../model/supply.interface";
import { ViewActivityComponent } from "../../components/view-activity/view-activity.component";

@Component({
	selector: "home-page",
	templateUrl: "./home-page.component.html"
})
export class HomePage {

	public activities = [];
	public currentActivity: Activity = null;
	public completedActivities: Array<Activity>;
	public toDo: Array<Activity> = [];
	public loading: boolean = true;

	private pantry: Array<Supply>;
	constructor(
		public navCtrl: NavController,
		public storage: Storage,
		public modalCtrl: ModalController,
		private alertCtrl: AlertController
	) {}

	ionViewDidEnter() {
		this.kickoff();
	}

	create() {
		this.navCtrl.push(CreateActivityPage);
	}

	viewPantry() {
		this.navCtrl.push(PantryPage);
	}

	activitySelected(activityIndex: number) {
		this.currentActivity = this.toDo[activityIndex];
		this.completedActivities.push(this.currentActivity);
		this.toDo.splice(activityIndex, 1);
		this.storage.set(DB.completedActivities, this.completedActivities);
		this.storage.set(DB.currentActivity, this.currentActivity);
		this.viewActivity(true);
	}

	completeActivity() {
		this.currentActivity = null;
		this.storage.set(DB.currentActivity, null);
		if(this.completedActivities.length == this.activities.length) {
			this.completedActivities = [];
			this.toDo = this.activities;
		}
		this.storage.set(DB.completedActivities, this.completedActivities);
	}

	discard() {
		let alert = this.alertCtrl.create({
			title: 'Discard Activity',
		    message: 'Do you want to send this activity back to the pile?',
		    buttons: [
		      {
		        text: 'No',
		        role: 'cancel'
		      },
		      {
		        text: 'Yes',
		        handler: () => {
		          this.discardCurrentActivity();
		        }
		      }
		    ]
		});
		alert.present();
	}

	viewActivity(isNew?: boolean) {
		let modal = this.modalCtrl.create(ViewActivityComponent, { 
			activity: this.currentActivity,
			new: isNew
		});
		modal.onDidDismiss(data => {
            if (data) {
            	if(data.action == "complete") {
            		this.completeActivity();
            	} else if (data.action == "discard") {
            		this.discard();
            	}
            }
        });
		modal.present();
	}

	private discardCurrentActivity = () => {
		let index = this.completedActivities.indexOf(this.currentActivity);
		let removedItem = this.completedActivities.splice(index, 1);
		this.toDo.push(removedItem[0]);
		this.completeActivity();
	};

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
		let p4 = this.storage.get(DB.pantry).then((supplies) => {
			if(supplies && supplies.length > 0) {
				this.pantry = supplies;
			} else {
				this.pantry = [];
			}
		});
		Promise.all([p1, p2, p3, p4]).then(() => {
			if(this.activities.length > 0 && this.activities.length === this.completedActivities.length) {
				// ToDo, reset activities.
				return;
			}
			let currentSupplies = this.pantry.filter((item: Supply) => {
				return item.stocked;
			});
			this.toDo = this.activities.filter((activity: Activity) => {
				let complete: boolean = false;
				this.completedActivities.forEach((doneActivity: Activity) => {
					if(doneActivity.name === activity.name) {
						complete = true;;
					}
				});
				if(complete) {
					return false;
				}
				let supplied: boolean = true;
				for(let i = 0; i < activity.supplies.length; i++) {
					let item = activity.supplies[i];
					let found: boolean = false;
					for(let j = 0; j < currentSupplies.length; j++) {
						let supply = currentSupplies[j];
						if(item === supply.name) {
							found = true;
							break;
						}
					}
					if(!found) {
						supplied = false;
						break;
					}
				}
				return supplied;
			});
			this.loading = false;
		});
	}
}