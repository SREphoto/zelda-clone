import { Sprite } from './Sprite';
import { Player } from './Player';
import heartsSrc from '../assets/hearts.png';

export class HUD {
    private hearts: Sprite;

    constructor() {
        this.hearts = new Sprite(heartsSrc);
    }

    public render(ctx: CanvasRenderingContext2D, player: Player) {
        const heartWidth = 16;
        const heartHeight = 16;
        const scale = 2;
        const spacing = 5;

        for (let i = 0; i < player.maxHealth; i++) {
            let frameX = 2; // Empty by default

            if (i < player.health) {
                frameX = 0; // Full heart
            }

            this.hearts.draw(
                ctx,
                10 + i * (heartWidth * scale + spacing),
                10,
                frameX, 0,
                heartWidth, heartHeight,
                heartWidth * scale,
                heartHeight * scale
            );
        }
    }
}
