import { GUIContainer } from "../objects/guiContainer";
import GameScene from "../scenes/GameScene";

export const SetKeyboardKeys = (scene: GameScene, inputField: GUIContainer) => {
  scene.input.keyboard.removeAllKeys(true);
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE)
    .on("down", (event: Phaser.Input.Keyboard.Key) => {
      scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
    });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE).on("down", (event: Phaser.Input.Keyboard.Key) => {
    scene.SetAnswerText(event.originalEvent.key, inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on("down", () => {
    scene.CheckAnswer(inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE).on("down", () => {
    scene.ResetAnswerText(inputField.textObject, inputField.sprite);
  });
  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE).on("down", () => {
    scene.ResetAnswerText(inputField.textObject, inputField.sprite);
  });
};
