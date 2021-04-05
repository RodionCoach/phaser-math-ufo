import ExampleContainer from "./ExampleContainer";
export default class ExampleSpawner extends Phaser.GameObjects.GameObject {
    speedIncrementer: number;
    delta: number;
    currentLiliesCount: number;
    examples: ExampleContainer[];
    notGuessedCount: number;
    guessedCount: number;
    visibleLiliesCount: number;
    constructor(scene: Phaser.Scene);
    checkSomeExample(answerText: number): number;
    GetExample(HeartsCallBack?: () => void): void;
}
