
//** Branch Class  */
//** This method will be the class for building branches */
import { Vector } from "p5";
import P5Sketch from "../../ui/gamming/p5Sketch";
import {P5Instance} from "../../ui/gamming/reactP5WrapperComponent";
import * as tModels from "./treeModels";

export module tree{
//This method is used to draw branches on the tree
export class SimpleBranch 
{
    //The vector type is a xy point
    begin:Vector;
    end:Vector;
    p5:P5Instance;
    girth?:number;
    color?:number;
constructor(start:Vector, end:Vector, p:P5Instance)
{
  this.begin = start;
  this.end = end;
  this.p5 = p;
}


  //This draws the trunk 
  draw(colorValue:number = 255,branchGirth:number=1){
    this.color = colorValue;
    this.girth = branchGirth;
    //set the color of tree
    this.p5.stroke(colorValue);
    //drawline
    this.p5.line(this.begin.x,this.begin.y, this.end.x,this.end.y);
  }

  createRightBranch()
  {
    //We now want to create a dirctional vetor by subtracting the beginging from end
    let direction = Vector.sub(this.end,this.begin);
    //Now that we have the start point lets rotate it
    direction.rotate(Math.PI/4);
    direction.mult(.67);
    let rightEnd = Vector.add(this.end, direction);
    //Now we can draw the new right branch
    let rightBranch = new SimpleBranch(this.end,rightEnd,this.p5);
    return rightBranch;

  }
  createLeftBranch()
  {

    //We now want to create a dirctional vetor by subtracting the beginging from end
    let direction = Vector.sub(this.end,this.begin);
    //Now that we have the start point lets rotate it
    direction.rotate(-(Math.PI/4));
    direction.mult(.67);
    let leftEnd = Vector.add(this.end, direction);
    //Now we can draw the new right branch
    let leftBranch = new SimpleBranch(this.end,leftEnd,this.p5);
    return leftBranch;

  }
  //add jitter 
  jitter()
  {
    this.end.x += Math.floor(Math.random() * -5) + 5;
    this.end.y += Math.floor(Math.random() * -5) + 5;
  }
}

}

