# 조달청 입찰정보 API 트러블슈팅 가이드

## 개요
나라장터(조달청) 입찰공고 API를 연동하면서 발생한 오류와 해결 방법을 정리한 문서입니다.

---

## 1. 입찰정보가 "개찰완료"만 표시되는 문제

### 증상
- 입찰정보 조회 시 모든 데이터가 "개찰완료" 상태로만 표시됨
- 입찰예정, 입찰중인 데이터가 보이지 않음

### 원인
- 조회 기간이 **과거 날짜만** 포함되어 있었음
- 등록일 기준 최근 30일 데이터를 조회하면 대부분 이미 개찰 완료된 입찰임

### 해결
```javascript
// 변경 전: 과거 30일만 조회
const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const endDate = now;

// 변경 후: 과거 30일 ~ 오늘 (종료시간 2359)
const formatDate = (date, isEnd = false) => {
  return `${year}${month}${day}${isEnd ? '2359' : '0000'}`;
};
```

---

## 2. 입력범위값 초과 에러

### 증상
```
입력범위값 초과 에러
```

### 원인
- 조달청 API는 조회 기간에 제한이 있음
- 미래 날짜(예: 60일 후)까지 조회하려고 하면 에러 발생

### 해결
- 조회 기간을 API가 허용하는 범위 내로 제한
- 과거 30일 ~ 현재까지로 설정

---

## 3. Failed to fetch 에러 (CORS)

### 증상
```
입찰정보를 불러오는 중 오류가 발생했습니다: Failed to fetch
```

### 원인
- 브라우저에서 직접 외부 API(apis.data.go.kr)를 호출할 때 CORS 정책에 의해 차단됨
- 브라우저 보안 정책으로 다른 도메인의 API 직접 호출 불가

### 해결
Vite 프록시 설정 추가 (`vite.config.js`):
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/bid': {
        target: 'https://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bid/, ''),
      },
    },
  },
});
```

API 호출 URL 변경:
```javascript
// 변경 전
const BASE_URL = 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService';

// 변경 후 (프록시 경로 사용)
const BASE_URL = '/api/bid/1230000/ad/BidPublicInfoService';
```

---

## 4. HTTP 500 Internal Server Error

### 증상
```
GET http://localhost:5173/api/bid/... 500 (Internal Server Error)
```

### 원인
- 잘못된 API 엔드포인트 사용
- `BidPublicInfoService04` → 해당 서비스에 API 신청이 되어있지 않음
- API 키가 해당 서비스에 대한 권한이 없음

### 해결
1. 공공데이터포털에서 신청된 API 서비스 확인
2. 올바른 엔드포인트 사용:
```javascript
// 오류 발생 (권한 없음)
const BASE_URL = '/api/bid/1230000/BidPublicInfoService04';

// 정상 작동 (권한 있음)
const BASE_URL = '/api/bid/1230000/ad/BidPublicInfoService';
```

### API 엔드포인트 테스트 방법
```bash
# curl로 직접 API 테스트
curl -s "https://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoServcPPSSrch?serviceKey=YOUR_KEY&numOfRows=10&pageNo=1&inqryDiv=1&inqryBgnDt=202512210000&inqryEndDt=202601202359&type=json"
```

---

## 5. API 키 보안 문제

### 증상
- API 키가 소스코드에 하드코딩되어 있음
- Git 이력에 API 키가 노출됨

### 원인
```javascript
// 보안 취약: 하드코딩된 API 키
const API_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxx';
```

### 해결

#### 5.1 환경변수 사용
`.env` 파일:
```
VITE_PROCUREMENT_API_KEY=your_api_key_here
```

코드에서 환경변수 참조:
```javascript
const API_KEY = import.meta.env.VITE_PROCUREMENT_API_KEY;
```

#### 5.2 Git 이력에서 API 키 제거
```bash
# git-filter-repo를 사용하여 이력에서 민감 정보 제거
echo "literal:YOUR_API_KEY===>REDACTED_API_KEY" > /tmp/replace.txt
git filter-repo --replace-text /tmp/replace.txt --force

# 원격 저장소 다시 추가 및 force push
git remote add origin https://github.com/your/repo.git
git push --force origin main
```

---

## 6. 업종코드 필터링이 적용되지 않는 문제

### 증상
- `indstrytyCd` 파라미터를 추가해도 필터링이 되지 않음

### 원인
- 기본 API(`getBidPblancListInfoServc`)는 업종코드 필터링을 지원하지 않음
- 나라장터 검색조건 API(`getBidPblancListInfoServcPPSSrch`)를 사용해야 함

### 해결
```javascript
// 변경 전: 기본 API (업종코드 필터 미지원)
const ENDPOINT = '/getBidPblancListInfoServc';

// 변경 후: 검색조건 API (업종코드 필터 지원)
const ENDPOINT = '/getBidPblancListInfoServcPPSSrch';

// 파라미터에 업종코드 추가
const params = new URLSearchParams({
  // ... 기타 파라미터
  indstrytyCd: '6146',  // 정보시스템감리업
  type: 'json'
});
```

---

## 7. GitHub Pages 배포 시 HTTP 404 에러

### 증상
```
입찰정보를 불러오는 중 오류가 발생했습니다: HTTP error! status: 404
```
- 로컬 개발 환경에서는 정상 작동
- GitHub Pages 배포 후 404 에러 발생

### 원인
- Vite 프록시 설정(`/api/bid`)은 **로컬 개발 서버에서만 작동**
- GitHub Pages는 정적 파일 호스팅으로 프록시 기능이 없음
- 배포된 사이트에서 `/api/bid/...` 경로를 찾을 수 없어 404 발생

### 해결
환경에 따라 다른 API URL을 사용하도록 분기 처리:

```javascript
const API_KEY = import.meta.env.VITE_PROCUREMENT_API_KEY;

// 개발환경: 프록시 사용, 프로덕션: 직접 호출
const BASE_URL = import.meta.env.DEV
  ? '/api/bid/1230000/ad/BidPublicInfoService'
  : 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService';

const ENDPOINT = '/getBidPblancListInfoServcPPSSrch';
```

### 참고
- `import.meta.env.DEV`: Vite에서 개발 환경 여부를 확인하는 환경변수
- 조달청 API는 CORS를 허용하므로 GitHub Pages에서 직접 호출 가능
- CORS가 허용되지 않는 API의 경우 Vercel/Netlify 등 서버리스 함수 지원 플랫폼으로 배포 필요

---

## 최종 작동 코드 구성

### API 설정
```javascript
const API_KEY = import.meta.env.VITE_PROCUREMENT_API_KEY;

// 환경별 BASE_URL 분기
const BASE_URL = import.meta.env.DEV
  ? '/api/bid/1230000/ad/BidPublicInfoService'
  : 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService';

const ENDPOINT = '/getBidPblancListInfoServcPPSSrch';
```

### API 호출 파라미터
```javascript
const params = new URLSearchParams({
  numOfRows: '10',
  pageNo: '1',
  inqryDiv: '1',
  inqryBgnDt: '202512210000',  // YYYYMMDDHHMM
  inqryEndDt: '202601202359',  // YYYYMMDDHHMM
  indstrytyCd: '6146',         // 업종코드
  type: 'json'
});

const url = `${BASE_URL}${ENDPOINT}?serviceKey=${encodeURIComponent(API_KEY)}&${params}`;
```

### 응답 형식
- `type: 'json'` 파라미터 사용 시 JSON 응답
- 미사용 시 XML 응답

---

## 참고 자료
- [공공데이터포털](https://www.data.go.kr/)
- [나라장터 입찰공고정보서비스 API 문서](https://www.data.go.kr/data/15001206/openapi.do)
