//**Partical */
//**This class creates particals */
import {P5Instance} from "../../ui/gamming/reactP5WrapperComponent";
import { Vector } from "p5";
import * as tModels from "./fireworksModels";

//This method is used to draw branches on the tree
export class ParticleClass{
  p5I:P5Instance;
  screenLocation:Vector;
  isFirework:boolean;//is this a firework or just a falling partical
  lifespan:number;//life of firwork before explosion
  hue:number; //**Color */
  acc:Vector;//Not sure what this is yet
  speed:Vector;
//**
// */
// * @param p5I -> p5Js running Instance for sketch
// * @param x   -> x Value to create Vector
// * @param y   -> y Value to create Vector
//* @param hu   -> Color value for Fire work
//* @param firework -> FirworkClass
// */
constructor(p:P5Instance,x:number, y:number, hu:number, isFirework:boolean) {
  this.p5I = p;
  this.screenLocation = p.createVector(x, y);
  this.isFirework = isFirework;
  this.lifespan = 255;
  this.hue = hu;
  this.acc = p.createVector(0, 0);
  //Special firework counter
  if (isFirework) {
    //By just changing the location to of y we can change the height of firework
    this.speed = p.createVector(0, p.random(-11, -6));
  }
  else {
    this.speed = Vector.random2D();
    this.speed.mult(p.random(2, 10));
  }
}

  applyForce(force:Vector) {
    this.acc.add(force);
  };

  update() {
    if (!this.isFirework) {
      this.speed.mult(0.9);
      this.lifespan -= 4;
    }

    this.speed.add(this.acc);
    this.screenLocation.add(this.speed);
    this.acc.mult(0);
  };

  done() {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  };

  show() {
    this.p5I.colorMode(this.p5I.HSB);

    if (!this.isFirework) {
      this.p5I.strokeWeight(2);
      this.p5I.stroke(this.hue, 255, 255, this.lifespan);

    } else {
      this.p5I.strokeWeight(5);
      this.p5I.stroke(this.hue, 255, 255);
      this.p5I.point(this.screenLocation.x, this.screenLocation.y);
      //this.p5I.point(this.p5I.random(this.screenLocation.x-50,this.screenLocation.x+50), this.screenLocation.y);
    }

    this.p5I.point(this.screenLocation.x, this.screenLocation.y);
  };
}


