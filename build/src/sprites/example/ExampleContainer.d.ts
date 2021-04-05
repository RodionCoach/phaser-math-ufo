export default class ExampleContainer extends Phaser.GameObjects.Container {
    tweenMove: Phaser.Tweens.Tween;
    tweenSave: Phaser.Tweens.Tween;
    tweenMissed: Phaser.Tweens.Tween;
    sprite: Phaser.GameObjects.Sprite;
    additionalSprite: Phaser.GameObjects.Sprite;
    colorFactor: number;
    textObject: Phaser.GameObjects.Text;
    textObjectForSign: Phaser.GameObjects.Text;
    divisionSign: Phaser.GameObjects.Sprite;
    canMove: boolean;
    answer: number;
    rt: Phaser.GameObjects.RenderTexture;
    spriteText: Phaser.GameObjects.Sprite;
    static config: {
        startPos: {
            x: number;
            y: number;
        };
    };
    constructor(scene: Phaser.Scene, x: number, y: number);
    UpdateExampleTexture(): void;
    SetStatus(status: boolean, answer: number): void;
    SetTweenMissed(): void;
    SetTweenSave(): void;
    ResetAfterAnimation(): void;
    RecolorExample(): void;
}
