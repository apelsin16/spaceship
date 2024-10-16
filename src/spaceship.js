import { Sprite, Assets } from 'pixi.js';
import { Bullet } from './bullet';

export class Spaceship extends Sprite {
    constructor(x, y) {
        super(); 

        this.init(x, y); 
    }

    async init(x, y) {
        const texture = await Assets.load('/assets/spaceship.png'); 
        this.texture = texture; 
        this.anchor.set(0.5);
        this.x = x; 
        this.y = y; 
    }

    shot() {
        const bullet = new Bullet(this.x, this.y - this.height / 2);
        this.parent.addChild(bullet); 
        return bullet;
    }
}