/**
 * 계산기 키패드 컴포넌트
 * 숫자, 연산자, 특수 버튼을 렌더링하고 클릭 이벤트를 처리합니다.
 */
export class Keypad {
    private container: HTMLElement;
    private onButtonClick: (value: string, type: ButtonType) => void;

    // 버튼 레이아웃 정의
    private readonly buttons: ButtonConfig[][] = [
        [
            { value: 'AC', type: 'special', label: 'AC' },
            { value: '(', type: 'operator', label: '(' },
            { value: ')', type: 'operator', label: ')' },
            { value: 'backspace', type: 'operator', label: '⌫' },
        ],
        [
            { value: '7', type: 'number', label: '7' },
            { value: '8', type: 'number', label: '8' },
            { value: '9', type: 'number', label: '9' },
            { value: '/', type: 'operator', label: '÷' },
        ],
        [
            { value: '4', type: 'number', label: '4' },
            { value: '5', type: 'number', label: '5' },
            { value: '6', type: 'number', label: '6' },
            { value: '*', type: 'operator', label: '×' },
        ],
        [
            { value: '1', type: 'number', label: '1' },
            { value: '2', type: 'number', label: '2' },
            { value: '3', type: 'number', label: '3' },
            { value: '-', type: 'operator', label: '-' },
        ],
        [
            { value: '0', type: 'number', label: '0' },
            { value: '.', type: 'number', label: '.' },
            { value: '=', type: 'special', label: '=' },
            { value: '+', type: 'operator', label: '+' },
        ],
    ];

    constructor(container: HTMLElement, onButtonClick: (value: string, type: ButtonType) => void) {
        this.container = container;
        this.onButtonClick = onButtonClick;
        this.render();
    }

    /**
     * 키패드 UI를 렌더링합니다.
     */
    private render(): void {
        this.container.innerHTML = '';
        this.container.style.cssText = 'display: grid; gap: 12px;';

        this.buttons.forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;';

            row.forEach(button => {
                const buttonElement = this.createButton(button);
                rowElement.appendChild(buttonElement);
            });

            this.container.appendChild(rowElement);
        });
    }

    /**
     * 버튼 요소를 생성합니다.
     */
    private createButton(config: ButtonConfig): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = config.label;
        button.dataset.value = config.value;
        button.dataset.type = config.type;

        // 버튼 스타일 클래스 적용
        button.className = `calc-button ${this.getButtonClass(config.type)}`;

        // 클릭 이벤트 리스너
        button.addEventListener('click', () => {
            this.onButtonClick(config.value, config.type);
        });

        return button;
    }

    /**
     * 버튼 타입에 따른 CSS 클래스를 반환합니다.
     */
    private getButtonClass(type: ButtonType): string {
        switch (type) {
            case 'number':
                return 'calc-button-number';
            case 'operator':
                return 'calc-button-operator';
            case 'special':
                return 'calc-button-special';
            default:
                return '';
        }
    }

    /**
     * 특정 버튼을 비활성화합니다.
     */
    disableButton(value: string): void {
        const button = this.container.querySelector(`button[data-value="${value}"]`) as HTMLButtonElement;
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        }
    }

    /**
     * 특정 버튼을 활성화합니다.
     */
    enableButton(value: string): void {
        const button = this.container.querySelector(`button[data-value="${value}"]`) as HTMLButtonElement;
        if (button) {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    }
}

// 타입 정의
type ButtonType = 'number' | 'operator' | 'special';

interface ButtonConfig {
    value: string;
    type: ButtonType;
    label: string;
}
