import type { HistoryItem } from '../../types';
import { Formatter } from '../../utils/Formatter';

/**
 * 계산 히스토리 패널 컴포넌트
 * 계산 히스토리를 표시하고 관리합니다.
 */
export class HistoryPanel {
    private container: HTMLElement;
    private panel: HTMLElement;
    private historyList: HTMLElement;
    private isOpen: boolean = false;
    private onHistoryClick: (item: HistoryItem) => void;
    private onHistoryDelete: (id: number) => void;
    private onClearAll: () => void;

    constructor(
        container: HTMLElement,
        onHistoryClick: (item: HistoryItem) => void,
        onHistoryDelete: (id: number) => void,
        onClearAll: () => void
    ) {
        this.container = container;
        this.onHistoryClick = onHistoryClick;
        this.onHistoryDelete = onHistoryDelete;
        this.onClearAll = onClearAll;
        this.panel = document.createElement('div');
        this.historyList = document.createElement('div');
        this.render();
    }

    /**
     * 히스토리 패널 UI를 렌더링합니다.
     */
    private render(): void {
        this.panel.className = 'history-panel-side';

        // 헤더
        const header = document.createElement('div');
        header.className = 'history-header';
        header.innerHTML = `
            <h2 class="history-title">History</h2>
        `;

        // 전체 삭제 버튼
        const clearAllButton = document.createElement('button');
        clearAllButton.textContent = '전체 삭제';
        clearAllButton.className = 'history-clear-btn';

        clearAllButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onClearAll();
        });

        // 히스토리 목록
        this.historyList.className = 'history-list-container';

        // 닫기 버튼 이벤트
        header.querySelector('#close-history')?.addEventListener('click', () => {
            this.close();
        });

        this.panel.appendChild(header);
        this.panel.appendChild(clearAllButton); // 헤더 아래 상단 배치
        this.panel.appendChild(this.historyList);
        this.container.appendChild(this.panel);
    }

    /**
     * 히스토리 목록을 업데이트합니다.
     */
    updateHistory(history: HistoryItem[]): void {
        this.historyList.innerHTML = '';

        if (history.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.padding = '32px';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = 'var(--color-text-secondary)';
            emptyMessage.textContent = '계산 기록이 없습니다';
            this.historyList.appendChild(emptyMessage);
            return;
        }

        history.forEach(item => {
            const historyItem = this.createHistoryItem(item);
            this.historyList.appendChild(historyItem);
        });
    }

    /**
     * 히스토리 항목 요소를 생성합니다.
     */
    private createHistoryItem(item: HistoryItem): HTMLElement {
        const element = document.createElement('div');
        element.className = 'history-panel-item fade-in';

        const expression = document.createElement('div');
        expression.style.fontSize = '14px';
        expression.style.color = 'var(--color-text-secondary)';
        expression.textContent = item.expression;

        const result = document.createElement('div');
        result.style.fontSize = '18px';
        result.style.fontWeight = '600';
        result.style.color = 'var(--color-text)';
        result.textContent = `= ${Formatter.formatResult(item.result)}`;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️'; // 쓰레기통 아이콘
        deleteButton.className = 'history-delete-btn';
        deleteButton.setAttribute('aria-label', 'Delete item');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onHistoryDelete(item.id);
        });

        element.appendChild(deleteButton);
        element.appendChild(expression);
        element.appendChild(result);

        // 항목 클릭 시 수식 재사용
        element.addEventListener('click', () => {
            this.onHistoryClick(item);
        });

        return element;
    }

    /**
     * 히스토리 패널을 엽니다.
     */
    open(): void {
        this.isOpen = true;
        this.panel.classList.add('open');
    }

    /**
     * 히스토리 패널을 닫습니다.
     */
    close(): void {
        this.isOpen = false;
        this.panel.classList.remove('open');
    }

    /**
     * 히스토리 패널을 토글합니다.
     */
    toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * 패널이 열려있는지 확인합니다.
     */
    getIsOpen(): boolean {
        return this.isOpen;
    }
}
