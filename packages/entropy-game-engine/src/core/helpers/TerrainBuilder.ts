import { SpriteData } from '../interfaces/SpriteData';
import { NavGrid } from './NavGrid';
import { Vector2 } from './Vector2';
import { Terrain } from '../../game-objects/Terrain';
import { TerrainSpec } from '../interfaces/TerrainSpec';
import { GameEngine } from '../GameEngine';

export class TerrainBuilder {
  private readonly builderMap: Map<HTMLImageElement, Map<string, SpriteData[]>> = new Map<
    HTMLImageElement,
    Map<string, SpriteData[]>
  >();
  private readonly spriteSheetSet: Set<string> = new Set<string>();
  private readonly context: CanvasRenderingContext2D;
  private readonly canvas: HTMLCanvasElement;
  private currentSpriteSheet: HTMLImageElement | null = null;

  public constructor(width: number = 1024, height: number = 576) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    const context = this.canvas.getContext('2d');

    if (context === null) {
      throw new Error('Bad context');
    }

    this.context = context;
  }

  public async buildTerrain(gameEngine: GameEngine, terrainSpec: TerrainSpec): Promise<Terrain> {
    await this.using(terrainSpec.spriteSheetUrl);

    return new Promise(resolve => {
      const { scale } = terrainSpec;
      const terrainGrid = terrainSpec.getSpec();
      const { cellSize } = terrainSpec;
      const navGrid = new NavGrid(cellSize * scale);
      const colliderOffsets: Vector2[] = [];

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

          navGrid.addCell({
            passable: gridCell.passable,
            weight: gridCell.weight,
            position: new Vector2(x, y)
          });

          if (!gridCell.passable) {
            colliderOffsets.push(new Vector2(x, y));
          }

          const c = gridCell.spriteData;

          if (this.currentSpriteSheet === null) {
            throw new Error('Error building terrain.');
          }

          this.context.drawImage(
            this.currentSpriteSheet,
            c.sliceX,
            c.sliceY,
            c.sliceWidth,
            c.sliceHeight,
            x,
            y,
            c.sliceWidth * scale,
            c.sliceHeight * scale
          );
          x = j === terrainGrid[i].length - 1 ? 0 : x + c.sliceWidth * scale;
          y = j === terrainGrid[i].length - 1 ? y + c.sliceHeight * scale : y;
        }
      }

      const image = new Image();
      image.src = this.canvas.toDataURL();
      image.onload = () => {
        resolve(new Terrain(gameEngine, image, navGrid, colliderOffsets));
      };
    });
  }

  private async using(spriteSheet: string): Promise<TerrainBuilder> {
    if (this.spriteSheetSet.has(spriteSheet)) {
      console.warn('This builder is already using this sprite sheet!');
    }

    return new Promise(resolve => {
      this.spriteSheetSet.add(spriteSheet);

      const spriteSheetImg = new Image();
      spriteSheetImg.src = spriteSheet;
      spriteSheetImg.onload = () => {
        this.builderMap.set(spriteSheetImg, new Map<string, SpriteData[]>());
        this.currentSpriteSheet = spriteSheetImg;
        resolve(this);
      };
    });
  }
}
