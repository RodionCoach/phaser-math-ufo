import { IInitData } from "../types";
declare class EndScene extends Phaser.Scene {
    currentScore: number;
    soundControl: Phaser.GameObjects.Image;
    constructor();
    init(data: IInitData): void;
    create(): void;
    IsBestScore(bestScorePlane: Phaser.GameObjects.Image): string;
    RestartGame(): void;
    ReturnToMainMenu(): void;
}
export default EndScene;
