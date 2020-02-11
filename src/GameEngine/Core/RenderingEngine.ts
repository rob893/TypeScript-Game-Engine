import { Renderable } from './Interfaces/Renderable';
import { RenderableGizmo } from './Interfaces/RenderableGizmo';
import { RenderableGUI } from './Interfaces/RenderableGUI';
import { RenderableBackground } from './Interfaces/RenderableBackground';
import { Terrain } from '../GameObjects/Terrain';
import { Component } from '../Components/Component';


export class RenderingEngine {

    public renderGizmos: boolean;

    private _background: RenderableBackground | null;
    private _terrain: Terrain | null;
    private readonly renderableObjects: Renderable[];
    private readonly renderableGizmos: RenderableGizmo[];
    private readonly renderableGUIElements: RenderableGUI[];
    private readonly _canvasContext: CanvasRenderingContext2D;
    

    public constructor(context: CanvasRenderingContext2D) {
        this._canvasContext = context;
        this.renderableObjects = [];
        this.renderableGizmos = [];
        this.renderableGUIElements = [];
        this.renderGizmos = false;
        this._terrain = null;
        this._background = null;
    }

    public set terrain(terrain: Terrain) {
        this._terrain = terrain;
    }

    public set background(background: RenderableBackground) {
        this._background = background;
    }

    public get canvasContext(): CanvasRenderingContext2D {
        return this._canvasContext;
    }

    public addRenderableObject(object: Renderable): void {
        this.renderableObjects.push(object);

        if (object instanceof Component) {
            object.onDestroyed.add(() => {
                const index = this.renderableObjects.indexOf(object);

                if (index !== -1) {
                    this.renderableObjects.splice(index, 1);
                }
            });
        }
    }

    public addRenderableGizmo(gizmo: RenderableGizmo): void {
        this.renderableGizmos.push(gizmo);

        if (gizmo instanceof Component) {
            gizmo.onDestroyed.add(() => {
                const index = this.renderableGizmos.indexOf(gizmo);

                if (index !== -1) {
                    this.renderableGizmos.splice(index, 1);
                }
            });
        }
    }

    public addRenderableGUIElement(guiElement: RenderableGUI): void {
        this.renderableGUIElements.push(guiElement);

        if (guiElement instanceof Component) {
            guiElement.onDestroyed.add(() => {
                const index = this.renderableGUIElements.indexOf(guiElement);

                if (index !== -1) {
                    this.renderableGUIElements.splice(index, 1);
                }
            });
        }
    }

    public renderScene(): void {
        if (this._background !== null) {
            this._background.renderBackground(this._canvasContext);
        }

        if (this._terrain !== null) {
            this._terrain.renderBackground(this._canvasContext);
        }

        for (const object of this.renderableObjects) {
            if (object.enabled) {
                object.render(this._canvasContext);
            }
        }

        if (this.renderGizmos) {
            for (const gizmo of this.renderableGizmos) {
                if (gizmo.enabled) {
                    gizmo.renderGizmo(this._canvasContext);
                }
            }
        }

        for (const guiElement of this.renderableGUIElements) {
            if (guiElement.enabled) {
                guiElement.renderGUI(this._canvasContext);
            }
        }
    }
}