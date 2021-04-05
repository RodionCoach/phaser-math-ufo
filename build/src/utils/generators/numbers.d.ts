interface IExample {
    number1: number;
    sign: string;
    number2: number;
    answer: number;
}
declare type Example = (sign?: string, max?: number) => IExample;
export declare const exampleGenerator: Example;
export {};
