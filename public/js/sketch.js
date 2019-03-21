let guide;
let spinner;
let y;
let a;
let r;
let n;
let logo_background;

let rot;

function preload() {

}


function setup () {
  var canvas = createCanvas(550, 550); //400, 400
  canvas.parent('sketch-holder');
  guide = loadImage('../imgs/yarn_logo.png')
  logo_background = loadImage('../imgs/yarn_just_logo.png')
  spinner = loadImage('../imgs/yarn_spinner.png')
  y = loadImage('../imgs/Y.png')
  a = loadImage('../imgs/A.png')
  r = loadImage('../imgs/R.png')
  n = loadImage('../imgs/N.png')



}


function draw(){
    background(34,94,151)
    image(logo_background, 275, 275)
    tint(255, 127)
    push();
    translate(200,275)
    rot = PI * (mouseX-mouseY)/1200;
    rot2 = PI * (mouseX-mouseY)/3000
    rotate(rot2);
    image(spinner,0,0);
    pop();
    tint(255, 255)
    image(y,110+rot*.3,320-rot*3);
    image(a,190-rot*.3,310+rot*3);
    image(r,250+rot*.3,310-rot*3);
    image(n,320-rot*.3,310+rot*3);

    imageMode(CENTER);
}

interv = setInterval(draw,1000)
