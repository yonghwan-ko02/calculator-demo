import { describe, it, expect } from 'vitest';
import { Validators } from '../Validators';

describe('Validators', () => {
    describe('isValidInput', () => {
        it('숫자를 유효한 입력으로 인식해야 한다', () => {
            expect(Validators.isValidInput('0')).toBe(true);
            expect(Validators.isValidInput('1')).toBe(true);
            expect(Validators.isValidInput('9')).toBe(true);
        });

        it('연산자를 유효한 입력으로 인식해야 한다', () => {
            expect(Validators.isValidInput('+')).toBe(true);
            expect(Validators.isValidInput('-')).toBe(true);
            expect(Validators.isValidInput('*')).toBe(true);
            expect(Validators.isValidInput('/')).toBe(true);
        });

        it('괄호를 유효한 입력으로 인식해야 한다', () => {
            expect(Validators.isValidInput('(')).toBe(true);
            expect(Validators.isValidInput(')')).toBe(true);
        });

        it('소수점을 유효한 입력으로 인식해야 한다', () => {
            expect(Validators.isValidInput('.')).toBe(true);
        });

        it('유효하지 않은 문자를 거부해야 한다', () => {
            expect(Validators.isValidInput('a')).toBe(false);
            expect(Validators.isValidInput('Z')).toBe(false);
            expect(Validators.isValidInput('!')).toBe(false);
            expect(Validators.isValidInput('@')).toBe(false);
        });
    });

    describe('isValidExpression', () => {
        it('유효한 수식을 인식해야 한다', () => {
            expect(Validators.isValidExpression('2 + 3')).toBe(true);
            expect(Validators.isValidExpression('10 - 5')).toBe(true);
            expect(Validators.isValidExpression('4 * 3')).toBe(true);
            expect(Validators.isValidExpression('12 / 4')).toBe(true);
            expect(Validators.isValidExpression('(2 + 3) * 4')).toBe(true);
        });

        it('빈 문자열을 유효하지 않은 수식으로 처리해야 한다', () => {
            expect(Validators.isValidExpression('')).toBe(false);
        });

        it('연산자만 있는 수식을 거부해야 한다', () => {
            expect(Validators.isValidExpression('+')).toBe(false);
            expect(Validators.isValidExpression('*')).toBe(false);
        });

        it('연산자로 끝나는 수식을 허용해야 한다 (입력 중)', () => {
            expect(Validators.isValidExpression('2 +')).toBe(true);
            expect(Validators.isValidExpression('10 *')).toBe(true);
        });

        it('유효하지 않은 문자가 포함된 수식을 거부해야 한다', () => {
            expect(Validators.isValidExpression('2 + abc')).toBe(false);
            expect(Validators.isValidExpression('10 @ 5')).toBe(false);
        });
    });

    describe('canAddOperator', () => {
        it('숫자 뒤에 연산자를 추가할 수 있어야 한다', () => {
            expect(Validators.canAddOperator('2', '+')).toBe(true);
            expect(Validators.canAddOperator('123', '-')).toBe(true);
        });

        it('닫는 괄호 뒤에 연산자를 추가할 수 있어야 한다', () => {
            expect(Validators.canAddOperator('(2 + 3)', '*')).toBe(true);
        });

        it('빈 수식에 연산자를 추가할 수 없어야 한다', () => {
            expect(Validators.canAddOperator('', '+')).toBe(false);
        });

        it('연산자 뒤에 연산자를 추가할 수 없어야 한다', () => {
            expect(Validators.canAddOperator('2 +', '-')).toBe(false);
            expect(Validators.canAddOperator('10 *', '/')).toBe(false);
        });

        it('소수점 뒤에 연산자를 추가할 수 없어야 한다', () => {
            expect(Validators.canAddOperator('3.', '+')).toBe(false);
        });

        it('여는 괄호 뒤에 연산자를 추가할 수 없어야 한다', () => {
            expect(Validators.canAddOperator('(', '+')).toBe(false);
        });
    });

    describe('canAddDecimal', () => {
        it('정수 뒤에 소수점을 추가할 수 있어야 한다', () => {
            expect(Validators.canAddDecimal('3')).toBe(true);
            expect(Validators.canAddDecimal('123')).toBe(true);
        });

        it('이미 소수점이 있는 숫자에 소수점을 추가할 수 없어야 한다', () => {
            expect(Validators.canAddDecimal('3.14')).toBe(false);
            expect(Validators.canAddDecimal('10.5')).toBe(false);
        });

        it('빈 문자열에 소수점을 추가할 수 있어야 한다 (0. 입력)', () => {
            expect(Validators.canAddDecimal('')).toBe(true);
        });

        it('연산자 뒤에 소수점을 추가할 수 있어야 한다', () => {
            expect(Validators.canAddDecimal('2 +')).toBe(true);
            expect(Validators.canAddDecimal('10 *')).toBe(true);
        });

        it('괄호 뒤에 소수점을 추가할 수 있어야 한다', () => {
            expect(Validators.canAddDecimal('(')).toBe(true);
        });

        it('현재 숫자에 이미 소수점이 있으면 추가할 수 없어야 한다', () => {
            expect(Validators.canAddDecimal('2 + 3.')).toBe(false);
            expect(Validators.canAddDecimal('10 * 5.5')).toBe(false);
        });
    });

    describe('canAddParenthesis', () => {
        it('빈 수식에 여는 괄호를 추가할 수 있어야 한다', () => {
            expect(Validators.canAddParenthesis('', '(')).toBe(true);
        });

        it('연산자 뒤에 여는 괄호를 추가할 수 있어야 한다', () => {
            expect(Validators.canAddParenthesis('2 +', '(')).toBe(true);
            expect(Validators.canAddParenthesis('10 *', '(')).toBe(true);
        });

        it('숫자 뒤에 닫는 괄호를 추가할 수 있어야 한다', () => {
            expect(Validators.canAddParenthesis('(2 + 3', ')')).toBe(true);
        });

        it('괄호가 균형을 이루지 않으면 닫는 괄호를 추가할 수 없어야 한다', () => {
            expect(Validators.canAddParenthesis('2 + 3', ')')).toBe(false);
        });

        it('여는 괄호가 더 많으면 닫는 괄호를 추가할 수 있어야 한다', () => {
            expect(Validators.canAddParenthesis('((2 + 3', ')')).toBe(true);
            expect(Validators.canAddParenthesis('(2 + (3 * 4', ')')).toBe(true);
        });
    });

    describe('hasBalancedParentheses', () => {
        it('괄호가 균형을 이루는 수식을 인식해야 한다', () => {
            expect(Validators.hasBalancedParentheses('(2 + 3)')).toBe(true);
            expect(Validators.hasBalancedParentheses('((2 + 3) * 4)')).toBe(true);
            expect(Validators.hasBalancedParentheses('(2 + (3 * 4))')).toBe(true);
        });

        it('괄호가 없는 수식을 균형 잡힌 것으로 처리해야 한다', () => {
            expect(Validators.hasBalancedParentheses('2 + 3')).toBe(true);
            expect(Validators.hasBalancedParentheses('10 * 5')).toBe(true);
        });

        it('괄호가 균형을 이루지 않는 수식을 거부해야 한다', () => {
            expect(Validators.hasBalancedParentheses('(2 + 3')).toBe(false);
            expect(Validators.hasBalancedParentheses('2 + 3)')).toBe(false);
            expect(Validators.hasBalancedParentheses('((2 + 3)')).toBe(false);
        });
    });
});
