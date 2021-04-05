import { DEPTH_LAYERS, SIGNS } from "../../utils/constants";

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

  static config = {
    startPos: {
      x: 0,
      y: 650,
    },
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.colorFactor = 1;

    this.sprite = scene.add.sprite(0, 0, "", "").disableInteractive();
    this.add(this.sprite);
    this.textObject = scene.add.text(0, 0, "", {}).disableInteractive().setVisible(false);
    this.textObjectForSign = scene.add.text(0, 0, "", {}).disableInteractive().setVisible(false);

    this.divisionSign = scene.add
      .sprite(0, 0, "divisionSign")
      .setOrigin(0.5, 0.5)
      .setScale(1.1, 1.1)
      .disableInteractive()
      .setVisible(false);
    this.add(this.divisionSign);

    this.additionalSprite = scene.add.sprite(0, 0, "", "").disableInteractive().setVisible(false);
    this.add(this.additionalSprite);

    this.canMove = false;

    this.rt = this.scene.add.renderTexture(400, 300, 128, 128).setVisible(false);
    this.rt.saveTexture("spriteText");
    this.spriteText = this.scene.add.sprite(-17, -52, "spriteText");
    this.add(this.spriteText);
  }

  UpdateExampleTexture() {
    this.rt.clear();
    this.rt.beginDraw();
    this.rt.batchDraw(this.textObject, 64 + 23, 64);
    if (this.textObjectForSign.text !== SIGNS[3]) {
      this.rt.batchDraw(this.textObjectForSign, 64 - 37, 64);
    } else {
      this.rt.batchDraw(this.divisionSign, 64 - 28, 65);
    }
    this.rt.endDraw();
  }

  SetStatus(status: boolean, answer: number) {
    this.canMove = status;
    this.y = ExampleContainer.config.startPos.y;
    if (status) {
      this.answer = answer;
    }
  }

  SetTweenMissed() {
    this.tweenMissed = this.scene.tweens.add({
      targets: this,
      props: {
        colorFactor: {
          value: 0,
          duration: 150,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Liner",
        },
        alpha: {
          value: 0.8,
          duration: 300,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Quad.easeInOut",
        },
        scaleX: {
          value: "0.2",
          duration: 300,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Quad.easeIn",
        },
        scaleY: {
          value: "0.2",
          duration: 300,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Quad.easeIn",
        },
      },
      onUpdate: () => {
        this.RecolorExample();
      },
      onComplete: () => {
        this.ResetAfterAnimation();
        this.SetStatus(false, -1);
      },
    });
  }

  SetTweenSave() {
    this.tweenSave = this.scene.tweens.add({
      targets: this,
      props: {
        colorFactor: {
          value: 0,
          duration: 850,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Liner",
        },
        x: {
          value: {
            getEnd: (target, key, value) => {
              return value + 125 * (Math.random() - 0.5);
            },
          },
          duration: 1000,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Liner",
        },
        y: {
          value: 800,
          duration: 1000,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Back.easeIn",
        },
        alpha: {
          value: 0.8,
          duration: 1000,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Quad.easeInOut",
        },
        scaleX: {
          value: "0.2",
          duration: 1000,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Quad.easeIn",
        },
        scaleY: {
          value: "0.2",
          duration: 1000,
          yoyo: false,
          repeat: 0,
          loop: -1,
          ease: "Quad.easeIn",
        },
      },
      onUpdate: () => {
        this.RecolorExample();
      },
      onComplete: () => {
        this.ResetAfterAnimation();
        this.additionalSprite.setVisible(false);
      },
    });
  }

  ResetAfterAnimation() {
    this.setDepth(DEPTH_LAYERS.two).setScale(1.1, 1.1);
    this.alpha = 1.0;
    this.colorFactor = 1.0;
    this.sprite.clearTint();
  }

  RecolorExample() {
    this.sprite.setTint(
      Phaser.Display.Color.GetColor(
        this.colorFactor * 255,
        this.colorFactor * 255,
        Phaser.Math.Clamp(this.colorFactor + 0.18, 0.0, 1.0) * 255,
      ),
    );
  }
}
