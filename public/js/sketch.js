let guide;
let spinner;
let y;
let a;
let r;
let n;
let logo_background;

// let v = document.getElementById('sketch-holder')

let rot;

let mouse_x = 0;
let mouse_y = 0;

function preload() {

}


function setup () {
  // var canvas = createCanvas(550, 550); //400, 400
  var canvas = createCanvas(windowWidth, 550);
  canvas.parent('sketch-holder');
  guide = loadImage('../imgs/yarn_logo.png')
  logo_background = loadImage('../imgs/yarn_just_logo.png')
  spinner = loadImage('../imgs/yarn_spinner.png')
  y = loadImage('../imgs/Y.png')
  a = loadImage('../imgs/A.png')
  r = loadImage('../imgs/R.png')
  n = loadImage('../imgs/N.png')
  yarn1 = loadImage('../imgs/background_yarn.png')
  yarn2 = loadImage('../imgs/background_yarn copy.png')



}

function drawz(){
function draw(){
    background('#225E97')
    // background(34,94,151)
    push()
    console.log(windowWidth)
    translate(windowWidth/3.3,0)
    // push()
    // image(yarn1, 275, 280, windowWidth)
    // tint(255, 200)
    // image(yarn2, 275, 280, windowWidth)

    // tint(0,180,180)


    tint(255)
    image(logo_background, 275, 275)
    tint(255, 127)
    push();
    translate(200,275)
    rot = PI * (mouseX-mouseY)/1200;
    rot2 = Math.abs(PI * (mouseX-mouseY)/3000);
    rotate(rot2);
    image(spinner,0,0);
    pop();
    tint(255, 255)
    image(y,110+rot*.3,320-rot*3);
    image(a,190-rot*.3,310+rot*3);
    image(r,250+rot*.3,310-rot*3);
    image(n,320-rot*.3,310+rot*3);
    pop();
    pop();

    imageMode(CENTER);
}
draw()
}

// if (mouseX != mouse_x || mouseY != mouse_y){
//     console.log('hey')
//     drawz()
//     mouse_x = mouseX
//     mouse_y = mouseY
// }
interv = setInterval(drawz,50)
