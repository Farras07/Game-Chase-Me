const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const dogRun =new Image()
dogRun.src = "./assets/dog/Walk.png"
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
const dogIdle = new Image()
dogIdle.src = './assets/dog/Idle.png'


let gameStart= false

let previousTime = null;
let PlatformsController = null;
const GAME_SPEED_START = 7
const GAME_SPEED_INCREMENT = 0.0001;
let speed = GAME_SPEED_START

const gravity = 0.5
const gameFrame = 10000
const jumpHeightMax = 320
let gameOver = false
let isRunnerWin=null
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
            x:gameFrame+1000,
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
        const fontSize = 50 ;
        ctx.font = `${fontSize}px serif`;
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText("FINISH",this.position.x-30,200)
    }
    update(){
        this.frameIndex = 0 + (Math.floor(Date.now() / 100) % 6);
        this.position.x-=speed

    }
    reset(xBackground){
        this.position.x = xBackground+gameFrame+1000
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
        this.playerImage = playerImage
        this.frame = [
            {x:0,y:0,w:this.width,h:this.height},
            {x:48,y:0,w:this.width,h:this.height},
            {x:48*2,y:0,w:this.width,h:this.height},
            {x:48*3,y:0,w:this.width,h:this.height},
            {x:48*4,y:0,w:this.width,h:this.height},
            {x:48*5,y:0,w:this.width,h:this.height},
            {x:48*6,y:0,w:this.width,h:this.height},
            
        ]
        addEventListener('keydown',({keyCode})=>{

            if(keyCode === key && 
                this.position.y>=jumpHeightMax && 
                this.numberPress<=2 &&
                Street.position.x>=-gameFrame + 800 &&
                !gameOver)
                {
                this.numberPress++
                this.isJump = true
                this.velocity.y -= 8
            }
        })
        addEventListener('keyup',({keyCode})=>{
            this.isJump=false
            if(this.numberPress>=2||this.position.y>=412||this.position.y<=jumpHeightMax){
                this.numberPress=0
            }

            
        })
    }
    draw(){
        let frame = this.frame[this.framesIndex]
        ctx.drawImage(this.playerImage,frame.x,frame.y,frame.w,frame.h,this.position.x,this.position.y,this.width,this.height)
  
    }
    update(){
        if(this.isJump&&!gameOver){
            playSound("./assets/backsound/Arcade-8-bit-jump.mp3",".sfxJump",false)

        }
        else{
            this.framesIndex = 0 + (Math.floor(Date.now() / 100) % 6); // animate right frames
        }

  
        this.position.y += this.velocity.y
        if(this.position.y + this.height+this.velocity.y <= 460){
            this.velocity.y += gravity
        }
        else{
            this.velocity.y = 0
        }

    }
    reset(x){
        this.position.x = x
   }
}
class Dog {
    constructor(x,y,key,dogRun,dogIdle){
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
        this.dogRun = dogRun
        this.dogIdle = dogIdle
        this.frame = [
            {x:0,y:0,w:this.width,h:this.height},
            {x:48,y:0,w:this.width,h:this.height},
            {x:48*2,y:0,w:this.width,h:this.height},
            {x:48*3,y:0,w:this.width,h:this.height},
            {x:48*4,y:0,w:this.width,h:this.height},
            {x:48*5,y:0,w:this.width,h:this.height},
            {x:48*6,y:0,w:this.width,h:this.height},
            { x: 192/4, y: 0, w: this.width, h: this.height }, 
            { x: 192/4*2, y: 0, w: this.width, h: this.height },
            { x: 192/4*3, y: 0, w: this.width, h: this.height }, 
            { x: 192/4*3, y: 0, w: this.width, h: this.height }, 
            { x: 192/4*4, y: 0, w: this.width, h: this.height }, 
            
        ]
        addEventListener('keydown',({keyCode})=>{

            if(keyCode === key && 
                this.position.y>=jumpHeightMax && 
                this.numberPress<=2 &&
                Street.position.x>=-gameFrame + 800 &&
                !gameOver)
                {
                this.numberPress++
                this.isJump = true
                this.velocity.y -= 8
            }
        })
        addEventListener('keyup',({keyCode})=>{
            this.isJump=false
            if(this.numberPress>=2||this.position.y>=412||this.position.y<=jumpHeightMax){
                this.numberPress=0
            }

            
        })
    }
    draw(){
        let frame = this.frame[this.framesIndex]
        if(Street.position.x>-gameFrame){
            ctx.drawImage(this.dogRun,frame.x,frame.y,frame.w,frame.h,this.position.x,this.position.y,this.width,this.height)
        }
        else{
            console.log(this.framesIndex)
            ctx.drawImage(this.dogIdle,frame.x,frame.y,frame.w,frame.h,this.position.x,this.position.y,this.width,this.height)
        }
    }
    update(){
        if(Street.position.x>-gameFrame){
            this.framesIndex = 0 + (Math.floor(Date.now() / 100) % 6); // animate right frames
        }
        else{
            this.framesIndex = 7 + (Math.floor(Date.now() / 100) % 4); // animate right frames
        }

        this.position.y += this.velocity.y
        if(this.position.y + this.height+this.velocity.y <= 460){
            this.velocity.y += gravity
        }
        else{
            this.velocity.y = 0
        }

    }
    reset(x){
        this.position.x = x
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

        ctx.drawImage(this.image,this.position.x, this.position.y, this.width, this.height);

    }
    update(){
        this.position.x -= speed
        
    }
    collideWith(runner,dog){
        const adjustByRunnerX=1.5
        const adjustByDogX=1.3
        const adjustByRunnerY=1.3
        const adjustByDogY=1.3


        if(
            runner.position.x <= this.position.x + this.width / adjustByRunnerX &&
            runner.position.x + runner.width/adjustByRunnerX>= this.position.x &&
            runner.position.y >= this.position.y - this.height/adjustByRunnerY &&
            runner.height + runner.position.y / adjustByRunnerY < this.position.y
            
        ){
            // runner.numberCollide++
            isRunnerWin = false
            return true
        }
        else if(
            dog.position.x <= this.position.x + this.width / adjustByDogX &&
            dog.position.x + dog.width/adjustByDogX>= this.position.x &&
            dog.position.y >= this.position.y - this.height/adjustByDogY &&
            dog.height + dog.position.y / adjustByDogY < this.position.y ||
            runner.position.x>=1000
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
        }
        else{

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
        this.scoreRun = 0
        this.highScoreRunKey = "HIGHSCORE RUN" 
    }
    update(frameTimeDelta){
        this.scoreRun += frameTimeDelta * 0.01;

    }
    reset() {
        this.scoreRun = 0;
        this.scoreChase = 0;
      }
    setHighScore() {
    const highScoreRun = Number(localStorage.getItem(this.highScoreRunKey));
    if (this.scoreRun > highScoreRun) {
      localStorage.setItem(this.highScoreRunKey, Math.floor(this.scoreRun));
    }
  }
  draw() {
    const highScoreRun = Number(localStorage.getItem(this.highScoreRunKey));

    const fontSizeScore = 20 ;
    ctx.font = `${fontSizeScore}px serif`;
    ctx.fillStyle = "#525250";
    const y = 40;

    const scoreRunX = canvas.width - 150;
    const highScoreRunX = scoreRunX - 125 ;
    const scorePaddedRun = Math.floor(this.scoreRun).toString().padStart(6, 0);
    const highScorePaddedRun = highScoreRun.toString().padStart(6, 0);
    
    ctx.fillText(scorePaddedRun, scoreRunX, y);
    ctx.fillText(`HI ${highScorePaddedRun}`, highScoreRunX, y);
    
  }
}
//----------
const background = new Background()
const Shop = new shop(332)
const runners = new Player(200,412,38,runner)
const dogs = new Dog(100,412,87,dogRun,dogIdle)
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
    if(isRunnerWin){
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
}
const reset =()=>{
    playSound("./assets/backsound/Medium-size-dog-barking.mp3",".sfxDog",true)
    setTimeout(()=>{
        playSound("./assets/backsound/[Electro] - Nitro Fun & Hyper Potions - Checkpoint [Monstercat Release].mp3",".sfxBacksound",false)
        
    },1000)
    firstGame=false
    pressStart=false
    gameOver=false
    gameStart=true
    background.reset()
    runners.reset(200)        
    dogs.reset(100)        
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

const playSound = (soundfile,selector,loop)=>{
    return document.querySelector(selector).innerHTML = "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\""+loop+"\"/>";

}
const pressStartButton =()=>{
    window.addEventListener('keyup',({keyCode})=>{
        if(keyCode === 32 && !gameStart){
            reset()
        }
    })

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
    pressStartButton()
    if(!gameStart&&firstGame){
        showStartText()
    }
    
    if(!gameOver && gameStart){
        if(Street.position.x>-gameFrame){
            background.update()
            PlatformsController.update(frameTimeDelta)
            Street.update()
            Score.update(frameTimeDelta);
            Shop.update()
            updateGameSpeed(frameTimeDelta)
        }
        if(runners.position.x<=1009){
            if(Street.position.x <= -gameFrame){
                runners.position.x+=speed
            }
            dogs.update()
            runners.update()
        }
        else if(runners.position.x>=1010){
            runners.position.x = 1010
        }
    }
    
    if(gameOver){
        gameOverDisplay(isRunnerWin)
        gameStart=false
    }
    if(!gameOver && PlatformsController.collideWith(runners,dogs)||runners.position.x>=1010){
        if(gameFrame<2200){
            isRunnerWin = true
        }
        if(isRunnerWin){
            playSound("./assets/backsound/piglevelwin2mp3-14800.mp3",".sfxBacksound",false)
        }
        else{
            playSound("./assets/backsound/8-bit-video-game-fail-version-2-145478.mp3",".sfxBacksound",false)
        }
        Score.setHighScore()
        gameOver=true
        setupGameReset()

    }
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)



