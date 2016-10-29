import { Component, OnInit } from '@angular/core';
import { ViewController } from "ionic-angular";

@Component({
	selector: 'select-filter',
	templateUrl: './select-filter.component.html'
})
export class SelectFilterComponent implements OnInit {
	public age: string[] = [];
	public supervision: boolean;
	public location: string;

	public setAges: boolean = false;
	public setLocation: boolean = false;
	public setSupervision: boolean = false;
	constructor(
		private viewCtrl: ViewController
	) {}

	ngOnInit() {
		
	}

	ok() {
		this.viewCtrl.dismiss({
			ages: this.age,
			supervision: this.supervision,
			location: this.location
		});
	}

	cancel() {

	}
}