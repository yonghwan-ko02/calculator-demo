
import { describe, it, expect, beforeEach } from 'vitest';
import { CalculatorEngine } from '../CalculatorEngine';

describe('CalculatorEngine - Percent', () => {
    let engine: CalculatorEngine;

    beforeEach(() => {
        engine = new CalculatorEngine();
    });

    it('should calculate simple percentage', () => {
        // 20% -> 0.2
        const result = engine.calculatePercent('20');
        expect(result).toBe('0.2');
    });

    it('should calculate percentage addition', () => {
        // 100 + 20% -> 100 + 20 -> 120
        // 여기서는 퍼센트 값 자체만 계산: 20 -> 20 (base 100)
        // 실제로는 UI 레벨이나 엔진에서 base number를 알아야 함
        // CalculatorEngine.calculatePercent 메서드를 확장하여 base number를 받을 수 있게 하거나
        // 별도의 처리 로직이 필요함.

        // 방식 1: calculatePercent(value, base)
        expect(engine.calculatePercent('20', '100')).toBe('20');
        expect(engine.calculatePercent('10', '50')).toBe('5');
    });

    it('should calculate percentage subtraction', () => {
        // 100 - 20% -> 100 - 20 -> 80
        // 퍼센트 값은 동일하게 20
        expect(engine.calculatePercent('20', '100')).toBe('20');
    });

    it('should calculate percentage multiplication', () => {
        // 100 * 20% -> 100 * 0.2 -> 20
        // 이 경우 20%는 0.2로 취급되어야 할 수도 있고, 문맥에 따라 다름.
        // 보통 공학용 계산기에서는 100 * 20% = 20 이 됨.
        // 즉 20%는 0.2
        // 그러나 덧셈/뺄셈에서는 base number의 비율로 동작.

        // 여기서는 calculatePercent가 문맥을 모른다면 0.2를 리턴하는게 맞으나,
        // UI에서 처리하기 편하게 base를 주면 base의 %값을 리턴하고, 안 주면 단순히 /100을 리턴하도록 설계

        expect(engine.calculatePercent('50', '200')).toBe('100'); // 200의 50% = 100
    });
});
