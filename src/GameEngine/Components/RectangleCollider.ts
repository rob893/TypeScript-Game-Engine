import { Vector2 } from '../Core/Helpers/Vector2';
import { Component } from './Component';
import { Transform } from './Transform';
import { LiteEvent } from '../Core/Helpers/LiteEvent';
import { GameObject } from '../Core/GameObject';
import { CustomLiteEvent } from '../Core/Interfaces/CustomLiteEvent';
import { RenderableGizmo } from '../Core/Interfaces/RenderableGizmo';
import { Rigidbody } from './Rigidbody';
import { Color } from '../Core/Enums/Color';
import { GameEngine } from '../Core/GameEngine';

export class RectangleCollider extends Component implements RenderableGizmo {

    public width: number;
    public height: number;
    public readonly offset: Vector2;

    private _attachedRigidbody: Rigidbody|null;
    private readonly _onCollided = new LiteEvent<RectangleCollider>();
    private readonly _topLeft: Vector2;
    private readonly _topRight: Vector2;
    private readonly _bottomLeft: Vector2;
    private readonly _bottomRight: Vector2;
    

    public constructor(gameObject: GameObject, width: number, height: number, offsetX: number = 0, offsetY: number = 0) {
        super(gameObject);

        this.width = width;
        this.height = height;
        this.offset = new Vector2(offsetX, offsetY);

        const transform: Transform = this.transform;

        this._topLeft = new Vector2(transform.position.x + this.offset.x - (width / 2), transform.position.y + this.offset.y - height);
        this._topRight = new Vector2(transform.position.x + this.offset.x + (width / 2), transform.position.y + this.offset.y - height);
        this._bottomLeft = new Vector2(transform.position.x + this.offset.x - (width / 2), transform.position.y + this.offset.y);
        this._bottomRight = new Vector2(transform.position.x + this.offset.x + (width / 2), transform.position.y + this.offset.y);

        GameEngine.instance.physicsEngine.addCollider(this);
        GameEngine.instance.renderingEngine.addRenderableGizmo(this);
    }

    public start(): void {
        this._attachedRigidbody = this.gameObject.hasComponent(Rigidbody) ? this.gameObject.getComponent(Rigidbody) : null;
    }

    public get topLeft(): Vector2 {
        this._topLeft.x = this.transform.position.x + this.offset.x - (this.width / 2);
        this._topLeft.y = this.transform.position.y + this.offset.y - this.height;

        return this._topLeft;
    }

    public get topRight(): Vector2 {
        this._topRight.x = this.transform.position.x + this.offset.x + (this.width / 2);
        this._topRight.y = this.transform.position.y + this.offset.y - this.height;

        return this._topRight;
    }

    public get bottomLeft(): Vector2 {
        this._bottomLeft.x = this.transform.position.x + this.offset.x - (this.width / 2);
        this._bottomLeft.y = this.transform.position.y + this.offset.y;

        return this._bottomLeft;
    }

    public get bottomRight(): Vector2 {
        this._bottomRight.x = this.transform.position.x + this.offset.x + (this.width / 2);
        this._bottomRight.y = this.transform.position.y + this.offset.y;

        return this._bottomRight;
    }

    public get center(): Vector2 {
        return new Vector2(this.topLeft.x + this.offset.x + (this.width / 2), this.topLeft.y + this.offset.y + (this.height / 2));
    }

    public get attachedRigidbody(): Rigidbody|null {
        return this._attachedRigidbody;
    }

    public detectCollision(other: RectangleCollider): boolean {
        
        if(!(other.topLeft.x > this.topRight.x ||
            other.topRight.x < this.topLeft.x ||
            other.topLeft.y > this.bottomLeft.y ||
            other.bottomLeft.y < this.topLeft.y)) {
            this._onCollided.trigger(other);
                
            return true;
        }
        
        return false;
    }

    public get onCollided(): CustomLiteEvent<RectangleCollider> { 
        return this._onCollided.expose(); 
    }

    public renderGizmo(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.moveTo(this.topLeft.x, this.topLeft.y);
        context.lineTo(this.bottomLeft.x, this.bottomLeft.y);
        context.lineTo(this.bottomRight.x, this.bottomRight.y);
        context.lineTo(this.topRight.x, this.topRight.y);
        context.lineTo(this.topLeft.x, this.topLeft.y);
        context.strokeStyle = Color.LightGreen;
        context.stroke();
    }
}