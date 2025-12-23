# 공학용 전자계산기 Tech Spec

## 1. 아키텍처 개요

### 1.1 기술 스택
- **Runtime**: Browser (Chrome, Edge, Safari, Firefox)
- **Language**: TypeScript (안정성 및 유지보수성 향상)
- **Bundler**: Vite (빠른 개발 환경 및 빌드 최적화)
- **Styling**: Tailwind CSS (유틸리티 퍼스트 CSS)
- **Package Manager**: npm
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions (Build & Deploy)

### 1.2 아키텍처 패턴
- **MVCS (Model-View-Controller-Service)** 패턴 적용
  - **Model**: 계산기 상태 및 데이터 구조 (State, History)
  - **View**: DOM 조작 및 UI 렌더링 (Display, Keypad, HistoryPanel)
  - **Controller**: 사용자 입력 처리 및 로직 연결 (CalculatorController)
  - **Service**: 핵심 계산 로직 (CalculatorEngine)

## 2. 모듈 구조

### 2.1 디렉토리 구조
```
/
├── src/
│   ├── core/
│   │   ├── CalculatorEngine.ts  (계산 로직: Shunting-yard 알고리즘)
│   │   ├── CalculatorState.ts   (상태 관리)
│   │   └── StorageService.ts    (로컬 스토리지 관리)
│   ├── ui/
│   │   ├── components/
│   │   │   ├── Display.ts       (디스플레이 영역 제어)
│   │   │   ├── Keypad.ts        (버튼 이벤트 처리)
│   │   │   └── HistoryPanel.ts  (히스토리 목록 렌더링)
│   │   ├── ThemeManager.ts      (다크/라이트 모드 관리)
│   │   └── UIManager.ts         (전체 UI 조율)
│   ├── utils/
│   │   ├── Formatter.ts         (숫자 포맷팅)
│   │   └── Validators.ts        (입력 유효성 검사)
│   ├── types/
│   │   └── index.ts             (공통 타입 정의)
│   ├── main.ts                  (엔트리 포인트)
│   └── style.css                (Tailwind directives)
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 3. 핵심 로직 상세

### 3.1 계산 알고리즘
- **Shunting-yard Algorithm** 사용
  - 중위 표기법(Infix) -> 후위 표기법(Postfix) 변환
  - 연산자 우선순위 처리 (괄호 > 곱셈/나눗셈 > 덧셈/뺄셈)
  - 공학 함수(sin, cos 등) 지원 용이

### 3.2 상태 관리 (State Management)
- **Observer Pattern** 또는 **Pub/Sub Pattern** 사용하여 상태 변경 시 UI 자동 업데이트
- **State 객체 구조**:
  ```typescript
  interface CalculatorState {
    expression: string;       // 현재 수식 (예: "12 + 5 * ")
    currentNumber: string;    // 현재 입력 중인 숫자 (예: "123")
    result: string | null;    // 계산 결과
    history: HistoryItem[];   // 히스토리 목록
    isDegrees: boolean;       // 각도 단위
    theme: 'light' | 'dark' | 'system';
  }
  ```

### 3.3 정밀도 처리
- JavaScript 부동소수점(`number`)의 한계(예: `0.1 + 0.2 !== 0.3`) 극복을 위해 `decimal.js` 또는 `big.js` 같은 라이브러리 도입 고려
- MVP 단계에서는 내장 `Math` 객체와 유틸리티 함수(epsilon 처리)를 사용하여 1차 구현, 필요 시 라이브러리 전환.

## 4. 데이터 스토리지

### 4.1 LocalStorage Schema
- **Key**: `calc_app_v1`
- **Value (JSON)**:
  ```json
  {
    "theme": "dark",
    "history": [
      {
        "id": 1703315000000,
        "expression": "10 + 20",
        "result": "30",
        "timestamp": 1703315000000
      }
    ],
    "settings": {
      "isDegrees": true
    }
  }
  ```

## 5. UI/UX 구현 전략

### 5.1 반응형 디자인
- Tailwind CSS의 `breakpoints` 활용
- Mobile First 접근 방식
- 데스크톱에서는 중앙 정렬된 모바일 뷰 형태 또는 확장형 레이아웃 제공

### 5.2 테마 시스템
- Tailwind의 `darkMode: 'class'` 기능 활용
- `html` 태그에 `dark` 클래스 토글
- 시스템 설정(`prefers-color-scheme`) 감지하여 초기값 설정

### 5.3 애니메이션
- CSS Transitions 및 Tailwind 유틸리티(`transition-all`, `duration-200`) 사용
- 버튼 클릭 시 `active:scale-95` 효과
- 히스토리 패널 등장은 `transform`과 `opacity` 조합

## 6. 개발 워크플로우

### 6.1 설정 단계
1. `npm create vite@latest .` (Vanilla + TS)
2. Tailwind CSS 설치 및 설정
3. ESLint + Prettier 설정

### 6.2 구현 단계
1. **Core**: `CalculatorEngine` 로직 구현 및 단위 테스트
2. **UI Base**: HTML 구조 및 기본 스타일링
3. **Logic Integration**: DOM 이벤트 리스너 연결 및 상태 연동
4. **Feature**: 히스토리, 설정 등 추가 기능 구현

## 7. 테스트 계획

### 7.1 자동화 테스트 (코어 로직만)
- **Unit Test**: Vitest 사용
  - **계산 엔진** (`CalculatorEngine`): 사칙연산, 우선순위, 괄호, 예외 케이스
  - **상태 관리** (`CalculatorState`): 상태 초기화, 업데이트, 히스토리 관리
  - **유틸리티** (`Formatter`, `Validators`): 숫자 포맷팅, 입력 검증, 수식 파싱
  - **스토리지 서비스** (`StorageService`): LocalStorage 저장/불러오기, 직렬화
  
### 7.2 수동 테스트 (UI)
- **UI 컴포넌트**: 자동화 테스트 없이 수동 테스트로 검증
  - 디스플레이, 키패드, 히스토리 패널, 테마 전환 등
  - 브라우저별 렌더링 확인
  - 반응형 레이아웃 확인
  - 애니메이션 및 인터랙션 확인

## 8. 보안 고려사항
- `eval()` 함수 사용 절대 금지
- 입력값에 대한 Strict Validation 수행
- XSS 방지를 위해 DOM 업데이트 시 `textContent` 사용 권장 (HTML 삽입 지양)
