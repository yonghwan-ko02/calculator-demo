import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageService } from '../StorageService';
import type { CalculatorState } from '../../types';

describe('StorageService', () => {
    let storage: StorageService;
    const STORAGE_KEY = 'calc_app_v1';

    beforeEach(() => {
        storage = new StorageService();
        // LocalStorage 초기화
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('saveState', () => {
        it('상태를 LocalStorage에 저장해야 한다', () => {
            const state: CalculatorState = {
                expression: '2 + 3',
                currentNumber: '5',
                result: '5',
                history: [],
                theme: 'dark',
            };

            storage.saveState(state);

            const saved = localStorage.getItem(STORAGE_KEY);
            expect(saved).not.toBeNull();

            const parsed = JSON.parse(saved!);
            expect(parsed.expression).toBe('2 + 3');
            expect(parsed.theme).toBe('dark');
        });

        it('히스토리를 포함한 상태를 저장해야 한다', () => {
            const state: CalculatorState = {
                expression: '',
                currentNumber: '',
                result: null,
                history: [
                    {
                        id: 1,
                        expression: '2 + 3',
                        result: '5',
                        timestamp: Date.now(),
                    },
                ],
                theme: 'light',
            };

            storage.saveState(state);

            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = JSON.parse(saved!);
            expect(parsed.history).toHaveLength(1);
            expect(parsed.history[0].expression).toBe('2 + 3');
        });
    });

    describe('loadState', () => {
        it('저장된 상태를 불러와야 한다', () => {
            const state: CalculatorState = {
                expression: '10 + 20',
                currentNumber: '30',
                result: '30',
                history: [],
                theme: 'dark',
            };

            storage.saveState(state);
            const loaded = storage.loadState();

            expect(loaded).not.toBeNull();
            expect(loaded?.expression).toBe('10 + 20');
            expect(loaded?.theme).toBe('dark');
        });

        it('저장된 데이터가 없으면 null을 반환해야 한다', () => {
            const loaded = storage.loadState();
            expect(loaded).toBeNull();
        });

        it('잘못된 JSON 데이터는 null을 반환해야 한다', () => {
            localStorage.setItem(STORAGE_KEY, 'invalid json');
            const loaded = storage.loadState();
            expect(loaded).toBeNull();
        });

        it('히스토리를 포함한 상태를 불러와야 한다', () => {
            const state: CalculatorState = {
                expression: '',
                currentNumber: '',
                result: null,
                history: [
                    {
                        id: 1,
                        expression: '5 * 6',
                        result: '30',
                        timestamp: Date.now(),
                    },
                ],
                theme: 'system',
            };

            storage.saveState(state);
            const loaded = storage.loadState();

            expect(loaded?.history).toHaveLength(1);
            expect(loaded?.history[0].expression).toBe('5 * 6');
        });
    });

    describe('clearState', () => {
        it('저장된 상태를 삭제해야 한다', () => {
            const state: CalculatorState = {
                expression: '2 + 3',
                currentNumber: '',
                result: null,
                history: [],
                theme: 'light',
            };

            storage.saveState(state);
            expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

            storage.clearState();
            expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        });
    });

    describe('에러 처리', () => {
        it('LocalStorage가 가득 찬 경우 에러를 처리해야 한다', () => {
            // LocalStorage quota 초과 시뮬레이션
            const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation(() => {
                throw new Error('QuotaExceededError');
            });

            const state: CalculatorState = {
                expression: '',
                currentNumber: '',
                result: null,
                history: [],
                theme: 'light',
            };

            // 에러가 발생해도 예외를 던지지 않아야 함
            expect(() => storage.saveState(state)).not.toThrow();

            setItemSpy.mockRestore();
        });

        it('LocalStorage 접근 불가 시 에러를 처리해야 한다', () => {
            const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(() => {
                throw new Error('SecurityError');
            });

            // 에러가 발생해도 null을 반환해야 함
            const loaded = storage.loadState();
            expect(loaded).toBeNull();

            getItemSpy.mockRestore();
        });
    });

    describe('데이터 검증', () => {
        it('유효하지 않은 데이터 구조는 null을 반환해야 한다', () => {
            // 필수 필드가 없는 데이터
            const invalidData = {
                expression: '2 + 3',
                // currentNumber, result, history, theme 누락
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidData));
            const loaded = storage.loadState();

            // 유효성 검증에 실패하면 null 반환
            expect(loaded).toBeNull();
        });

        it('유효한 데이터 구조만 반환해야 한다', () => {
            const validData: CalculatorState = {
                expression: '2 + 3',
                currentNumber: '5',
                result: '5',
                history: [],
                theme: 'dark',
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(validData));
            const loaded = storage.loadState();

            expect(loaded).not.toBeNull();
            expect(loaded).toEqual(validData);
        });
    });
});
