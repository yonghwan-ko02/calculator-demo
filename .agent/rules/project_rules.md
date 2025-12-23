# Project Rules

## 1. TDD for Core Logic Only

**범위**: UI를 제외한 코어 로직만 TDD(Test-Driven Development)로 구현합니다.

### TDD 적용 대상 (자동화 테스트)
- **계산 엔진** (`CalculatorEngine`): 사칙연산, 연산자 우선순위, 괄호 처리, 에러 핸들링
- **상태 관리** (`CalculatorState`): 상태 초기화, 업데이트, 히스토리 관리
- **유틸리티 함수** (`Formatter`, `Validators`): 숫자 포맷팅, 입력 검증, 수식 파싱
- **스토리지 서비스** (`StorageService`): LocalStorage 저장/불러오기, 직렬화/역직렬화

### TDD 미적용 대상 (수동 테스트)
- **UI 컴포넌트**: Display, Keypad, HistoryPanel, ThemeManager 등
- **DOM 조작 로직**: 렌더링, 이벤트 리스너, 애니메이션
- **스타일링**: CSS, Tailwind 클래스 적용

### TDD 프로세스
1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 코드 개선 및 리팩토링

---

## 2. SOLID Principles

모든 코드 구현은 SOLID 원칙을 준수해야 합니다.

### S - Single Responsibility Principle (단일 책임 원칙)
- 각 클래스/함수는 하나의 책임만 가져야 합니다.
- 예: `CalculatorEngine`은 계산만, `StorageService`는 저장만 담당

### O - Open/Closed Principle (개방-폐쇄 원칙)
- 확장에는 열려있고, 수정에는 닫혀있어야 합니다.
- 예: 새로운 연산자 추가 시 기존 코드 수정 없이 확장 가능하도록 설계

### L - Liskov Substitution Principle (리스코프 치환 원칙)
- 하위 타입은 상위 타입을 대체할 수 있어야 합니다.
- 예: 인터페이스 구현 시 계약 준수

### I - Interface Segregation Principle (인터페이스 분리 원칙)
- 클라이언트는 사용하지 않는 인터페이스에 의존하지 않아야 합니다.
- 예: 큰 인터페이스를 작은 단위로 분리

### D - Dependency Inversion Principle (의존성 역전 원칙)
- 고수준 모듈은 저수준 모듈에 의존하지 않아야 합니다.
- 예: 구체적인 구현이 아닌 추상화에 의존

---

## 3. 코드 품질 기준

- **테스트 커버리지**: 코어 로직 80% 이상
- **린팅**: ESLint 규칙 준수
- **포맷팅**: Prettier 규칙 준수
- **타입 안정성**: TypeScript strict 모드 사용