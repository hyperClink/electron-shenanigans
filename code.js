const electron = require('electron');
const url = require('url');
const path = require('path');

//canvas init. (a)
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//score init.
var score = 0;
var scoreMax = 0;
var scoreOutput = document.getElementById('score');

//ship start variables
var yp = 100;
var xp = 20;
var speed = 0;
var speedacc = 0;

var bullet_id = 0;

//particles
var nframe = 0;
var animnframe = null;

//specials(?)
var spec1=false;
var spec1u=true;
var specB=false;

var specTimer=0;
var specTimerOut=document.getElementById('special');

//bulletT1 start variables
var xspeed = 0;
var yspeed = 0;
var BulletTimer=0;
var BulletRate=1;

//control variables
var up=false;
var down=false;
var left=false;
var right=false;
var shoot=false;

var keydownkey='null';
var keyupkey='null';

//enemy variables
var enemyTimer = 0;
var enemyRate = 50;
var enemy_id = 0;

//upgrades
var bulletUp = 0;
var bulletUp2 = 0;
var spMaxU = 2000;
var spRateU = 1;
var sBulletType = 0;

var upgradesOut = document.getElementById('upgrades');

//creating arrays
var bullets=[];
var enemies=[];
var upgrades=[];
var boundObjects=[];

var bckg = [{x:0, y:0, spawned:false}];

//img creation
var ship = new Image();
var ship_e = new Image();
var bg = new Image();
var bullet1 = new Image();
var bullet2 = new Image();
var enemy1 = new Image();
var enemy2 = new Image();
var enemy3 = new Image();
var enemy4 = new Image();
var enemy5 = new Image();
var enemy6 = new Image();
var enemymini1 = new Image();
var spec1img = new Image();
var spec1img2 = new Image();
var eBullet = new Image();
var eLaser = new Image();
var bUp = new Image();
var bUp2 = new Image();
var spMax = new Image();
var spRate = new Image();
var particle1 = new Image();
var particle2 = new Image();
var particle3_1 = new Image();
var particle3_2 = new Image();
var particle3_3 = new Image();
var particle4 = new Image();
var particle5 = new Image();
var particle6 = new Image();

bg.onload = () => {};

//sources of images
ship.src= path.join(__dirname, 'img/ship.png');
bg.src= path.join(__dirname, 'img/bg2.jpg');
bullet1.src= path.join(__dirname, 'img/bullet_custom.png');
bullet2.src= path.join(__dirname, 'img/bullet2.png');
enemy1.src= path.join(__dirname, 'img/enemy.png');
enemy2.src= path.join(__dirname, 'img/enemy2-v2.png');
enemy3.src= path.join(__dirname, 'img/enemy3.png');
enemy4.src= path.join (__dirname, 'img/enemy4.png');
enemy5.src= path.join(__dirname, 'img/enemy5-v2-shaded.png');
enemy6.src= path.join(__dirname, 'img/enemy6.png');
enemymini1.src= path.join(__dirname, 'img/enemymini1.png');
spec1img.src= path.join(__dirname, 'img/special.png');
spec1img2.src= path.join(__dirname, 'img/special-V2.png');
eBullet.src= path.join(__dirname, 'img/enemyBullet.png');
eLaser.src= path.join(__dirname, "img/eLaser.png");
bUp.src= path.join(__dirname, 'img/bulletUp.png');
bUp2.src= path.join(__dirname, 'img/bulletUp2.png');
spMax.src= path.join(__dirname, 'img/spMax.png');
spRate.src= path.join(__dirname, 'img/spRate.png');
particle1.src= path.join(__dirname, "img/particle1.png");
particle2.src= path.join(__dirname, "img/particle2.png");
particle3_1.src= path.join(__dirname, "img/particle3-1.png");
particle3_2.src= path.join(__dirname, "img/particle3-2.png");
particle3_3.src= path.join(__dirname, "img/particle3-3.png");
particle4.src= path.join(__dirname, "img/particle4-1.png");
particle5.src= path.join(__dirname, "img/particle5.png");
particle6.src= path.join(__dirname, "img/particle6.png");

//init html
scoreOutput.innerHTML='Score:' + Math.max(Math.round(score), 0) + ' Max Score:' + scoreMax;
upgradesOut.innerHTML='Bullet Rate:' + Math.min(5, bulletUp) + '(4 max, >4 - upgrade)||||Bullet Multiplier: x' + (bulletUp2+1) + '||||Bullet Level: ' + sBulletType + '||||SP MAX: ' + spMaxU/20+ '%|||| SP Charge Rate:' + spRateU;

//the fact that am running a 144hz screen and the game go crazy fast maqke this happen
var fps, fpsInterval, startTime, now, then, elapsed;

//key check
document.addEventListener("keydown", keydownkey1);
document.addEventListener('keyup', keyupkey1);

//key down check
function keydownkey1(keyd) {
    switch(keyd.key){

      case 'W':
      case 'w':
      case 'ArrowUp':
        up = true;
      break;

      case 'S':
      case 's':
      case 'ArrowDown':
        down = true;
      break;

      case 'A':
      case 'a':
      case 'ArrowLeft':
        left = true;
      break;

      case 'D':
      case 'd':
      case 'ArrowRight':
        right = true;
      break;

      case ' ':
        shoot = true;
      break;

      case 'Q':
      case 'q':
        spec1 = true;
      break;

      case 'Shift':
        specB = true;
      break;

      default:
        console.log(keyd.key);
      break;
    };
};

//check for keys which are up
function keyupkey1(keyu) {
    switch(keyu.key){

      case 'W':
      case 'w':
      case 'ArrowUp':
        up = false;
      break;

      case 'S':
      case 's':
      case 'ArrowDown':
        down = false;
      break;

      case 'A':
      case 'a':
      case 'ArrowLeft':
        left = false;
      break;

      case 'D':
      case 'd':
      case 'ArrowRight':
        right = false;
      break;

      case ' ':
        shoot = false;
      break;

      case 'Q':
      case 'q':
        spec1 = false;
        spec1u = true;
      break;

      case 'Shift':
        specB = false;
      break;

      default:
      break;
    }

  }


//funcs

  //sets up the bullet
    fireBullet = function(xOffset, yOffset, defSpeed,
        accel, accelRate, defSpeedY, accelY, accelRateY, scaleX, scaleY, tscr, tscd, doTimeScale,
        doTimeAccel, timerEnd, spread, xdec, ydec, xso, yso, damage, hp, kb, type, side) {

      bullets.push({x:xOffset, y:yOffset, defSpeed:defSpeed,
      accel:accel, accelRate:accelRate, defSpeedY:defSpeedY, accelY:accelY, accelRateY:accelRateY, scaleX:scaleX, scaleY:scaleY, tScaleRate:tscr,
      tAccelDecay:tscd, xDecay:xdec, yDecay:ydec, timer:0, timerEnd:timerEnd,
      xspeed:xspeed*xso, yspeed:yspeed*yso, flipCoin:coinflip(),
      doTimeScale:doTimeScale, spread:spread, damage:damage, sturdiness:hp, knockback:kb, type:type, side:side, id:bullet_id});
      bullet_id++;
      };



  //adds enemies to the array
    spawnEnemy = function(x, y, hp, speedx, speedy, accelInitX, accelX, accelInitY, accelY, KBAbility, type, bx, by, bRate, score, followtype) {
      enemies.push({x:x, y:y, hp:hp, speedx:speedx, speedy:speedy, accelXinit:accelInitX, accelX:accelX, accelYinit:accelInitY, accelY:accelY, kbAbility:KBAbility, type:type, bulleyX:bx, bulletY:by, bRate:bRate, score:score, followtype:followtype, offset:enemyTimer%bRate, id:enemy_id});
      enemy_id++;
    };

  //adds bckg
    addBckg = function() {
    bckg.push({x:canvas.width, y:0})
  };

  //creates an upgrade
    spawnUpgrade = function(x, y, type) {
      upgrades.push({x:x, y:y, type:type})
    };

  //random integer
   randomInt = function(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random()*(max-min+1))+min;
   };
   //1 or -1
   coinflip = function (){
     return Math.round(Math.random()) * 2 - 1
   };

   //remove enemy, then laser very carefully
  laserCleanup = function(i){
    if (bullets.length != 'undefined' || bullets.length != 0){
      var h = 0;
      while (bullets[h].id != enemies[i].id){
        h++;
      };
      bulletIdHandler(bullets[h].id);
      bullets.splice(h--, 1);
    };
      enemyIdHandler(enemies[i].id);
      enemies.splice(i--, 1);
    };

    //limits fps hahah only 60 because i dont care
    function startAnimating(fps) {
      fpsInterval = 1000 / fps;
      then = Date.now();
      startTime = then;
      draw();
    };

     //score handling
    function scoreHandler(value) {

      score+=value;
      scoreOutput.innerHTML='Score:' + Math.max(Math.round(score), 0) + ' Max Score:' + scoreMax;
    };

    //id handling
    function bulletIdHandler(ident) {
      bullet_id--;
      for (var i = ident; i < bullets.length; i++) {
        bullets[i].id--;
      };
    };

    function enemyIdHandler(ident) {
      enemy_id--;
      for (var i = ident; i < enemies.length; i++) {
        enemies[i].id--;
      };
    };

startAnimating(60);

//engine
function draw() {

  requestAnimationFrame(draw);

  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {

  //bckg scroll
  for (var i = 0; i < bckg.length; i++) {
    ctx.drawImage(bg, bckg[i].x, bckg[i].y);
    if(bckg[i].x<=0 && bckg[i].spawned==false){
      bckg[i].spawned=true;
      bckg.push({x:canvas.width, y:0, spawned:false});
    };

    bckg[i].x-=1 + Math.min(score/150, 6);
    if(bckg[i].x+bg.width<=-canvas.width){
      bckg.splice(i--, 1)
    };
  };
//end

//ship
  ctx.drawImage(ship, xp, yp);

  BulletRate = Math.max(2, 6-bulletUp);

//lose (temp.)
  if(score<0){
    score=0;
    scoreHandler(0);
  };

//ship keydown actions--
speedacc = 5+speed;

  if (up == true && yp>0){
    yp -=speedacc;
    yspeed = -1*speedacc;
  };

  if (down == true && yp+ship.height<canvas.height){
    yp +=speedacc;
    yspeed = speedacc;
  };

  if (left == true && xp>0){
    xp -=speedacc;
    xspeed = -1*speedacc;
  };

  if (right == true && xp+ship.width<canvas.width){
    xp +=speedacc;
    xspeed = speedacc;
  };

  //ship acceleration--
  if (speed<2.2 && (up==true || down==true || left==true || right==true)) {speed += 0.2};
  if (up==false && down==false && left==false && right==false && speed>0) {speed = 0};
  if (up==false && down==false){yspeed = 0};
  if (left==false && right==false){xspeed = 0};
  if (up==true && down==true){yspeed = 0};
  if (left==true && right==true){xspeed = 0};
  //end

  //ship particle
  nframe = randomInt(1, 3);
  switch (nframe) {
    case 1:
    animnframe = particle3_1;
      break;

    case 2:
    animnframe = particle3_2;
      break;

    case 3:
    animnframe = particle3_3;
      break;
  };

  for (var k = 0; k < 1; k++) {
    fireBullet(xp, randomInt(yp+5, yp+ship.height), 0, randomInt(-5, -3), 0.2,
      randomInt(-2, 2) * Math.random(), 0, 0, 4, 4, 1, 10,
      false, false, 15, 0, Math.random(), Math.random(),
      0, 0, 0, 1, 0, animnframe, 100);
    };

//ship shoot
  if (shoot == true){
    BulletTimer++;
    if (BulletTimer%BulletRate==0) {
/*describe the bullet here

offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
t scale rate, timeaccelDecay, scale with time?\\, acceletation decay?\\, decay timer,
spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
      for (var i = 0; i < bulletUp2+1; i++) {
        if (sBulletType == 0) {
          fireBullet(45+xp, 21+yp, 10, Math.random()*2, 0.1, 0, 0, 0, 11, 11, 1, 1, false, true, 60, 0.1, 100, 100, 0.3, 0.3, 1, 1, 0.3, bullet1, 1, 0);
        };

        if (sBulletType == 1) {
          fireBullet(45+xp, 21+yp, 10, Math.random()*2, 0.1, 0, 0, 0, 11, 11, 1000, 1, false, false, 60, 0.05, 100, 100, 0.3, 0.3, 1, 3, 0.6, bullet2, 1);
        };

      };
    };
  };

  if (xp<=0){xp=0; xspeed = 0};
  if (xp+ship.width>=canvas.width){xp=canvas.width-ship.width; yspeed = 0};
  if (yp<=0){yp=0; yspeed = 0};
  if (yp+ship.height>=canvas.height){yp=canvas.height-ship.height; yspeed = 0};
//end

//specials--
  if (specTimer<spMaxU){
    specTimer+=spRateU;
  };

  //specials timer
  specTimerOut.innerHTML=Math.round(specTimer/20)+  '% SP Charge (press shift)';

  if (specTimer>spMaxU){
    specTimer=spMaxU;
  };

  //spawn special1
  if (spec1 == true && spec1u == true && specTimer>=2000){
    for (var i = 0; i < 4; i++) {
      fireBullet(0, 0, 0, 15+randomInt(0,8), -0.29, 0, 0, 0, 10, 15, 0, 10, false, false, 0, 0, 0, -15, 0, 0, 2, 5000, 0, spec1img, 1);
    };
      spec1u = false;
      specTimer -= 2000;
  };

  //spawn special bullet
  if (specB == true && specTimer>=300){
      fireBullet(50+xp, 18+yp, 50, 0, 0, 0, 0, 0, 10, 15, 0, 10, false, false, 0, 0, -100, 1, 0, 0, 1.5, 5000, 0, spec1img2, 1);
      spec1u = false;
      specTimer -= 300;
  };
//end

//collisions--
//remove bullets
  for(var i=0; i<bullets.length; i++) {
        if((bullets[i].x >canvas.width || bullets[i].x+bullets[i].scaleX <0 || bullets[i].scaleX<0 || bullets[i].scaleY<0) && bullets[i].type != eLaser) {
          bulletIdHandler(bullets[i].id);
          bullets.splice(i--, 1);
        };
    };

//remove enemies
  for(var i=0; i<enemies.length && enemies.length != 'undefined' && enemies.length != 0; i++) {
        if(enemies[i].x+enemies[i].type.width < 0 || enemies[i].x > canvas.width+10 || enemies[i].y > canvas.height || enemies[i].y+enemies[i].type.height < 0){
          if (enemies[i].type == enemy3){
            laserCleanup(i);
          }else{
            enemyIdHandler(enemies[i].id);
            enemies.splice(i--, 1);
          };
        };
        //enemy down
        if (i >= 0) {
          if (enemies[i].hp<=0){

            scoreHandler(enemies[i].score);

            if (enemies[i].type == enemy3){
              laserCleanup(i);
            }else{
              enemyIdHandler(enemies[i].id);
              enemies.splice(i--, 1);
            };

            if (specTimer<+spMaxU){
            specTimer+=Math.max(2*spRateU, 100-Math.ceil(score/2.5)*spRateU);
          };

        };
      };
    };

//enemies-bullets collision
  for(var i=0; i<bullets.length && bullets.length != 'undefined' && bullets.length != 0; i++) {
    for(var n=0; n<enemies.length && enemies.length != 'undefined' && enemies.length != 0; n++) {
      if (i >= 0) {
        //good bullets
        if(bullets[i].x+bullets[i].scaleX>enemies[n].x &&
           bullets[i].x<enemies[n].x+enemies[n].type.width &&
           bullets[i].y+bullets[i].scaleY>enemies[n].y &&
           bullets[i].y<enemies[n].y+enemies[n].type.height &&
           bullets[i].side==1)
           {
             enemies[n].hp-=bullets[i].damage;
            // console.log(enemies[n].hp);

            //"particle" ""system""
            switch (bullets[i].type) {
              case bullet1:

            for (var k = 0; k < 2; k++) {
              fireBullet(bullets[i].x, bullets[i].y, 0, 0, Math.random()/2*bullets[i].flipCoin,
                0, randomInt(-3, 3)*Math.random(), 0, 3, 3, 1, 10,
                false, false, 10, 0, 0.5, 0.5,
                0, 0, 0, 1, 0, particle1, 100);
              };

              break;

              case bullet2:

            for (var k = 0; k < 2; k++) {
              fireBullet(bullets[i].x, bullets[i].y, 0, 0, Math.random()/2*bullets[i].flipCoin,
                0, randomInt(-3, 3)*Math.random(), 0, 3, 3, 1, 10,
                false, false, 10, 0, 0.5, 0.5,
                0, 0, 0, 1, 0, particle2, 100);
              };

              break;

              case spec1img:

            for (var k = 0; k < 3; k++) {
              fireBullet(enemies[n].x, enemies[n].y+(enemies[n].type.height/2), 10, 0,  randomInt(2, 5)*Math.random(),
                0, Math.random()*bullets[i].flipCoin*3, 0, 2, 2, 1, 10,
                false, false, 10, 0, 0.1, 0.1,
                0, 0, 0, 1, 0, particle6, 100);
              };

              case spec1img2:

            for (var k = 0; k < 3; k++) {
              fireBullet(enemies[n].x, bullets[i].y, 10, 0,  randomInt(2, 5)*Math.random(),
                0, Math.random()*bullets[i].flipCoin*3, 0, 2, 2, 1, 10,
                false, false, 10, 0, 0.1, 0.1,
                0, 0, 0, 1, 0, particle6, 100);
              };

              break;

            default:
            console.log(bullets[i].type + " particle not assigned");
            break;

          };


             if (bullets[i].knockback>enemies[n].kbAbility) {
               enemies[n].accelXinit-=bullets[i].knockback-enemies[n].kbAbility;
             };

              bullets[i].sturdiness--;

              if (bullets[i].sturdiness<=0) {
                bulletIdHandler(bullets[i].id);
                bullets.splice(i--, 1);
              };

           };
           if (i >= 0){
                                //ctx.fillStyle = "#FF0000";
                                //ctx.fillRect(xp+30, yp+13, 20, 14);
             //bad bullets
        if(bullets[i].x+bullets[i].scaleX>xp+30 &&
           bullets[i].x<xp+50 &&
           bullets[i].y+bullets[i].scaleY>yp+13 &&
           bullets[i].y<yp+27 &&
           bullets[i].side==0) {
             xp-=bullets[i].knockback;
             scoreHandler(-bullets[i].damage);

              fireBullet(xp+ship.width, bullets[i].y+(bullets[i].scaleY/2), 0, randomInt(-8,8)*Math.random(), randomInt(-0.1,0.1)*Math.random(),
                0, randomInt(-8,-6)*Math.random(), 0.5, 4, 4, 1, 10,
                false, false, 10, 0, 0.5, 0.5,
                0, 0, 0, 1, 0, particle5, 100);

             bullets[i].sturdiness--;
          if (bullets[i].sturdiness<=0) {
            bulletIdHandler(bullets[i].id);
            bullets.splice(i--, 1)
          };

          };
        };

        };

    };
  };

//ship collision(enemies)--
  for(var n=0; n<enemies.length && enemies.length != 'undefined' && enemies.length != 0; n++) {
    if(xp+50>enemies[n].x &&
       xp+30<enemies[n].x+enemies[n].type.width &&
       yp+27>enemies[n].y &&
       yp+13<enemies[n].y+enemies[n].type.height) {

           fireBullet(xp+ship.width, yp+(ship.height/2), 0, 0, Math.random()/2*coinflip(),
             0, randomInt(-3, 3)*Math.random(), 0, 3, 3, 1, 10,
             false, false, 10, 0, 0.5, 0.5,
             0, 0, 0, 1, 0, particle1, 100);

             fireBullet(enemies[n].x, enemies[n].y+(enemies[n].type.height/2), 0, 0, Math.random()/5*coinflip(),
               0, randomInt(-10, 10)*Math.random(), 0, 3, 3, 1, 10,
               false, false, 10, 0, 0.5, 0.5,
               0, 0, 0, 1, 0, particle5, 100);

         xp-=enemies[n].speedx+enemies[n].accelXinit;
         scoreHandler(-2);
         xp-=15;
         enemies[n].hp--;
     };
   };
//end

//ship collision(upgrades)--
  for(var n=0; n<upgrades.length && up.length != 'undefined' && upgrades.length != 0; n++) {
    if(xp+ship.width>upgrades[n].x &&
       xp<upgrades[n].x+bUp.width &&
       yp+ship.width>upgrades[n].y &&
       yp<upgrades[n].y+bUp.height) {

         if (upgrades[n].type==bUp){
         scoreHandler(5);
         bulletUp++;
       };

       if (upgrades[n].type==bUp2){
         scoreHandler(15);
         bulletUp2++;
      };

      if (upgrades[n].type==spMax){
        scoreHandler(15);
        spMaxU+=200;
      };

      if (upgrades[n].type==spRate){
        scoreHandler(20);
        spRateU+=0.2;
      };

         upgrades.splice(n--, 1);
     };
    //upgrades output to div
      upgradesOut.innerHTML='Bullet Rate:' + Math.min(5, bulletUp) + '(4 max, >4 - upgrade)||||Bullet Multiplier: x' + (bulletUp2+1) + '||||Bullet Level: ' + sBulletType + '||||SP MAX: ' + spMaxU/20+ '%|||| SP Charge Rate:' + spRateU;

   };
//end

//upgrades--
  //draw upgrades
  for (var i = 0; i < upgrades.length; i++) {
        ctx.drawImage(upgrades[i].type, upgrades[i].x, upgrades[i].y)
        upgrades[i].x-=6;
      };

//upgrade bullets
  if (bulletUp > 4 && sBulletType<1){
    bulletUp = 0;
    sBulletType++;
  };

//spawn upgrades
//bullet 1
  if (1%randomInt(1, 4500)==0){
    spawnUpgrade(canvas.width,randomInt(0, canvas.height-bUp.height), bUp);
  };

//bullet 2
  if (1%randomInt(1, 10000)==0){
    spawnUpgrade(canvas.width,randomInt(0, canvas.height-bUp.height), bUp2);
  };

//sp Max
  if (1%randomInt(1, 5500)==0){
    spawnUpgrade(canvas.width,randomInt(0, canvas.height-bUp.height), spMax);
  };

//sp Rate
  if (1%randomInt(1, 14000)==0){
    spawnUpgrade(canvas.width,randomInt(0, canvas.height-bUp.height), spRate);
  };
//end

//bullet logic
  for(var i=0; i<bullets.length; i++) {
      ctx.drawImage(bullets[i].type, bullets[i].x, bullets[i].y, bullets[i].scaleX, bullets[i].scaleY);

      if (bullets[i].type == eLaser){
        var h = 0;
        while (bullets[i].id != enemies[h].id){
            h++;
          };
        bullets[i].y = enemies[h].y+enemies[h].bulletY-(bullets[i].scaleY/2);
        bullets[i].x = enemies[h].x-bullets[i].scaleX;
      }else{
        bullets[i].x +=bullets[i].defSpeed + bullets[i].accel + bullets[i].xspeed;
        bullets[i].y += bullets[i].spread * bullets[i].flipCoin * Math.random() + bullets[i].yspeed + bullets[i].defSpeedY + bullets[i].accelY;
      };
      bullets[i].accel += bullets[i].accelRate;
      bullets[i].accelY += bullets[i].accelRateY;
      bullets[i].timer++;

      //special bullet trait (lasers)
      if (bullets[i].type == spec1img2){
        bullets[i].y = bullets[i].y + yspeed;
        bullets[i].x = bullets[i].x + xspeed;
      };



      //size-time modification
      if (bullets[i].timer < bullets[i].timerEnd && bullets[i].doTimeScale==true) {
        bullets[i].scaleX = bullets[i].scaleX - bullets[i].timer/bullets[i].tScaleRate;
        bullets[i].x += bullets[i].xDecay/2;
        bullets[i].scaleY = bullets[i].scaleY - bullets[i].timer/bullets[i].tScaleRate;
        bullets[i].y += bullets[i].yDecay/2;
      }

      //bullet decay
      if (bullets[i].timer > bullets[i].timerEnd) {
        bullets[i].scaleX -=bullets[i].xDecay;
        bullets[i].scaleY -=bullets[i].yDecay;
        bullets[i].y += bullets[i].yDecay/2;
        bullets[i].x += bullets[i].xDecay/2;
        bullets[i].y += bullets[i].spread * bullets[i].flipCoin;
          //decay acceleration
          if (bullets[i].doTimeAccel == true){
            bullets[i].accel -= Math.random() * bullets[i].timer / bullets[i].tAccelDecay;
          };

      };

  };

//enemies--
//enemy draw, logic
    for(var i=0; i<enemies.length; i++) {

      console.log("ENEMIES: id: " + enemies[i].id + " -- length: " + enemies.length);

      ctx.drawImage(enemies[i].type, enemies[i].x, enemies[i].y);
      enemies[i].accelXinit+=enemies[i].accelX;
      enemies[i].accelYinit+=enemies[i].accelY;
      enemies[i].y-=enemies[i].speedy+enemies[i].accelYinit;
      enemies[i].x-=enemies[i].speedx+enemies[i].accelXinit;
      if (enemies[i].followtype==1 || enemies[i].followtype==2){
        if (enemies[i].y<yp){
          enemies[i].speedy-=0.1;
        }else

        if (enemies[i].y>yp+ship.height){
          enemies[i].speedy+=0.1;
        }else

        if (enemies[i].followtype==2){
          enemies[i].speedy=enemies[i].speedy/3;
        };

      };
  };

//enemy shoots (scary part)
  //the n variable || is gone!!!

  //enemy6 bullets
  for (var i = 0; i < enemies.length && enemies.length != 'undefined' && enemies.length != 0; i++) {

    if (enemies[i].type===enemy6){
      if ((enemyTimer+enemies[i].offset)%enemies[i].bRate == 0) {
  /*describe the bullet here

  offsets 2, speed,
  init.acceleration, acceleration rate, intitial scale 2, scale rate, timeScaleDecay,
  scale with time?, acceletation decay?, decay timer, spread, xDecay and Ydecay 2, xspeed and yspeed mult.2,
  damage, sturdiness, knockback, type, side */
    fireBullet(
    enemies[i].x, enemies[i].y+enemies[i].bulletY, -13,
    -Math.random()*2, -0.1, 0, 0, 0, 8, 8, 50, 40,
    true, true, 3, 3, 5, 5, 0, 0,
    0.5, 4, 40, eBullet, 0);
    };
    };

  //enemymini1 bullets
    if (enemies[i].type===enemymini1){
      if ((enemyTimer+enemies[i].offset)%enemies[i].bRate == 0) {
        /*describe the bullet here

        offsets 2, speed,
        init.acceleration, acceleration rate, intitial scale 2, scale rate, timeAccDecay,
        scale with time?, acceletation decay?, decay timer, spread, xDecay and Ydecay 2, xspeed and yspeed mult.2,
        damage, sturdiness, knockback, type, side */
        fireBullet(
          enemies[i].x+enemies[i].bulletY, enemies[i].y+enemies[i].bulletY, -5-enemies[i].accelXinit,
          -Math.random(), -0.05, 0, 0, 0, 5, 5, 100, 30,
          true, false, 18, 1, 3, 3, 0, 0,
          1, 1, 1, eBullet, 0);

        };
      };

  //enemy5 ""bullets""
    if (enemies[i].type===enemy5){
      if ((enemyTimer+enemies[i].offset)%enemies[i].bRate == 0) {
  /*describe the """"bullet"""" here

  x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score*/
      spawnEnemy(enemies[i].x, enemies[i].y+enemies[i].bulletY+randomInt(-5,5), 1, 0, randomInt(-2,2), 0, 0.1, 0, 0, 0.3, enemymini1, 0, 0, 8+randomInt(1,4), 2, 0);
      };
    };

  //enemy4 bullets
  if (enemies.length != 'undefined' && enemies.length != 0 && enemies[i].type === enemy4) {
    if ((enemyTimer+enemies[i].offset)%enemies[i].bRate == 0) {
      /*describe the bullet here

  offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
  scale rate, timeAccelDecay, scale with time?, acceletation decay?, decay timer,
  spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
    fireBullet(
      enemies[i].x, enemies[i].y+enemies[i].bulletY, -10,
      -Math.random(), -0.07, 0, 0, 0, 10, 10, 100, 10,
      false, false, 30, 0, 0.01, 0.01, 0, 0, 8, 1,
      20, eBullet, 0);

      enemies[i].bRate = randomInt(100, 230);
      enemies[i].offset = enemyTimer% enemies[i].bRate;
    };
  };

  //enemy3 bullets
    if (enemies[i].type===enemy3){
      if ((enemyTimer+enemies[i].offset)%enemies[i].bRate == 0) {
  /*describe the bullet here

  offsets 2, speed, init.acceleration, acceleration rate, intitial scale 2,
  scale rate, timeScaleDecay, scale with time?, acceletation decay?, decay timer,
  spread, xDecay and Ydecay 2, xspeed and yspeed mult.2, damage, sturdiness, knockback, type, side */
      fireBullet(
        enemies[i].x, enemies[i].y+enemies[i].bulletY, 0,
        0, 0, 0, 0, 0, 8, 8, 50, 40,
        false, false, 0, 0, -10, -0.01, 0, 0, 0.06, 999999999,
        0.1, eLaser, 0);
        enemies[i].bRate = 999999999;
      };
    };

  //enemy2 bullets
    if (enemies[i].type===enemy2){
      if ((enemyTimer+enemies[i].offset)%enemies[i].bRate == 0) {
  /*describe the bullet here

  offsets 2, speed,
  init.acceleration, acceleration rate, intitial scale 2, scale rate, timeScaleDecay,
  scale with time?, acceletation decay?, decay timer, spread, xDecay and Ydecay 2, xspeed and yspeed mult.2,
  damage, sturdiness, knockback, type, side */
      fireBullet(
      enemies[i].x, enemies[i].y+enemies[i].bulletY, -13,
      -Math.random()*2, -0.1, 0, 0, 0, 6, 6, 100, 0,
      true, false, 4, 2, 2, 2, 0, 0,
      0.5, 4, 40, eBullet, 0);
      };
    };

  //enemy1 bullets
  if (enemies.length != 'undefined' && enemies.length != 0 && enemies[i].type === enemy1) {
      if ((enemyTimer+enemies[i].offset)%enemies[i].bRate == 0) {
      /*describe the bullet here

      offsets 2, speed,
      init.acceleration, acceleration rate, intitial scale 2, scale rate, timeScaleDecay,
      scale with time?, acceletation decay?, decay timer, spread, xDecay and Ydecay 2, xspeed and yspeed mult.2,
      damage, sturdiness, knockback, type, side */
      fireBullet(
        enemies[i].x, enemies[i].y+enemies[i].bulletY, -10,
        -Math.random(), -0.07, 0, 0, 0, 10, 10, 100, 10,
        false, false, 30, 0, 0.01, 0.01, 0, 0,
        4, 1, 20, eBullet, 0);


        enemies[i].bRate = randomInt(190, 250);
        enemies[i].offset = enemyTimer% enemies[i].bRate;
      };
  };
};

//spawn enemies
    enemyTimer++;
    //enemy1
    if (enemyTimer%Math.max(10, enemyRate-Math.ceil(score/8))==0 && score<200) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score, ft
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy1.height), 6, 3, 0, Math.random()*2, 0.01, 0, 0, 0, enemy1, 0, 23, randomInt(150, 180), 1, 0);
    };

    //enemy 2
    if (enemyTimer%Math.max(10, (enemyRate*randomInt(1,5)-Math.ceil(score/14)))==0 && score<320) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy2.height), 10, 8, randomInt(-1,1), Math.random()*1.2, 0.06*Math.random(), 0, 0, 1, enemy2, 0, 20, 2, 2, 0);
    };

    //enemy 3
    if (enemyTimer%Math.max(235, enemyRate*30-Math.ceil(score/2))==0 && score>100) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy3.height), 200, 0.8, 0, 0, 0, 0, 0, 1000, enemy3, 0, 46, 5, 25, 0);
    };

    //enemy4
    if (enemyTimer%Math.max(10, enemyRate-Math.ceil(score/16))==0 && score>180) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score, ft
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy4.height), 8, 7, 0, Math.random()*3, 0.01, 0, 0, 0.4, enemy4, 0, 23, randomInt(10, 300), 2, 0);
    };

    //enemy5
    if (enemyTimer%Math.max(100, enemyRate-Math.ceil(score/75))==0 && score>240) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score, ft
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy5.height), 50, 1, 0, 0, -0.002, 0, 0, 0.25, enemy5, 0, 23, 10, 15, 0);
    };

    //enemy6
    if (enemyTimer%Math.max(10, enemyRate-Math.ceil(score/40))==0 && score>260) {
      //x, y, hp, speed x, speed y, accelInit.x, accelx, accelInit.y, accely, -knockback, type, bulletx, bullety, bullet rate, score, ft
      spawnEnemy(canvas.width, randomInt(0,canvas.height-enemy6.height), 12, 1, 0, 0, 0.1, 0, 0, 1, enemy6, 0, 20, 1, 4, 2);
    };

    then = now - (elapsed % fpsInterval);
//end
 };

};

  draw();
