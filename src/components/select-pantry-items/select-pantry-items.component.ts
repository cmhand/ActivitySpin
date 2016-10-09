import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { Supply } from "../../model/supply.interface";
import { DB } from "../../constants/db";

@Component({
	selector: 'select-pantry-items',
	templateUrl: './select-pantry-items.component.html'
})
export class SelectPantryItemsComponent implements OnInit {
	public stocked: string[];
	public selected: string[] = [];
	public newItem: string;

	private fullPantry: Array<Supply>;
	constructor(
		private viewCtrl: ViewController,
		private params: NavParams,
		private storage: Storage
	) {
	}

	ngOnInit() {
		this.selected = this.params.get("selectedItems");
		this.storage.get(DB.pantry).then((pantry: Array<Supply>) => {
			this.fullPantry = pantry;
			this.stocked = pantry.filter((item: Supply) => {
				return item.stocked;
			}).map((item: Supply) => {
				return item.name;
			});
		})
	}

	public add() {
		let item = {
			name: this.newItem,
			stocked: true
		};
		this.stocked.push(item);
		this.fullPantry.push(item);
		this.storage.set(DB.pantry, this.fullPantry);
	}

	public toggle(item: string) {
		let index = this.selected.indexOf(item);
		if(index > -1) {
			this.selected.splice(index, 1);
		} else {
			this.selected.push(item);
		}
	}

	public cancel() {
		this.viewCtrl.dismiss();
	}

	public ok() {
		this.viewCtrl.dismiss(this.selected);
	}

}