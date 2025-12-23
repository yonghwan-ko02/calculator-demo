import { describe, it, expect } from 'vitest';
import { CalculatorEngine } from '../CalculatorEngine';

describe('CalculatorEngine', () => {
    describe('기본 사칙연산', () => {
        it('덧셈을 정확히 계산해야 한다', () => {
            const engine = new CalculatorEngine();
            expect(engine.calculate('2 + 3')).toBe(5);
        });

        it('뺄셈을 정확히 계산해야 한다', () => {
            const engine = new CalculatorEngine();
            expect(engine.calculate('5 - 3')).toBe(2);
        });

        it('곱셈을 정확히 계산해야 한다', () => {
            const engine = new CalculatorEngine();
            expect(engine.calculate('4 * 3')).toBe(12);
        });

        it('나눗셈을 정확히 계산해야 한다', () => {
            const engine = new CalculatorEngine();
            expect(engine.calculate('12 / 4')).toBe(3);
        });
    });

    describe('연산자 우선순위', () => {
        it('곱셈이 덧셈보다 먼저 계산되어야 한다', () => {
            const engine = new CalculatorEngine();
            expect(engine.calculate('2 + 3 * 4')).toBe(14);
        });

        it('나눗셈이 뺄셈보다 먼저 계산되어야 한다', () => {
            const engine = new CalculatorEngine();
            expect(engine.calculate('10 - 6 / 2')).toBe(7);
        });
    });

    describe('괄호 연산', () => {
        it('괄호 안의 연산이 먼저 계산되어야 한다', () => {
            const engine = new CalculatorEngine();
            expect(engine.calculate('(2 + 3) * 4')).toBe(20);
        });

        it('중첩된 괄호를 처리해야 한다', () => {
            const engine = new CalculatorEngine();
            expect(engine.calculate('((2 + 3) * 4) / 2')).toBe(10);
        });
    });

    describe('에러 처리', () => {
        it('0으로 나누기 시 에러를 발생시켜야 한다', () => {
            const engine = new CalculatorEngine();
            expect(() => engine.calculate('5 / 0')).toThrow('0으로 나눌 수 없습니다');
        });

        it('잘못된 수식에 대해 에러를 발생시켜야 한다', () => {
            const engine = new CalculatorEngine();
            expect(() => engine.calculate('2 + + 3')).toThrow();
        });

        it('괄호가 맞지 않으면 에러를 발생시켜야 한다', () => {
            const engine = new CalculatorEngine();
            expect(() => engine.calculate('(2 + 3')).toThrow('괄호가 맞지 않습니다');
        });
    });
});
