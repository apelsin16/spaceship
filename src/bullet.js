import { Graphics } from 'pixi.js';

export class Bullet extends Graphics {
    constructor(x, y) {
        super();
        this.init(x, y);
    }

    init(x, y) {
        this.beginFill(0x00ff00); 
        this.drawCircle(0, 0, 10); 
        this.endFill();

        this.x = x; 
        this.y = y; 
    }

    update() {
        this.y -= 5; 
    }

    checkCollision(asteroid) {
        if (!this || !asteroid) {
            return false; 
        }
        const dx = this.x - asteroid.x;
        const dy = this.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < 70; 
    }
}
