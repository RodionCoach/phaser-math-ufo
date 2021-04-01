import { DEPTH_LAYERS, GAME_RESOLUTION } from "../utils/constants";
import { BUTTON_STYLE, SCORE_TITLE_STYLE, SCORE_NUMBERS_STYLE, SCORE_TEXT_STYLE } from "../utils/styles";
import { SetAudio } from "../sceneHooks/SetAudio";
import SoundButton from "../objects/soundButton";
import { GUIContainer } from "../objects/guiContainer";
import { IInitData } from "../types";

class EndScene extends Phaser.Scene {
  currentScore: number;
  soundControl: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "EndScene",
    });

    this.currentScore = 0;
  }

  init(data: IInitData) {
    this.currentScore = data.currentScore;
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

    this.sound.add("gameOver");

    const container = this.add
      .container(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2)
      .setName("container")
      .setDepth(DEPTH_LAYERS.one);

    const distanceBetweenButtons = 30;

    this.add.image(0, 0, "backgroundMenu", "menu_background.png").setOrigin(0);
    this.add.image(GAME_RESOLUTION.width / 2, 71, "backgroundMenu", "frame_score.png").setOrigin(0.5, 0);
    const bestScorePlane = this.add
      .image(GAME_RESOLUTION.width / 2, 215, "backgroundMenu", "frame_newrecord.png")
      .setOrigin(0.5, 0)
      .setVisible(false);

    const yourScoreText = this.add.text(0, -190, "YOUR SCORE", SCORE_TITLE_STYLE).setOrigin(0.5);
    container.add(yourScoreText);
    const scoreText = this.add.text(0, -135, `${this.currentScore}`, SCORE_NUMBERS_STYLE).setOrigin(0.5);
    container.add(scoreText);
    const bestScoreText = this.add.text(0, -260, this.IsBestScore(bestScorePlane), SCORE_TEXT_STYLE).setOrigin(0.5);
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

  IsBestScore(bestScorePlane: Phaser.GameObjects.Image) {
    let prevBestScore = window.localStorage.getItem("best_score");
    if (prevBestScore === "undefined" || prevBestScore === null) {
      prevBestScore = "0";
    }

    if (+prevBestScore < this.currentScore) {
      window.localStorage.setItem("best_score", `${this.currentScore}`);
      bestScorePlane.setVisible(true);
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
