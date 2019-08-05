import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { BallMotor } from '../Components/BallMotor';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';

export class Ball extends GameObject {

    public constructor(id: string) {
        super(id, 345, 195);

        const ballComponents: Component[] = [];
        
        ballComponents.push(new RectangleCollider(this, 10, 10));
        ballComponents.push(new BallMotor(this));
        ballComponents.push(new RectangleRenderer(this, 10, 10, 'white'));

        this.setComponents(ballComponents);
    }
}