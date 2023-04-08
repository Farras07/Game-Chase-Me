const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const dog =new Image()
dog.src = "./assets/dog/Walk.png"
let runner = new Image()
runner.src = "./assets/karakter/Biker_run.png"
const bg = new Image()
bg.src = "./assets/background/2 Background/Background.png"
const streetBase = new Image()
streetBase.src = "./assets/background/1 Tiles/IndustrialTile_73.png"
const streetTop = new Image()
streetTop.src = "./assets/background/1 Tiles/IndustrialTile_81.png"
const jump = new Image();
jump.src = './assets/karakter/Biker_jump.png'

let previousTime = null;
let PlatformsController = null;
const GAME_SPEED_START = 7
const GAME_SPEED_INCREMENT = 0.0001;
let speed = GAME_SPEED_START

const gravity = 0.5
const gameFrame = 50000
let numberPress = 0
let press = false
let isRunnersjump = false
let gameOver = false

const PLATFORMS_CONFIG = [
    { width: 50, height: 55 , image: "./assets/background/3 Objects/Barrel2.png" },
    { width: 32, height: 32 , image: "./assets/background/3 Objects/Box1.png" },
    // { width: 25 , height: 32 , image: "./assets/background/3 Objects/Box2.png" },
    // { width: 32 , height: 32 , image: "./assets/background/3 Objects/Box8.png" },
    // { width: 36 , height: 36 , image: "./assets/background/3 Objects/Locker2.png" },

  ];
class Background {
    constructor(){
        this.position={
            x:0,
            y:0
        }
        this.width = 1000
    }
    draw(){
        ctx.drawImage(bg,this.position.x,this.position.y,this.width,canvas.height)
        for(let x = 0;x<=gameFrame;x+=this.width){
            ctx.drawImage(bg,this.position.x+x,this.position.y,this.width,canvas.height)
        }

    }
    update(){
        if(this.position.x> -gameFrame){
            this.position.x -= speed
        }
        else{
            this.position.x =-gameFrame
        }
    }
}

class Player {
    constructor(x,y,key,playerImage){
        this.position={
            x,
            y
        }
        this.velocity ={
            x:0,
            y:5
        }
        this.width = 48
        this.height = 48
        this.framesIndex = 0
        this.playerImage = playerImage
        this.frame = [
            {x:0,y:0,w:this.width,h:this.height},
            {x:48,y:0,w:this.width,h:this.height},
            {x:48*2,y:0,w:this.width,h:this.height},
            {x:48*3,y:0,w:this.width,h:this.height},
            {x:48*4,y:0,w:this.width,h:this.height},
            {x:48*5,y:0,w:this.width,h:this.height},
            {x:48*6,y:0,w:this.width,h:this.height},
            { x: 0, y: 0, w: 48, h: 48 }, // up
            { x: 48, y: 0, w: 48, h: 48 }, // up
            { x: 48*2, y: 0, w: 48, h: 48 }, // up
            { x: 48*3, y: 0, w: 48, h: 48 }, // up}
            
        ]
        addEventListener('keydown',({keyCode})=>{

            if(keyCode === key && runners.position.y>=344 && numberPress<=2){
        
                press = true
                this.velocity.y -= 8
            }
        })
        addEventListener('keyup',({keyCode})=>{
            press=false
            numberPress++
            if(numberPress>=2){
                numberPress=0
            }

            
        })
    }
    draw(){
        let frame = this.frame[this.framesIndex]
        ctx.drawImage(this.playerImage,frame.x,frame.y,frame.w,frame.h,this.position.x,this.position.y,this.width,this.height)
        // if(isRunnersjump){
        //     ctx.drawImage(jump,frame.x,frame.y,frame.w,frame.h,this.position.x,this.position.y,this.width,this.height)
            
        // }
        // else{
        //     ctx.drawImage(runner,frame.x,frame.y,frame.w,frame.h,this.position.x,this.position.y,this.width,this.height)
        // }
        
    }
    update(){
        if(press){
            isRunnersjump===true
            this.framesIndex = 6 + (Math.floor(Date.now() / 100) % 4); // animate right frames
        }
        else{
            isRunnersjump===false
            this.framesIndex = 0 + (Math.floor(Date.now() / 100) % 6); // animate right frames
        }

        // if(this.framesIndex<6){
        //     this.framesIndex+=1

        // }
        // else{
        //     this.framesIndex=0

        // }
        this.position.y += this.velocity.y
        if(this.position.y + this.height+this.velocity.y <= 460){
            this.velocity.y += gravity
        }
        else{
            this.velocity.y = 0
        }

    }
}
class street{
    constructor({x,y}){
        this.position={
            x,
            y
        }
        this.distance = 32
        this.broke = false
    }
    //fix this!
    draw(){
        for(let x = this.position.x;x<=gameFrame;x=x+this.distance){
            ctx.drawImage(streetTop,x,460)
            ctx.drawImage(streetBase,x,470)
        }
    }
    update(){
        if(this.position.x>-gameFrame){
            this.position.x -= speed
        }
        else{
            speed = 0
            this.position.x =-gameFrame
        }
    }
}
class platform{
    constructor(x, y, width, height, image) {
        this.position={
            x,
            y
        }
        this.width = width
        this.height = height
        this.image = image
    }
    draw(){
        ctx.drawImage(this.image,this.position.x, this.position.y, this.width, this.height);
    }
    update(){
        this.position.x -= speed
        // this.position.x -= speed
        
    }
    collideWith(sprite){
        const adjustBy=1.6
        console.log(`runners x = ${sprite.height + sprite.position.y / adjustBy} `)
        console.log(`platforms x = ${ this.position.y} `)
            // if(runners.position.x+runners.width/2 === Plt.position.x && 
    // runners.position.y>=Platform.position.y-Platform.height
    // ){

        if(
            sprite.position.x <= this.position.x + this.width / adjustBy &&
            sprite.position.x + sprite.width/adjustBy>= this.position.x &&
            sprite.position.y >= this.position.y - this.height/adjustBy &&
            sprite.height + sprite.position.y / adjustBy < this.position.y
            
        ){
            return true
        }
        else{
            // console.log('runner x ='+sprite.position.)
            return false
        }
    }
}
class platformController{
    INTERVAL_MIN = 500
    INTERVAL_MAX = 1200

    nextPlatformInterval = null
    plato=[]

    constructor(platformImages,speed){
        this.platformsImages = platformImages;
        this.speed = speed;

        this.setNextPlatformTime();
    }

    setNextPlatformTime() {
    const num = this.getRandomNumber(
      this.INTERVAL_MIN,
      this.INTERVAL_MAX
    );

    this.nextPlatformInterval = num;
    }
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    createPlatform() {
        const index = this.getRandomNumber(0, this.platformsImages.length - 1);
        let y = null
        const PlatformImage = this.platformsImages[index];
        const x = canvas.width;
        const pltfrm = new platform(x,430,PlatformImage.width,PlatformImage.height, PlatformImage.image);
        this.plato.push(pltfrm);
    }
    update(frameTimeDelta) {
        if (this.nextPlatformInterval <= 0) {
        this.createPlatform();
        this.setNextPlatformTime();
        }
        this.nextPlatformInterval -= frameTimeDelta;

        this.plato.forEach((platform) => {
        platform.update(this.speed, frameTimeDelta);
        });
    }

    draw() {
        this.plato.forEach((platform) => platform.draw());
    }
    collideWith(sprite){
        return this.plato.some((platform)=>platform.collideWith(sprite))
    }
}
//----------
const background = new Background()
const runners = new Player(200,400,38,runner)
const dogs = new Player(100,400,87,dog)
const Street= new street({x:0,y:0})
const clearScreen=()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height)

}
const platformImages = PLATFORMS_CONFIG.map((platform)=>{
    const image = new Image();
    image.src = platform.image;
    return {
      image,
      width: platform.width,
      height: platform.height,
    };
})
PlatformsController = new platformController(
    platformImages,
    speed
  );

function updateGameSpeed(frameTimeDelta) {
    speed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

const animate = (currentTime) =>{
    if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(animate);
        return;
      }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;

    clearScreen()

    if(!gameOver){
        if(Street.position.x>-gameFrame){
            background.update()
            PlatformsController.update(frameTimeDelta)
            Street.update()
            runners.update()
            dogs.update()
            
        }
    }
    else{
    }
    const a = PlatformsController.collideWith(runners)
    if(!gameOver && a){
        gameOver=true
    }
    console.log(a)
    background.draw()
    Street.draw()
    PlatformsController.draw()
    runners.draw()
    dogs.draw()

    updateGameSpeed(frameTimeDelta)
    // if(runners.position.x+runners.width/2 === Plt.position.x && 
    // runners.position.y>=Platform.position.y-Platform.height
    // ){
    //     alert('hey')
    // }
    requestAnimationFrame(animate)
}




requestAnimationFrame(animate)


