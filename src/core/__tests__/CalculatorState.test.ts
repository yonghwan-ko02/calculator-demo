import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CalculatorState } from '../CalculatorState';
import type { HistoryItem } from '../../types';

describe('CalculatorState', () => {
    let state: CalculatorState;

    beforeEach(() => {
        state = new CalculatorState();
    });

    describe('초기화', () => {
        it('기본값으로 초기화되어야 한다', () => {
            expect(state.getState()).toEqual({
                expression: '',
                currentNumber: '',
                result: null,
                history: [],
                theme: 'system',
                isDegree: true,
                isScientific: false,
            });
        });

        it('커스텀 초기값으로 초기화할 수 있어야 한다', () => {
            const customState = new CalculatorState({
                expression: '2 + 3',
                currentNumber: '5',
                result: '5',
                history: [],
                theme: 'dark',
            });

            expect(customState.getState().expression).toBe('2 + 3');
            expect(customState.getState().theme).toBe('dark');
        });
    });

    describe('상태 업데이트', () => {
        it('expression을 업데이트할 수 있어야 한다', () => {
            state.updateExpression('2 + 3');
            expect(state.getState().expression).toBe('2 + 3');
        });

        it('currentNumber를 업데이트할 수 있어야 한다', () => {
            state.updateCurrentNumber('123');
            expect(state.getState().currentNumber).toBe('123');
        });

        it('result를 업데이트할 수 있어야 한다', () => {
            state.updateResult('42');
            expect(state.getState().result).toBe('42');
        });

        it('theme을 업데이트할 수 있어야 한다', () => {
            state.updateTheme('dark');
            expect(state.getState().theme).toBe('dark');
        });

        it('전체 상태를 한 번에 업데이트할 수 있어야 한다', () => {
            state.setState({
                expression: '10 + 20',
                currentNumber: '30',
                result: '30',
                history: [],
                theme: 'light',
            });

            const currentState = state.getState();
            expect(currentState.expression).toBe('10 + 20');
            expect(currentState.currentNumber).toBe('30');
            expect(currentState.result).toBe('30');
            expect(currentState.theme).toBe('light');
        });
    });

    describe('Observer 패턴', () => {
        it('리스너를 등록할 수 있어야 한다', () => {
            const listener = vi.fn();
            state.subscribe(listener);

            state.updateExpression('2 + 3');

            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(state.getState());
        });

        it('여러 리스너를 등록할 수 있어야 한다', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();

            state.subscribe(listener1);
            state.subscribe(listener2);

            state.updateExpression('2 + 3');

            expect(listener1).toHaveBeenCalledTimes(1);
            expect(listener2).toHaveBeenCalledTimes(1);
        });

        it('리스너를 해제할 수 있어야 한다', () => {
            const listener = vi.fn();
            const unsubscribe = state.subscribe(listener);

            state.updateExpression('2 + 3');
            expect(listener).toHaveBeenCalledTimes(1);

            unsubscribe();
            state.updateExpression('4 + 5');
            expect(listener).toHaveBeenCalledTimes(1); // 여전히 1번만 호출됨
        });

        it('상태 변경 시 모든 리스너에게 알려야 한다', () => {
            const listener = vi.fn();
            state.subscribe(listener);

            state.updateExpression('2 + 3');
            state.updateCurrentNumber('5');
            state.updateResult('5');

            expect(listener).toHaveBeenCalledTimes(3);
        });
    });

    describe('히스토리 관리', () => {
        it('히스토리를 추가할 수 있어야 한다', () => {
            const historyItem: HistoryItem = {
                id: Date.now(),
                expression: '2 + 3',
                result: '5',
                timestamp: Date.now(),
            };

            state.addHistory(historyItem);

            expect(state.getState().history).toHaveLength(1);
            expect(state.getState().history[0]).toEqual(historyItem);
        });

        it('히스토리를 최신순으로 정렬해야 한다', () => {
            const item1: HistoryItem = {
                id: 1,
                expression: '2 + 3',
                result: '5',
                timestamp: 1000,
            };

            const item2: HistoryItem = {
                id: 2,
                expression: '10 + 20',
                result: '30',
                timestamp: 2000,
            };

            state.addHistory(item1);
            state.addHistory(item2);

            const history = state.getState().history;
            expect(history[0].id).toBe(2); // 최신 항목이 먼저
            expect(history[1].id).toBe(1);
        });

        it('히스토리를 삭제할 수 있어야 한다', () => {
            const item: HistoryItem = {
                id: 1,
                expression: '2 + 3',
                result: '5',
                timestamp: Date.now(),
            };

            state.addHistory(item);
            expect(state.getState().history).toHaveLength(1);

            state.removeHistory(1);
            expect(state.getState().history).toHaveLength(0);
        });

        it('모든 히스토리를 삭제할 수 있어야 한다', () => {
            state.addHistory({
                id: 1,
                expression: '2 + 3',
                result: '5',
                timestamp: Date.now(),
            });

            state.addHistory({
                id: 2,
                expression: '10 + 20',
                result: '30',
                timestamp: Date.now(),
            });

            expect(state.getState().history).toHaveLength(2);

            state.clearHistory();
            expect(state.getState().history).toHaveLength(0);
        });

        it('히스토리 최대 개수를 제한해야 한다 (50개)', () => {
            // 51개의 히스토리 추가
            for (let i = 0; i < 51; i++) {
                state.addHistory({
                    id: i,
                    expression: `${i} + ${i}`,
                    result: `${i * 2}`,
                    timestamp: Date.now() + i,
                });
            }

            // 최대 50개만 유지되어야 함
            expect(state.getState().history).toHaveLength(50);

            // 가장 오래된 항목(id: 0)은 제거되어야 함
            const oldestItem = state.getState().history.find(item => item.id === 0);
            expect(oldestItem).toBeUndefined();
        });
    });

    describe('상태 리셋', () => {
        it('상태를 초기값으로 리셋할 수 있어야 한다', () => {
            state.updateExpression('2 + 3');
            state.updateCurrentNumber('5');
            state.updateResult('5');
            state.addHistory({
                id: 1,
                expression: '2 + 3',
                result: '5',
                timestamp: Date.now(),
            });

            state.reset();

            expect(state.getState()).toEqual({
                expression: '',
                currentNumber: '',
                result: null,
                history: [],
                theme: 'system',
                isDegree: true,
                isScientific: false,
            });
        });

        it('리셋 시 리스너에게 알려야 한다', () => {
            const listener = vi.fn();
            state.subscribe(listener);

            state.reset();

            expect(listener).toHaveBeenCalledTimes(1);
        });
    });
});
