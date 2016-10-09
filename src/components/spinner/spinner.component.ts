import { Component, OnInit, Input } from '@angular/core';

import { Activity } from "../../model/activity.interface";

@Component({
	selector: 'activities-spinner',
	templateUrl: 'spinner.component.html'
})
export class SpinnerComponent implements OnInit {

	@Input() activities: Array<Activity>;
	public canvas: any;
	
	private color: any[] = [];
	private label: any[] = [];
	private slices: number;
	private sliceDeg: number;
	private deg: number;
	private speed: number = 0;
	private slowDownRand: number = 0;
	private ctx: any;
	private width: number;
	private center: number;
	private isStopped: boolean;
	private lock: boolean;

	constructor() {}

	ngOnInit() {
		this.canvas = document.querySelector("activities-spinner #canvas");
		this.drawSpinner();
	}

	private rand(min, max) {
		return Math.random() * (max - min) + min;
	}

	private drawSpinner() {
		let index = 0;
		this.activities.forEach((activity: Activity) => {
			if(index === 0) {
				this.color.push("#00d");
				index = 1;
			} else {
				this.color.push("#00f");
				index = 0;
			}
			this.label.push(activity.name.substr(0, 5));
		});
		this.slices = this.color.length;
		this.sliceDeg = 360/this.slices;
		this.deg = this.rand(0, 360);
		this.speed = 0;
		this.slowDownRand = 0;
		this.ctx = this.canvas.getContext('2d');
		this.width = this.canvas.width; // size
		this.center = this.width/2;      // center
		this.isStopped = false;
		this.lock = false;
		
		this.drawImg();
	}

	public spin() {
		this.isStopped = false;
		this.lock = false;
		this.anim();
		setTimeout(() => {
			this.isStopped = true;
		}, 1000);
	}

	private anim = () => {
		this.deg += this.speed;
		this.deg %= 360;

		// Increment speed
		if(!this.isStopped && this.speed < 8){
			this.speed = 15;
			//this.speed = this.speed + 1 * 0.5;
		}
		// Decrement Speed
		if(this.isStopped){
			if(!this.lock){
			  this.lock = true;
			  this.slowDownRand = this.rand(0.90, 0.998);
			} 
		
			this.speed = this.speed > 0.2 ? this.speed *= this.slowDownRand : 0;
		}
		// Stopped!
		if(this.lock && !this.speed){
			var ai = Math.floor(((360 - this.deg - 90) % 360) / this.sliceDeg); // deg 2 Array Index
			ai = (this.slices+ai)%this.slices; // Fix negative index
			return alert("You got:\n"+ this.activities[ai].name ); // Get Array Item from end Degree
		}
		this.drawImg();
		window.requestAnimationFrame( this.anim );
	};
		
	private deg2rad = (deg) => {
	  return deg * Math.PI/180;
	};

	private drawSlice = (deg, color) => {
	  this.ctx.beginPath();
	  this.ctx.fillStyle = color;
	  this.ctx.moveTo(this.center, this.center);
	  this.ctx.arc(this.center, this.center, this.width/2 - 5, this.deg2rad(deg), this.deg2rad(deg+this.sliceDeg));
	  this.ctx.lineTo(this.center, this.center);
	  this.ctx.fill();
	};

	private drawText = (deg, text) => {
	  this.ctx.save();
	  this.ctx.translate(this.center, this.center);
	  this.ctx.rotate(this.deg2rad(deg));
	  this.ctx.textAlign = "right";
	  this.ctx.fillStyle = "#fff";
	  this.ctx.font = 'bold 16px sans-serif';
	  this.ctx.fillText(text, 105, 10);
	  this.ctx.restore();
	};

	private drawImg = () => {
	  this.ctx.clearRect(0, 0, this.width - 5, this.width - 5);
	  for(var i=0; i<this.slices; i++){
	    this.drawSlice(this.deg, this.color[i]);
	    this.drawText(this.deg+this.sliceDeg/2, this.label[i]);
	    this.deg += this.sliceDeg;
	  }
	};


}