//This is our Tree sketch
import { Element, Vector } from "p5";
import {P5Instance} from "../../ui/gamming/reactP5WrapperComponent";
import {tree} from "./branch";
import {FireWorkClass} from "../fireworks/firework";
import {ParticleClass} from "../fireworks/particle";
import {explosionPlacment,GravityValue} from "../fireworks/fireworksModels";


export function SketchLive (p5I:P5Instance){

//Fractial tree section
let treeArray:Array<tree.Branch> = [];
let slider:Element;
var count = 0;
let leaves = [];
//Fireworks Section
let fireworks:Array<FireWorkClass> = [];
let gravity:Vector;


if(p5I !== undefined)
{
    //set Vars for sketch here this will come from props
    let height = 400;
    let width = 1200;
    //Set the type to the class
    let root:tree.Branch;
    p5I.setup = () => {
    p5I.createCanvas(width, height);

   const TreeSetUp = () =>{
    //Each vector point is a screen point (x,y)
    //Every line is made up of two vetor points
    let startVector = p5I.createVector(width/2,height);
    let endVector = p5I.createVector(width/2,height-100);
    root = new tree.Branch(startVector,endVector,p5I);
    //Add the root of the tree
    treeArray[0] = root;
    //for now add branches when user presses down
    //later add branches for the number od days in a year
    //Add leaves when we are making money 
    const rndNumberofBranches = p5I.random(2, 200);
    for (let index = 0; index <= rndNumberofBranches; index++) {
        treeArray.push(treeArray[index].createRightBranch());
        treeArray.push(treeArray[index].createLeftBranch());
        //Check for number of branches in futher swith girth
        //size to decided when to add leaves
        if(rndNumberofBranches > 275 && rndNumberofBranches > 400 )
        {
        //set Count for leaves
        if(count === 0 && index > 175)
        {
            count++
        }
        if(count === 3)
        {
            //make leaves on every third branch
            count = 0;
        }
        }
        }

}
const FireWorkSetUp = () =>{
        //setup Fireworks Show
        p5I.colorMode(p5I.HSB);
        gravity = p5I.createVector(0, GravityValue);
        p5I.stroke(255);
        p5I.strokeWeight(4);
        p5I.background(0);
}

//Setup Fire Works
FireWorkSetUp(); 
TreeSetUp ();
//Add tree
    //end of setup
    }

    p5I.draw = () => {
    const drawTree = () => {
      //Make background grey
    p5I.background(0);
      //treeArray[0].draw();
      //set the color of tree by passing a value to the draw method
    let unjitterCounter: number = 1;
    const jitterBugEffect = (itemIndex:number) => {
        if (itemIndex < treeArray.length / 2) {
        treeArray[itemIndex].jitter();
        } else {
        unjitterCounter = itemIndex - unjitterCounter;
        if (itemIndex > 0) treeArray[itemIndex].unjitter();
        unjitterCounter++;
        }
    };
    for (let index = 0; index < treeArray.length; index++) {
        treeArray[index].draw();
    }
    };


    //Add fire works behind the tree
     drawTree();
    p5I.colorMode(p5I.RGB);
    p5I.background(0, 0, 0, 25);
    if (p5I.random(1) < 0.03) {
        fireworks.push(new FireWorkClass(p5I,width,height-100,gravity));
}

for (var i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();

    if (fireworks[i].done()) {
    fireworks.splice(i, 1);
    }
}

}
    }

};

