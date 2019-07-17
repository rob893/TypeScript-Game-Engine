import { IRenderable } from "./Interfaces/IRenderable";

export class ImageBackground implements IRenderable {
    
    private gameCanvas: HTMLCanvasElement;
    private image: HTMLImageElement;


    public constructor(gameCanvas: HTMLCanvasElement, imageSrc: string) {
        this.image = new Image(gameCanvas.width, gameCanvas.height);
        this.image.src = imageSrc;
        this.gameCanvas = gameCanvas;
    }
    
    public render(context: CanvasRenderingContext2D): void {
        context.drawImage(this.image, 0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}