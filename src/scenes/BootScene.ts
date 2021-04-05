import { PATH_SPRITES } from "../utils/constants";

class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene",
    });
  }
  preload() {
    const progressBox = this.add.graphics();
    const progress = this.add.graphics();

    // Register a load progress event to show a load bar
    this.load.on("progress", (value: number) => {
      progress.clear();
      progressBox.fillStyle(0xfffffff, 0.8);
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, +this.sys.game.config.height / 2, +this.sys.game.config.width * value, 60);
    });

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on("complete", () => {
      progress.destroy();
      progressBox.destroy();
      this.scene.start("StartScene");
    });

    this.load.multiatlas("background0", `${PATH_SPRITES}/background/background0.json`, `${PATH_SPRITES}/background`);
    this.load.multiatlas("background", `${PATH_SPRITES}/background/background.json`, `${PATH_SPRITES}/background`);
    this.load.multiatlas(
      "backgroundMenu",
      `${PATH_SPRITES}/background/backgroundMenu.json`,
      `${PATH_SPRITES}/background`,
    );
    this.load.multiatlas("buttonBackground", `${PATH_SPRITES}/button/button.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("volume", `${PATH_SPRITES}/button/volume.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("set", `${PATH_SPRITES}/button/set.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("reset", `${PATH_SPRITES}/button/reset.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("pause", `${PATH_SPRITES}/button/pause.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("digital", `${PATH_SPRITES}/button/digital.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("health", `${PATH_SPRITES}/gui/health.json`, `${PATH_SPRITES}/gui`);
    this.load.multiatlas("inputField", `${PATH_SPRITES}/gui/inputField.json`, `${PATH_SPRITES}/gui`);
    this.load.image("divisionSign", "./assets/img/divisionSign.png");
    this.load.multiatlas("cow", `${PATH_SPRITES}/cow/cow.json`, `${PATH_SPRITES}/cow`);

    this.load.audio("background", "./assets/sounds/background.mp3");
    this.load.audio("solved", "./assets/sounds/solved_problem.mp3");
    this.load.audio("wrong", "./assets/sounds/wrong_answer.mp3");
    this.load.audio("missed", "./assets/sounds/missed_problem.mp3");
    this.load.audio("gameOver", "./assets/sounds/end_of_the_game.mp3");
    this.load.audio("ufoBeam", "./assets/sounds/ufo_beam.mp3");

    this.load.glsl("ufoLightShader", "./assets/shaders/ufoLight.glsl");
    this.load.image("backForShader", "./assets/img/background.png");
    this.load.image("lightForShader", "./assets/img/light.png");

    this.load.rexWebFont({
      google: {
        families: ["Lato:400,700,900"],
      },
    });
  }
}

export default BootScene;
