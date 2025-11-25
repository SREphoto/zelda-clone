export class Input {
    private keys: { [key: string]: boolean } = {};
    private previousKeys: { [key: string]: boolean } = {};

    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
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
        this.keys[e.code] = true;
    }

    private handleKeyUp(e: KeyboardEvent) {
        this.keys[e.code] = false;
    }

    public isDown(code: string): boolean {
        return !!this.keys[code];
    }

    public isPressed(code: string): boolean {
        return !!this.keys[code] && !this.previousKeys[code];
    }
}
