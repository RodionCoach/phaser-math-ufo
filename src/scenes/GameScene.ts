import ExampleSpawner from "../sprites/example/ExampleSpawner";
import { GUIContainer } from "../objects/guiContainer";
import { SetKeyboardKeys } from "../sceneHooks/SetKeyboardKeys";
import { SetAudio } from "../sceneHooks/SetAudio";
import { GAME_RESOLUTION, GAME_HEALTH_POINTS, TOTAL_LILIES, DEPTH_LAYERS } from "../utils/constants";
import { SCORE_LABEL_STYLE, INPUT_NUMBER_STYLE, BUTTON_NUMBER_STYLE, SCORE_STYLE } from "../utils/styles";
import SoundButton from "../objects/soundButton";
import { IScore } from "../types";

class GameScene extends Phaser.Scene {
  currentLifes: number;
  prevHealthPoints: number;
  heartsGroup: Phaser.GameObjects.Container;
  exampleSpawner: ExampleSpawner;
  plusPts: Phaser.GameObjects.Text;
  soundControl: SoundButton;
  prevNotGuessed: number;
  score: IScore;

  constructor() {
    super({
      key: "GameScene",
    });

    this.currentLifes = GAME_HEALTH_POINTS;
    this.prevHealthPoints = 0;
  }

  create() {
    this.soundControl = new SoundButton({
      scene: this,
      x: 15,
      y: 15,
      texture: "volume",
      frameOn: "default.png",
      frameOff: "pressed.png",
    });
    const pauseControl = this.add
      .image(785, 15, "pause", "default.png")
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      ?.setDepth(DEPTH_LAYERS.four);
    pauseControl.on("pointerdown", () => {
      this.scene.launch("PauseScene");
      this.scene.pause();
    });

    // this.add.image(0, 0, "background0", "background.png").setOrigin(0).setDepth(DEPTH_LAYERS.zero);
    // this.add.image(0, 0, "background0", "light.png").setOrigin(0).setDepth(DEPTH_LAYERS.zero);

    this.add.shader(
      "ufoLightShader",
      GAME_RESOLUTION.width / 2,
      GAME_RESOLUTION.height / 2,
      GAME_RESOLUTION.width,
      GAME_RESOLUTION.height,
      ["backForShader", "lightForShader"],
    );

    this.add
      .image(GAME_RESOLUTION.width / 2, 0, "background", "ship.png")
      .setOrigin(0.5, 0)
      .setDepth(DEPTH_LAYERS.three);
    this.add.image(0, 0, "background", "background_2.png").setOrigin(0).setDepth(DEPTH_LAYERS.three);
    this.add.image(800, 315, "background", "frame_right.png").setOrigin(1, 0).setDepth(DEPTH_LAYERS.three);
    this.add.image(0, 521, "background", "frame_left.png").setOrigin(0).setDepth(DEPTH_LAYERS.three);

    this.plusPts = this.add
      .text(43, 500, "", SCORE_STYLE)
      .setOrigin(0.5)
      .setDepth(DEPTH_LAYERS.three)
      .setVisible(false);
    this.add.text(17, 528, "SCORE", SCORE_LABEL_STYLE).setOrigin(0).setDepth(DEPTH_LAYERS.three);

    this.sound.add("background");
    this.sound.add("wrong");
    this.sound.add("missed");
    this.sound.add("solved");
    this.sound.add("ufoBeam");

    this.heartsGroup = this.add.container(756, 331).setName("heartsGroup").setDepth(DEPTH_LAYERS.three);
    for (let i = 0; i < this.currentLifes; i++) {
      const heartFilled: Phaser.GameObjects.Sprite = this.add
        .sprite(0, i * 50, "health", "on.png")
        .setOrigin(0, 0)
        .disableInteractive();
      this.heartsGroup.add(heartFilled);
    }

    const containerInputGUI = this.add
      .container(GAME_RESOLUTION.width / 2, 477)
      .setName("containerInputGUI")
      .setDepth(DEPTH_LAYERS.three);

    const inputField = new GUIContainer({
      scene: this,
      name: "inputField",
      x: 0,
      y: 0,
      text: "",
      textStyle: INPUT_NUMBER_STYLE,
      texture: "inputField",
      defaultFrame: "right.png",
      depth: DEPTH_LAYERS.three,
    });
    inputField.sprite.disableInteractive();
    containerInputGUI.add(inputField);

    const resetButton = new GUIContainer({
      scene: this,
      name: "resetButton",
      x: -(inputField.sprite.width / 2) - 20,
      y: 0,
      text: "",
      texture: "reset",
      defaultFrame: "default.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.three,
      pointerDown: () => {
        this.ResetAnswerText(inputField.textObject, inputField.sprite);
      },
    });
    containerInputGUI.add(resetButton);

    const setButton = new GUIContainer({
      scene: this,
      name: "setButton",
      x: inputField.sprite.width / 2 + 20,
      y: 0,
      text: "",
      texture: "set",
      defaultFrame: "default.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.three,
      pointerDown: () => {
        this.CheckAnswer(inputField.textObject, inputField.sprite);
      },
    });
    containerInputGUI.add(setButton);

    const containerDigitalGUI = this.add
      .container(GAME_RESOLUTION.width / 2 - 262, 557)
      .setName("containerDigitalGUI")
      .setDepth(DEPTH_LAYERS.three);
    for (let i = 0; i < 10; i++) {
      const digitalButton = new GUIContainer({
        scene: this,
        name: `digital-${i}`,
        x: i === 0 ? 9 * 62 : (i - 1) * 62,
        y: 0,
        text: `${i}`,
        textStyle: BUTTON_NUMBER_STYLE,
        texture: "digital",
        defaultFrame: "default.png",
        pressedFrame: "pressed.png",
        depth: DEPTH_LAYERS.three,
        pointerDown: () => {
          this.SetAnswerText(`${i}`, inputField.textObject, inputField.sprite);
        },
      });
      digitalButton.textObject.setPosition(0, -10);
      containerDigitalGUI.add(digitalButton);
    }

    this.SpawnObjects();
    this.SetScore();
    SetAudio(this, "background", 0.4, true);
    SetKeyboardKeys(this, inputField);

    this.time.addEvent({
      delay: 20000,
      loop: true,
      callback: () => SetAudio(this, "ufoBeam", 0.05, false),
      callbackScope: this,
    });
  }

  update() {
    const renderedExample = Phaser.Math.Clamp(this.exampleSpawner.currentLiliesCount - 1, 0, TOTAL_LILIES);
    if (
      this.exampleSpawner.examples[renderedExample].y < +this.game?.config?.height - 200 ||
      !this.exampleSpawner.visibleLiliesCount
    ) {
      this.exampleSpawner.GetExample(() => {
        this.HeartsCallBack();
      });
    }

    this.exampleSpawner.examples.forEach(example => {
      if (example.tweenMove) {
        example.tweenMove.timeScale = this.exampleSpawner.speedIncrementer;
      }
      if (example.tweenSave) {
        example.tweenSave.timeScale = this.exampleSpawner.speedIncrementer;
      }
    });

    this.soundControl.setTexture("volume", this.sound.mute ? "pressed.png" : "default.png");
  }

  HeartsCallBack() {
    if (this.prevHealthPoints !== this.exampleSpawner.notGuessedCount) {
      this.prevNotGuessed = this.exampleSpawner.notGuessedCount;
      this.tweens.add({
        targets: this.heartsGroup.getAll()[this.prevNotGuessed - 1],
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 170,
        yoyo: true,
        ease: "Quad.easeInOut",
        repeat: 0,
        onComplete: () => {
          this.PlayMissedSound();
          const heart = <Phaser.GameObjects.Sprite>this.heartsGroup.getAll()[this.prevNotGuessed - 1];
          heart.setTexture("health", "off.png");
        },
      });
      if (this.prevNotGuessed === this.currentLifes) {
        //ToDo: move it out
        this.time.addEvent({
          delay: 500,
          callback: () => this.ResetGame(),
          callbackScope: this,
        });
      }
    }
  }

  SpawnObjects() {
    this.exampleSpawner = new ExampleSpawner(this);
    this.exampleSpawner.GetExample(() => {
      this.HeartsCallBack();
    });
  }

  ResetAnswerText(inputTextObject: Phaser.GameObjects.Text, inputFieldObject: Phaser.GameObjects.Sprite, text = "") {
    inputTextObject.setText(text);
    inputFieldObject.setTexture("inputField", "right.png");
  }

  WrongAnswerText(inputTextObject: Phaser.GameObjects.Text, inputFieldObject: Phaser.GameObjects.Sprite) {
    inputTextObject.setText("");
    inputFieldObject.setTexture("inputField", "wrong.png");
  }

  SetAnswerText(
    subString: string,
    inputTextObject: Phaser.GameObjects.Text,
    inputFieldObject: Phaser.GameObjects.Sprite,
  ) {
    this.ResetAnswerText(
      inputTextObject,
      inputFieldObject,
      inputTextObject.text.length <= 5 ? inputTextObject.text + subString : subString,
    );
  }

  CheckAnswer(inputTextObject: Phaser.GameObjects.Text, inputFieldObject: Phaser.GameObjects.Sprite) {
    if (inputTextObject.text !== "") {
      const guessedCount = this.exampleSpawner.checkSomeExample(+inputTextObject.text);
      if (guessedCount) {
        this.PlaySolvedSound();
        this.UpdateScore(100 * guessedCount);
        this.ResetAnswerText(inputTextObject, inputFieldObject, "");
      } else {
        this.PlayWrongSound();
        this.WrongAnswerText(inputTextObject, inputFieldObject);
      }
    } else {
      this.WrongAnswerText(inputTextObject, inputFieldObject);
    }
  }

  PlaySolvedSound() {
    this.sound.get("solved").play();
  }

  PlayWrongSound() {
    this.sound.get("wrong").play();
  }

  PlayMissedSound() {
    this.sound.get("missed").play({ volume: 0.5 });
  }

  SetScore() {
    this.score = {
      pts: 0,
      textObject: this.make
        .text({
          x: 43,
          y: 559,
          text: "0",
          origin: {
            x: 0.5,
            y: 0.5,
          },
          style: SCORE_STYLE,
          add: true,
        })
        .setDepth(DEPTH_LAYERS.three),
    };

    this.score.textObject.setText(`${this.score.pts}`);
  }

  UpdateScore(scores: number) {
    this.score.pts += scores;
    this.score.textObject.setText(`${this.score.pts}`);
    this.plusPts.setText(`+${scores}`).setVisible(true);
    this.time.addEvent({
      delay: 1000,
      callback: () => this.plusPts.setVisible(false),
      callbackScope: this,
    });
  }

  ResetGame() {
    this.scene.stop("GameScene");
    this.sound.stopAll();
    this.scene.start("EndScene", {
      currentScore: this.score.pts,
    });
  }
}

export default GameScene;
