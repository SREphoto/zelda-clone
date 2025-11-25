export class Sprite {
    private image: HTMLImageElement;
    private isLoaded: boolean = false;

    public get width(): number { return this.image.naturalWidth; }
    public get height(): number { return this.image.naturalHeight; }

    constructor(src: string) {
        this.image = new Image();
        this.image.src = src;
        this.image.onload = () => {
            this.removeBackground();
            this.isLoaded = true;
            console.log('Sprite Loaded:', src, this.image.naturalWidth, this.image.naturalHeight);
        };
    }

    private removeBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = this.image.naturalWidth;
        canvas.height = this.image.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(this.image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // If pixel is near white, make it transparent
            if (r > 200 && g > 200 && b > 200) {
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        const newImage = new Image();
        newImage.src = canvas.toDataURL();
        this.image = newImage;
    }

    public draw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        frameX: number,
        frameY: number,
        frameWidth: number,
        frameHeight: number,
        width: number,
        height: number
    ) {
        if (!this.isLoaded) return;

        ctx.drawImage(
            this.image,
            frameX * frameWidth,
            frameY * frameHeight,
            frameWidth,
            frameHeight,
            x,
            y,
            width,
            height
        );
    }
}
