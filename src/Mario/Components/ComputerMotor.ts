import { Motor } from "./Motor";
import { Transform } from "../../GameEngine/Components/Transform";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Time } from "../../GameEngine/Core/Time";
import { Vector2 } from "../../GameEngine/Core/Vector2";

export class ComputerMotor extends Motor {

    private ballTransform: Transform;
    private timer: number = 0;
    private quarterFieldX: number;
    private midFieldY: number;


    public constructor(gameObject: GameObject) {
        super(gameObject);

        this.yVelocity = 1;
    }

    public start(): void {
        super.start();

        this.ballTransform = GameEngine.Instance.getGameObjectById("ball").getTransform();
        this.quarterFieldX = this.gameCanvas.width / 4;
        this.midFieldY = this.gameCanvas.height / 2;
    }

    protected handleOutOfBounds(): void {
        if(this.transform.position.y <= 0) {
            this.yVelocity = -1;
        }
        else if(this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity = 1;
        }
    }

    protected move(): void {
        if(this.ballTransform.position.x < this.quarterFieldX) {
            if(this.transform.position.y > this.midFieldY + 5) {
                this.yVelocity = 1;
            }
            else if(this.transform.position.y < this.midFieldY - 5) {
                this.yVelocity = -1;
            }
            else {
                this.yVelocity = 0;
            }
        }
        else {
            this.timer += Time.DeltaTime;

            if(this.timer > 0.15) {
                if(this.transform.center.y < this.ballTransform.center.y - 10) {
                    this.yVelocity = -1;
                }
                else if (this.transform.center.y > this.ballTransform.center.y + 10){
                    this.yVelocity = 1;
                }
                else {
                    this.yVelocity = 0;
                }
    
                this.timer = 0;
            }
        }

        this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
    }
}