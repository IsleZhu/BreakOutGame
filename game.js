const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
console.log( window.innerWidth );
const boxWidth = 3;
const boxHeight = 2;
const boxDepth = 3;
const boxMargin = 0.02;
var bricksPerRow = 8; // how many bricks per row
var brickWidth = 2 * (boxWidth - boxMargin) / bricksPerRow;
var brickHeight = brickWidth * 0.618;
var brickDepth = brickHeight;
var brickRows = 3;
var boxUpSpace = 0.5;
var brickSet = [];
var brickCoordSet = []; // record each brick using its lower-left vertex

var plate = new THREE.Mesh();
var plateWidth = 1.8;
var plateHeight = 0.05;

const white = "#FFFFFF";
const purple = "#8678D8";
const darkblue = "#4D6DD5";
const blue = "#188CE1";
const lightpink = "#EEB5C5";
const pink = "#EF98A1";
const lightpurple = "#858BC5";
const red = "#FA7468";
const green = "#8DF277";
const lightgreen = "#D4ECA9";
const darkred = "#F35A5F";

camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

var alive = false;
var lives = 3;
var score = 0;
var level = 1;
var scoreStep = 1;

camera.position.z = 5;

var ballMesh = null;
var ballRadius = 0.08;
var ballVelocity = new THREE.Vector3(); // set up the velocity of the ball, TBD
var velocityFactor = 0.9;
var plateVelocity = 0.08;

var gameStart = document.createElement("a");
gameStart.style.position = "fixed";
gameStart.style.top = "45%";
gameStart.style.fontSize = window.innerHeight/18;
gameStart.style.left = window.innerWidth/2 - window.innerHeight/20 * 4.5;
gameStart.style.color = "gray";
gameStart.style.fontStyle = "normal";
gameStart.style.visibility = "visible";
gameStart.innerHTML = "Press Space to Start";
document.body.appendChild(gameStart);

function start() {
    gameStart.style.visibility = "visible";
    score = 0;
    lives = 3;
    level = 1;
    bricksPerRow = 8;
    brickWidth = 2 * (boxWidth - boxMargin) / bricksPerRow;
    brickHeight = brickWidth * 0.618;

    plateWidth = 1.8;
    ambientLight.intensity = 0.5;
    spotLight.intensity = 1;
    anotherspotLight.intensity = 1;
    gameOver.style.visibility = "hidden";
    gameOverShade.style.visibility = "hidden";
    for (k = 0; k < brickSet.length; k++) {
        scene.remove(brickSet[k]);
        // console.log(brick);
        // scene.remove(brick);
        console.log(scene);
    }
    brickSet.length = 0;
    brickCoordSet.length = 0;
    setupBricks();
    scoreStep = 1;
    velocityFactor = 0.9;
    initVelocity();
    scene.remove(plate);
    setupPlate();
}


var ambientLight = new THREE.AmbientLight();
var spotLight = new THREE.SpotLight();
var anotherspotLight = new THREE.SpotLight();



function initLight() {

    ambientLight = new THREE.AmbientLight(white, 0.5);
    scene.add(ambientLight);

    var hemiLight = new THREE.HemisphereLight(lightpurple,lightpurple,1);

    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 100, -100 );

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add( spotLight );

    anotherspotLight = new THREE.SpotLight( 0xffffff );
    anotherspotLight.position.set( 0, -100, -100 );

    anotherspotLight.castShadow = true;

    anotherspotLight.shadow.mapSize.width = 1024;
    anotherspotLight.shadow.mapSize.height = 1024;

    anotherspotLight.shadow.camera.near = 500;
    anotherspotLight.shadow.camera.far = 4000;
    anotherspotLight.shadow.camera.fov = 30;

    scene.add( anotherspotLight );

}


function setupScene() {
    var banzi = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2 * boxHeight, boxDepth ),
        new THREE.MeshPhongMaterial({opacity:0.25,color:purple,transparent:true}));
    banzi.position.x = -boxWidth;
    banzi.position.y = 0;
    banzi.position.z = -boxDepth/2;
    scene.add(banzi);
    var banzi = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2 * boxHeight, boxDepth ),
        new THREE.MeshPhongMaterial({opacity:0.25,color:purple,transparent:true}));
    banzi.position.x = boxWidth;
    banzi.position.y = 0;
    banzi.position.z = -boxDepth/2;
    scene.add(banzi);
    var banzi = new THREE.Mesh(new THREE.BoxGeometry(2 * boxWidth, 2 * boxHeight, 0.1),
        new THREE.MeshPhongMaterial({opacity:0.25,color:purple,transparent:true}));
    banzi.position.x = 0;
    banzi.position.y = 0;
    banzi.position.z = -boxDepth;
    scene.add(banzi);
    var banzi = new THREE.Mesh(new THREE.BoxGeometry(2 * boxWidth + 0.1, 0.1, boxDepth ),
        new THREE.MeshPhongMaterial({opacity:0.25,color:purple,transparent:true}));
    banzi.position.x = 0;
    banzi.position.y = boxHeight + 0.05;
    banzi.position.z = -boxDepth/2;
    scene.add(banzi);



    var points = [];
    points.push( new THREE.Vector3( -boxWidth, boxHeight, 0 ) );
    points.push( new THREE.Vector3( boxWidth, boxHeight, 0 ) );
    points.push( new THREE.Vector3( boxWidth, -boxHeight, 0 ) );
    points.push( new THREE.Vector3( -boxWidth, -boxHeight, 0 ) );
    points.push( new THREE.Vector3( -boxWidth, boxHeight, 0 ) );
    points.push( new THREE.Vector3( -boxWidth, boxHeight, -boxDepth ) );
    points.push( new THREE.Vector3( boxWidth, boxHeight, -boxDepth ) );
    points.push( new THREE.Vector3( boxWidth, -boxHeight, -boxDepth ) );
    points.push( new THREE.Vector3( -boxWidth, -boxHeight, -boxDepth ) );
    points.push( new THREE.Vector3( -boxWidth, boxHeight, -boxDepth ) );

    var geometry = new THREE.BufferGeometry().setFromPoints( points );

    var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: purple } ) );
    scene.add( line );

    points = [];
    points.push( new THREE.Vector3( boxWidth, boxHeight, 0 ) );
    points.push( new THREE.Vector3( boxWidth, boxHeight, -boxDepth ) );
    geometry = new THREE.BufferGeometry().setFromPoints( points );
    line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: purple } ) );
    scene.add( line );

    points = [];
    points.push( new THREE.Vector3( boxWidth, -boxHeight, 0 ) );
    points.push( new THREE.Vector3( boxWidth, -boxHeight, -boxDepth ) );
    geometry = new THREE.BufferGeometry().setFromPoints( points );
    line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: purple } ) );
    scene.add( line );

    points = [];
    points.push( new THREE.Vector3( -boxWidth,-boxHeight, 0 ) );
    points.push( new THREE.Vector3( -boxWidth, -boxHeight, -boxDepth ) );
    geometry = new THREE.BufferGeometry().setFromPoints( points );
    line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: purple } ) );
    scene.add( line );

}

function setupBricks() {

    var colorSet = [darkred, red, darkblue, blue, pink, lightpink];
    var brickcolor = 0;
    var colorswitch = 1;
    for (var j = 0; j < brickRows; j++) {
        for (var i = 0; i < bricksPerRow; i++) {
            brickcolor += colorswitch;
            colorswitch *= -1;
            var brick = new THREE.Mesh(new THREE.BoxGeometry( brickWidth, brickHeight, brickDepth ),
                new THREE.MeshPhongMaterial({opacity:1,color:colorSet[brickcolor],transparent:false}));
            brick.position.x = - boxWidth + boxMargin + brickWidth/2 + brickWidth * i;
            brick.position.y = boxHeight - boxUpSpace - (brickHeight + boxMargin) * j;
            brick.position.z = -1;
            scene.add(brick);
            brickCoordSet.push(new THREE.Vector2(brick.position.x - brickWidth/2, brick.position.y - brickHeight/2));
            brickSet.push(brick);
        }
        brickcolor += 2;
    }

}

function setupPlate() {
    plate = new THREE.Mesh(new THREE.BoxGeometry( plateWidth, plateHeight, brickDepth ),
        new THREE.MeshPhongMaterial({opacity:0.6,color:green,transparent:true}));
    plate.position.x = 0;
    plate.position.y = -boxHeight + plateHeight/2 + boxMargin;
    plate.position.z = -1;
    scene.add(plate);
}

var moveLeft = false;
var moveRight = false;

function moveKeys(event){
  if(event.keyCode == 37){                                                      // Left Arrow --> select previous triangle
    moveLeft = true;
  }
  if(event.keyCode == 39){                                                      // Right Arrow --> select next triangle
    moveRight = true;
  }
  if(event.keyCode == 32) {
    if (lives > 0) {
        alive = true;
        hintBoard.style.visibility = "hidden";
    }
    else {
        start();
    }
  }
}

function keyUp(event){
  moveLeft = false;
  moveRight = false;
}


function setupBall() {
    ballMesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 16, 8),
        new THREE.MeshPhongMaterial({opacity:0.6,color:green,transparent:true}));
    ballMesh.position.y = - boxHeight + ballRadius + plateHeight;
    ballMesh.position.z = plate.position.z;
    scene.add(ballMesh);
}

function initVelocity() {
    ballVelocity.x = Math.random()/10 - 0.05;
    ballVelocity.x *= velocityFactor;
    ballVelocity.y = Math.sqrt(0.005 * velocityFactor * velocityFactor - ballVelocity.x*ballVelocity.x);
    ballVelocity.y = Math.abs(ballVelocity.y);
}


var newLevel = document.createElement("a");
newLevel.style.position = "fixed";
newLevel.style.bottom = "10%";
newLevel.style.fontSize = window.innerHeight/20;
newLevel.style.left = window.innerWidth/2 - (window.innerHeight/20*2);
newLevel.style.color = lightgreen;
newLevel.style.fontStyle = "normal";
newLevel.style.visibility = "visible";
newLevel.innerHTML = "LEVEL " + level.toString();
document.body.appendChild(newLevel);

function levelUp() {
    velocityFactor *= 1.2;
    plateVelocity *= velocityFactor;
    initVelocity();
    level += 1;
    bricksPerRow += 3;
    brickWidth = 2 * (boxWidth - boxMargin) / bricksPerRow;
    brickHeight = brickWidth * 0.618;
    plateWidth *= 0.8;
    scene.remove(plate);
    setupPlate();
    scoreStep += 1;
    lives += 1;
    plate.position.x = 0;
    ballMesh.position.x = 0;
    ballMesh.position.y = - boxHeight + ballRadius + plateHeight;

    newLevel.style.visibility = "visible";
    anotherspotLight.intensity = 1;

    setupBricks();

}


var gameOverShade = document.createElement("a");
var gameOver = document.createElement("a");
function endGame() {

    gameOverShade.style.position = "fixed";
    gameOverShade.style.top = window.innerHeight * 0.45;
    gameOverShade.style.fontSize = window.innerHeight/10;
    gameOverShade.style.left = window.innerWidth/2 - (window.innerHeight/10*3);
    gameOverShade.style.color = lightgreen;
    gameOverShade.style.fontStyle = "normal";
    gameOverShade.style.visibility = "visible";
    gameOverShade.innerHTML = "GAME OVER";
    document.body.appendChild(gameOverShade);

    gameOver.style.position = "fixed";
    gameOver.style.top = window.innerHeight * 0.44;
    gameOver.style.fontSize = window.innerHeight/10;
    gameOver.style.left = window.innerWidth/2 - (window.innerHeight/10*3);
    gameOver.style.color = "red";
    gameOver.style.fontStyle = "normal";
    gameOver.style.visibility = "visible";
    gameOver.innerHTML = "GAME OVER";
    document.body.appendChild(gameOver);

    ambientLight.intensity = 0.1;
    spotLight.intensity = 0.1;
    anotherspotLight = 0.1;
}

var scoreBoard = document.createElement("a");
scoreBoard.style.position = "fixed";
scoreBoard.style.top = "10%";
scoreBoard.style.fontSize = window.innerHeight/30;
scoreBoard.style.left = "35%";
scoreBoard.style.color = lightgreen;
scoreBoard.style.fontStyle = "normal";
scoreBoard.style.visibility = "visible";
scoreBoard.innerHTML = "SCORE: " + score.toString();
document.body.appendChild(scoreBoard);

var livesBoard = document.createElement("a");
livesBoard.style.position = "fixed";
livesBoard.style.top = "10%";
livesBoard.style.fontSize = window.innerHeight/30;
livesBoard.style.right = "35%";
livesBoard.style.color = lightgreen;
livesBoard.style.fontStyle = "normal";
livesBoard.style.visibility = "visible";
livesBoard.innerHTML = "LIVES: " + lives.toString();
document.body.appendChild(livesBoard);

var hintBoard = document.createElement("a");
hintBoard.style.position = "fixed";
hintBoard.style.top = "45%";
hintBoard.style.fontSize = window.innerHeight/20;
hintBoard.style.left = window.innerWidth/2 - window.innerHeight/20 * 4.7;
hintBoard.style.color = "gray";
hintBoard.style.fontStyle = "normal";
hintBoard.style.visibility = "hidden";
hintBoard.innerHTML = "Press Space to Continue";
document.body.appendChild(hintBoard);


function setTexts() {
    scoreBoard.innerHTML = "SCORE: " + score.toString();
    livesBoard.innerHTML = "LIVES: " + lives.toString();
    newLevel.innerHTML = "LEVEL " + level.toString();
    if (alive == false) {
        if (lives > 0) {
            hintBoard.style.visibility = "visible";
        }
        else {
            endGame();
        }
    }
}

function animate() {
    requestAnimationFrame( animate );
    document.onkeydown = moveKeys;
    document.onkeyup = keyUp;


    if (alive) {
        gameStart.style.visibility = "hidden";
        if (moveLeft) {
            if (plate.position.x - plateWidth/2 >= -boxWidth){
                plate.position.x -= plateVelocity;
            }
        }

        if (moveRight) {
            if (plate.position.x + plateWidth/2 <= boxWidth){
                plate.position.x += plateVelocity;
            }
        }
        ballMesh.position.x += ballVelocity.x;
        ballMesh.position.y += ballVelocity.y;

        if (ballMesh.position.x - ballRadius + boxWidth <=  Math.abs(ballVelocity.x)*0.95 || boxWidth - ballMesh.position.x - ballRadius <= Math.abs(ballVelocity.x)*0.95 ) {
            ballVelocity.x *= -1;
        }
        if (boxHeight - ballMesh.position.y - ballRadius <= Math.abs(ballVelocity.y)*0.95 ) {
            ballVelocity.y *= -1;
        }
        if (ballMesh.position.y - ballRadius - (- boxHeight + plateHeight) < Math.abs(ballVelocity.y) * 0.8) {
            ballVelocity.y = Math.abs(ballVelocity.y);
            if (ballMesh.position.x + Math.abs(ballVelocity.x)*0.95 >= plate.position.x - plateWidth/2 && ballMesh.position.x <= plate.position.x + plateWidth/2) {
            ballVelocity.y = Math.abs(ballVelocity.y);
            if (moveLeft) {
                ballVelocity.x = ballVelocity.x - 0.02 * velocityFactor;
                while (ballVelocity.x * ballVelocity.x >= 0.005 * velocityFactor*velocityFactor){
                    ballVelocity.x *= 0.8;
                }
                ballVelocity.y = Math.sqrt(0.005*velocityFactor*velocityFactor - ballVelocity.x * ballVelocity.x);
            }
            if (moveRight) {
                ballVelocity.x = ballVelocity.x + 0.02 * velocityFactor;
                while (ballVelocity.x * ballVelocity.x >= 0.005 * velocityFactor*velocityFactor){
                    ballVelocity.x *= 0.8;
                }
                ballVelocity.y = Math.sqrt(0.005*velocityFactor*velocityFactor - ballVelocity.x * ballVelocity.x);
            }
            if (Math.random()<0.2) {
                initVelocity();
            }
            }
            else {
                ballMesh.position.x = 0;
                ballMesh.position.y = - boxHeight + ballRadius + plateHeight;
                plate.position.x = 0;
                alive = false;
                lives -= 1;
                initVelocity();
                ballVelocity.y = Math.abs(ballVelocity.y);
            }
        }

        for (var k = 0; k < brickCoordSet.length; k++) {
            if ((Math.abs(ballMesh.position.x - ballRadius - brickCoordSet[k].x - brickWidth) <= Math.abs(ballVelocity.x)
                || (Math.abs(brickCoordSet[k].x - ballMesh.position.x - ballRadius) <= Math.abs(ballVelocity.x)))
                && ballMesh.position.y >= brickCoordSet[k].y - Math.abs(ballVelocity.y) && ballMesh.position.y <= brickCoordSet[k].y + brickHeight + Math.abs(ballVelocity.y)) {
                    ballVelocity.x *= -1;
                    score += scoreStep;
                    brickCoordSet.splice(k,1);
                    scene.remove(brickSet[k]);
                    brickSet.splice(k,1);
                    break;
            }
            if ((Math.abs(ballMesh.position.y - ballRadius - brickCoordSet[k].y - brickHeight) <= Math.abs(ballVelocity.y)
                || Math.abs(brickCoordSet[k].y - ballMesh.position.y - ballRadius) <= Math.abs(ballVelocity.y))
                && ballMesh.position.x >= brickCoordSet[k].x - Math.abs(ballVelocity.x) && ballMesh.position.x <= brickCoordSet[k].x + brickWidth + Math.abs(ballVelocity.x)) {
                ballVelocity.y *= -1;
                score += scoreStep;
                brickCoordSet.splice(k,1);
                scene.remove(brickSet[k]);
                brickSet.splice(k,1);
                break;
            }
        }
        if (brickSet.length == 0) {
            levelUp();
            newLevel.innerHTML = "LEVEL "+ level.toString();
            hintBoard.style.visibility = "visible";
            alive = false;

        }
        else {
            hintBoard.style.visibility = "hidden";
        }
        setTexts();
        // console.log(ballMesh.position);
    }

    renderer.render( scene, camera );
};

function main(){
    initVelocity();
    initLight();
    setupScene();
    setupBricks();
    setupPlate();
    setupBall();
    animate();
}

main();
