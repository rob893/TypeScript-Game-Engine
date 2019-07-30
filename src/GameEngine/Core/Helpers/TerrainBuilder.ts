import { ISpriteData } from "../Interfaces/ISpriteData";
import { NavGrid } from "./NavGrid";
import { Vector2 } from "./Vector2";
import { Terrain } from "./Terrain";
import { ITerrainSpec } from "../Interfaces/ITerrainSpec";

export class TerrainBuilder {

    private builderMap: Map<HTMLImageElement, Map<string, ISpriteData[]>> = new Map<HTMLImageElement, Map<string, ISpriteData[]>>();
    private spriteSheetSet: Set<string> = new Set<string>();
    private readonly context: CanvasRenderingContext2D;
    private readonly canvas: HTMLCanvasElement;
    private currentSpriteSheet: HTMLImageElement;


    public constructor(width: number = 1024, height: number = 576) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
    }

    public async buildTerrain(terrainSpec: ITerrainSpec): Promise<Terrain> {

        await this.using(terrainSpec.spriteSheetUrl);

        return new Promise(resolve => {
            const scale = terrainSpec.scale;
            const terrainGrid = terrainSpec.getSpec();
            const cellSize = terrainSpec.cellSize;
            const navGrid = new NavGrid(cellSize * scale);

            let x = 0;
            let y = 0;
            for (let i = 0; i < terrainGrid.length; i++) {
                for (let j = 0; j < terrainGrid[i].length; j++) {
                    const gridCell = terrainGrid[i][j];

                    if (gridCell === null) {
                        x = j === terrainGrid[i].length - 1 ? 0 : x + cellSize * scale;
                        y = j === terrainGrid[i].length - 1 ? y + cellSize * scale : y;
                        continue;
                    }

                    navGrid.addCell({ passable: gridCell.passable, weight: gridCell.weight, position: new Vector2(x, y) });
                    
                    const c = gridCell.spriteData;

                    this.context.drawImage(this.currentSpriteSheet, c.sliceX, c.sliceY, c.sliceWidth, c.sliceHeight, x, y, c.sliceWidth * scale, c.sliceHeight * scale);
                    x = j === terrainGrid[i].length - 1 ? 0 : x + (c.sliceWidth * scale);
                    y = j === terrainGrid[i].length - 1 ? y + (c.sliceHeight * scale) : y;
                }
            }

            const image = new Image();
            image.src = this.canvas.toDataURL();
            image.onload = () => {
                resolve(new Terrain(image, navGrid, []));
            }
        });
    }

    private async using(spriteSheet: string): Promise<TerrainBuilder> {
        if (this.spriteSheetSet.has(spriteSheet)) {
            console.warn('This builder is already using this sprite sheet!');
        }

        return new Promise(resolve => {
            this.spriteSheetSet.add(spriteSheet);
        
            let spriteSheetImg = new Image();
            spriteSheetImg.src = spriteSheet;
            spriteSheetImg.onload = () => {
                this.builderMap.set(spriteSheetImg, new Map<string, ISpriteData[]>());
                this.currentSpriteSheet = spriteSheetImg;
                resolve(this);
            }
        });
    }
}