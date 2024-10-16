import { Sprite, Assets } from 'pixi.js';

export class Asteroid extends Sprite {
    constructor(x, y) {
        super();

        this.x = x;
        this.y = y; 
        this.anchor.set(0.5); 
        this.rotationSpeed = 0.0005; 
        this.radius = Math.random() * 20;
        this.angle = Math.random() * Math.PI * 2;
        this.centerX = x; 
        this.centerY = y; 
    }

    async init() {
        const texture = await Assets.load('/assets/asteroid.png'); 
        this.texture = texture; 
    }

    update() {
        this.rotation += this.rotationSpeed;

        this.angle += 0.01; 
        this.x = this.centerX + this.radius * Math.cos(this.angle);
        this.y = this.centerY + this.radius * Math.sin(this.angle);
    }

    destroy() {
        if (this.parent) {
            this.parent.removeChild(this); 
        } else {
            console.warn('Asteriod already removed or parent is null.');
        }
    }
}