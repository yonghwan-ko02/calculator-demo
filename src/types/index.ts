// 계산기 상태 인터페이스
export interface CalculatorState {
    expression: string;        // 현재 수식 (예: "12 + 5 * ")
    currentNumber: string;      // 현재 입력 중인 숫자 (예: "123")
    result: string | null;      // 계산 결과
    history: HistoryItem[];     // 계산 히스토리
    theme: ThemeType;           // 테마 설정
    isDegree?: boolean;         // 각도 단위 (true: Degree, false: Radian)
    isScientific?: boolean;     // 공학용 모드 여부
}

// 히스토리 아이템 인터페이스
export interface HistoryItem {
    id: number;                 // 고유 ID (timestamp)
    expression: string;         // 계산식 (예: "12 + 88")
    result: string;             // 계산 결과 (예: "100")
    timestamp: number;          // 계산 시각
}

// 테마 타입
export type ThemeType = 'light' | 'dark' | 'system';

// 연산자 타입
export type OperatorType = '+' | '-' | '*' | '/' | '(' | ')';

// 버튼 타입
export type ButtonType = 'number' | 'operator' | 'function' | 'special';

// 상태 변경 리스너
export type StateChangeListener = (state: CalculatorState) => void;
