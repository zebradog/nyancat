if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var statsEnabled = false, container, stats;
var camera, scene, renderer, poptart, face, feet, tail;
var stars, numStars=40, rainbow, rainChunk, numRainChunks=50;
var starMaxX = 400;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var clock = new THREE.Clock(), deltaSum=0, tick=0, frame=0, running=true;
var song = document.createElement('audio'), song2 = document.createElement('audio');
var cameraDepth = 100;
var controls;

init();

function init() {

  song.setAttribute('src', 'audio/nyanlooped.mp3');
  song.setAttribute('loop', 'true');
  song2.setAttribute('src', 'audio/nyanslow.mp3');
  song2.setAttribute('loop', 'true');
  song.play();
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 10000 );
  camera.position.z = cameraDepth;
  camera.position.x = 0;
  camera.position.y = 0;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x003366, 0.015 * (30/cameraDepth)  );
  
  scene.add(camera);
  
  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [ 65, 83, 68 ];
  controls.addEventListener( 'change', render );
  
  //CAT
  var cat = group = new THREE.Object3D();
  poptart = createPoptart();
  cat.add( poptart );
  feet = createFeet();
  cat.add( feet );
  tail = createTail();
  cat.add( tail );
  face = createFace();
  cat.add(face);
  rainbow=new THREE.Object3D();
  for(var c=0;c<numRainChunks-1;c++){
    var yOffset=8;
    if(c%2==1) yOffset=7;
    var xOffset=(-c*8) - 8.25;
    create( rainbow,xOffset,yOffset,    0, 8, 3, 1, 0xff0000);
    create( rainbow,xOffset,yOffset-3,  0, 8, 3, 1, 0xff9900);
    create( rainbow,xOffset,yOffset-6,  0, 8, 3, 1, 0xffff00);
    create( rainbow,xOffset,yOffset-9,  0, 8, 3, 1, 0x33ff00);
    create( rainbow,xOffset,yOffset-12, 0, 8, 3, 1, 0x0099ff);
    create( rainbow,xOffset,yOffset-15, 0, 8, 3, 1, 0x6633ff);
  }
  cat.add(rainbow);
  scene.add(cat);
  //cat.position.x+=120;
  
  rainChunk=new THREE.Object3D();
  create( rainChunk, -16.5,  7,  0, 8,  3,   1, 0xff0000);
  create( rainChunk, -16.5,  4,  0, 8,  3,   1, 0xff9900);
  create( rainChunk, -16.5,  1,  0, 8,  3,   1, 0xffff00);
  create( rainChunk, -16.5, -2,  0, 8,  3,   1, 0x33ff00);
  create( rainChunk, -16.5, -5,  0, 8,  3,   1, 0x0099ff);
  create( rainChunk, -16.5, -8,  0, 8,  3,   1, 0x6633ff);
  rainChunk.position.x-=(8*(numRainChunks-1));
  scene.add( rainChunk );
  
  //STARS
  stars=new Array();
  for(var state=0;state<6;state++){
    stars.push(new Array());
    for(var c=0;c<numStars;c++){
      var star = new THREE.Object3D();
      star.position.x=Math.random() * starMaxX - 100;
      star.position.y=Math.random() * starMaxX - 100;
      star.position.z=Math.random() * starMaxX - 100;
      createStar(star, state);
      scene.add( star );
      stars[state].push(star);
    }
  }
  
  var pointLight = new THREE.PointLight( 0xFFFFFF );
  pointLight.position.z = 1000;
  scene.add(pointLight);
  
  var pointLight = new THREE.PointLight( 0xFFFFFF );
  pointLight.position.z = -1000;
  scene.add(pointLight);
  
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  if ( statsEnabled ) {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );
  }
  
  document.addEventListener( 'mousedown', stopPlay, false );
  document.addEventListener( 'mouseup', startPlay, false );
  var scrollTimer;
  document.addEventListener( 'mousewheel', function(){
    stopPlay();
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
        startPlay();
    }, 250);
  }, false );
  window.addEventListener( 'resize', onWindowResize, false );
  
  animate();
  
}

//		object	   x    y    z    w    h    d	  color
function create(o, x, y, z, w, h, d, c){
  var material = new THREE.MeshLambertMaterial( { color: c} );
  var geometry = new THREE.BoxGeometry(w, h, d, 1, 1, 1);
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.x=x+(w/2);
  mesh.position.y=y-(h/2);
  mesh.position.z=z+(d/2);
  o.add( mesh );
}

function createPoptart(){
  var poptart = new THREE.Object3D();
  
  create(	poptart,   0,  -2,  -1,  21,  14,   3, 0x222222);
  create(	poptart,   1,  -1,  -1,  19,  16,   3, 0x222222);
  create(	poptart,   2,   0,  -1,  17,  18,   3, 0x222222);
  
  create(	poptart,   1,  -2,-1.5,  19,  14,   4, 0xffcc99);
  create(	poptart,   2,  -1,-1.5,  17,  16,   4, 0xffcc99);
  
  create(	poptart,   2,  -4,   2,  17,  10,  .6, 0xff99ff);
  create(	poptart,   3,  -3,   2,  15,  12,  .6, 0xff99ff);
  create(	poptart,   4,  -2,   2,  13,  14,  .6, 0xff99ff);
  
  create(	poptart,   4,  -4,   2,   1,   1,  .7, 0xff3399);
  create(	poptart,   9,  -3,   2,   1,   1,  .7, 0xff3399);
  create(	poptart,  12,  -3,   2,   1,   1,  .7, 0xff3399);
  create(	poptart,  16,  -5,   2,   1,   1,  .7, 0xff3399);
  create(	poptart,   8,  -7,   2,   1,   1,  .7, 0xff3399);
  create(	poptart,   5,  -9,   2,   1,   1,  .7, 0xff3399);
  create(	poptart,   9, -10,   2,   1,   1,  .7, 0xff3399);
  create(	poptart,   3, -11,   2,   1,   1,  .7, 0xff3399);
  create(	poptart,   7, -13,   2,   1,   1,  .7, 0xff3399);
  create(	poptart,   4, -14,   2,   1,   1,  .7, 0xff3399);
  
  poptart.position.x=-10.5;
  poptart.position.y=9;
  return poptart;
}

function createFeet(){
  var feet = new THREE.Object3D();
  create(	feet,   0,  -2, .49,  3,  3,   1, 0x222222);
  create(	feet,   1,  -1, .49,  3,  3,   1, 0x222222);
  create(	feet,   1,  -2,-.01,  2,  2,   2, 0x999999);
  create(	feet,   2,  -1,-.01,  2,  2,   2, 0x999999);
  
  create(	feet,   6,  -2, -.5,  3,  3,   1, 0x222222);
  create(	feet,   6,  -2, -.5,  4,  2,   1, 0x222222);
  create(	feet,   7,  -2,-.99,  2,  2,   2, 0x999999);
  
  create(	feet,   16, -3, .49,  3,  2,   1, 0x222222);
  create(	feet,   15, -2, .49,  3,  2,   1, 0x222222);
  create(	feet,   15, -2,-.01,  2,  1,   2, 0x999999);
  create(	feet,   16, -3,-.01,  2,  1,   2, 0x999999);
  
  create(	feet,   21, -3, -.5,  3,  2,   1, 0x222222);
  create(	feet,   20, -2, -.5,  3,  2,   1, 0x222222);
  create(	feet,   20, -2,-.99,  2,  1,   2, 0x999999);
  create(	feet,   21, -3,-.99,  2,  1,   2, 0x999999);
  
  feet.position.x=-12.5;
  feet.position.y=-6;
  return feet;
}

function createTail(){
  var tail = new THREE.Object3D();
  create(	tail,   0,  0,-.25,  4,  3, 1.5, 0x222222);
  create(	tail,   1, -1,-.25,  4,  3, 1.5, 0x222222);
  create(	tail,   2, -2,-.25,  4,  3, 1.5, 0x222222);
  create(	tail,   3, -3,-.25,  4,  3, 1.5, 0x222222);
  create(	tail,   1, -1, -.5,  2,  1,   2, 0x999999);
  create(	tail,   2, -2, -.5,  2,  1,   2, 0x999999);
  create(	tail,   3, -3, -.5,  2,  1,   2, 0x999999);
  create(	tail,   4, -4, -.5,  2,  1,   2, 0x999999);
  
  tail.position.x=-16.5;
  tail.position.y=2;
  return tail;
}

function createFace(){
  var face = new THREE.Object3D();
  create(	   face,   2,  -3,  -3,  12,   9,   4, 0x222222);
  create(	   face,   0,  -5,   0,  16,   5,   1, 0x222222);
  create(	   face,   1,  -1,   0,   4,  10,   1, 0x222222);
  create(	   face,  11,  -1,   0,   4,  10,   1, 0x222222);
  create(	   face,   3, -11,   0,  10,   2,   1, 0x222222);
  create(	   face,   2,   0,   0,   2,   2,   1, 0x222222);
  create(	   face,   4,  -2,   0,   2,   2,   1, 0x222222);
  create(	   face,  12,   0,   0,   2,   2,   1, 0x222222);
  create(	   face,  10,  -2,   0,   2,   2,   1, 0x222222);
  
  create(	   face,   1, -5,   .5,  14,   5,   1, 0x999999);
  create(	   face,   3, -4,   .5,  10,   8,   1, 0x999999);
  create(	   face,   2, -1,   .5,   2,  10,   1, 0x999999);
  create(	   face,  12, -1,   .5,   2,  10,   1, 0x999999);
  create(	   face,   4, -2,   .5,   1,   2,   1, 0x999999);
  create(	   face,   5, -3,   .5,   1,   1,   1, 0x999999);
  create(	   face,  11, -2,   .5,   1,   2,   1, 0x999999);
  create(	   face,  10, -3,   .5,   1,   1,   1, 0x999999);
  //Eyes
  create(	   face,   4,  -6,  .6,   2,   2,   1, 0x222222);
  create(	   face,  11,  -6,  .6,   2,   2,   1, 0x222222);
  create(	   face,3.99,-5.99, .6,1.01,1.01,1.01, 0xffffff);
  create(	  face,10.99,-5.99, .6,1.01,1.01,1.01, 0xffffff);
  //MOUTH
  create(	   face,   5, -10,  .6,   7,   1,   1, 0x222222);
  create(	   face,   5,  -9,  .6,   1,   2,   1, 0x222222);
  create(	   face,   8,  -9,  .6,   1,   2,   1, 0x222222);
  create(	   face,  11,  -9,  .6,   1,   2,   1, 0x222222);
  //CHEEKS
  create(	   face,   2,  -8,  .6,   2,   2, .91, 0xff9999);
  create(	   face,  13,  -8,  .6,   2,   2, .91, 0xff9999);
  
  face.position.x=-.5;
  face.position.y=4;
  face.position.z=4;
  return face;
}

function createStar(star, state) {
  switch(state){
    case 0:
      create( star, 0, 0, 0, 1, 1, 1, 0xffffff);
      break;
    case 1:
      create( star, 1, 0, 0, 1, 1, 1, 0xffffff);
      create( star,-1, 0, 0, 1, 1, 1, 0xffffff);
      create( star, 0, 1, 0, 1, 1, 1, 0xffffff);
      create( star, 0,-1, 0, 1, 1, 1, 0xffffff);
      break;
    case 2:
      create( star, 1, 0, 0, 2, 1, 1, 0xffffff);
      create( star,-2, 0, 0, 2, 1, 1, 0xffffff);
      create( star, 0, 2, 0, 1, 2, 1, 0xffffff);
      create( star, 0,-1, 0, 1, 2, 1, 0xffffff);
      break;
    case 3:
      create( star, 0, 0, 0, 1, 1, 1, 0xffffff);
      create( star, 2, 0, 0, 2, 1, 1, 0xffffff);
      create( star,-3, 0, 0, 2, 1, 1, 0xffffff);
      create( star, 0, 3, 0, 1, 2, 1, 0xffffff);
      create( star, 0,-2, 0, 1, 2, 1, 0xffffff);
      break;
    case 4:
      create( star, 0, 3, 0, 1, 1, 1, 0xffffff);
      create( star, 2, 2, 0, 1, 1, 1, 0xffffff);
      create( star, 3, 0, 0, 1, 1, 1, 0xffffff);
      create( star, 2,-2, 0, 1, 1, 1, 0xffffff);
      create( star, 0,-3, 0, 1, 1, 1, 0xffffff);
      create( star,-2,-2, 0, 1, 1, 1, 0xffffff);
      create( star,-3, 0, 0, 1, 1, 1, 0xffffff);
      create( star,-2, 2, 0, 1, 1, 1, 0xffffff);
      break;
    case 5:
      create( star, 2, 0, 0, 1, 1, 1, 0xffffff);
      create( star,-2, 0, 0, 1, 1, 1, 0xffffff);
      create( star, 0, 2, 0, 1, 1, 1, 0xffffff);
      create( star, 0,-2, 0, 1, 1, 1, 0xffffff);
      break;
  }
}

function onDocumentMouseDown(event) {
  togglePlay();
}

function startPlay(){
  running = true;
  song.play();
  song2.pause();
}

function stopPlay(){
  running = false;
  song.pause();
  song2.play();
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  controls.handleResize();

  render();

}

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
  if ( statsEnabled ) stats.update();
}

function render() {
  var delta = clock.getDelta();
  if(running) deltaSum+=delta;
  if(deltaSum>.07){
    deltaSum=deltaSum%.07;
    frame=(frame+1)%12;
    for(var c=0;c<numStars;c++){
      var tempX = stars[5][c].position.x,
        tempY = stars[5][c].position.y,
        tempZ = stars[5][c].position.z;
      for(var state=5;state>0;state--){
        var star=stars[state][c];
        var star2=stars[state-1][c];
        star.position.x=star2.position.x-8;
        star.position.y=star2.position.y;
        star.position.z=star2.position.z;
        
        if(star.position.x<-starMaxX){
          star.position.x+=starMaxX+100;
          star.position.y = Math.random() * starMaxX - 100;
          star.position.z = Math.random() * starMaxX - 100;
        }
      }
      stars[0][c].position.x=tempX;
      stars[0][c].position.y=tempY;
      stars[0][c].position.z=tempZ;
    }
    switch(frame){
      case 0://2nd frame
        face.position.x++;
        feet.position.x++;
        break;
      case 1:
        face.position.y--;
        feet.position.x++;
        feet.position.y--;
        poptart.position.y--;
        rainbow.position.x-=9;
        rainChunk.position.x+=(8*(numRainChunks-1))-1;
        break;
      case 2:
        feet.position.x--;
        break;
      case 3:
        face.position.x--;
        feet.position.x--;
        rainbow.position.x+=9;
        rainChunk.position.x-=(8*(numRainChunks-1))-1;
        break;
      case 4:
        face.position.y++;
        break;
      case 5:
        poptart.position.y++;
        feet.position.y++;
        rainbow.position.x-=9;
        rainChunk.position.x+=(8*(numRainChunks-1))-1;
        break;
      case 6://8th frame
        face.position.x++;
        feet.position.x++;
        break;
      case 7:
        poptart.position.y--;
        face.position.y--;
        feet.position.x++;
        feet.position.y--;
        rainbow.position.x+=9;
        rainChunk.position.x-=(8*(numRainChunks-1))-1;
        break;
      case 8:
        feet.position.x--;
        break;
      case 9:
        face.position.x--;
        feet.position.x--;
        rainbow.position.x-=9;
        rainChunk.position.x+=(8*(numRainChunks-1))-1;
        break;
      case 10:
        face.position.y++;
        break;
      case 11://1st frame
        poptart.position.y++;
        feet.position.y++;
        rainbow.position.x+=9;
        rainChunk.position.x-=(8*(numRainChunks-1))-1;
        break;
    }
  }
  var timer = Date.now() * 0.0001;
  renderer.render( scene, camera );
}