
import { describe, it, expect, beforeEach } from 'vitest';
import { CalculatorEngine } from '../CalculatorEngine';

describe('CalculatorEngine - Scientific Functions', () => {
    let engine: CalculatorEngine;

    beforeEach(() => {
        engine = new CalculatorEngine();
    });

    describe('Trigonometric Functions', () => {
        it('sin (Degree)', () => {
            expect(engine.calculateScientificFunction('sin', 0, true)).toBe(0);
            expect(engine.calculateScientificFunction('sin', 90, true)).toBe(1);
            expect(engine.calculateScientificFunction('sin', 30, true)).toBeCloseTo(0.5);
        });

        it('sin (Radian)', () => {
            expect(engine.calculateScientificFunction('sin', 0, false)).toBe(0);
            expect(engine.calculateScientificFunction('sin', Math.PI / 2, false)).toBe(1);
            expect(engine.calculateScientificFunction('sin', Math.PI / 6, false)).toBeCloseTo(0.5);
        });

        it('cos (Degree)', () => {
            expect(engine.calculateScientificFunction('cos', 0, true)).toBe(1);
            expect(engine.calculateScientificFunction('cos', 90, true)).toBe(0); // Precision fix check
            expect(engine.calculateScientificFunction('cos', 60, true)).toBeCloseTo(0.5);
        });

        it('tan (Degree)', () => {
            expect(engine.calculateScientificFunction('tan', 0, true)).toBe(0);
            expect(engine.calculateScientificFunction('tan', 45, true)).toBeCloseTo(1);
        });
    });

    describe('Logarithmic & Exponential Functions', () => {
        it('log (Common Log)', () => {
            expect(engine.calculateScientificFunction('log', 100, true)).toBe(2);
            expect(engine.calculateScientificFunction('log', 1, true)).toBe(0);
        });

        it('ln (Natural Log)', () => {
            expect(engine.calculateScientificFunction('ln', Math.E, true)).toBe(1);
            expect(engine.calculateScientificFunction('ln', 1, true)).toBe(0);
        });

        it('exp', () => {
            expect(engine.calculateScientificFunction('exp', 1, true)).toBeCloseTo(Math.E);
            expect(engine.calculateScientificFunction('exp', 0, true)).toBe(1);
        });
    });

    describe('Other Functions', () => {
        it('sqrt', () => {
            expect(engine.calculateScientificFunction('sqrt', 16, true)).toBe(4);
            expect(() => engine.calculateScientificFunction('sqrt', -1, true)).toThrow('음수의 제곱근은 허수입니다');
        });

        it('cbrt', () => {
            expect(engine.calculateScientificFunction('cbrt', 8, true)).toBe(2);
            expect(engine.calculateScientificFunction('cbrt', -8, true)).toBe(-2);
        });

        it('pow2', () => {
            expect(engine.calculateScientificFunction('pow2', 3, true)).toBe(9);
        });

        it('inv (reciprocal)', () => {
            expect(engine.calculateScientificFunction('inv', 2, true)).toBe(0.5);
            expect(() => engine.calculateScientificFunction('inv', 0, true)).toThrow('0으로 나눌 수 없습니다');
        });
    });
});
