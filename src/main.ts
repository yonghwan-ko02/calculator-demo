import './style.css';
import { CalculatorState } from './core/CalculatorState';
import { StorageService } from './core/StorageService';
import { UIManager } from './ui/UIManager';

/**
 * 애플리케이션 초기화
 */
function initApp() {
  // StorageService 초기화
  const storage = new StorageService();

  // 이전 상태 복원 또는 새로운 상태 생성
  const savedState = storage.loadState();
  const state = savedState
    ? new CalculatorState(savedState)
    : new CalculatorState();

  // UIManager 초기화 (모든 UI 컴포넌트 생성 및 연결)
  const uiManager = new UIManager(state);

  // 상태 변경 시 자동 저장
  state.subscribe((newState) => {
    storage.saveState(newState);
  });

  // 전역 객체에 uiManager 저장 (디버깅 및 테스트용)
  (window as any).calculator = {
    uiManager,
    state,
    storage,
  };

  console.log('✅ 공학용 계산기 초기화 완료');
  console.log('💡 키보드 단축키:');
  console.log('  - 숫자/연산자: 직접 입력');
  console.log('  - Enter: 계산 (=)');
  console.log('  - Backspace: 한 글자 삭제');
  console.log('  - Escape: 전체 삭제 (AC)');
  console.log('  - H: 히스토리 패널 토글');
  console.log('  - T: 테마 토글');
}

// DOM 로드 완료 후 앱 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
