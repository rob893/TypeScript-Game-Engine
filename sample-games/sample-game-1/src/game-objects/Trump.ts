import {
  Animation,
  Animator,
  Component,
  GameObject,
  Layer,
  NavAgent,
  PhysicalMaterial,
  PrefabSettings,
  RectangleCollider,
  SpriteSheet
} from '@entropy-engine/entropy-game-engine';
import { CharacterAnimations } from '../interfaces/CharacterAnimations';
import { CharacterAnimator } from '../components/characters/CharacterAnimator';
import { EnemyMotor } from '../components/characters/npc/EnemyMotor';

export class Trump extends GameObject {
  protected buildInitialComponents(): Component[] {
    const components: Component[] = [];

    const collider = new RectangleCollider(this, null, 60, 60, 0, -5);
    collider.physicalMaterial = PhysicalMaterial.bouncy;
    components.push(collider);

    const navAgent = new NavAgent(this, this.terrain.navGrid);
    components.push(navAgent);

    const trumpIdleFrames = this.assetPool.getAsset<SpriteSheet>('trumpIdleSpriteSheet').getFrames(4);

    const initialAnimation = new Animation(trumpIdleFrames, 0.1);
    const animator = new Animator(this, 75, 75, initialAnimation);
    components.push(animator);

    const trumpRunSpriteSheet = this.assetPool.getAsset<SpriteSheet>('trumpRunSpriteSheet');
    const trumpIdleSpriteSheet = this.assetPool.getAsset<SpriteSheet>('trumpIdleSpriteSheet');

    const runRightAnimation = new Animation(trumpRunSpriteSheet.getFrames(2), 0.075);
    const runLeftAnimation = new Animation(trumpRunSpriteSheet.getFrames(4), 0.075);
    const idleAnimation = new Animation(trumpIdleSpriteSheet.getFrames(1), 0.1);

    const animations: CharacterAnimations = {
      rightAttackAnimations: [idleAnimation],
      leftAttackAnimations: [idleAnimation],
      runLeftAnimation: runLeftAnimation,
      runRightAnimation: runRightAnimation,
      runDownAnimation: runLeftAnimation,
      runUpAnimation: runRightAnimation,
      runUpLeftAnimation: runLeftAnimation,
      runUpRightAnimation: runRightAnimation,
      runDownLeftAnimation: runLeftAnimation,
      runDownRightAnimation: runRightAnimation,
      idleLeftAnimation: idleAnimation,
      idleRightAnimation: idleAnimation,
      jumpLeftAnimation: idleAnimation,
      jumpRightAnimation: idleAnimation,
      dieLeftAnimation: idleAnimation,
      dieRightAnimation: idleAnimation
    };

    const characterAnimator = new CharacterAnimator(this, animator, animations);
    components.push(characterAnimator);

    components.push(new EnemyMotor(this, navAgent, characterAnimator));

    return components;
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 200,
      y: 300,
      rotation: 0,
      id: 'trump',
      tag: '',
      layer: Layer.Default
    };
  }
}
