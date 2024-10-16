import { Application, Sprite, Assets, Texture } from 'pixi.js';
import { Asteroid } from './asteroid';
import { Spaceship } from './spaceship';
import { GameText } from './game-text';

export class Game {

    constructor() {
        this.app = new Application();
        this.spaceship = null;

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        this.isMovingLeft = false; 
        this.isMovingRight = false; 

        this.lastKeyPressed = null;

        this.asteroidSpacing = 30;
        this.asteroids = [];
        this.bullets = [];
        this.shotsLeft = 10;
        this.timeLeft = 60;
    }

    async init() {
        await this.app.init({width: 1280, height: 720});
        document.body.appendChild(this.app.canvas);

        await this.loadBackground();

        this.spaceship = new Spaceship(this.app.screen.width / 2, this.app.screen.height - 100);
        this.app.stage.addChild(this.spaceship); 

        this.createAsteroids(10);

         this.timerText = new GameText(this.timeLeft, 1200, 20, { fontSize: 24, fill: '#ffffff' }, this.app.stage);

         
        window.addEventListener('keyup', (event) => {
            if (event.code === 'Space') {
                if(this.shotsLeft === 0) return;
                const bullet = this.spaceship.shot(); 
                this.shotsLeft -= 1;
                this.bullets.push(bullet); 
            }
        });

         this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft -= 1;
                this.timerText.setText(this.timeLeft); 
            }
        }, 1000);

         
        this.gameOverText = new GameText('', 640, 360, { fontSize: 36, fill: '#ff0000', align: 'center' }, this.app.stage);

        this.app.ticker.add(() => this.update());
    }

    async createAsteroids(count) {
        for (let i = 0; i < count; i++) {
            let newAsteroid;
            let overlapping;

            do {
                const x = Math.random() * (1210 - 70) + 70;
                const y = Math.random() * (360 - 70) + 70;
                newAsteroid = new Asteroid(x, y);
                await newAsteroid.init(); 

                overlapping = this.checkCollision(newAsteroid); 
            } while (overlapping);

            
            this.app.stage.addChild(newAsteroid);
            this.asteroids.push(newAsteroid);
        }
    }

    checkCollision(newAsteroid) {
        for (const asteroid of this.asteroids) {
            const distance = Math.sqrt(
                (newAsteroid.x - asteroid.x) ** 2 +
                (newAsteroid.y - asteroid.y) ** 2
            );
            
            if (distance < (asteroid.width / 2 + newAsteroid.width / 2 + this.asteroidSpacing)) {
                return true; 
            }
        }
        return false;
    }

    async loadBackground() {
        await Assets.load('/assets/background.jpg');
        const backgroundTexture = Assets.get('/assets/background.jpg');
        const background = new Sprite(backgroundTexture);
        background.width = this.app.screen.width; 
        background.height = this.app.screen.height; 
        this.app.stage.addChild(background); 
    }

    onKeyDown(event) {
        if (event.key === 'ArrowLeft') {
            this.isMovingLeft = true; 
            this.lastKeyPressed = 'ArrowLeft';
        } else if (event.key === 'ArrowRight') {
            this.isMovingRight = true;
            this.lastKeyPressed = 'ArrowRight';
        }
    }

    onKeyUp(event) {
        if (event.key === 'ArrowLeft') {
            this.isMovingLeft = false;
            if (this.isMovingRight) {
                this.lastKeyPressed = 'ArrowRight'; 
            }
        } else if (event.key === 'ArrowRight') {
            this.isMovingRight = false; 
            if (this.isMovingLeft) {
                this.lastKeyPressed = 'ArrowLeft'; 
            }
        }
    }
 
    update() {
        const moveSpeed = 5; 
        const bulletsToRemove = [];
        const asteroidsToRemove = [];

        if (this.isMovingLeft && this.lastKeyPressed === 'ArrowLeft') {
            this.spaceship.x -= moveSpeed;
        } else if (this.isMovingRight && this.lastKeyPressed === 'ArrowRight') {
            this.spaceship.x += moveSpeed; 
        }

        if (this.spaceship.x < 50) {
            this.spaceship.x = 50;
        } else if (this.spaceship.x > this.app.screen.width - 50) {
            this.spaceship.x = this.app.screen.width - 50;
        }

        this.asteroids.forEach(asteroid => asteroid.init());

        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.y < 0) {
                bulletsToRemove.push(index);
                return;
            }

            this.asteroids.forEach((asteroid, asteroidIndex) => {
                if (bullet.checkCollision(asteroid)) {
                    bulletsToRemove.push(index);
                    asteroidsToRemove.push(asteroidIndex);

                    asteroid.destroy();
                    return; 
                }
            });

        });

        bulletsToRemove.forEach(index => {
            const bullet = this.bullets[index];
            bullet.destroy();
        });
        this.bullets = this.bullets.filter((_, index) => !bulletsToRemove.includes(index));
        
        asteroidsToRemove.forEach(index => {
            const asteroid = this.asteroids[index];
            asteroid.destroy(); 
        });
        this.asteroids = this.asteroids.filter((_, index) => !asteroidsToRemove.includes(index));

        this.asteroids.forEach(asteroid => asteroid.update());

        if (this.asteroids.length === 0 && this.shotsLeft === 0) {
            this.winGame(); 
        }

        if (this.shotsLeft === 0 && this.bullets.length === 0 && this.asteroids.length > 0 || this.timeLeft <= 0) {
            this.endGame();
        } 
    }

    endGame() {
        this.gameOverText.setText('YOU LOSE');
        clearInterval(this.timerInterval);
        this.app.ticker.stop(); 
    }

    winGame() {
        this.gameOverText.setText('YOU WIN'); 
        clearInterval(this.timerInterval); 
        this.app.ticker.stop(); 
    }

}