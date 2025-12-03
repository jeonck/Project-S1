# 환경 설정 가이드

## 로컬 개발 환경 설정

### 1. 환경변수 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 나라장터 API 인증키 (Decoding된 키 사용)
VITE_PROCUREMENT_API_KEY=your_api_key_here
```

### 2. API 키 발급

1. [공공데이터포털](https://www.data.go.kr/) 접속
2. 회원가입 및 로그인
3. "조달청_누리장터 민간입찰공고서비스" 검색
4. 활용신청 후 인증키 발급
5. **Decoding된 키**를 `.env` 파일에 입력

### 3. 개발 서버 실행

```bash
npm install
npm run dev
```

## GitHub Pages 배포 설정

### GitHub Secrets 설정

1. GitHub 저장소 페이지로 이동
2. **Settings** → **Secrets and variables** → **Actions** 클릭
3. **New repository secret** 클릭
4. 다음 Secret 추가:
   - Name: `VITE_PROCUREMENT_API_KEY`
   - Secret: 나라장터 API 키 (Decoding된 키)
5. **Add secret** 클릭

### 자동 배포

- `main` 브랜치에 푸시하면 자동으로 빌드 및 배포됩니다
- GitHub Actions 탭에서 배포 상태를 확인할 수 있습니다

## 주의사항

⚠️ **절대 API 키를 소스코드에 직접 입력하지 마세요!**

- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
- `.env.example` 파일만 커밋되며, 실제 키 값은 포함되지 않습니다
- GitHub Secrets를 통해 안전하게 배포 시 환경변수를 주입합니다

## 트러블슈팅

### API 키가 작동하지 않는 경우

1. Encoding/Decoding 확인
   - **Decoding된 키**를 사용해야 합니다
   - 공공데이터포털에서 두 가지 버전의 키를 제공하므로 확인하세요

2. 개발 서버 재시작
   - `.env` 파일 수정 후 개발 서버를 재시작해야 합니다

3. GitHub Secrets 확인
   - Secret 이름이 정확히 `VITE_PROCUREMENT_API_KEY`인지 확인
   - Secret 값이 올바르게 입력되었는지 확인

### CORS 에러가 발생하는 경우

- 공공데이터포털 API는 서버 사이드에서 호출하는 것을 권장합니다
- 필요시 프록시 서버 설정을 고려하세요
