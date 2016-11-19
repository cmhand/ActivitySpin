import { Component, EventEmitter, Input, Output, AfterViewInit, ElementRef } from '@angular/core';

import { Activity } from "../../model/activity.interface";
@Component({
	selector: 'activities-spinner',
	templateUrl: 'spinner.component.html'
})
export class SpinnerComponent implements AfterViewInit {
	public transformStyle: string = "rotate(0deg)";
	@Input() activities: Array<Activity>;
	@Output() activitySelected: EventEmitter<number> = new EventEmitter<number>();

	private color = ['red','orange','yellow','green','cyan','blue', "indigo", "violet"];
	private slices = this.color.length;
	private sliceDeg = 360/this.slices;
	private deg = this.rand(0, 360);
	private speed = 0;
	private slowDownRand = 0;
	private ctx;
	private width; // size
	private center;      // center
	private isStopped = false;
	private lock = false;

	private currentDegrees: number = 0;
	constructor(private element: ElementRef) {}

	ngAfterViewInit() {
		let canvas = this.element.nativeElement.querySelector("canvas");
		this.ctx = canvas.getContext('2d');
		this.width = canvas.width;
		this.center = this.width / 2;
		this.drawImg();
	}

	public spin() {
		if(this.activities.length > 0) {
			setTimeout(() => {
				this.isStopped = true;
			}, 500);
			this.isStopped = false;
			this.speed = 15;
			this.animate();
		}
	}

	private selectRandom() {
		let activity = Math.floor(Math.random() * this.activities.length);
		this.activitySelected.emit(activity);
	}

	private rand(min, max) {
	  return Math.random() * (max - min) + min;
	}

	private deg2rad(deg) {
	  return deg * Math.PI/180;
	}

	private drawSlice(deg, color) {
	  this.ctx.beginPath();
	  this.ctx.fillStyle = color;
	  this.ctx.moveTo(this.center, this.center);
	  this.ctx.arc(this.center, this.center, this.width/2 - 10, this.deg2rad(deg), this.deg2rad(deg+this.sliceDeg));
	  this.ctx.lineTo(this.center, this.center);
	  this.ctx.fill();
	}

	private drawImg() {
	  this.ctx.clearRect(0, 0, this.width, this.width);
	  for(var i = 0; i < this.slices; i++){
	    this.drawSlice(this.deg, this.color[i]);
	    this.deg += this.sliceDeg;
	  }
	}

	private animate = () => {
		this.deg += this.speed;
		this.deg %= 360;

		// Increment speed
		if(!this.isStopped && this.speed < 10){
			this.speed = this.speed + 1 * 0.5;
		}
		// Decrement Speed
		if(this.isStopped){
			if(!this.lock){
			  this.lock = true;
			  this.slowDownRand = this.rand(0.960, 0.998);
			} 
			this.speed = this.speed > 0.4 ? this.speed *= this.slowDownRand : 0;
		}
		// Stopped!
		if(this.lock && !this.speed){
			this.selectRandom();
			return; 
		}

		this.drawImg();
		window.requestAnimationFrame( this.animate );
	};
}