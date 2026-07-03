
//** Branch Class  */
//** This method will be the class for building branches */
import { Vector } from "p5";
import P5Sketch from "../../ui/gamming/p5Sketch";
import {P5Instance} from "../../ui/gamming/reactP5WrapperComponent";
import * as tModels from "./treeModels";

export module tree{
//This method is used to draw branches on the tree
export class Branch {
  //The vector type is a xy point
  begin: Vector;
  end: Vector;
  p5I: P5Instance;
  isFinished?: boolean;
  girth?: number;
  color?: number;
  jitterValue: tModels.JitterModel;
  constructor(start: Vector, end: Vector, p: P5Instance) {
    this.begin = start;
    this.end = end;
    this.p5I = p;
    this.jitterValue = { x: this.p5I.random(-1, 1), y: this.p5I.random(-1, 1) };
  }

  //This draws the trunk
  draw(colorValue: number = 255, branchGirth: number = 1) {
    this.color = colorValue;
    this.girth = branchGirth;
    //set the color of tree
    this.p5I.stroke(colorValue);
    //drawline
    this.p5I.line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }

  createBranch(angle: number | string, placment: tModels.BranchPlacment) {
    //We now want to create a dirctional vetor by subtracting the beginging from end
    let direction = Vector.sub(this.end, this.begin);
    //Now that we have the start point lets rotate it
    direction.rotate(Number(angle));
    direction.mult(0.67);
    let rightEnd = Vector.add(this.end, direction);
    //Now we can draw the new right branch
    let newBranch = new Branch(this.end, rightEnd, this.p5I);
    return newBranch;
  }
  //this method will act like draw but use a grey color value and add shading outside
  //or inside of the branch
  addShading() {}

  //This method will take a pattern and create textured bark for the tree
  addBark() {}
  createRightBranch() {
    //We now want to create a dirctional vetor by subtracting the beginging from end
    let direction = Vector.sub(this.end, this.begin);
    //Now that we have the start point lets rotate it
    direction.rotate(Math.PI / 4);
    direction.mult(0.67);
    let rightEnd = Vector.add(this.end, direction);
    //Now we can draw the new right branch
    let rightBranch = new Branch(this.end, rightEnd, this.p5I);
    return rightBranch;
  }
  createLeftBranch() {
    //We now want to create a dirctional vetor by subtracting the beginging from end
    let direction = Vector.sub(this.end, this.begin);
    //Now that we have the start point lets rotate it
    direction.rotate(-(Math.PI / 4));
    direction.mult(0.67);
    let leftEnd = Vector.add(this.end, direction);
    //Now we can draw the new right branch
    let leftBranch = new Branch(this.end, leftEnd, this.p5I);
    return leftBranch;
  }
  //add jitter
  jitter() {

    this.end.x += this.jitterValue.x;
    this.end.y += this.jitterValue.y;
  }
  unjitter() {
    this.end.x -= this.jitterValue.x;
    this.end.y -= this.jitterValue.y;
  }
}

}

