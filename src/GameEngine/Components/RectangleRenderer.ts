import { Component } from "./Component";
import { Transform } from "./Transform";
import { GameObject } from "../Core/GameObject";

export class RectangleRenderer extends Component {

    private transform: Transform;
    private renderWidth: number;
    private renderHeight: number;
    private gameCanvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private color: string;

    public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, color: string) {
        super(gameObject);

        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.transform = gameObject.getTransform();
        this.color = color
    }

    public start(): void {
        this.gameCanvas = this.gameObject.getGameCanvas();
        this.canvasContext = this.gameCanvas.getContext("2d");
    }

    public update(): void {
        this.render();
    }

    public setColor(color: string): void {
        this.color = color;
    }

    private render(): void {
        this.canvasContext.fillStyle = this.color;
        this.canvasContext.fillRect(this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);
    }
}