import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { RenderableGUI } from '../../GameEngine/Core/Interfaces/RenderableGUI';
import { Time } from '../../GameEngine/Core/Time';
import { Input } from '../../GameEngine/Core/Helpers/Input';
import { EventType } from '../../GameEngine/Core/Enums/EventType';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';
import { SceneManager } from '../../GameEngine/Core/Helpers/SceneManager';

export class GameManager extends Component implements RenderableGUI {

    //private audioSource: AudioSource;
    private sceneMessage: string = '';
    private messageColor: string = '';
    private messageTimer: number = 0;
    private messageLength: number = 0;
    private gameOver: boolean = false;
    private readonly time: Time;
    private readonly sceneManager: SceneManager;


    public constructor(gameObject: GameObject, input: Input, time: Time, sceneManager: SceneManager) {
        super(gameObject);

        this.time = time;
        this.sceneManager = sceneManager;

        input.addKeyListener(EventType.KeyDown, KeyCode.One, async () => await sceneManager.loadScene(1));
        input.addKeyListener(EventType.KeyDown, KeyCode.Two, async () => await sceneManager.loadScene(2));
        input.addKeyListener(EventType.KeyDown, KeyCode.Three, async () => await sceneManager.loadScene(3));
        input.addKeyListener(EventType.KeyDown, KeyCode.P, () => this.printGameData());
    }

    public endGame(): void {
        this.togglePause();
        this.gameOver = true;
    }

    public showMessage(message: string, lengthInSeconds: number, color: string): void {
        this.sceneMessage = message;
        this.messageLength = lengthInSeconds;
        this.messageColor = color;
    }

    public renderGUI(context: CanvasRenderingContext2D): void {
        this.renderGameOver(context);
        this.renderMessage(context);
    }

    private renderGameOver(context: CanvasRenderingContext2D): void {
        if (this.gameOver) {
            context.fillText('Game Over! YOU SUCK', 50, 50);
        }
    }

    private renderMessage(context: CanvasRenderingContext2D): void {
        if (this.sceneMessage !== '') {
            this.messageTimer += this.time.deltaTime;
            context.fillStyle = this.messageColor;
            context.fillText(this.sceneMessage, 250, 250);

            if (this.messageTimer > this.messageLength) {
                this.sceneMessage = '';
                this.messageTimer = 0;
                this.messageLength = 0;
            }
        }
    }

    private togglePause(): void {
        this.sceneManager.togglePause();
    }

    private printGameData(): void {
        this.sceneManager.printGameData();
    }

    private testInstantiate(): void {
        //GameEngine.instance.instantiate(new Ball('ball2'));
    }
}