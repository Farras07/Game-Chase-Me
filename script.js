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
const shopImage = new Image()
shopImage.src = './assets/shop/shop.png'

let gameStart= false

let previousTime = null;
let PlatformsController = null;
const GAME_SPEED_START = 7
const GAME_SPEED_INCREMENT = 0.0001;
let speed = GAME_SPEED_START

const gravity = 0.5
const gameFrame = 8000
let isRunnersjump = false
let gameOver = false
let isRunnerWin=false
let pressStart = false
let firstGame= true 

const PLATFORMS_CONFIG = [
    { width: 50, height: 55 , image: "./assets/background/3 Objects/Barrel2.png" },
    { width: 32, height: 32 , image: "./assets/background/3 Objects/Box1.png" },

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
        for(let x = 0;x<=gameFrame+canvas.width;x+=this.width){
            ctx.drawImage(bg,this.position.x+x,this.position.y,this.width,canvas.height)
        }
        const fontSize = 50 ;
        ctx.font = `${fontSize}px serif`;
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText("FINISH",this.position.x+gameFrame+200,200)

    }
    update(){
        if(this.position.x> -gameFrame){
            this.position.x -= speed
        }
        else{
            this.position.x =-gameFrame
        }
    }
    reset(){
        this.position.x=0
    }
}
class shop {
    constructor(y){
        this.position={
            x:gameFrame+canvas.width,
            y
        }
        this.Image = shopImage
        this.frameMax=6
        this.width=708/6
        this.height=128
        this.frameIndex = 0
        this.frame = [
            {x:0,y:0,w:this.width,h:this.height},
            {x:this.width,y:0,w:this.width,h:this.height},
            {x:this.width*2,y:0,w:this.width,h:this.height},
            {x:this.width*3,y:0,w:this.width,h:this.height},
            {x:this.width*4,y:0,w:this.width,h:this.height},
            {x:this.width*5,y:0,w:this.width,h:this.height},
            {x:this.width*6,y:0,w:this.width,h:this.height},
        ]
    }
    draw(){
        let frameImage = this.frame[this.frameIndex]
        ctx.drawImage(this.Image,frameImage.x,frameImage.y,frameImage.w,frameImage.h,this.position.x,this.position.y,this.width,this.height)
    }
    update(){
        this.frameIndex = 0 + (Math.floor(Date.now() / 100) % 6);
        this.position.x-=speed

    }
    reset(xBackground){
        this.position.x = xBackground+gameFrame+200
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
        this.numberPress = 0
        this.framesIndex = 0
        this.isJump=false
        this.numberCollide = 0
        this.isCollide =false
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

            if(keyCode === key && this.position.y>=344 && this.numberPress<=2){
        
                this.isJump = true
                this.velocity.y -= 8
            }
        })
        addEventListener('keyup',({keyCode})=>{
            this.isJump=false
            this.numberPress++
            if(this.numberPress>=2){
                this.numberPress=0
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
        if(this.isJump){
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
        // if(this.position.x <=-gameFrame){
        //     const fontSizeScore = 20 ;
        //     ctx.font = `${fontSizeScore}px serif`;
        //     ctx.fillStyle = "#525250";
        //     ctx.fillText("FINISH",290,200)
        // }
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
    reset(){
        this.position.x=0
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
        // if(this.position.x<=-gameFrame + canvas.width+2000){
        //     PlatformsController.plato = []
        // }
        // else{
        ctx.drawImage(this.image,this.position.x, this.position.y, this.width, this.height);

    }
    update(){
        this.position.x -= speed
        // this.position.x -= speed
        
    }
    collideWith(runner,dog){
        const adjustBy=1.6
        // console.log(`runners x = ${sprite.height + sprite.position.y / adjustBy} `)
        // console.log(`platforms x = ${ this.position.y} `)
            // if(runners.position.x+runners.width/2 === Plt.position.x && 
    // runners.position.y>=Platform.position.y-Platform.height
    // ){

        if(
            runner.position.x <= this.position.x + this.width / adjustBy &&
            runner.position.x + runner.width/adjustBy>= this.position.x &&
            runner.position.y >= this.position.y - this.height/adjustBy &&
            runner.height + runner.position.y / adjustBy < this.position.y

            
        ){
            // runner.numberCollide++
            isRunnerWin = false
            return true
        }
        else if(
            dog.position.x <= this.position.x + this.width / adjustBy &&
            dog.position.x + dog.width/adjustBy>= this.position.x &&
            dog.position.y >= this.position.y - this.height/adjustBy &&
            dog.height + dog.position.y / adjustBy < this.position.y
        ){
            isRunnerWin = true
            return true
        }

    }
}
class platformController{
    INTERVAL_MIN = 500
    INTERVAL_MAX = 1300
    INTERVAL_MAX_DECREMENT = 0.1

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
        if(index ===0 ){
            y=408
        }
        else{
            y=430
        }
        const PlatformImage = this.platformsImages[index];
        const x = canvas.width;
        const pltfrm = new platform(x,y,PlatformImage.width,PlatformImage.height, PlatformImage.image);
        if(Street.position.x>=-gameFrame + canvas.width+600){
            this.plato.push(pltfrm);
            console.log('hey')
        }
        else{
            console.log(Street.position.x)

        }
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
        this.INTERVAL_MAX-= this.INTERVAL_MAX_DECREMENT
    }

    draw() {
        this.plato.forEach((platform) => platform.draw());
    }
    collideWith(runner,dog){
        return this.plato.some((platform)=>platform.collideWith(runner,dog))
    }
    reset(){
        this.plato=[]
        this.INTERVAL_MAX=1300
    }
}

class score{
    constructor(){
        this.score = 0
        this.highScoreKey = "HIGHSCORE" 
    }
    update(frameTimeDelta){
        this.score += frameTimeDelta * 0.01;

    }
    reset() {
        this.score = 0;
      }
    setHighScore() {
    const highScore = Number(localStorage.getItem(this.highScoreKey));
    if (this.score > highScore) {
      localStorage.setItem(this.highScoreKey, Math.floor(this.score));
    }
  }
  draw() {
    const highScore = Number(localStorage.getItem(this.highScoreKey));
    const y = 40;

    const fontSizeScore = 20 ;
    ctx.font = `${fontSizeScore}px serif`;
    ctx.fillStyle = "#525250";
    const scoreX = canvas.width - 150;
    const highScoreX = scoreX - 125 ;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    ctx.fillText(scorePadded, scoreX, y);
    ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
  reset(){
    this.score=0
  }
}
//----------
const background = new Background()
const Shop = new shop(332)
const runners = new Player(200,400,38,runner)
const dogs = new Player(100,400,87,dog)
const Street= new street({x:0,y:0})
const Score = new score()
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
const gameOverDisplay =(isRunnerWin)=>{
    const fontSize = 70
    ctx.font = `${fontSize}px Verdana`
    ctx.fillStyle = "rgb(0, 0, 0)"
    const xRunner = canvas.width/3.3
    const xDog = canvas.width/2.8
    const y = canvas.height/2
    if(isRunnerWin || Street.position.x === -gameFrame){
        ctx.fillText("RUNNER WIN!",xRunner,y)
    }
    else{
        ctx.fillText("DOG WIN!",xDog,y)
    }

}
const showStartText=()=>{
    const fontSize = 55
    ctx.font = `${fontSize}px Verdana`
    ctx.fillStyle = "rgb(0, 0, 0)"
    const x = canvas.width/3.8
    const y = canvas.height/2
    ctx.fillText("Press Space to Start",x,y)
}
const setupGameReset =()=>{
    if(!pressStart){
        pressStart = true
    }
    setTimeout(()=>{
        window.addEventListener('keyup',({keyCode})=>{
            if(keyCode === 32&&!gameStart){
                reset()
            }
        })
    },500)
}
const reset =()=>{
    firstGame=false
    pressStart=false
    gameOver=false
    gameStart=true
    background.reset()
    Shop.reset(background.position.x)
    Street.reset()
    Score.reset()
    coba = false
    PlatformsController.reset()
    speed = GAME_SPEED_START
}
const drawSprites = ()=>{
    background.draw()
    Street.draw()
    PlatformsController.draw()
    runners.draw()
    dogs.draw()
    Score.draw()
    Shop.draw()
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
    drawSprites()
    if(!gameStart&&firstGame){
        showStartText()
    }

    if(!gameOver && gameStart){
        if(Street.position.x>-gameFrame){
            background.update()
            PlatformsController.update(frameTimeDelta)
            Street.update()
            runners.update()
            dogs.update()
            Score.update(frameTimeDelta);
            Shop.update()
            updateGameSpeed(frameTimeDelta)

            
        }
    }
    
    if(gameOver){
        gameOverDisplay(isRunnerWin)
        gameStart=false
    }
    if(!gameOver && PlatformsController.collideWith(runners,dogs)||Street.position.x<=-gameFrame){
        Score.setHighScore()
        gameOver=true
        setupGameReset()
        // if(runners.numberCollide==2){
        //     Score.setHighScore()
        //     gameOver=true
        //     setupGameReset()
        // }
        // else if(dog.numberCollide)
        
    }
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

window.addEventListener('keyup',({keyCode})=>{
    if(keyCode === 32 && !gameStart){
        reset()
    }
})

