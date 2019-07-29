import { IRenderable } from "./Interfaces/IRenderable";
import { IRenderableGizmo } from "./Interfaces/IRenderableGizmo";
import { IRenderableGUI } from "./Interfaces/IRenderableGUI";
import { IRenderableBackground } from "./Interfaces/IRenderableBackground";
import FloorTileImage from "../../assets/images/DungeonTileset.png";
import { TerrainBuilder } from "./Helpers/TerrainBuilder";
import { TerrainSpec } from "./Helpers/TerrainSpec";
import { Terrain } from "./Helpers/Terrain";
import { AStarSearch } from "./Helpers/AStarSearch";
import { Vector2 } from "./Helpers/Vector2";
import { Color } from "./Enums/Color";

export class RenderingEngine {

    private static _instance: RenderingEngine;

    public renderGizmos: boolean;

    private _background: IRenderableBackground;
    private backgroundObjects: IRenderableBackground[];
    private renderableObjects: IRenderable[];
    private renderableGizmos: IRenderableGizmo[];
    private renderableGUIElements: IRenderableGUI[];
    private readonly _canvasContext: CanvasRenderingContext2D;
    private test: Terrain;
    private ready = false;
    private path: Vector2[];
    

    public constructor(context: CanvasRenderingContext2D) {
        this._canvasContext = context;
        this.backgroundObjects = [];
        this.renderableObjects = [];
        this.renderableGizmos = [];
        this.renderableGUIElements = [];
        this.renderGizmos = false;

        this.setThing();
    }

    private async setThing() {
        //this.test = await LevelBuilder.combineImages(FloorTileImage, 16, 64, 16, 16, 50, 50);
        const builder = new TerrainBuilder();
        await builder.using(FloorTileImage);
        this.test = await builder.buildTerrain(TerrainSpec.getSpec(), 3);
        const start = new Date().getMilliseconds();
        this.path = AStarSearch.findPath(this.test.navGrid, new Vector2(200, 300), new Vector2(700, 300));
        console.log(new Date().getMilliseconds() - start);
        this.ready = true;

    }

    private renderAstar(): void {
        if (!this.ready) {
            return;
        }

        this.canvasContext.beginPath();

        let start = true;
        for (let nodePos of this.path) {
            if (start) {
                start = false;
                this.canvasContext.moveTo(nodePos.x, nodePos.y);
                continue;
            }

            this.canvasContext.lineTo(nodePos.x, nodePos.y);
            
        }
       
        this.canvasContext.strokeStyle = Color.Orange;
        this.canvasContext.stroke();
    }

    public static get instance(): RenderingEngine {
        if (this._instance === null || this._instance === undefined) {
            throw new Error('The instance has not been created yet. Call the buildRenderingEngine() function first.');
        }

        return this._instance;
    }

    public static buildRenderingEngine(context: CanvasRenderingContext2D): RenderingEngine {
        this._instance = new RenderingEngine(context);

        return this._instance;
    }

    public set background(background: IRenderableBackground) {
        this._background = background;
    }

    public get canvasContext(): CanvasRenderingContext2D {
        return this._canvasContext;
    }

    public addRenderableObject(object: IRenderable): void {
        this.renderableObjects.push(object);
    }

    public addRenderableGizmo(gizmo: IRenderableGizmo): void {
        this.renderableGizmos.push(gizmo);
    }

    public addRenderableGUIElement(guiElement: IRenderableGUI) {
        this.renderableGUIElements.push(guiElement);
    }

    public renderScene(): void {
        this._background.renderBackground(this._canvasContext);

        if (this.ready) {
            this._canvasContext.drawImage(this.test.terrainImage, 0, 0);
        }
        
        // for (let object of this.backgroundObjects) {
        //     object.renderBackground(this._canvasContext);
        // }

        for (let object of this.renderableObjects) {
            if (object.enabled) {
                object.render(this._canvasContext);
            }
        }

        if (this.renderGizmos) {
            for (let gizmo of this.renderableGizmos) {
                if (gizmo.enabled) {
                    gizmo.renderGizmo(this._canvasContext);
                }
            }
        }
        this.renderAstar();
        for (let guiElement of this.renderableGUIElements) {
            if (guiElement.enabled) {
                guiElement.renderGUI(this._canvasContext);
            }
        }
    }
}