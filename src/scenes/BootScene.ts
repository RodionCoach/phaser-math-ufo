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

    this.load.multiatlas("lily", `${PATH_SPRITES}/lily/lily.json`, `${PATH_SPRITES}/lily`);
    this.load.multiatlas("inputField", `${PATH_SPRITES}/inputField/inputField.json`, `${PATH_SPRITES}/inputField`);
    this.load.multiatlas("actors", `${PATH_SPRITES}/actors/actors.json`, `${PATH_SPRITES}/actors`);
    this.load.multiatlas("background", `${PATH_SPRITES}/background/background.json`, `${PATH_SPRITES}/background`);
    this.load.multiatlas("gui", `${PATH_SPRITES}/gui/gui.json`, `${PATH_SPRITES}/gui`);
    this.load.multiatlas("buttonBackground", `${PATH_SPRITES}/button/button.json`, `${PATH_SPRITES}/button`);
    this.load.image("divisionSign", "./assets/img/divisionSign.png");
    this.load.image("answerButton", "./assets/img/GUI_digit_button.png");
    this.load.image("resetButton", "./assets/img/GUI_reset_btn.png");
    this.load.image("setButton", "./assets/img/GUI_submit_btn.png");
    this.load.image("cartoonWater", "./assets/img/cartoonWater.png");
    this.load.image("noiseWater", "./assets/img/noiseWater.png");
    this.load.image("noise", "./assets/img/noise.png");

    this.load.audio("background", "./assets/sounds/background.mp3");
    this.load.audio("solved", "./assets/sounds/solved_problem.mp3");
    this.load.audio("wrong", "./assets/sounds/wrong_answer.mp3");
    this.load.audio("missed", "./assets/sounds/missed_problem.mp3");
    this.load.audio("gameOver", "./assets/sounds/end_of_the_game.mp3");

    this.load.glsl("cartoonWaterShader", "./assets/shaders/cartoonWater.glsl");

    this.load.rexWebFont({
      google: {
        families: ["Lato:400,700,900"],
      },
    });
  }
}

export default BootScene;
