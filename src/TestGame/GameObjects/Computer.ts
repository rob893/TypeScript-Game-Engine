import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { ComputerMotor } from '../Components/ComputerMotor';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { GameEngine } from '../../GameEngine/Core/GameEngine';


export class Computer extends GameObject {

    public constructor(gameEngine: GameEngine, id: string) {
        super(gameEngine, id, 688, 175);

        const computerComponents: Component[] = [];
        
        computerComponents.push(new RectangleCollider(this, 10, 50));
        computerComponents.push(new ComputerMotor(this));
        computerComponents.push(new RectangleRenderer(this, 10, 50, 'white'));

        this.setComponents(computerComponents);
    }
}