import { Text } from 'pixi.js';

export class GameText {
    constructor(text, x, y, style, parent) {
        this.textObject = new Text(text, style);
        this.textObject.x = x;
        this.textObject.y = y;
        this.textObject.anchor.set(0.5, 0.5);
        parent.addChild(this.textObject);
    }

    setText(newText) {
        this.textObject.text = newText;
    }

    destroy() {
        this.textObject.parent.removeChild(this.textObject);
        this.textObject.destroy();
    }
}