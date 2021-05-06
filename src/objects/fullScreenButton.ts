import { DEPTH_LAYERS } from "../utils/constants";
import { IToggleAudioConfig } from "../types";

interface IFullScereenButton extends IToggleAudioConfig {
  x: number;
  y: number;
}

export default class FullScreenButton extends Phaser.GameObjects.Image {
  constructor({ scene, x, y, texture, frameOn, frameOff }: IFullScereenButton) {
    super(scene, x, y, texture, scene.scale.isFullscreen ? frameOff : frameOn);
    scene.add.existing(this);

    this.setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (scene.scale.isFullscreen) {
          scene.scale.stopFullscreen();
          scene.fullScreenControl.setTexture(texture, frameOn);
        } else {
          scene.scale.startFullscreen();
          scene.fullScreenControl.setTexture(texture, frameOff);
        }
      })
      ?.setDepth(DEPTH_LAYERS.four);
  }
}
