import { useEffect, useRef, useState } from 'react';
import { Game } from '../game/Game';
import { HUD } from './HUD';

export const GameCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);
    const [health, setHealth] = useState(3);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize game
        const game = new Game();
        game.init(canvasRef.current, (newHealth) => {
            setHealth(newHealth);
        });
        gameRef.current = game;

        return () => {
            game.destroy();
        };
    }, []);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <HUD health={health} maxHealth={3} />
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{
                    border: '2px solid #333',
                    borderRadius: '4px',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                    maxWidth: '100%',
                    imageRendering: 'pixelated',
                }}
            />
        </div>
    );
};
