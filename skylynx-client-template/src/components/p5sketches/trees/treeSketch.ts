//This is our Tree sketch
import { Element } from "p5";
import {P5Instance} from "../../ui/gamming/reactP5WrapperComponent"




export function Tree (p:P5Instance){

let leaves = [];
let trunkHeight=50
let branchLength = trunkHeight/4;
let tree = [];
let slider:Element;
var count = 0;
if(p !== undefined)
{
    //set Vars for sketch here this will come from props
    let height = 200;
    let width = 300;
    let angle: number | string  = (Math.PI / 4);

//tree private methods for building branches
const BranchB = (len:number) => {
p.line(0,0,0,-len)
let bLen = len
  p.translate(0, -bLen);
  p.rotate(3.14 / 4);
  BranchB(len * 0.67);
  p.line(0, 0, 0, -len * 0.67);
}

const Branch = (len:number, ) => {
    //draw a line
    p.line(0, 0, 0, -len);
    //return to start
    p.translate(0, -len);
    if(len > 2)
    {
        //push saves the location of translate
        p.push();
        p.rotate(Number(angle));
        //Changes Color of branch
        const rndRigtInt = Math.floor(Math.random() * 255) + 1
        p.stroke(rndRigtInt);
        Branch(len * 0.67);
        //This starts from the saved push location
        p.pop();
        p.push();
        const rndLeftInt = Math.floor(Math.random() * 255) + 1
        p.stroke(rndLeftInt);
        p.rotate(-angle);
        Branch(len * 0.67);
        p.pop();
    }

//for (let iLen = len; iLen < len; iLen--) {
  //  p.translate(0, -iLen);
  //  p.rotate(Math.PI / 4);
  //  BranchB(iLen * 0.67);
  //move my branch
 //  iLen = iLen + iLen * 0.25;

//}



}
    p.setup = () => {
    p.createCanvas(width, height);
    //Add Other controls for app here 
    //slider = p.createSlider(0,p.TWO_PI,Number(angle),0.01)

    }

    p.draw = () => {
    //Make background grey
    p.background(51);
    //set the color of tree
    p.stroke(175);
    //Set the height of the tree
    p.translate(width*.50, height);
    p.line(0,0,0,-trunkHeight)
    Branch(trunkHeight);
}
    }

};

