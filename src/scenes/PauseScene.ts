import { DEPTH_LAYERS, GAME_RESOLUTION } from "../utils/constants";
import { BUTTON_STYLE } from "../utils/styles";
import SoundButton from "../objects/soundButton";
import { GUIContainer } from "../objects/guiContainer";

class PauseScene extends Phaser.Scene {
  soundControl: SoundButton;

  constructor() {
    super({
      key: "PauseScene",
    });
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

    const containerButton = this.add
      .container(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2)
      .setName("containerButton")
      .setDepth(DEPTH_LAYERS.one);

    const distanceBetweenButtons = 40;

    const buttonRestart = new GUIContainer({
      scene: this,
      name: "buttonRestart",
      x: 0,
      y: 0,
      text: "RESTART",
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
    containerButton.add(buttonRestart);

    const buttonResume = new GUIContainer({
      scene: this,
      name: "buttonResume",
      x: 0,
      y: -buttonRestart.sprite.height - distanceBetweenButtons,
      text: "RESUME",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.ResumeGame();
      },
    });
    containerButton.add(buttonResume);

    const buttonReturn = new GUIContainer({
      scene: this,
      name: "buttonReturn",
      x: 0,
      y: buttonRestart.sprite.height + distanceBetweenButtons,
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
    containerButton.add(buttonReturn);
  }

  ResumeGame() {
    this.scene.resume("GameScene");
    this.scene.stop("PauseScene");
  }

  RestartGame() {
    this.sound.stopAll();
    this.scene.stop("GameScene");
    this.scene.start("CountdownScene");
  }

  ReturnToMainMenu() {
    this.sound.stopAll();
    this.scene.stop("GameScene");
    this.scene.stop("PauseScene");
    this.scene.start("StartScene");
  }
}

export default PauseScene;
