import { useEffect, useRef } from 'react';
import { Game } from '../game/Game';

export const GameCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);
    console.log('GameCanvas rendering');

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize game
        const game = new Game();
        game.init(canvasRef.current, () => { });
        gameRef.current = game;

        return () => {
            game.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
        />
    );
};
