export const signGenerator = (signArray: string[]): string => {
  return signArray[Phaser.Math.Between(0, signArray.length - 1)];
};
