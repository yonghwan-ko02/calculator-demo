import type { CalculatorState } from '../types';

/**
 * LocalStorage를 사용한 데이터 영속성 관리 서비스
 */
export class StorageService {
    private readonly STORAGE_KEY = 'calc_app_v1';

    /**
     * 계산기 상태를 LocalStorage에 저장합니다.
     * @param state 저장할 상태
     */
    saveState(state: CalculatorState): void {
        try {
            const serialized = JSON.stringify(state);
            localStorage.setItem(this.STORAGE_KEY, serialized);
        } catch (error) {
            // LocalStorage quota 초과, 접근 불가 등의 에러 처리
            console.error('Failed to save state to localStorage:', error);
        }
    }

    /**
     * LocalStorage에서 계산기 상태를 불러옵니다.
     * @returns 저장된 상태 또는 null
     */
    loadState(): CalculatorState | null {
        try {
            const serialized = localStorage.getItem(this.STORAGE_KEY);

            if (!serialized) {
                return null;
            }

            const parsed = JSON.parse(serialized);

            // 데이터 유효성 검증
            if (!this.isValidState(parsed)) {
                console.warn('Invalid state data in localStorage');
                return null;
            }

            return parsed as CalculatorState;
        } catch (error) {
            // JSON 파싱 에러, LocalStorage 접근 불가 등의 에러 처리
            console.error('Failed to load state from localStorage:', error);
            return null;
        }
    }

    /**
     * LocalStorage에서 계산기 상태를 삭제합니다.
     */
    clearState(): void {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear state from localStorage:', error);
        }
    }

    /**
     * 상태 데이터의 유효성을 검증합니다.
     * @param data 검증할 데이터
     * @returns 유효하면 true
     */
    private isValidState(data: any): boolean {
        if (!data || typeof data !== 'object') {
            return false;
        }

        // 필수 필드 확인
        const requiredFields = ['expression', 'currentNumber', 'result', 'history', 'theme'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                return false;
            }
        }

        // 타입 검증
        if (typeof data.expression !== 'string') return false;
        if (typeof data.currentNumber !== 'string') return false;
        if (data.result !== null && typeof data.result !== 'string') return false;
        if (!Array.isArray(data.history)) return false;
        if (!['light', 'dark', 'system'].includes(data.theme)) return false;

        return true;
    }
}
