import ExampleContainer from "./ExampleContainer";
import { exampleGenerator } from "../../utils/generators/numbers";
import { EXAMPLE_BOUNDARY_LIMIT, TOTAL_LILIES, DEPTH_LAYERS } from "../../utils/constants";
import { EXAMPLES_STYLE } from "../../utils/styles";

export default class ExampleSpawner extends Phaser.GameObjects.GameObject {
  speedIncrementer: number;
  delta: number;
  currentLiliesCount: number;
  examples: ExampleContainer[];
  notGuessedCount: number;
  guessedCount: number;
  visibleLiliesCount: number;

  constructor(scene: Phaser.Scene) {
    super(scene, "");

    this.speedIncrementer = 1;
    this.delta = 1;
    this.currentLiliesCount = 0;
    this.examples = [];
    this.notGuessedCount = 0;
    this.guessedCount = 0;
    this.visibleLiliesCount = 0;
    for (let i = 0; i < TOTAL_LILIES; i++) {
      const exampleContainer: ExampleContainer = new ExampleContainer(
        scene,
        ExampleContainer.config.startPos.x,
        ExampleContainer.config.startPos.y,
      );
      exampleContainer.setDepth(DEPTH_LAYERS.two);
      exampleContainer.sprite.setTexture("cow", "poses/0001.png").setScale(1.2, 1.2);
      exampleContainer.textObject.setStyle(EXAMPLES_STYLE).setOrigin(1, 0.5).setPosition(20, 0);
      exampleContainer.textObjectForSign.setStyle(EXAMPLES_STYLE).setOrigin(0, 0.5);
      this.examples.push(exampleContainer);
    }
  }

  checkSomeExample(answerText: number): number {
    const guessedExamples = this.examples.filter(example => example.answer === answerText);

    guessedExamples.forEach(exampleContainer => {
      this.visibleLiliesCount -= 1;
      exampleContainer.answer = -1;
      exampleContainer.setDepth(DEPTH_LAYERS.one);
      exampleContainer.tweenMove.stop();
      exampleContainer.spriteText.setVisible(false);
      exampleContainer.textObject.setText("");
      exampleContainer.textObjectForSign.setText("");
      exampleContainer.additionalSprite.setVisible(true);
      exampleContainer.tweenSave = this.scene.tweens.add({
        targets: exampleContainer,
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
        onUpdate: (tween, target) => {
          target.sprite.setTint(
            Phaser.Display.Color.GetColor(
              exampleContainer.colorFactor * 255,
              exampleContainer.colorFactor * 255,
              Phaser.Math.Clamp(exampleContainer.colorFactor + 0.18, 0.0, 1.0) * 255,
            ),
          );
        },
        onComplete: () => {
          exampleContainer.setDepth(DEPTH_LAYERS.two).setScale(1.1, 1.1);
          exampleContainer.alpha = 1.0;
          exampleContainer.colorFactor = 1.0;
          exampleContainer.sprite.clearTint();
          exampleContainer.additionalSprite.setVisible(false);
        },
      });

      this.speedIncrementer += (this.delta / 1000) * 0.05;
    });

    return guessedExamples.length;
  }

  GetExample(HeartsCallBack = () => {}) {
    this.currentLiliesCount %= TOTAL_LILIES;
    const randInt = Phaser.Math.RND.integerInRange(186, 650);
    const exampleObject = this.examples[this.currentLiliesCount];
    this.visibleLiliesCount += 1;
    const example = exampleGenerator();
    exampleObject.SetStatus(true, example.answer);
    exampleObject.x = randInt;
    exampleObject.spriteText.setVisible(true);
    exampleObject.textObject.setText(`${example.number1}\n${example.number2}`);
    exampleObject.textObjectForSign.setText(example.sign).setPosition(-exampleObject.textObject.width, 0);
    this.currentLiliesCount += 1;
    exampleObject.sprite.setTexture("cow", `poses/000${Phaser.Math.Between(1, 6)}.png`);
    exampleObject.additionalSprite.setTexture("cow", "moo/moo.png");
    exampleObject.additionalSprite.setPosition(10, -60);
    exampleObject.UpdateExampleTexture();
    exampleObject.tweenMove = this.scene.tweens.add({
      targets: exampleObject,
      y: EXAMPLE_BOUNDARY_LIMIT,
      duration: 10000,
      ease: "Linear",
      onComplete: () => {
        exampleObject.answer = -1;
        this.notGuessedCount++;
        HeartsCallBack();
        this.visibleLiliesCount -= 1;
        exampleObject.spriteText.setVisible(false);
        exampleObject.textObject.setText("");
        exampleObject.textObjectForSign.setText("");
        exampleObject.SetStatus(false, -1);
      },
    });
  }
}
