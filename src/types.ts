import GameScene from "./scenes/GameScene";
import PauseScene from "./scenes/PauseScene";
import RulesScene from "./scenes/RulesScene";
import StartScene from "./scenes/StartScene";
import EndScene from "./scenes/EndScene";

export interface IInitData {
  currentScore: number;
}

export interface IScore {
  pts: number;
  textObject: Phaser.GameObjects.Text;
}

type AllScenes = GameScene | PauseScene | RulesScene | StartScene | EndScene;

export interface IToggleAudioConfig {
  scene: AllScenes;
  texture: string;
  frameOn: string;
  frameOff: string;
}
