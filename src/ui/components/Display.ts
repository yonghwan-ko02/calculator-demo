import { Formatter } from '../../utils/Formatter';

/**
 * 계산기 디스플레이 컴포넌트
 * 현재 입력값, 이전 계산식, 결과를 표시합니다.
 */
export class Display {
    private container: HTMLElement;
    private expressionElement: HTMLElement;
    private currentNumberElement: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.expressionElement = document.createElement('div');
        this.currentNumberElement = document.createElement('div');
        this.render();
    }

    /**
     * 디스플레이 UI를 렌더링합니다.
     */
    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'calc-display';

        // 이전 계산식 표시 영역
        this.expressionElement.className = 'display-expression';
        this.expressionElement.textContent = '\u00A0'; // 공백 유지

        // 현재 입력값 표시 영역
        this.currentNumberElement.className = 'display-number';
        this.currentNumberElement.textContent = '0';

        this.container.appendChild(this.expressionElement);
        this.container.appendChild(this.currentNumberElement);
    }

    /**
     * 이전 계산식을 업데이트합니다.
     */
    updateExpression(expression: string): void {
        this.expressionElement.textContent = expression || '\u00A0';
    }

    /**
     * 현재 입력값을 업데이트합니다.
     */
    updateCurrentNumber(value: string): void {
        if (!value || value === '') {
            this.currentNumberElement.textContent = '0';
            return;
        }

        // 숫자 포맷팅 적용
        const formatted = Formatter.formatNumber(value);
        this.currentNumberElement.textContent = formatted;
    }

    /**
     * 결과를 표시합니다.
     */
    updateResult(result: string): void {
        const formatted = Formatter.formatResult(result);
        this.currentNumberElement.textContent = formatted;
    }

    /**
     * 디스플레이를 초기화합니다.
     */
    clear(): void {
        this.expressionElement.textContent = '\u00A0';
        this.currentNumberElement.textContent = '0';
    }

    /**
     * 에러 메시지를 표시합니다.
     */
    showError(message: string): void {
        this.currentNumberElement.textContent = message;
        this.currentNumberElement.classList.add('text-error');

        // 2초 후 에러 스타일 제거
        setTimeout(() => {
            this.currentNumberElement.classList.remove('text-error');
        }, 2000);
    }
}
