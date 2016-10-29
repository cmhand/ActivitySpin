import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from "ionic-angular";

import { Activity } from "../../model/activity.interface";

@Component({
	selector: 'view-activity',
	templateUrl: 'view-activity.component.html'
})
export class ViewActivityComponent implements OnInit {
	public activity: Activity;
	public isNew: boolean;
	constructor(
		private params: NavParams,
		private viewCtrl: ViewController
	) {}

	ngOnInit() {
		this.activity = this.params.get("activity");
		this.isNew = this.params.get("new") ? true : false;
	}

	dismiss(discard: boolean) {
		let data = discard ? {action: "discard"} : null;
		this.viewCtrl.dismiss(data);	
	}

	complete() {
		this.viewCtrl.dismiss({
			action: "complete"
		});
	}
}