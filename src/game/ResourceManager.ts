export class ResourceManager {
    private images: Map<string, HTMLImageElement | HTMLCanvasElement> = new Map();
    private toLoad: string[] = [
        '/assets/tiles.png',
        '/assets/link.png',
        '/assets/enemies.png',
        '/assets/bosses.png',
        '/assets/items.png'
    ];
    public loaded: boolean = false;

    public loadAll(): Promise<void> {
        const promises = this.toLoad.map(src => this.loadImage(src));
        return Promise.all(promises).then(() => {
            this.loaded = true;
            console.log('All assets loaded');
        });
    }

    private loadImage(src: string): Promise<HTMLImageElement | HTMLCanvasElement> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                // Process image to remove green background if it's Link or Tiles
                if (src.includes('link.png') || src.includes('tiles.png')) {
                    const processed = this.removeColorKey(img);
                    this.images.set(src, processed as HTMLCanvasElement);
                    resolve(processed);
                } else {
                    this.images.set(src, img);
                    resolve(img);
                }
            };
            img.onerror = (e) => {
                console.error(`Failed to load image: ${src}`, e);
                resolve(img);
            };
            img.src = src;
        });
    }

    private removeColorKey(img: HTMLImageElement): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Remove lime green (#00FF00) - chroma key
            const isGreen = g > 200 && r < 120 && b < 120;

            // Remove white/near-white backgrounds (#FFFFFF and similar)
            const isWhite = r > 240 && g > 240 && b > 240;

            // Remove light gray backgrounds
            const isLightGray = r > 220 && g > 220 && b > 220 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20;

            if (isGreen || isWhite || isLightGray) {
                data[i + 3] = 0; // Make transparent
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    public getImage(src: string): HTMLCanvasElement | HTMLImageElement | undefined {
        return this.images.get(src);
    }
}

export const resources = new ResourceManager();
