/**
 * 계산 엔진 클래스
 * Shunting-yard 알고리즘을 사용하여 수식을 계산합니다.
 */
export class CalculatorEngine {
    /**
     * 주어진 수식을 계산합니다.
     * @param expression 계산할 수식 (예: "2 + 3 * 4")
     * @returns 계산 결과
     */
    calculate(expression: string): number {
        // 1. 토큰화
        const tokens = this.tokenize(expression);

        // 2. 중위 표기법 → 후위 표기법 변환 (Shunting-yard)
        const postfix = this.infixToPostfix(tokens);

        // 3. 후위 표기법 평가
        return this.evaluatePostfix(postfix);
    }

    /**
     * 수식을 토큰으로 분리합니다.
     */
    private tokenize(expression: string): string[] {
        // 공백 제거 및 토큰 분리
        const cleaned = expression.replace(/\s+/g, '');
        const tokens: string[] = [];
        let currentNumber = '';

        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i];

            if (this.isDigit(char) || char === '.') {
                currentNumber += char;
            } else if (this.isOperator(char) || char === '(' || char === ')') {
                if (currentNumber) {
                    tokens.push(currentNumber);
                    currentNumber = '';
                }
                tokens.push(char);
            }
        }

        if (currentNumber) {
            tokens.push(currentNumber);
        }

        return tokens;
    }

    /**
     * 중위 표기법을 후위 표기법으로 변환합니다 (Shunting-yard 알고리즘).
     */
    private infixToPostfix(tokens: string[]): string[] {
        const output: string[] = [];
        const operatorStack: string[] = [];

        for (const token of tokens) {
            if (this.isNumber(token)) {
                output.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    output.push(operatorStack.pop()!);
                }
                if (operatorStack.length === 0) {
                    throw new Error('괄호가 맞지 않습니다');
                }
                operatorStack.pop(); // '(' 제거
            } else if (this.isOperator(token)) {
                while (
                    operatorStack.length > 0 &&
                    this.getPrecedence(operatorStack[operatorStack.length - 1]) >= this.getPrecedence(token)
                ) {
                    output.push(operatorStack.pop()!);
                }
                operatorStack.push(token);
            }
        }

        while (operatorStack.length > 0) {
            const op = operatorStack.pop()!;
            if (op === '(' || op === ')') {
                throw new Error('괄호가 맞지 않습니다');
            }
            output.push(op);
        }

        return output;
    }

    /**
     * 후위 표기법을 평가합니다.
     */
    private evaluatePostfix(postfix: string[]): number {
        const stack: number[] = [];

        for (const token of postfix) {
            if (this.isNumber(token)) {
                stack.push(parseFloat(token));
            } else if (this.isOperator(token)) {
                if (stack.length < 2) {
                    throw new Error('잘못된 수식입니다');
                }
                const b = stack.pop()!;
                const a = stack.pop()!;
                const result = this.applyOperator(a, b, token);
                stack.push(result);
            }
        }

        if (stack.length !== 1) {
            throw new Error('잘못된 수식입니다');
        }

        return stack[0];
    }

    /**
     * 연산자를 적용합니다.
     */
    private applyOperator(a: number, b: number, operator: string): number {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                if (b === 0) {
                    throw new Error('0으로 나눌 수 없습니다');
                }
                return a / b;
            default:
                throw new Error(`알 수 없는 연산자: ${operator}`);
        }
    }

    /**
     * 연산자의 우선순위를 반환합니다.
     */
    private getPrecedence(operator: string): number {
        switch (operator) {
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
                return 2;
            default:
                return 0;
        }
    }

    /**
     * 숫자인지 확인합니다.
     */
    private isNumber(token: string): boolean {
        return !isNaN(parseFloat(token));
    }

    /**
     * 숫자 문자인지 확인합니다.
     */
    private isDigit(char: string): boolean {
        return /\d/.test(char);
    }

    /**
     * 연산자인지 확인합니다.
     */
    private isOperator(char: string): boolean {
        return ['+', '-', '*', '/'].includes(char);
    }
}
