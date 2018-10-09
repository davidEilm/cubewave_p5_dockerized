var widthOfBlock = 10;
var numOfBlocksInRow = 40;

var start1 = 0;
var start2 = 0;

var waviness = 0.1;
var speed = 0.1;

var drawFlag = false;

//REST stuff
const Http = new XMLHttpRequest();
const baseUrl = 'http://192.168.99.100:5102';

function setup() {
  createCanvas(600, 600, WEBGL);
  //ortho(-width/1.3, width/1.3, -height/1.3, height/1.3, -600, 600);

  getConfiguration();
}

async function getConfiguration() {
  numOfBlocksInRow = await getNumOfBlocks();
  widthOfBlock = await getBlockWidth();
  waviness = await getWaviness();
  speed = await getSpeed();

  console.log("numOfBlocks returned: " + numOfBlocksInRow);
  console.log("widthOfBlock returned: " + widthOfBlock);
  console.log("waviness returned: " + waviness);
  console.log("speed returned: " + speed);

  drawFlag = true;
}

function getNumOfBlocks() {
  return new Promise((resolve, reject) => {
    //Get numOfBlocks
    Http.open("GET", baseUrl + '/api/numOfBlocks');
    Http.send();
    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4) { //VERY IMPORTANT!!!
        resolve(Number(Http.responseText));
      }
    }
  });
}

function getBlockWidth() {
  return new Promise((resolve, reject) => {
    //Get width of one inndividual block
    Http.open("GET", baseUrl + '/api/widthOfBlock');
    Http.send();
    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4) { //VERY IMPORTANT!!!
        resolve(Number(Http.responseText));
      }
    }
  });
}

function getWaviness() {
  return new Promise((resolve, reject) => {
    //Get waviness
    Http.open("GET", baseUrl + '/api/waviness');
    Http.send();
    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4) { //VERY IMPORTANT!!!
        resolve(Number(Http.responseText));
      }
    }
  });

}

function getSpeed() {
  return new Promise((resolve, reject) => {
    //Get speed
    Http.open("GET", baseUrl + '/api/speed');
    Http.send();
    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4) { //VERY IMPORTANT!!!
        resolve(Number(Http.responseText));
      }
    }
  });
}

function draw() {

  if (drawFlag) {
    background(0);
    stroke(255);
    fill(0);

    translate(0, 0, -500); //To view the simulation in orthographic-view, replace -500 in this line with width/2, and uncomment the ortho(...) line in setup().
    rotateX(radians(-25));
    rotateY(PI / 4);

    //Shows the center
    //fill(255, 0, 0);
    //ellipse(0, 0, 20, 20);
    //fill(200);

    var s1 = start1;
    for (var x = 0; x < numOfBlocksInRow; x++) {
      var s2 = start2;
      for (var z = 0; z < numOfBlocksInRow; z++) {
        push();

        translate(x * widthOfBlock, 0, z * widthOfBlock);
        translate(-(numOfBlocksInRow * widthOfBlock / 2) + widthOfBlock / 2, 0, -(numOfBlocksInRow * widthOfBlock / 2) + widthOfBlock / 2);
        scale(1, map(sin(s1) + sin(s2), -2, 2, 1, 5), 1);
        box(widthOfBlock);

        pop();
        s2 += waviness;
      }
      s1 += waviness;
    }
    start1 += speed;
    start2 += speed;
  }


}