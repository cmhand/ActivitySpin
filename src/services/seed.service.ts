import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

import { Activity } from "../model/activity.interface";
import { Supply } from "../model/supply.interface";
import { DB } from "../constants/db";

@Injectable()
export class SeedService {
	
	constructor(
		private storage: Storage
	) {}

	public seed(): Promise<any> {
		let pantry = this.getPantry();
		let activities = this.getActivities();

		let p1 = this.storage.set(DB.pantry, pantry);
		let p2 = this.storage.set(DB.activities, activities);
		return Promise.all([p1, p2]);
	}

	private getPantry(): Array<Supply> {
		return [
			{ name: "Spaghetti Noodles", stocked: true }, 
			{ name: "Colander", stocked: true },
			{ name: "Paper", stocked: true },
			{ name: "Crayons", stocked: true }
		];
	}

	private getActivities(): Array<Activity> {
		return [{
			"name": "Tracing small toys",
			"instructions": "Collect a pile of small toys. Have your toddler try to trace them one by one.",
			"location": "Indoor",
			"ages": ["5", "10"],
			"supervision": false,
			"supplies": ["Paper", "Crayons"]
		},
		{
			"name": "Threading Spaghetti",
			"instructions": "Get a colander and place it upside-down in front of your toddler. Have them thread as many spaghetti noodles in the holes of the colander as they can. It will look like a porcupine at the end!",
			"location": "Indoor",
			"ages": ["2", "5", "10"],
			"supervision": false,
			"supplies": ["Spaghetti Noodles", "Colander"]
		}];
	}
}