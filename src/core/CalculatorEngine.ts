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
     * 팩토리얼을 계산합니다.
     */
    private factorial(n: number): number {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    /**
     * 퍼센트를 계산합니다.
     * @param value 퍼센트 값 (예: '20')
     * @param base 기준 값 (선택 사항, 없으면 value/100)
     */
    calculatePercent(value: string, base?: string): string {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return '0';

        if (base) {
            const baseValue = parseFloat(base);
            if (isNaN(baseValue)) return (numValue / 100).toString();
            // base가 있으면 base의 퍼센트로 계산 (예: 100의 20% = 20)
            return (baseValue * (numValue / 100)).toString();
        }

        // base가 없으면 단순 비율 (예: 20% = 0.2)
        return (numValue / 100).toString();
    }

    /**
     * 공학 함수를 계산합니다.
     * @param func 함수 이름 (sin, cos, tan, log, etc.)
     * @param value 입력 값
     * @param isDegree 각도 단위 (true: Degree, false: Radian)
     */
    calculateScientificFunction(func: string, value: number, isDegree: boolean = true): number {
        switch (func) {
            // 삼각함수
            case 'sin':
                return Math.sin(this.toRadian(value, isDegree));
            case 'cos':
                // 부동소수점 오차 보정 (cos(90deg) -> 0)
                return this.fixPrecision(Math.cos(this.toRadian(value, isDegree)));
            case 'tan':
                // tan(90deg) 체크 필요하지만, JS에서는 Infinity 반환하므로 허용
                return this.fixPrecision(Math.tan(this.toRadian(value, isDegree)));
            case 'asin':
                return this.toDegree(Math.asin(value), isDegree);
            case 'acos':
                return this.toDegree(Math.acos(value), isDegree);
            case 'atan':
                return this.toDegree(Math.atan(value), isDegree);

            // 로그/지수
            case 'log':
                return Math.log10(value);
            case 'ln':
                return Math.log(value);
            case 'exp':
                return Math.exp(value);

            // 기타
            case 'sqrt':
                if (value < 0) throw new Error('음수의 제곱근은 허수입니다');
                return Math.sqrt(value);
            case 'cbrt':
                return Math.cbrt(value);
            case 'pow2': // x^2
                return Math.pow(value, 2);
            case 'inv': // 1/x
                if (value === 0) throw new Error('0으로 나눌 수 없습니다');
                return 1 / value;
            case 'abs':
                return Math.abs(value);
            case 'fact':
                return this.factorial(value);

            default:
                throw new Error(`지원하지 않는 함수: ${func}`);
        }
    }

    private toRadian(value: number, isDegree: boolean): number {
        return isDegree ? (value * Math.PI) / 180 : value;
    }

    private toDegree(value: number, isDegree: boolean): number {
        return isDegree ? (value * 180) / Math.PI : value;
    }

    private fixPrecision(value: number): number {
        return Math.abs(value) < 1e-10 ? 0 : value;
    }

    private isDigit(char: string): boolean {
        return /\d/.test(char);
    }

    private isOperator(char: string): boolean {
        return ['+', '-', '*', '/'].includes(char);
    }

    private isNumber(token: string): boolean {
        return !isNaN(parseFloat(token)) && isFinite(parseFloat(token));
    }

    private getPrecedence(operator: string): number {
        if (operator === '+' || operator === '-') return 1;
        if (operator === '*' || operator === '/') return 2;
        return 0;
    }

    private applyOperator(a: number, b: number, operator: string): number {
        switch (operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/':
                if (b === 0) throw new Error('0으로 나눌 수 없습니다');
                return a / b;
            default: return 0;
        }
    }
}
