import type { CalculatorState as ICalculatorState, HistoryItem, StateChangeListener } from '../types';

/**
 * 계산기 상태 관리 클래스
 * Observer 패턴을 사용하여 상태 변경 시 리스너에게 알립니다.
 */
export class CalculatorState {
    private state: ICalculatorState;
    private listeners: Set<StateChangeListener> = new Set();
    private readonly MAX_HISTORY = 50;

    constructor(initialState?: Partial<ICalculatorState>) {
        this.state = {
            expression: initialState?.expression || '',
            currentNumber: initialState?.currentNumber || '',
            result: initialState?.result || null,
            history: initialState?.history || [],
            theme: initialState?.theme || 'system',
            isDegree: initialState?.isDegree ?? true,
            isScientific: initialState?.isScientific ?? false, // 기본값: 일반 모드
        };
    }

    /**
     * 현재 상태를 반환합니다.
     */
    getState(): ICalculatorState {
        // 상태의 복사본을 반환하여 외부에서 직접 수정하지 못하도록 함
        return { ...this.state, history: [...this.state.history] };
    }

    /**
     * 전체 상태를 업데이트합니다.
     */
    setState(newState: ICalculatorState): void {
        this.state = { ...newState };
        this.notifyListeners();
    }

    /**
     * 공학용 모드를 토글합니다.
     */
    toggleScientificMode(): void {
        this.state.isScientific = !this.state.isScientific;
        this.notifyListeners();
    }

    /**
     * 현재 공학용 모드인지 확인합니다.
     */
    isScientificMode(): boolean {
        return !!this.state.isScientific;
    }

    /**
     * 각도 단위를 토글합니다.
     */
    toggleAngleUnit(): void {
        this.state.isDegree = !this.state.isDegree;
        this.notifyListeners();
    }

    /**
     * 현재 Degree 모드인지 확인합니다.
     */
    isDegreeMode(): boolean {
        return this.state.isDegree !== false; // undefined일 경우 true로 처리
    }

    /**
     * expression을 업데이트합니다.
     */
    updateExpression(expression: string): void {
        this.state.expression = expression;
        this.notifyListeners();
    }

    /**
     * currentNumber를 업데이트합니다.
     */
    updateCurrentNumber(currentNumber: string): void {
        this.state.currentNumber = currentNumber;
        this.notifyListeners();
    }

    /**
     * result를 업데이트합니다.
     */
    updateResult(result: string | null): void {
        this.state.result = result;
        this.notifyListeners();
    }

    /**
     * theme을 업데이트합니다.
     */
    updateTheme(theme: ICalculatorState['theme']): void {
        this.state.theme = theme;
        this.notifyListeners();
    }

    /**
     * 히스토리에 항목을 추가합니다.
     * 최신 항목이 배열의 앞에 위치하도록 정렬합니다.
     * 최대 개수를 초과하면 가장 오래된 항목을 제거합니다.
     */
    addHistory(item: HistoryItem): void {
        // 최신 항목을 앞에 추가
        this.state.history = [item, ...this.state.history];

        // 최대 개수 제한
        if (this.state.history.length > this.MAX_HISTORY) {
            this.state.history = this.state.history.slice(0, this.MAX_HISTORY);
        }

        this.notifyListeners();
    }

    /**
     * 히스토리에서 특정 항목을 제거합니다.
     */
    removeHistory(id: number): void {
        this.state.history = this.state.history.filter(item => item.id !== id);
        this.notifyListeners();
    }

    /**
     * 모든 히스토리를 삭제합니다.
     */
    clearHistory(): void {
        this.state.history = [];
        this.notifyListeners();
    }

    /**
     * 상태를 초기값으로 리셋합니다.
     * 테마는 유지됩니다.
     */
    reset(): void {
        const currentTheme = this.state.theme;
        this.state = {
            expression: '',
            currentNumber: '',
            result: null,
            history: [],
            theme: currentTheme,
            isDegree: true,
            isScientific: false,
        };
        this.notifyListeners();
    }

    /**
     * 상태 변경 리스너를 등록합니다.
     * @returns 리스너를 해제하는 함수
     */
    subscribe(listener: StateChangeListener): () => void {
        this.listeners.add(listener);

        // 리스너를 해제하는 함수 반환
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * 모든 리스너에게 상태 변경을 알립니다.
     */
    private notifyListeners(): void {
        const currentState = this.getState();
        this.listeners.forEach(listener => {
            listener(currentState);
        });
    }
}
