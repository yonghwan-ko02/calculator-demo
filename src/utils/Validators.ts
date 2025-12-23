/**
 * 입력 유효성 검사 유틸리티 클래스
 */
export class Validators {
    private static readonly VALID_CHARS = /^[0-9+\-*/().]$/;
    private static readonly OPERATORS = ['+', '-', '*', '/'];

    /**
     * 입력 문자가 유효한지 확인합니다.
     * @param char 검사할 문자
     * @returns 유효한 입력이면 true
     */
    static isValidInput(char: string): boolean {
        return this.VALID_CHARS.test(char);
    }

    /**
     * 수식이 유효한지 확인합니다.
     * @param expression 검사할 수식
     * @returns 유효한 수식이면 true
     */
    static isValidExpression(expression: string): boolean {
        if (!expression || expression.trim() === '') return false;

        // 모든 문자가 유효한지 확인
        for (const char of expression.replace(/\s/g, '')) {
            if (!this.isValidInput(char)) return false;
        }

        // 연산자만 있는 수식 거부
        const trimmed = expression.trim();
        if (this.OPERATORS.includes(trimmed)) return false;

        return true;
    }

    /**
     * 연산자를 추가할 수 있는지 확인합니다.
     * @param expression 현재 수식
     * @param operator 추가할 연산자
     * @returns 추가 가능하면 true
     */
    static canAddOperator(expression: string, operator: string): boolean {
        if (!expression || expression.trim() === '') return false;

        const trimmed = expression.trim();
        const lastChar = trimmed[trimmed.length - 1];

        // 연산자, 소수점, 여는 괄호 뒤에는 연산자를 추가할 수 없음
        if (this.OPERATORS.includes(lastChar) || lastChar === '.' || lastChar === '(') {
            return false;
        }

        return true;
    }

    /**
     * 소수점을 추가할 수 있는지 확인합니다.
     * @param expression 현재 수식
     * @returns 추가 가능하면 true
     */
    static canAddDecimal(expression: string): boolean {
        if (!expression || expression.trim() === '') return true;

        // 현재 입력 중인 숫자 추출
        const trimmed = expression.trim();
        const parts = trimmed.split(/[\+\-\*\/\(\)]/);
        const currentNumber = parts[parts.length - 1].trim();

        // 현재 숫자에 이미 소수점이 있으면 추가 불가
        if (currentNumber.includes('.')) return false;

        return true;
    }

    /**
     * 괄호를 추가할 수 있는지 확인합니다.
     * @param expression 현재 수식
     * @param parenthesis 추가할 괄호 ('(' 또는 ')')
     * @returns 추가 가능하면 true
     */
    static canAddParenthesis(expression: string, parenthesis: '(' | ')'): boolean {
        if (parenthesis === '(') {
            // 여는 괄호는 대부분의 경우 추가 가능
            return true;
        }

        // 닫는 괄호는 여는 괄호가 더 많을 때만 추가 가능
        const openCount = (expression.match(/\(/g) || []).length;
        const closeCount = (expression.match(/\)/g) || []).length;

        return openCount > closeCount;
    }

    /**
     * 괄호가 균형을 이루는지 확인합니다.
     * @param expression 검사할 수식
     * @returns 균형을 이루면 true
     */
    static hasBalancedParentheses(expression: string): boolean {
        let count = 0;

        for (const char of expression) {
            if (char === '(') {
                count++;
            } else if (char === ')') {
                count--;
                if (count < 0) return false; // 닫는 괄호가 먼저 나옴
            }
        }

        return count === 0; // 여는 괄호와 닫는 괄호 개수가 같아야 함
    }
}
