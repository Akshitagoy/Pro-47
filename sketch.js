var PLAY = 2;
var END = 3;
var BEGIN = 1;
var START = 0
var WIN = 4
var gameState = BEGIN;
var speed;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var life = 3;
var cloudsGroup, cloudImage;
var obstaclesGroup;
var bullet;
var backgroundImg
var score=0;
//var obstacle;
var jumpSound, collidedSound;
var bulletImg;
var gameOver, restart;
var count = 0;

function preload(){
  jumpSound = loadSound("sounds/jump.wav")
  collidedSound = loadSound("sounds/over.wav")
  gunSound = loadSound("sounds/gun.mp3");
  winSound = loadSound("sounds/win.wav");
  startSound = loadSound("sounds/start.wav");
  backgroundImg = loadImage("assets/backgroundImg.png")
  sunAnimation = loadImage("assets/sun.png");
  finishSound = loadSound("sounds/finalLevel.mp3");
  
  coDieSound = loadSound("sounds/coDie.mp3");
  groundImage = loadImage("assets/blackGround.png");
  heartImg = loadImage("assets/heart.png");
  cloudImage = loadImage("assets/cloud.png");
  reliveSound = loadSound("sounds/relieve.wav");
  
  gun = loadImage("assets/shootingPlayer.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
    sky = loadImage("assets/sky.jpeg");
    sunImg = loadImage("assets/sun.png")
    corona = loadImage("assets/corona2.png");
    corona2 = loadImage("assets/corona.png");
    moon = loadImage("assets/moon.png");
    manDied = loadImage("assets/manDied.png");
    bulletImg = loadImage("assets/bullet.png");
    YouWinImg = loadImage("assets/youWin.png");
    sanetizerImg = loadImage("assets/sanetizer.png");
    maskImg = loadImage("assets/mask.png");
    city = loadImage("assets/cityCopy.jpg");
    goodImg = loadImage("assets/good.png");
   
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-80,100,10,10);
  sun.addAnimation("moon", sunImg);
  sun.scale = 0.2
  
  trex = createSprite(camera.x+displayWidth/2,860,20,50);
  trex.x = 750
  trex.addAnimation("running", gun);
  trex.addAnimation("collided", manDied);
  trex.setCollider('rectangle',0,0,700,1200);
  //trex.debug = true;
  trex.scale = 0.15
  speed=random(83,90);
  bullet= createSprite(trex.x,trex.y-50,5,5);
  bullet.addImage(bulletImg);
 bullet.scale=0.1
 bullet.visible = false;

 youWin = createSprite(850,250);
 youWin.addImage(YouWinImg);
 youWin.visible = false;
 youWin.scale = 0.4
 heart = createSprite(860,45);
 heart.addImage(heartImg);
 heart.scale = 0.1
 heart.visible = false;
  // trex.debug=true;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "black";
  
  ground = createSprite(width/2,height,width,1);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  ground.scale = 0.5
  //ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth-800,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  good = createSprite(800,350);
  good.addImage(goodImg);
  good.scale = 0.5
  good.visible = false;
   
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  bulletGroup = new Group();
  powersGroup = new Group();
  life = 3;
  score = 0;
  count=0;
}

function draw() {
 
  camera.x = trex.x-750;
  gameOver.position.x = restart.position.x - camera.x;
  camera.position.x = windowWidth/2;

  //trex.debug = true;
  background(city);
  
  
  
  if (gameState===PLAY){
   
    //score = score + Math.round(getFrameRate()/60);
    strokeWeight(5);
  stroke("orange");
  textSize(23);
  fill("black")
  text("Score: "+ score,710,50);
  text(" : "+life,880,50);
    trex.visible = true;
   
    heart.visible=true;
    ground.velocityX = -(6 + 3*score/100);
    
  
    if((touches.length > 0 || keyDown(UP_ARROW)) && trex.y  >= height-220) {
      jumpSound.play( )
      trex.velocityY = -24;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
   
    trex.collide(invisibleGround);
    if(keyCode===120){
      
      createBullet();
      gunSound.play();
 }
   spawnObstacles();
    spawnClouds(); 
    spawnPowers();
    if(obstaclesGroup.isTouching(bulletGroup)){
      obstaclesGroup.destroyEach();
      bulletGroup.destroyEach();
      score=score+50;
     // coDieSound.play();
    } 
    
    if(powersGroup.isTouching(trex)){
      powersGroup.destroyEach();
      //bulletGroup.destroyEach();
      count = count+1;
      
      
     winSound.play();

    } 
    
    if(count === 5){
      life=life+1;
      count = 0;
    }
    if(life===0){
      gameState = END;
      collidedSound.play();
      reliveSound.pause();
    }
 if(score===1000){
   gameState=WIN
    finishSound.play();
 }
 if(score===500){
   
   good.visible = true;
 }else{
   good.visible = false;
 }
    
    if(trex.isTouching(obstaclesGroup)){
        obstaclesGroup.destroyEach();
      life = life - 1;
      reliveSound.play();
    }
    
  }
  else if (gameState === END) {
    //playB.visible=false;
    gameOver.visible = true;
    restart.visible = true;
    good.visible = false;
    heart.visible = false;
    //set velocity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    //life=0;
    powersGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    bulletGroup.setVelocityXEach(0);
    //change the trex animation
    trex.changeAnimation("collided",manDied);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    bulletGroup.setLifetimeEach(-1);
    powersGroup.setLifetimeEach(-1);
    bulletGroup.destroyEach();
    powersGroup.destroyEach();
    //powersGroup.destroyEach();
    strokeWeight(6)
    fill("red")
    stroke("pink");
    textSize(30);
    text("Try again your Score is "+score,600,270);
    text("Press Space key to restart the game",550,300);
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  //Win
  else if(gameState===WIN){
    //playB.visible=false;
    heart.visible=false;
    //finishSound.stop();
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    powersGroup.setVelocityXEach(0);
   youWin.visible=true
   trex.position.y = 700;
    //change the trex animation
    //trex.changeAnimation("collided",manDied);
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    powersGroup.setLifetimeEach(-1);
    powersGroup.destroyEach();
    obstaclesGroup.destroyEach();

    strokeWeight(5);
    stroke("orange");
  textSize(35);
  fill("black")
    text("Press Space key to restart the game",600,400);
    text("Congratulations! Your Score is "+score,600,350);
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
      //youWin.visible = false;
    }
  }
  //Begin
  else if(gameState === BEGIN){
    strokeWeight(3);
    stroke("yellow");
    textSize(25);
    fill("black")
    text("Instructions :",600,200);
    fill("white");
    stroke("blue");
    text("Press Enter to start the game",600,450);
    stroke("red");
    text("Press UP ARROW to Jump",600,300);
    stroke("green");
    text("Score atleast 1000 to win the game",600,350);
    stroke("purple");
    text("Press x to shoot",600,250);
    //fill("")
    strokeWeight(5)
    stroke("orange")
    text("Collect 5 masks/sanetizers to increase your life",600,400)
    trex.visible = false;
    
   if(keyDown("Enter")){
    gameState = PLAY;
    startSound.play();
   }
  }
  //Start
  else if(gameState===START){
  
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x+width/2,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 540;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+width/2,height-random([155,200,400,350]),20,30);
    obstacle.setCollider('circle',0,0,105);
    //obstacle.debug = true;
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(corona);
              //obstacle.scale = 0.2;
              break;
      case 2: obstacle.addImage(corona2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    
    obstaclesGroup.add(obstacle);
   
  }
  
}

function reset(){
  gameState = BEGIN;
  gameOver.visible = false;
  restart.visible = false;
  youWin.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  powersGroup.destroyEach();
  
  trex.changeAnimation("running",gun);
  //startSound.play();
  score = 0;
  life = 3
  count=0;
  
}

function createBullet() {
  var bullet= createSprite(500, 100, 60, 10);
  bullet.addImage(bulletImg);
  bullet.y=trex.y;
  bullet.x = trex.x;
  bullet.velocityX = 20;
  bullet.lifetime = 150;
  bullet.scale = 0.1;
  bulletGroup.add(bullet);
  return bullet;
   
}
function spawnPowers() {
  if(frameCount % 190 === 0) {
    var powers = createSprite(camera.x+width/2,height-random(200,600),20,30);
    powers.setCollider('circle',0,0,125);
    //powers.debug = true;
  
    powers.velocityX = -(6 + 3*score/100);

    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: powers.addImage(sanetizerImg);
              //obstacle.scale = 0.2;
              break;
      case 2: powers.addImage(maskImg);
              break;
      default: break;
    }
    
    
    
    //assign scale and lifetime to the obstacle           
    powers.scale = 0.1;
    powers.lifetime = 300;
    powers.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    
    powersGroup.add(powers);
   
  }
  
}
