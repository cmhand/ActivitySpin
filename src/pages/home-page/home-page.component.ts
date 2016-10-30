import { Component, OnInit } from "@angular/core";
import { NavController, ModalController, AlertController } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { DB } from "../../constants/db";
import { Filters } from "../../model/filters.interface";
import { Activity } from "../../model/activity.interface";
import { CreateActivityPage } from "../create-activity/create-activity-page.component";
import { PantryPage } from "../pantry/pantry.component";
import { Supply } from "../../model/supply.interface";
import { ViewActivityComponent } from "../../components/view-activity/view-activity.component";
import { SelectFilterComponent } from "../../components/select-filter/select-filter.component";
import { SeedService } from "../../services/seed.service";

@Component({
	selector: "home-page",
	templateUrl: "./home-page.component.html"
})
export class HomePage implements OnInit {

	public activities = [];
	public currentActivity: Activity = null;
	public completedActivities: Array<Activity>;
	public toDo: Array<Activity> = [];
	public loading: boolean = true;

	public filters: Filters;
	private pantry: Array<Supply>;
	private currentSupplies: Array<Supply>;
	private firstPromise: Promise<any>;
	constructor(
		public navCtrl: NavController,
		public storage: Storage,
		public modalCtrl: ModalController,
		private alertCtrl: AlertController,
		private seedSvc: SeedService
	) {}

	ngOnInit() {
		this.firstPromise = this.storage.get(DB.loaded);
	}

	ionViewDidEnter() {
		this.firstPromise.then((loaded) => {
			if(loaded) {
				this.kickoff();
			} else {
				this.seedSvc.seed().then(() => {
					this.storage.set(DB.loaded, true);
					this.kickoff();
				});
			}
		});
	}

	create() {
		this.navCtrl.push(CreateActivityPage);
	}

	viewPantry() {
		this.navCtrl.push(PantryPage);
	}

	activitySelected(activityIndex: number) {
		this.currentActivity = this.toDo[activityIndex];
		if(this.toDo.length > 1) {
			this.toDo.splice(activityIndex, 1);
		} else {
			this.toDo = [];
		}
		this.storage.set(DB.currentActivity, this.currentActivity);
		this.viewActivity(true);
	}

	completeActivity() {
		this.completedActivities.push(this.currentActivity);
		this.clearCurrentActivity();
		if(this.completedActivities.length == this.activities.length) {
			this.completedActivities = [];
			this.toDo = this.activities;
		}
		this.storage.set(DB.completedActivities, this.completedActivities);
	}

	selectFilters() {
		let modal = this.modalCtrl.create(SelectFilterComponent);
		modal.onDidDismiss(data => {
			if(data) {
				this.filters = data;
				this.storage.set(DB.filters, data);
				this.filter();
			}
		});
		modal.present();
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
		this.toDo.push(this.currentActivity);
		this.clearCurrentActivity();
	};

	private clearCurrentActivity = () => {
		this.currentActivity = null;
		this.storage.set(DB.currentActivity, null);
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
		let p5 = this.storage.get(DB.filters).then((filters: Filters) => {
			if(filters) {
				this.filters = filters;
			}
		});
		Promise.all([p1, p2, p3, p4, p5]).then(() => {
			if(this.activities.length > 0 && this.activities.length === this.completedActivities.length) {
				// ToDo, reset activities.
				return;
			}
			this.currentSupplies = this.pantry.filter((item: Supply) => {
				return item.stocked;
			});
			this.toDo = this.filter();
			this.loading = false;
		});
	}

	private filter = () => {
		return this.activities.filter((activity: Activity) => {
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
					for(let j = 0; j < this.currentSupplies.length; j++) {
						let supply = this.currentSupplies[j];
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
				if(supplied) {
					if(this.filters) {
						if(this.filters.ages && this.filters.ages.length > 0) {
							let rightAge = false;
							for(let k = 0; k < activity.ages.length; k++) {
								let age: string = activity.ages[k];
								if(this.filters.ages.indexOf(age) > -1) {
									rightAge = true;
									break;
								}
							}
							if(!rightAge) {
								return false;
							}
						}
						if(this.filters.location && this.filters.location != "") {
							if(activity.location != this.filters.location) {
								return false;
							}
						}
						if(this.filters.supervision != null) {
							if(activity.supervision != this.filters.supervision) {
								return false;
							}
						}
					}
				}
				return supplied;
			});
	};
}