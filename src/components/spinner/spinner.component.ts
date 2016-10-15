import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { Activity } from "../../model/activity.interface";

@Component({
	selector: 'activities-spinner',
	templateUrl: 'spinner.component.html'
})
export class SpinnerComponent implements OnInit {
	public transformStyle: string = "rotate(0deg)";
	@Input() activities: Array<Activity>;
	@Output() activitySelected: EventEmitter<number> = new EventEmitter<number>();

	private currentDegrees: number = 0;
	constructor() {}

	ngOnInit() {
		
	}

	public spin() {
		if(this.activities.length > 0) {
			this.currentDegrees += this.getRandomArbitrary();
			this.transformStyle = `rotate(${this.currentDegrees}deg)`;
			setTimeout(() => {
				this.selectRandom();
			}, 1500);
		}
	}

	private selectRandom() {
		let activity = Math.floor(Math.random() * this.activities.length);
		this.activitySelected.emit(activity);
	}

	private getRandomArbitrary() {
		let min = 720;
		let max = 1420;
	  return Math.random() * (max - min) + min;
	}
}