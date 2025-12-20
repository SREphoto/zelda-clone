export class Input {
    private keys: { [key: string]: boolean } = {};
    private previousKeys: { [key: string]: boolean } = {};

    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        console.log('✅ Input system initialized - listening for keys');
    }

    public destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    public update() {
        // Copy current keys to previous keys at start of frame
        this.previousKeys = { ...this.keys };
    }

    private handleKeyDown(e: KeyboardEvent) {
        console.log('🔑 KEY DOWN:', e.code, 'Keys object:', this.keys);

        // Prevent default for game control keys
        const gameKeys = [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'KeyW', 'KeyA', 'KeyS', 'KeyD',
            'Space', 'Enter',
            'KeyZ', 'KeyX', 'KeyB', 'KeyM'
        ];

        if (gameKeys.includes(e.code)) {
            e.preventDefault();
            console.log('⚠️ Prevented default for:', e.code);
        }

        this.keys[e.code] = true;
        console.log('✅ Key registered:', e.code, 'Current keys:', Object.keys(this.keys).filter(k => this.keys[k]));
    }

    private handleKeyUp(e: KeyboardEvent) {
        console.log('🔓 KEY UP:', e.code);
        this.keys[e.code] = false;
    }

    public isDown(code: string): boolean {
        const result = !!this.keys[code];
        if (result) {
            console.log('📍 isDown(' + code + ') = TRUE');
        }
        return result;
    }

    public isPressed(code: string): boolean {
        const result = !!this.keys[code] && !this.previousKeys[code];
        if (result) {
            console.log('🎯 isPressed(' + code + ') = TRUE');
        }
        return result;
    }
}
