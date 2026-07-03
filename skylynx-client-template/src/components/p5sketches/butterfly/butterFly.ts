//This is our Tree sketch
import {P5Instance} from "../../ui/gamming/reactP5WrapperComponent"


var yoff = 0;
export function ButterFly (p:P5Instance){


var count = 0;
if(p !== undefined)
{
    //set Vars for sketch here this will come from props 
    let height = 400;
    let width = 400;
    p.setup = () => {
    p.createCanvas(height, width);
    }

    p.draw = () => {
    p.background(51);
    p.translate(width / 2, height / 2);
    //rotate(PI / 2);
    //Make so we can alter
    p.stroke(255);
    p.fill(255, 50);
    p.strokeWeight(1);

  var da = Math.PI / 200;
  var dx = 0.05;

  var xoff = 0;
  p.beginShape();
  let TWO_PI = Math.PI*2;
for (var a = 0; a <= TWO_PI; a += da) {
    var n = p.noise(xoff, yoff);
    var r = Math.sin(2 * a); //* Math.map(n, 0, 1, 50, 300);
    var x = r * Math.cos(a);
    var y = r * Math.sin(a);
    if (a < Math.PI) {
    xoff += dx;
    } else {
    xoff -= dx;
    }
    //point(x, y);
    p.vertex(x, y);
    }
    p.endShape();

  yoff += 0.01;
}
    }

};

