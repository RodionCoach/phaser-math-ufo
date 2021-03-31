import { DEPTH_LAYERS, GAME_RESOLUTION } from "../utils/constants";
import { BUTTON_STYLE, SCORE_TITLE_STYLE, SCORE_NUMBERS_STYLE, SCORE_TEXT_STYLE } from "../utils/styles";
import { SetAudio } from "../sceneHooks/SetAudio";
import SoundButton from "../objects/soundButton";
import { GUIContainer } from "../objects/guiContainer";
import { InitData } from "../types";

class EndScene extends Phaser.Scene {
  currentScore: number;
  soundControl: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "EndScene",
    });

    this.currentScore = 0;
  }

  init(data: InitData) {
    this.currentScore = data.currentScore;
  }

  create() {
    this.soundControl = new SoundButton({
      scene: this,
      x: 20,
      y: 20,
      texture: "gui",
      frameOn: "sound_on.svg",
      frameOff: "sound_off_light.svg",
    });
    this.add.shader(
      "cartoonWaterShader",
      GAME_RESOLUTION.width / 2,
      GAME_RESOLUTION.height / 2,
      GAME_RESOLUTION.width,
      GAME_RESOLUTION.height,
      ["cartoonWater", "noiseWater", "noise"],
    );
    this.add.image(770, 670, "actors", "water_lily.png").setOrigin(0).setAngle(-135.0).setFlipY(true);

    this.sound.add("gameOver");

    const container = this.add
      .container(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2)
      .setName("container")
      .setDepth(DEPTH_LAYERS.one);

    const distanceBetweenButtons = 40;

    const yourScoreText = this.add.text(0, -180, "Your Score:", SCORE_TITLE_STYLE).setOrigin(0.5);
    container.add(yourScoreText);
    const scoreText = this.add.text(0, -130, `${this.currentScore}`, SCORE_NUMBERS_STYLE).setOrigin(0.5);
    container.add(scoreText);
    const bestScoreText = this.add.text(0, -50, this.IsBestScore(), SCORE_TEXT_STYLE).setOrigin(0.5);
    container.add(bestScoreText);

    const buttonRestart = new GUIContainer({
      scene: this,
      name: "buttonRestart",
      x: 0,
      y: 86,
      text: "PLAY AGAIN",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.RestartGame();
      },
    });
    container.add(buttonRestart);

    const buttonReturn = new GUIContainer({
      scene: this,
      name: "buttonReturn",
      x: 0,
      y: 86 + buttonRestart.sprite.height + distanceBetweenButtons,
      text: "MAIN MENU",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.ReturnToMainMenu();
      },
    });
    container.add(buttonReturn);

    SetAudio(this, "gameOver", 1.0, false);
  }

  IsBestScore() {
    let prevBestScore = window.localStorage.getItem("best_score");
    if (prevBestScore === "undefined" || prevBestScore === null) {
      prevBestScore = "0";
    }

    if (+prevBestScore < this.currentScore) {
      window.localStorage.setItem("best_score", `${this.currentScore}`);

      return "It is your best score!";
    }

    return `Your best Score is ${prevBestScore}`;
  }

  RestartGame() {
    this.sound.stopAll();
    this.scene.start("CountdownScene");
  }

  ReturnToMainMenu() {
    this.sound.stopAll();
    this.scene.start("StartScene");
  }
}

export default EndScene;
