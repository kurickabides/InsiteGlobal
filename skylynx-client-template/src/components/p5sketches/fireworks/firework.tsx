import {P5Instance} from "../../ui/gamming/reactP5WrapperComponent";
import { Vector } from "p5";
//fwm stans for fireworks module
import {ParticleClass} from "./particle";
//This method is used to draw branches on the tree
export class FireWorkClass {
  hue: number;
  firework: ParticleClass;
  p5I: P5Instance;
  particles: Array<ParticleClass> = [];
  exploded = false;
  gravity: Vector;
  //**@displayField:number this field should be the screen width */
  constructor(
    p: P5Instance,
    displayField: number,
    displayHeight: number,
    gravity: Vector
  ) {
    this.p5I = p;
    this.hue = p.random(255);
    this.firework = new ParticleClass(
      p,
      p.random(displayField),
      displayHeight,
      this.hue,
      true
    );
    this.gravity = gravity;
  }
  done() {
    if (this.exploded && this.particles.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(this.gravity);
      this.firework.update();

      if (this.firework.speed.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (var i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(this.gravity);
      this.particles[i].update();

      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    for (var i = 0; i < 100; i++) {
      var p = new ParticleClass(
        this.p5I,
        this.firework.screenLocation.x,
        this.firework.screenLocation.y,
        this.hue,
        false
      );
      this.particles.push(p);
    }
  }

  display() {
    if (!this.exploded) {
      this.firework.show();
    }

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

