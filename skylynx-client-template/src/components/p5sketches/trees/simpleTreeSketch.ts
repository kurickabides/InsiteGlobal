//This is our Tree sketch
import { Element } from "p5";
import {P5Instance} from "../../ui/gamming/reactP5WrapperComponent";
import {tree} from "./simplebranch";



export function LiveTree (p5I:P5Instance){

let leaves = [];
let treeArray:Array<tree.SimpleBranch> = [];
let slider:Element;
var count = 0;
if(p5I !== undefined)
{
    //set Vars for sketch here this will come from props
    let height = 400;
    let width = 350;
    //Set the type to the class
    let root:tree.SimpleBranch;
    p5I.setup = () => {
    p5I.createCanvas(width, height);
    //Each vector point is a screen point (x,y)
    //Every line is made up of two vetor points
    let startVector = p5I.createVector(width/2,height);
    let endVector = p5I.createVector(width/2,height-100);
    root = new tree.SimpleBranch(startVector,endVector,p5I);
    //Add the root of the tree
    treeArray[0] = root;
    //for now add branches when user presses down
    //later add branches for the number od days in a year
    //Add leaves when we are making money 
    const rndNumberofBranches = p5I.random(2, 50);
    for (let index = 0; index <= rndNumberofBranches; index++) {
        treeArray.push(treeArray[index].createRightBranch());
        treeArray.push(treeArray[index].createLeftBranch());
    }


    }

    p5I.draw = () => {
    //Make background grey
    p5I.background(51);
    //treeArray[0].draw();
    //set the color of tree by passing a value to the draw method
    for (let index = 0; index < treeArray.length; index++) {
        treeArray[index].draw();
        //treeArray[index].jitter();
    }


}
    }

};

