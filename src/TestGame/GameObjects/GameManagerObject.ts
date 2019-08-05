import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
//import { GameManager } from '../Components/GameManager';
import { FPSCounter } from '../../GameEngine/Components/FPSCounter';
//import { AudioSource } from '../../GameEngine/Components/AudioSource';
//import MarioTheme from '../../assets/sounds/marioTheme.mp3';

export class GameManagerObject extends GameObject {

    public constructor(id: string) {
        super(id, 0, 0);

        const gameManagerComponents: Component[] = [];
        
        //let gameManager = GameManager.createinstance(this);
        //gameManagerComponents.push(gameManager);
        gameManagerComponents.push(new FPSCounter(this));
        //gameManagerComponents.push(new AudioSource(this, MarioTheme));

        this.setComponents(gameManagerComponents);
    }
}