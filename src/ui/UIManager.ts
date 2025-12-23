import { CalculatorState } from '../core/CalculatorState';
import { CalculatorEngine } from '../core/CalculatorEngine';
import { Validators } from '../utils/Validators';
import { ThemeManager } from './ThemeManager';
import { Display } from './components/Display';
import { HistoryPanel } from './components/HistoryPanel';
import type { HistoryItem } from '../types';

/**
 * UI 관리 클래스 - 모바일 앱 스타일
 * 풀스크린 레이아웃으로 모든 UI 컴포넌트를 조율합니다.
 */
export class UIManager {
    private state: CalculatorState;
    private engine: CalculatorEngine;
    private themeManager: ThemeManager;

    // 컴포넌트
    private display!: Display;
    private historyPanel!: HistoryPanel;

    // UI 컨테이너
    private keypadContainer!: HTMLElement;
    private keypadSection!: HTMLElement;


    constructor(state: CalculatorState) {
        this.state = state;
        this.engine = new CalculatorEngine();
        this.themeManager = new ThemeManager();

        this.initUI();

        // 상태 변경 구독
        this.state.subscribe((newState) => {
            this.updateUI(newState);
        });

        this.setupKeyboardListeners();
        this.updateUI(this.state.getState());

        // 패널 크기 동기화 시작
        this.setupPanelSync();
    }

    private initUI(): void {
        const app = document.querySelector('#app')!;
        app.innerHTML = '';
        app.setAttribute('role', 'application');
        app.setAttribute('aria-label', 'Scientific Calculator');

        // 1. Left Side: Scientific Panel Container
        const sciPanelContainer = document.createElement('div');
        sciPanelContainer.className = 'calc-scientific-section';
        app.appendChild(sciPanelContainer);
        this.createScientificPanel(sciPanelContainer);

        // 2. Center: Main Content Wrapper (Header + Display + Keypad)
        const mainContent = document.createElement('div');
        mainContent.className = 'calc-main-content';

        // 헤더
        const header = this.createHeader();
        mainContent.appendChild(header);

        // 디스플레이 섹션
        const displayContainer = document.createElement('section');
        displayContainer.className = 'calc-display-section';
        this.display = new Display(displayContainer);
        mainContent.appendChild(displayContainer);

        // Spacer between Display and Keypad
        const layoutSpacer = document.createElement('div');
        layoutSpacer.style.height = '20px'; // 40px -> 20px로 축소 (절반)
        layoutSpacer.style.flexShrink = '0'; // Prevent collapsing
        mainContent.appendChild(layoutSpacer);

        // 키패드 섹션
        mainContent.appendChild(this.createKeypadSection());

        app.appendChild(mainContent);

        // 3. Right Side: History Panel Container
        const historyPanelContainer = document.createElement('div');
        historyPanelContainer.className = 'calc-history-section';
        app.appendChild(historyPanelContainer);

        this.historyPanel = new HistoryPanel(
            historyPanelContainer,
            (item) => { // On Click
                this.state.updateExpression('');
                this.state.updateCurrentNumber(item.result);
            },
            (id) => { // On Delete
                this.state.removeHistory(id);
            },
            () => { // On Clear All
                this.state.clearHistory();
            }
        );
    }

    private createHeader(): HTMLElement {
        const header = document.createElement('header');
        header.className = 'calc-header';

        // Swap: Theme Button (Left)
        const themeBtn = document.createElement('button');
        themeBtn.innerHTML = this.themeManager.isDarkMode() ? '☀️' : '🌙';
        themeBtn.setAttribute('aria-label', 'Toggle Theme');
        themeBtn.title = 'Toggle Theme';
        themeBtn.addEventListener('click', () => {
            this.themeManager.toggleTheme();
            themeBtn.innerHTML = this.themeManager.isDarkMode() ? '☀️' : '🌙';
        });

        // Scientific Mode
        const sciBtn = document.createElement('button');
        sciBtn.id = 'sci-mode-btn';
        sciBtn.textContent = 'Scientific';
        sciBtn.setAttribute('aria-label', 'Toggle Scientific Mode');
        sciBtn.title = 'Toggle Scientific Mode';
        sciBtn.style.cssText = 'width: auto; padding: 0 12px; border-radius: 20px; font-size: 14px; font-weight: 600;';
        sciBtn.addEventListener('click', () => {
            this.state.toggleScientificMode();
            this.updateScientificButtonState(sciBtn);
        });

        // Angle Unit
        const angleBtn = document.createElement('button');
        angleBtn.id = 'angle-unit-btn';
        angleBtn.textContent = 'RAD | DEG';
        angleBtn.setAttribute('aria-label', 'Toggle Angle Unit');
        angleBtn.title = 'Toggle Angle Unit (DEG/RAD)';
        angleBtn.style.cssText = 'width: auto; padding: 0 12px; font-size: 14px; font-weight: 600; min-width: 80px;';
        angleBtn.addEventListener('click', () => {
            this.state.toggleAngleUnit();
        });

        // Swap: History Button (Right)
        const historyBtn = document.createElement('button');
        historyBtn.innerHTML = '🕒';
        historyBtn.setAttribute('aria-label', 'View History');
        historyBtn.title = 'View History';
        historyBtn.addEventListener('click', () => {
            this.historyPanel.toggle();
            const isOpen = this.historyPanel.getIsOpen();
            const body = document.body;
            if (isOpen) body.classList.add('history-mode-active');
            else body.classList.remove('history-mode-active');
        });

        // Help Button (README)
        const helpBtn = document.createElement('button');
        helpBtn.innerHTML = '?';
        helpBtn.setAttribute('aria-label', 'Project README');
        helpBtn.title = 'View Project GitHub';
        helpBtn.addEventListener('click', () => {
            window.open('https://github.com/yonghwan-ko02/calculator-demo', '_blank');
        });

        const spacer = document.createElement('div');
        spacer.style.width = '20px';

        const smallSpacer = document.createElement('div');
        smallSpacer.style.width = '8px';

        // Order: Theme -> Spacer -> Sci -> Angle -> Spacer -> History -> Spacer -> Help
        header.appendChild(themeBtn);
        header.appendChild(document.createElement('div')).style.width = '20px'; // Spacer
        header.appendChild(sciBtn);
        header.appendChild(angleBtn);
        header.appendChild(spacer);
        header.appendChild(historyBtn);
        header.appendChild(smallSpacer);
        header.appendChild(helpBtn);

        return header;
    }

    private createScientificPanel(container: HTMLElement): void {
        const sciPanel = document.createElement('div');
        sciPanel.className = 'scientific-panel';
        sciPanel.id = 'scientific-panel';

        const sciButtons = [
            { value: 'asin', label: 'sin⁻¹', aria: '아크 사인' },
            { value: 'acos', label: 'cos⁻¹', aria: '아크 코사인' },
            { value: 'atan', label: 'tan⁻¹', aria: '아크 탄젠트' },
            { value: 'e', label: 'e', aria: '자연상수 e' },
            { value: 'ln', label: 'ln', aria: '자연로그' },
            { value: 'exp', label: 'eˣ', aria: '지수 함수' },
            { value: 'cbrt', label: '∛', aria: '세제곱근' },
            { value: 'inv', label: '1/x', aria: '역수' },
            { value: 'abs', label: '|x|', aria: '절댓값' },
            { value: 'fact', label: 'x!', aria: '팩토리얼' },
        ];

        sciButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'calc-button calc-button-function';
            button.textContent = btn.label;
            button.setAttribute('aria-label', btn.aria);
            button.dataset.value = btn.value;
            button.addEventListener('click', () => this.handleButtonClick(btn.value));
            sciPanel.appendChild(button);
        });

        container.appendChild(sciPanel);
    }

    private updateScientificButtonState(btn: HTMLElement): void {
        const isActive = this.state.isScientificMode();
        btn.style.backgroundColor = isActive ? 'var(--color-primary)' : 'transparent';
        btn.style.color = isActive ? '#FFFFFF' : 'var(--color-text-secondary)';
    }

    private createKeypadSection(): HTMLElement {
        const section = document.createElement('section');
        section.className = 'calc-keypad-section';
        this.keypadSection = section; // 멤버 변수에 할당

        // Basic Keypad Only
        this.keypadContainer = document.createElement('div');
        this.keypadContainer.className = 'calc-keypad-grid';

        // ... Buttons array stays same ...

        const buttons = [
            // Row 1
            { value: 'sin', label: 'sin', type: 'function', aria: '사인' },
            { value: 'cos', label: 'cos', type: 'function', aria: '코사인' },
            { value: 'tan', label: 'tan', type: 'function', aria: '탄젠트' },
            { value: 'log', label: 'log', type: 'function', aria: '상용로그' },
            // Row 2
            { value: 'sqrt', label: '√', type: 'function', aria: '제곱근' },
            { value: 'pow', label: 'x²', type: 'function', aria: '제곱' },
            { value: 'pi', label: 'π', type: 'function', aria: '파이' },
            { value: 'percent', label: '%', type: 'function', aria: '퍼센트' },
            // Row 3 (Basic)
            { value: 'AC', label: 'AC', type: 'clear', aria: '올 클리어' },
            { value: '(', label: '(', type: 'operator', aria: '여는 괄호' },
            { value: ')', label: ')', type: 'operator', aria: '닫는 괄호' },
            { value: '/', label: '÷', type: 'operator', aria: '나누기' },
            // Row 4
            { value: '7', label: '7', type: 'number', aria: '7' },
            { value: '8', label: '8', type: 'number', aria: '8' },
            { value: '9', label: '9', type: 'number', aria: '9' },
            { value: '*', label: '×', type: 'operator', aria: '곱하기' },
            // Row 5
            { value: '4', label: '4', type: 'number', aria: '4' },
            { value: '5', label: '5', type: 'number', aria: '5' },
            { value: '6', label: '6', type: 'number', aria: '6' },
            { value: '-', label: '-', type: 'operator', aria: '빼기' },
            // Row 6
            { value: '1', label: '1', type: 'number', aria: '1' },
            { value: '2', label: '2', type: 'number', aria: '2' },
            { value: '3', label: '3', type: 'number', aria: '3' },
            { value: '+', label: '+', type: 'operator', aria: '더하기' },
            // Row 7
            { value: '0', label: '0', type: 'number', aria: '0' },
            { value: '.', label: '.', type: 'number', aria: '소수점' },
            { value: 'backspace', label: '⌫', type: 'operator', aria: '지우기' },
            { value: '=', label: '=', type: 'equals', aria: '계산' },
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `calc-button calc-button-${btn.type}`;
            button.textContent = btn.label;
            button.setAttribute('aria-label', btn.aria);
            button.dataset.value = btn.value;

            // 접근성: 키보드 포커스 가능
            button.setAttribute('tabindex', '0');

            button.addEventListener('click', () => {
                this.handleButtonClick(btn.value);
            });

            this.keypadContainer.appendChild(button);
        });

        section.appendChild(this.keypadContainer);
        return section;
    }

    private handleButtonClick(value: string): void {
        try {
            switch (value) {
                case 'AC':
                    this.state.updateExpression('');
                    this.state.updateCurrentNumber('');
                    this.state.updateResult(null);
                    break;
                case 'backspace':
                    this.handleBackspace();
                    break;
                case '=':
                    this.handleEquals();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                    this.handleOperator(value);
                    break;
                case '.':
                    this.handleDecimal();
                    break;
                case '(':
                case ')':
                    this.handleParenthesis(value as '(' | ')');
                    break;
                case 'percent':
                    this.handlePercent();
                    break;

                // 공학 함수
                case 'sin': case 'cos': case 'tan':
                case 'asin': case 'acos': case 'atan':
                case 'log': case 'ln':
                case 'sqrt': case 'cbrt':
                case 'exp': case 'abs': case 'fact':
                case 'pow': // handler에서 pow2로 매핑하거나 직접 처리 (여기선 pow 버튼이 x^2 의미)
                case 'inv':
                    this.handleScientificFunction(value);
                    break;

                // 상수
                case 'pi':
                    this.state.updateCurrentNumber(Math.PI.toString());
                    break;
                case 'e':
                    this.state.updateCurrentNumber(Math.E.toString());
                    break;

                default:
                    // 숫자
                    if (!isNaN(Number(value))) {
                        this.handleNumber(value);
                    }
                    break;
            }
        } catch (error) {
            this.display.showError('오류');
        }
    }

    private handleScientificFunction(func: string): void {
        const current = this.state.getState().currentNumber;
        if (!current) return;

        try {
            const num = parseFloat(current);
            const isDegree = this.state.isDegreeMode();

            // UI 버튼 값과 엔진 함수 매핑
            let engineFunc = func;
            if (func === 'pow') engineFunc = 'pow2'; // UI 'pow'는 x^2

            const result = this.engine.calculateScientificFunction(engineFunc, num, isDegree);
            this.state.updateCurrentNumber(result.toString());
        } catch (e) {
            this.display.showError('오류');
        }
    }

    private handleNumber(num: string): void {
        const currentState = this.state.getState();
        const newNumber = currentState.currentNumber + num;
        this.state.updateCurrentNumber(newNumber);
    }

    private handleOperator(operator: string): void {
        const currentState = this.state.getState();
        if (!Validators.canAddOperator(currentState.expression + currentState.currentNumber, operator)) return;

        const newExpression = currentState.expression + currentState.currentNumber + ' ' + operator + ' ';
        this.state.updateExpression(newExpression);
        this.state.updateCurrentNumber('');
    }

    private handleDecimal(): void {
        const currentNumber = this.state.getState().currentNumber;
        if (!Validators.canAddDecimal(currentNumber)) return;

        this.state.updateCurrentNumber(currentNumber === '' ? '0.' : currentNumber + '.');
    }

    private handleParenthesis(paren: '(' | ')'): void {
        const state = this.state.getState();
        const fullExpr = state.expression + state.currentNumber;

        if (!Validators.canAddParenthesis(fullExpr, paren)) return;

        if (paren === '(') {
            this.state.updateExpression(state.expression + state.currentNumber + '(');
            this.state.updateCurrentNumber('');
        } else {
            this.state.updateExpression(state.expression + state.currentNumber + ')');
            this.state.updateCurrentNumber('');
        }
    }

    private handleEquals(): void {
        const state = this.state.getState();
        const fullExpression = state.expression + state.currentNumber;

        if (!fullExpression.trim()) return;

        try {
            const result = this.engine.calculate(fullExpression);
            const resultStr = result.toString();

            const historyItem: HistoryItem = {
                id: Date.now(),
                expression: fullExpression,
                result: resultStr,
                timestamp: Date.now(),
            };
            this.state.addHistory(historyItem);

            this.state.updateResult(resultStr);
            this.state.updateExpression('');
            this.state.updateCurrentNumber(resultStr);
        } catch (error) {
            this.display.showError((error as Error).message);
        }
    }

    private handleBackspace(): void {
        const state = this.state.getState();
        if (state.currentNumber) {
            this.state.updateCurrentNumber(state.currentNumber.slice(0, -1));
        } else if (state.expression) {
            this.state.updateExpression(state.expression.trim().slice(0, -1).trim() + ' ');
        }
    }

    private handlePercent(): void {
        const state = this.state.getState();
        const current = state.currentNumber;
        if (!current) return;

        // Base 찾기 (간단한 로직)
        const match = state.expression.trim().match(/(\d+(?:\.\d+)?)\s*[\+\-\*\/]\s*$/);
        const base = match ? match[1] : undefined;

        try {
            const result = this.engine.calculatePercent(current, base);
            this.state.updateCurrentNumber(result);
        } catch {
            this.display.showError('오류');
        }
    }

    private updateUI(newState: any): void {
        // Display 업데이트
        this.display.updateExpression(newState.expression);
        this.display.updateCurrentNumber(newState.currentNumber); // 또는 result 처리 로직 확인
        // 결과 표시 후 바로 숫자 입력 시 처리 로직이 필요할 수 있으나 현재 구조에서는 currentNumber로 표시됨

        // Inline History Removed


        // Full History Panel 업데이트
        this.historyPanel.updateHistory(newState.history);

        // 버튼 상태 업데이트
        const angleBtn = document.querySelector('#angle-unit-btn');
        if (angleBtn) {
            const isDeg = this.state.isDegreeMode();
            // 활성화된 모드를 강조하는 HTML (스타일 간략 적용)
            angleBtn.innerHTML = isDeg
                ? '<span style="opacity:0.5">RAD</span> | <span style="opacity:1">DEG</span>'
                : '<span style="opacity:1">RAD</span> | <span style="opacity:0.5">DEG</span>';
        }

        const sciBtn = document.querySelector('#sci-mode-btn') as HTMLElement;
        this.updateScientificButtonState(sciBtn);

        const keypadSection = document.querySelector('.calc-keypad-section');
        const body = document.body;

        if (keypadSection) {
            if (this.state.isScientificMode()) {
                keypadSection.classList.add('scientific-mode');
                body.classList.add('scientific-mode-active');
            } else {
                keypadSection.classList.remove('scientific-mode');
                body.classList.remove('scientific-mode-active');
            }
        }
    }

    private setupPanelSync(): void {
        const sciSection = document.querySelector('.calc-scientific-section') as HTMLElement;

        if (!this.keypadSection || !sciSection) return;

        const updateHeight = () => {
            // 키패드 섹션의 높이를 측정하여 공학 패널에 적용
            const height = this.keypadSection.offsetHeight;
            if (height > 0) {
                sciSection.style.height = `${height}px`;
            }
        };

        // 초기 실행
        requestAnimationFrame(updateHeight);

        // 변경 감지
        const observer = new ResizeObserver(() => {
            updateHeight();
        });

        observer.observe(this.keypadSection);

        // 창 크기 변경 시에도 실행
        window.addEventListener('resize', updateHeight);
    }

    private setupKeyboardListeners(): void {
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            if (key >= '0' && key <= '9') this.handleNumber(key);
            else if (['+', '-', '*', '/'].includes(key)) this.handleOperator(key);
            else if (key === 'Enter') this.handleEquals();
            else if (key === 'Backspace') this.handleBackspace();
            else if (key === 'Escape') {
                this.state.updateExpression('');
                this.state.updateCurrentNumber('');
                this.state.updateResult(null);
            }
            else if (key === '.') this.handleDecimal();
            else if (key === '(' || key === ')') this.handleParenthesis(key);
            else if (key.toLowerCase() === 't') this.themeManager.toggleTheme();
            else if (key.toLowerCase() === 'h') this.historyPanel.toggle();
        });
    }
}
