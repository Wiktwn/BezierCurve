let curvePoints = [];        //do not change 
let moving = [];             //do not change 
let drawn = [];              //do not change 
let updating = true;         //no point to changing here
let framerate = 0;           // also no point 
let drawControlPoints = true;//toggle wether you are able to see the curve control points
let smoothUpdate = true;     //update curves while dragging control points or not

function setup() {
  
  //create random starting vectors for 1 bezier curve
  let p1 = randomVector(); 
  let p2 = randomVector();
  let p3 = randomVector();
  let p4 = randomVector();
  
  curvePoints.push.apply(curvePoints,[p1,p2,p3,p4]);//add the random points to list of points
  moving.push.apply(moving,[false,false,false,false]);//default vales for moving list
  createCanvas(windowWidth-100, windowHeight-100);// You must already know this if you're here
}

function draw() {
  //checks if any of the points are moving
  for (let i=0; i<moving.length; i++) {
    let p = curvePoints[i];
    if (moving[i]) {
      // keep all control points of the curves inside the bounds of the HTM5 canvas
      p.x = constrain(mouseX, 0, width);
      p.y = constrain(mouseY, 0, height);
      if (smoothUpdate) {
        updating=true;
      }
    }
  }
  
  background(0);
  strokeWeight(4);
  stroke(70);
  
  //if the curve changed run the bezier function for all points, otherwise just redraw
  if (updating) {
    let x=0;
    drawn = [];
    while (x<curvePoints.length-(curvePoints.length%4)) {
      const p1=curvePoints[x];   const p2=curvePoints[x+1];
      const p3=curvePoints[x+2]; const p4=curvePoints[x+3];
      drawn.push(bezierCurve(p1, p2, p3, p4, false)); // add the sampled points of the curve
      x+=4;                                           // to the list of already drawn points
    } 
    updating=false;
  }
  for (let curve of drawn) {
    for (let l of curve) {
      line(l[0], l[1], l[2], l[3]);
    }
  }
  
  // shows the points that the cubic bezier curve is generated from
  if (drawControlPoints) {
    for (let i=0; i<curvePoints.length; i++) {
      strokeWeight(5);
      const p = curvePoints[i];
      if ((i-3)%4==0 || i%4==0) {
        stroke("red");
      } else {
        stroke("#89CFF0");
      }
      point(p.x, p.y);
      if ((i+1)%4==0) {
        stroke("grey");
        strokeWeight(1);
        line(p.x, p.y, curvePoints[i-1].x, curvePoints[i-1].y);
        line(curvePoints[i-2].x, curvePoints[i-2].y, curvePoints[i-3].x, curvePoints[i-3].y);
      }
    }
  }
  
  // update frame rate counter every 15 frames
  stroke(255);
  if (frameCount%15==0) {
    framerate = round(frameRate(), 1);
  }
  text(framerate, 10, 20);
}

function lerp2d(p1, p2, t) {
  //takes a p5.Vector and returns the lerp function for its x and y values
  return createVector(lerp(p1.x, p2.x, t), lerp(p1.y, p2.y, t))
}

function bezierCurve(p1, p2, p3 , p4, draw) {
  let points = []; // list of all the points sampled along the bezier curve
  
  let t=0;
  while (t < 1) {
    //a lot of linear interpolation
    let a1 = lerp2d(p1, p2, t);
    let a2 = lerp2d(p2, p3, t);
    let a3 = lerp2d(p3, p4, t);
    let b1 = lerp2d(a1, a2, t);
    let b2 = lerp2d(a2, a3, t);
    let c1 = lerp2d(b1, b2, t);
    points.push(c1);
    //point(c1.x, c1.y);
    t+=0.01;
  }
  
  //draw a line between each point or return a list of lines
  if (!draw) {
    let returnList = [];
    for (let i=0; i<points.length-1; i++) {
      const d1 = points[i];
      const d2 = points[i+1];
      returnList.push([d1.x, d1.y, d2.x, d2.y]); // return line start and end points
    }
    return returnList;
  } else {
    for (let i=0; i<points.length-1; i++) {
      let d1 = points[i]; // starting point of the line 
      let d2 = points[i+1]; // ending point of the line
      line(d1.x, d1.y, d2.x, d2.y); // draw line
    }
    return;
  }
}

function randomVector() {
  let x = random(0,  width*4);
  let y = random(0, height*4);
  return createVector(x, y);
}

function mousePressed() {
  for (let i=0; i<curvePoints.length; i++) {
    let p = curvePoints[i];
    const d = dist(p.x, p.y, mouseX, mouseY)
    if (d<5) {
      moving[i] = true;
    }
  }
  document.getElementById("paragraph").hidden = true;
}

function mouseReleased() {
  for (let i=0; i<moving.length; i++) {
    moving[i] = false;
  }
  updating=true;
}

function doubleClicked() {
  const x = constrain(mouseX, 0,  width);
  const y = constrain(mouseY, 0, height);
  curvePoints.push(createVector(x, y));
  updating=true;
}

function keyPressed() {
  if (key != " ") {
    return;
  }
  if (drawControlPoints == true) {
    drawControlPoints = false;
  } else {
    drawControlPoints = true;
  }
}