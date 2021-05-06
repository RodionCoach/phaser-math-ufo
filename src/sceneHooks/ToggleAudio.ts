import { IToggleAudioConfig } from "../types";

export const ToggleAudio = ({ scene, texture, frameOn, frameOff }: IToggleAudioConfig) => {
  if (!scene.sound.mute) {
    scene.soundControl.setTexture(texture, frameOff);
  } else {
    scene.soundControl.setTexture(texture, frameOn);
  }

  const sound = <Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSoundManager>scene.sound;
  sound.setMute(!scene.sound.mute);
};
