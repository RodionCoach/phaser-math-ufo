import LilySpawner from "../sprites/lily/lilySpawner";
import { GUIContainer } from "../objects/guiContainer";
import { SetKeyboardKeys } from "../sceneHooks/SetKeyboardKeys";
import { SetAudio } from "../sceneHooks/SetAudio";
import { GAME_RESOLUTION, GAME_HEALTH_POINTS, TOTAL_LILIES, DEPTH_LAYERS } from "../utils/constants";
import { BUTTON_NUMBER_STYLE, SCORE_STYLE } from "../utils/styles";
import SoundButton from "../objects/soundButton";
import { Score } from "../types";

class GameScene extends Phaser.Scene {
  currentLifes: number;
  prevHealthPoints: number;
  heartsGroup: Phaser.GameObjects.Container;
  lilySpawner: LilySpawner;
  plusPts: Phaser.GameObjects.Text;
  soundControl: SoundButton;
  prevNotGuessed: number;
  score: Score;

  constructor() {
    super({
      key: "GameScene",
    });

    this.currentLifes = GAME_HEALTH_POINTS;
    this.prevHealthPoints = 0;
  }

  create() {
    this.soundControl = this.soundControl = new SoundButton({
      scene: this,
      x: 20,
      y: 20,
      texture: "gui",
      frameOn: "sound_on.svg",
      frameOff: "sound_off_light.svg",
    });
    const pauseControl = this.add
      .image(752, 24, "gui", "pause.svg")
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
      ?.setDepth(DEPTH_LAYERS.one);
    pauseControl.on("pointerdown", () => {
      this.scene.launch("PauseScene");
      this.scene.pause();
    });

    this.plusPts = this.add.text(60, 395, "", SCORE_STYLE).setOrigin(0.5).setDepth(DEPTH_LAYERS.one).setVisible(false);
    this.add
      .shader(
        "cartoonWaterShader",
        GAME_RESOLUTION.width / 2,
        GAME_RESOLUTION.height / 2,
        GAME_RESOLUTION.width,
        GAME_RESOLUTION.height,
        ["cartoonWater", "noiseWater", "noise"],
      )
      .setUniform("isFoam.value", 1.0);

    this.add.image(0, 0, "background", "sand_left_side.png").setOrigin(0);
    this.add.image(698, 0, "background", "sand_right_side.png").setOrigin(0);
    this.add.image(56, 347, "actors", "boat.png").setAngle(-5.5);
    this.add.text(60, 335, "Score", SCORE_STYLE).setOrigin(0.5).setDepth(DEPTH_LAYERS.one);

    this.add.image(0, 449, "actors", "bridge.png").setOrigin(0).setDepth(DEPTH_LAYERS.one);
    this.add.image(765, 483, "actors", "leaves_stones_right.png").setOrigin(0).setDepth(DEPTH_LAYERS.one);
    this.add.image(0, 541, "actors", "leaves_stones_left.png").setOrigin(0).setDepth(DEPTH_LAYERS.one);

    this.sound.add("background");
    this.sound.add("wrong");
    this.sound.add("missed");
    this.sound.add("solved");

    this.heartsGroup = this.add.container(765, 355).setName("heartsGroup").setDepth(DEPTH_LAYERS.one);
    for (let i = 0; i < this.currentLifes; i++) {
      const heartFilled: Phaser.GameObjects.Sprite = this.add
        .sprite(0, i * 30, "gui", "filled_heart.svg")
        .setOrigin(0.5, 0.5)
        .disableInteractive();
      this.heartsGroup.add(heartFilled);
    }

    const containerInputGUI = this.add
      .container(GAME_RESOLUTION.width / 2, 477)
      .setName("containerInputGUI")
      .setDepth(DEPTH_LAYERS.one);

    const inputField = new GUIContainer({
      scene: this,
      name: "inputField",
      x: 0,
      y: 0,
      text: "",
      textStyle: BUTTON_NUMBER_STYLE,
      texture: "gui",
      defaultFrame: "inpul_field.png",
      depth: DEPTH_LAYERS.one,
    });
    inputField.sprite.disableInteractive();
    containerInputGUI.add(inputField);

    const resetButton = new GUIContainer({
      scene: this,
      name: "resetButton",
      x: -(inputField.sprite.width / 2) - 40,
      y: 0,
      text: "",
      texture: "gui",
      defaultFrame: "reset_btn.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.ResetAnswerText(inputField.textObject, inputField.sprite);
      },
    });
    containerInputGUI.add(resetButton);

    const setButton = new GUIContainer({
      scene: this,
      name: "setButton",
      x: inputField.sprite.width / 2 + 40,
      y: 0,
      text: "",
      texture: "gui",
      defaultFrame: "submit_btn.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.CheckAnswer(inputField.textObject, inputField.sprite);
      },
    });
    containerInputGUI.add(setButton);

    const containerDigitalGUI = this.add
      .container(GAME_RESOLUTION.width / 2 - 316, 547)
      .setName("containerDigitalGUI")
      .setDepth(DEPTH_LAYERS.one);
    for (let i = 0; i < 10; i++) {
      const digitalButton = new GUIContainer({
        scene: this,
        name: `digital-${i}`,
        x: i === 0 ? 9 * 70 : (i - 1) * 70,
        y: 0,
        text: `${i}`,
        textStyle: BUTTON_NUMBER_STYLE,
        texture: "gui",
        defaultFrame: "digit_button.png",
        depth: DEPTH_LAYERS.one,
        pointerDown: () => {
          this.SetAnswerText(`${i}`, inputField.textObject, inputField.sprite);
        },
      });
      containerDigitalGUI.add(digitalButton);
    }

    this.SpawnObjects();
    this.SetScore();
    SetAudio(this, "background", 0.4, true);
    SetKeyboardKeys(this, inputField);
  }

  update() {
    const renderedLily = Phaser.Math.Clamp(this.lilySpawner.currentLiliesCount - 1, 0, TOTAL_LILIES);
    if (
      this.lilySpawner.lilies[renderedLily].y < +this.game?.config?.height - 200 ||
      !this.lilySpawner.visibleLiliesCount
    ) {
      this.lilySpawner.GetLily(() => {
        this.HeartsCallBack();
      });
    }

    this.lilySpawner.lilies.forEach(lily => {
      if (lily.tweenMove) {
        lily.tweenMove.timeScale = this.lilySpawner.speedIncrementer;
      }
    });

    this.soundControl.setTexture("gui", this.sound.mute ? "sound_off_light.svg" : "sound_on.svg");
  }

  HeartsCallBack() {
    if (this.prevHealthPoints !== this.lilySpawner.notGuessedCount) {
      this.prevNotGuessed = this.lilySpawner.notGuessedCount;
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
          heart.setTexture("gui", "empty_heart.svg");
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
    this.lilySpawner = new LilySpawner(this);
    this.lilySpawner.GetLily(() => {
      this.HeartsCallBack();
    });
  }

  ResetAnswerText(inputTextObject: Phaser.GameObjects.Text, inputFieldObject: Phaser.GameObjects.Sprite, text = "") {
    inputTextObject.setText(text);
    inputFieldObject.setTexture("inputField", "0001.png");
  }

  WrongAnswerText(inputTextObject: Phaser.GameObjects.Text, inputFieldObject: Phaser.GameObjects.Sprite) {
    inputTextObject.setText("");
    inputFieldObject.setTexture("inputField", "0002.png");
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
      const guessedCount = this.lilySpawner.checkSomeExample(+inputTextObject.text);
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
    this.sound.get("missed").play();
  }

  SetScore() {
    this.score = {
      pts: 0,
      textObject: this.make.text({
        x: 60,
        y: 355,
        text: "0",
        origin: {
          x: 0.5,
          y: 0.5,
        },
        style: SCORE_STYLE,
        add: true,
      }),
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
