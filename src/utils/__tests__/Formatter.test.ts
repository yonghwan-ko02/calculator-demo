import { describe, it, expect } from 'vitest';
import { Formatter } from '../Formatter';

describe('Formatter', () => {
    describe('formatNumber', () => {
        it('천 단위 구분 기호를 추가해야 한다', () => {
            expect(Formatter.formatNumber('1000')).toBe('1,000');
            expect(Formatter.formatNumber('1000000')).toBe('1,000,000');
            expect(Formatter.formatNumber('123456789')).toBe('123,456,789');
        });

        it('소수점이 있는 숫자를 올바르게 포맷해야 한다', () => {
            expect(Formatter.formatNumber('1000.5')).toBe('1,000.5');
            expect(Formatter.formatNumber('1234567.89')).toBe('1,234,567.89');
        });

        it('음수를 올바르게 포맷해야 한다', () => {
            expect(Formatter.formatNumber('-1000')).toBe('-1,000');
            expect(Formatter.formatNumber('-1234567.89')).toBe('-1,234,567.89');
        });

        it('작은 숫자는 그대로 반환해야 한다', () => {
            expect(Formatter.formatNumber('0')).toBe('0');
            expect(Formatter.formatNumber('123')).toBe('123');
            expect(Formatter.formatNumber('999')).toBe('999');
        });

        it('빈 문자열은 그대로 반환해야 한다', () => {
            expect(Formatter.formatNumber('')).toBe('');
        });

        it('유효하지 않은 숫자는 그대로 반환해야 한다', () => {
            expect(Formatter.formatNumber('abc')).toBe('abc');
            expect(Formatter.formatNumber('12.34.56')).toBe('12.34.56');
        });
    });

    describe('formatDecimal', () => {
        it('소수점 자릿수를 제한해야 한다', () => {
            expect(Formatter.formatDecimal('3.14159', 2)).toBe('3.14');
            expect(Formatter.formatDecimal('3.14159', 4)).toBe('3.1416');
        });

        it('기본 자릿수는 10이어야 한다', () => {
            const longDecimal = '3.12345678901234567890';
            const result = Formatter.formatDecimal(longDecimal);
            const decimalPart = result.split('.')[1];
            expect(decimalPart?.length).toBeLessThanOrEqual(10);
        });

        it('정수는 그대로 반환해야 한다', () => {
            expect(Formatter.formatDecimal('123', 2)).toBe('123');
            expect(Formatter.formatDecimal('0', 5)).toBe('0');
        });

        it('반올림을 올바르게 처리해야 한다', () => {
            expect(Formatter.formatDecimal('3.145', 2)).toBe('3.15');
            expect(Formatter.formatDecimal('3.144', 2)).toBe('3.14');
        });
    });

    describe('removeTrailingZeros', () => {
        it('불필요한 뒷자리 0을 제거해야 한다', () => {
            expect(Formatter.removeTrailingZeros('3.50')).toBe('3.5');
            expect(Formatter.removeTrailingZeros('3.00')).toBe('3');
            expect(Formatter.removeTrailingZeros('10.1000')).toBe('10.1');
        });

        it('의미 있는 0은 유지해야 한다', () => {
            expect(Formatter.removeTrailingZeros('0')).toBe('0');
            expect(Formatter.removeTrailingZeros('100')).toBe('100');
            expect(Formatter.removeTrailingZeros('3.14')).toBe('3.14');
        });

        it('정수는 그대로 반환해야 한다', () => {
            expect(Formatter.removeTrailingZeros('123')).toBe('123');
            expect(Formatter.removeTrailingZeros('0')).toBe('0');
        });

        it('소수점만 있는 경우 제거해야 한다', () => {
            expect(Formatter.removeTrailingZeros('3.')).toBe('3');
            expect(Formatter.removeTrailingZeros('10.')).toBe('10');
        });
    });

    describe('formatResult', () => {
        it('결과를 포맷팅해야 한다 (천 단위 구분 + 불필요한 0 제거)', () => {
            expect(Formatter.formatResult('1000.00')).toBe('1,000');
            expect(Formatter.formatResult('1234567.50')).toBe('1,234,567.5');
            expect(Formatter.formatResult('3.14159')).toBe('3.14159');
        });

        it('매우 긴 소수는 제한해야 한다', () => {
            const longDecimal = '3.123456789012345678901234567890';
            const result = Formatter.formatResult(longDecimal);
            const decimalPart = result.split('.')[1];
            expect(decimalPart?.length).toBeLessThanOrEqual(10);
        });

        it('과학적 표기법을 처리해야 한다', () => {
            expect(Formatter.formatResult('1e6')).toBe('1,000,000');
            expect(Formatter.formatResult('1.5e3')).toBe('1,500');
        });

        it('매우 작은 숫자는 과학적 표기법으로 표시해야 한다', () => {
            const result = Formatter.formatResult('0.0000001');
            expect(result).toContain('e');
        });
    });

    describe('엣지 케이스', () => {
        it('Infinity를 처리해야 한다', () => {
            expect(Formatter.formatResult('Infinity')).toBe('Infinity');
            expect(Formatter.formatResult('-Infinity')).toBe('-Infinity');
        });

        it('NaN을 처리해야 한다', () => {
            expect(Formatter.formatResult('NaN')).toBe('Error');
        });

        it('매우 큰 숫자를 처리해야 한다', () => {
            const result = Formatter.formatResult('999999999999999');
            expect(result).toContain(',');
        });
    });
});
