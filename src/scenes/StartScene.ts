import { DEPTH_LAYERS, GAME_RESOLUTION } from "../utils/constants";
import { BUTTON_STYLE, TITLE_STYLE } from "../utils/styles";
import { SetAudio } from "../sceneHooks/SetAudio";
import SoundButton from "../objects/soundButton";
import { GUIContainer } from "../objects/guiContainer";

class StartScene extends Phaser.Scene {
  soundControl: SoundButton;

  constructor() {
    super({
      key: "StartScene",
    });
  }

  create() {
    this.add.image(0, 0, "backgroundMenu", "menu_background.png").setOrigin(0);
    this.add.image(GAME_RESOLUTION.width / 2, 71, "backgroundMenu", "frame_title.png").setOrigin(0.5, 0);
    this.add
      .text(GAME_RESOLUTION.width / 2, 115, "SPACE MOO", TITLE_STYLE)
      .setOrigin(0.5, 0)
      .setDepth(DEPTH_LAYERS.one);

    this.soundControl = new SoundButton({
      scene: this,
      x: 15,
      y: 15,
      texture: "volume",
      frameOn: "default.png",
      frameOff: "pressed.png",
    });

    this.sound.add("background");

    const containerButton = this.add
      .container(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2 + 100)
      .setName("containerButton")
      .setDepth(DEPTH_LAYERS.one);

    const newGameButton = new GUIContainer({
      scene: this,
      name: "newGameButton",
      x: 0,
      y: -40,
      text: "NEW GAME",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.StartGame();
      },
    });
    containerButton.add(newGameButton);

    const rulesGameButton = new GUIContainer({
      scene: this,
      name: "rulesGameButton",
      x: 0,
      y: 40,
      text: "HOW TO PLAY",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.HowToPlay();
      },
    });
    containerButton.add(rulesGameButton);

    SetAudio(this, "background", 1.0, true);
  }

  StartGame() {
    this.scene.start("CountdownScene");
  }

  HowToPlay() {
    this.scene.start("RulesScene");
  }
}

export default StartScene;
