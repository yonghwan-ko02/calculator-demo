# 기여 가이드 (Contributing Guide)

이 프로젝트에 관심을 가져주셔서 감사합니다! 여러분의 기여가 더 좋은 계산기를 만드는 데 큰 도움이 됩니다.

## 🤝 기여 방법

1. **Fork** 이 저장소를 자신의 계정으로 포크합니다.
2. **Clone** 포크한 저장소를 로컬에 클론합니다.
   ```bash
   git clone https://github.com/YOUR_USERNAME/calculator-demo.git
   ```
3. **Branch** 새로운 기능을 위한 브랜치를 생성합니다.
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Commit** 변경 사항을 커밋합니다. (커밋 메시지는 명확하게 작성해주세요)
   ```bash
   git commit -m 'feat: Add some amazing feature'
   ```
5. **Push** 브랜치에 푸시합니다.
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Pull Request** 원본 저장소로 Pull Request를 보냅니다.

## 🧪 테스트

모든 변경 사항은 테스트를 통과해야 합니다. PR을 보내기 전에 테스트를 실행해 주세요.

```bash
npm test
```

## 📝 코드 스타일

- TypeScript를 사용하며, 엄격한 타입 체크(Strict Mode)를 준수합니다.
- Prettier와 ESLint 설정에 따라 코드를 포맷팅해 주세요.

## 🐛 버그 제보

이슈 탭을 통해 버그를 제보해 주세요. 가능한 한 자세한 정보(재현 방법, 환경 등)를 제공해 주시면 감사하겠습니다.

---

**즐거운 코딩 되세요!** 🚀
