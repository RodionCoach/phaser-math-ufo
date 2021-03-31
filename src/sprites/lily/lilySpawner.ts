import LilyContainer from "./lilyContainer";
import { exampleGenerator } from "../../utils/generators/numbers";
import { LILY_BONDARY_LIMIT, TOTAL_LILIES } from "../../utils/constants";
import { EXAMPLES_STYLE } from "../../utils/styles";

export default class LilySpawner extends Phaser.GameObjects.GameObject {
  speedIncrementer: number;
  delta: number;
  currentLiliesCount: number;
  lilies: LilyContainer[];
  notGuessedCount: number;
  guessedCount: number;
  visibleLiliesCount: number;

  constructor(scene: Phaser.Scene) {
    super(scene, "");

    scene.add.existing(this);
    this.speedIncrementer = 1;
    this.delta = 1;
    this.currentLiliesCount = 0;
    this.lilies = [];
    this.notGuessedCount = 0;
    this.guessedCount = 0;
    this.visibleLiliesCount = 0;
    const frameNamesWave = scene.anims.generateFrameNames("lily", {
      start: 1,
      end: 4,
      zeroPad: 4,
      prefix: "wave/",
      suffix: ".png",
    });
    scene.anims.create({ key: "wave", frames: frameNamesWave, frameRate: 4, repeat: -1 });

    const frameNamesSolved = scene.anims.generateFrameNames("lily", {
      start: 1,
      end: 11,
      zeroPad: 4,
      prefix: "solved/",
      suffix: ".png",
    });
    scene.anims.create({ key: "solved", frames: frameNamesSolved, frameRate: 10, repeat: 0 });

    const frameNamesLine = scene.anims.generateFrameNames("lily", {
      start: 1,
      end: 5,
      zeroPad: 4,
      prefix: "line/",
      suffix: ".png",
    });
    scene.anims.create({ key: "line", frames: frameNamesLine, frameRate: 15, repeat: 0 });

    for (let i = 0; i < TOTAL_LILIES; i++) {
      const lilyContainer: LilyContainer = new LilyContainer(
        scene,
        LilyContainer.config.startPos.x,
        LilyContainer.config.startPos.y,
      );
      lilyContainer.sprite.setTexture("lily", "wave/0001.png").setScale(1.2, 1.2);
      lilyContainer.sprite.on(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          lilyContainer.SetStatus(false, -1);
        },
        this,
      );
      lilyContainer.textObject.setStyle(EXAMPLES_STYLE).setOrigin(1, 0.5).setPosition(20, 0);
      lilyContainer.textObjectForSign.setStyle(EXAMPLES_STYLE).setOrigin(0, 0.5);
      this.lilies.push(lilyContainer);
    }
  }

  checkSomeExample(answerText: number): number {
    const guessedLilyIndex = this.lilies.filter(lily => lily.answer === answerText);

    guessedLilyIndex.forEach(lily => {
      this.visibleLiliesCount -= 1;
      lily.answer = -1;
      lily.tweenMove.stop();
      lily.spriteText.setVisible(false);
      lily.textObject.setText("");
      lily.textObjectForSign.setText("");
      lily.sprite.anims.play({
        key: "solved",
        frameRate: Phaser.Math.Between(15, 20),
      });
      this.speedIncrementer += (this.delta / 1000) * 0.05;
    });

    return guessedLilyIndex.length;
  }

  GetLily(HeartsCallBack = () => {}) {
    this.currentLiliesCount %= TOTAL_LILIES;
    const randInt = Phaser.Math.RND.integerInRange(186, 650);
    const lily = this.lilies[this.currentLiliesCount];
    this.visibleLiliesCount += 1;
    const example = exampleGenerator();
    lily.SetStatus(true, example.answer);
    lily.x = randInt;
    lily.spriteText.setVisible(true);
    lily.textObject.setText(`${example.number1}\n${example.number2}`);
    lily.textObjectForSign.setText(example.sign).setPosition(-lily.textObject.width, 0);
    this.currentLiliesCount += 1;
    lily.sprite.anims.play({
      key: "wave",
      frameRate: Phaser.Math.Between(2, 5),
    });

    lily.UpdateExampleTexture();
    lily.tweenMove = this.scene.tweens.add({
      targets: lily,
      y: LILY_BONDARY_LIMIT,
      duration: 10000,
      ease: "Linear",
      onComplete: () => {
        lily.answer = -1;
        this.notGuessedCount++;
        HeartsCallBack();
        this.visibleLiliesCount -= 1;
        lily.spriteText.setVisible(false);
        lily.textObject.setText("");
        lily.textObjectForSign.setText("");
        lily.sprite.anims.stop();
        lily.sprite.anims.play({
          key: "line",
          frameRate: 15,
        });
      },
    });
  }
}
