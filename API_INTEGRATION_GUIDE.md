# 조달청 공공입찰정보 API 연동 가이드

이 문서는 조달청 공공입찰정보서비스 API를 React 애플리케이션에 통합하는 방법을 설명합니다.

## 목차
- [개요](#개요)
- [API 정보](#api-정보)
- [준비사항](#준비사항)
- [구현 방법](#구현-방법)
- [전체 소스코드](#전체-소스코드)
- [주요 기능 설명](#주요-기능-설명)
- [커스터마이징](#커스터마이징)
- [트러블슈팅](#트러블슈팅)

---

## 개요

조달청에서 제공하는 공공입찰정보를 조회하고 표시하는 기능을 구현합니다.

### 주요 기능
- 최근 30일 입찰공고 조회
- 10개 컬럼 테이블 형식 UI
- 페이지네이션 지원
- 입찰 진행 단계 시각화 (입찰예정/입찰중/마감/개찰완료)
- 입찰 마감까지 남은 일수 표시 (D-day)
- 나라장터 상세 페이지 링크

---

## API 정보

### 기본 정보
- **제공기관:** 조달청
- **서비스명:** 공공입찰정보서비스
- **API 유형:** REST API (XML 응답)
- **인증방식:** Service Key

### 엔드포인트
```
GET https://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoServc
```

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|---------|------|------|------|------|
| ServiceKey | String | ✅ | 공공데이터포털에서 발급받은 인증키 | `m/kMIZ...` |
| numOfRows | String | ✅ | 한 페이지 결과 수 | `10` |
| pageNo | String | ✅ | 페이지 번호 | `1` |
| inqryDiv | String | ✅ | 조회구분 (1:등록일시, 2:입찰공고번호, 3:변경일시) | `1` |
| inqryBgnDt | String | ⚠️ | 조회시작일시 (YYYYMMDDHHMM) | `202512010000` |
| inqryEndDt | String | ⚠️ | 조회종료일시 (YYYYMMDDHHMM) | `202512312359` |
| bidNtceNo | String | ⚠️ | 입찰공고번호 (inqryDiv=2일 때 필수) | `R25BK00934017` |

> ⚠️ `inqryDiv`가 1 또는 3인 경우 `inqryBgnDt`, `inqryEndDt`가 필수입니다.

### 응답 형식 (XML)

```xml
<response>
  <header>
    <resultCode>00</resultCode>
    <resultMsg>정상</resultMsg>
  </header>
  <body>
    <items>
      <item>
        <bidNtceNo>R25BK00934017</bidNtceNo>
        <bidNtceNm>공고명</bidNtceNm>
        <ntceInsttNm>공고기관명</ntceInsttNm>
        <dminsttNm>수요기관명</dminsttNm>
        <bidNtceDt>2025-07-01 13:21:14</bidNtceDt>
        <bidClseDt>2025-07-08 14:00:00</bidClseDt>
        <opengDt>2025-07-08 15:00:00</opengDt>
        <bidNtceUrl>https://www.g2b.go.kr/...</bidNtceUrl>
        <!-- 기타 필드들 -->
      </item>
    </items>
    <numOfRows>10</numOfRows>
    <totalCount>100</totalCount>
  </body>
</response>
```

---

## 준비사항

### 1. API 키 발급

1. [공공데이터포털](https://www.data.go.kr/) 접속
2. 회원가입 및 로그인
3. "공공입찰정보서비스" 검색
4. 활용신청 후 인증키 발급
5. **Decoding된 키** 사용

### 2. 필요한 패키지

이 구현은 React 기본 기능만 사용하며, 추가 패키지 설치가 필요하지 않습니다.

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

---

## 구현 방법

### Step 1: 기본 구조 설정

```javascript
import { useState, useEffect } from 'react';

const BiddingInfo = () => {
  const [biddingData, setBiddingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    numOfRows: '10',
    pageNo: '1',
    inqryDiv: '1', // 1: 등록일시
    inqryBgnDt: '',
    inqryEndDt: ''
  });

  const API_KEY = 'YOUR_API_KEY_HERE';
  const BASE_URL = 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService';
  const ENDPOINT = '/getBidPblancListInfoServc';

  // ...
};
```

### Step 2: 날짜 범위 설정 함수

```javascript
// 최근 30일 날짜 범위 생성
const getDefaultDateRange = () => {
  const now = new Date();
  const endDate = now;
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}0000`;
  };

  return {
    inqryBgnDt: formatDateTime(startDate),
    inqryEndDt: formatDateTime(endDate)
  };
};
```

### Step 3: XML 파싱 함수

```javascript
const parseXML = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const getTextContent = (element, tagName) => {
    const el = element.getElementsByTagName(tagName)[0];
    return el ? el.textContent : '';
  };

  const resultCode = getTextContent(xmlDoc, 'resultCode');
  const resultMsg = getTextContent(xmlDoc, 'resultMsg');

  if (resultCode !== '00') {
    return {
      success: false,
      message: resultMsg || '데이터를 불러오는데 실패했습니다.'
    };
  }

  const items = [];
  const itemElements = xmlDoc.getElementsByTagName('item');

  for (let i = 0; i < itemElements.length; i++) {
    const item = itemElements[i];

    const itemData = {
      bidNtceNo: getTextContent(item, 'bidNtceNo'),
      bidNtceNm: getTextContent(item, 'bidNtceNm'),
      ntceInsttNm: getTextContent(item, 'ntceInsttNm'),
      dminsttNm: getTextContent(item, 'dminsttNm'),
      bidNtceDt: getTextContent(item, 'bidNtceDt'),
      bidClseDt: getTextContent(item, 'bidClseDt'),
      opengDt: getTextContent(item, 'opengDt'),
      bidNtceUrl: getTextContent(item, 'bidNtceUrl'),
      ntceKindNm: getTextContent(item, 'ntceKindNm'),
      srvceDivNm: getTextContent(item, 'srvceDivNm'),
      rgstTyNm: getTextContent(item, 'rgstTyNm'),
      bidBeginDt: getTextContent(item, 'bidBeginDt'),
      // 필요한 필드 추가
    };

    items.push(itemData);
  }

  const totalCount = getTextContent(xmlDoc, 'totalCount');
  const numOfRows = getTextContent(xmlDoc, 'numOfRows');

  return { success: true, items, totalCount, numOfRows };
};
```

### Step 4: API 호출 함수

```javascript
const fetchBiddingData = async () => {
  setLoading(true);
  setError(null);

  try {
    const params = new URLSearchParams({
      ServiceKey: API_KEY,
      numOfRows: searchParams.numOfRows,
      pageNo: searchParams.pageNo,
      inqryDiv: searchParams.inqryDiv,
      inqryBgnDt: searchParams.inqryBgnDt,
      inqryEndDt: searchParams.inqryEndDt
    });

    const url = `${BASE_URL}${ENDPOINT}?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const result = parseXML(xmlText);

    if (result.success) {
      setBiddingData(result.items || []);
    } else {
      setError(result.message);
      setBiddingData([]);
    }
  } catch (err) {
    setError('입찰정보를 불러오는 중 오류가 발생했습니다: ' + err.message);
    setBiddingData([]);
  } finally {
    setLoading(false);
  }
};
```

### Step 5: useEffect 훅 설정

```javascript
useEffect(() => {
  // 초기 날짜 범위 설정
  const dateRange = getDefaultDateRange();
  setSearchParams(prev => ({
    ...prev,
    ...dateRange
  }));
}, []);

useEffect(() => {
  // 날짜 설정 후 API 호출
  if (searchParams.inqryBgnDt && searchParams.inqryEndDt) {
    fetchBiddingData();
  }
}, [searchParams.pageNo, searchParams.inqryBgnDt, searchParams.inqryEndDt]);
```

### Step 6: 입찰 단계 계산 함수

```javascript
// 입찰 진행 단계 계산
const getBiddingStage = (item) => {
  const now = new Date();
  const bidBegin = item.bidBeginDt ? new Date(item.bidBeginDt) : null;
  const bidClose = item.bidClseDt ? new Date(item.bidClseDt) : null;
  const opening = item.opengDt ? new Date(item.opengDt) : null;

  if (!bidBegin || !bidClose) return '정보없음';

  if (now < bidBegin) return '입찰예정';
  if (now >= bidBegin && now < bidClose) return '입찰중';
  if (now >= bidClose && opening && now < opening) return '마감';
  if (opening && now >= opening) return '개찰완료';

  return '마감';
};

// 입찰 진행 요약 (D-day)
const getBiddingSummary = (item) => {
  const stage = getBiddingStage(item);

  if (stage === '입찰중') {
    const bidClose = new Date(item.bidClseDt);
    const now = new Date();
    const daysLeft = Math.ceil((bidClose - now) / (1000 * 60 * 60 * 24));
    return `D-${daysLeft}`;
  }

  return '-';
};
```

### Step 7: 날짜 포맷팅 함수

```javascript
const formatDate = (dateString) => {
  if (!dateString) return '-';

  try {
    // "2025-07-01 13:21:14" 형식 또는 YYYYMMDDHHMM 형식 처리
    if (dateString.includes('-') || dateString.includes(':')) {
      return dateString;
    } else if (dateString.length >= 8) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);

      if (dateString.length >= 12) {
        const hour = dateString.substring(8, 10);
        const min = dateString.substring(10, 12);
        return `${year}-${month}-${day} ${hour}:${min}`;
      }

      return `${year}-${month}-${day}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
};
```

### Step 8: 페이지네이션 함수

```javascript
const handlePageChange = (direction) => {
  const currentPage = parseInt(searchParams.pageNo);
  const newPage = direction === 'next'
    ? currentPage + 1
    : Math.max(1, currentPage - 1);

  setSearchParams({
    ...searchParams,
    pageNo: String(newPage)
  });
};
```

### Step 9: UI 렌더링

```jsx
return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">입찰정보 (조달청)</h1>

    {/* 에러 메시지 */}
    {error && (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    )}

    {/* 로딩 상태 */}
    {loading && (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">입찰정보를 불러오는 중...</span>
      </div>
    )}

    {/* 테이블 */}
    {!loading && !error && (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-center">No</th>
              <th className="px-3 py-3 text-center">업무구분</th>
              <th className="px-3 py-3 text-center">구분</th>
              <th className="px-3 py-3 text-center">입찰공고번호</th>
              <th className="px-6 py-3 text-left">공고명</th>
              <th className="px-4 py-3 text-left">공고기관</th>
              <th className="px-4 py-3 text-left">수요기관</th>
              <th className="px-3 py-3 text-center">게시일시<br/>(입찰마감일시)</th>
              <th className="px-3 py-3 text-center">단계</th>
              <th className="px-3 py-3 text-center">입찰진행요약</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {biddingData.map((item, index) => {
              const rowNumber = (parseInt(searchParams.pageNo) - 1) *
                                parseInt(searchParams.numOfRows) + index + 1;

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-center">{rowNumber}</td>
                  <td className="px-3 py-4 text-center">
                    {item.srvceDivNm || item.rgstTyNm || '-'}
                  </td>
                  <td className="px-3 py-4 text-center">
                    {item.ntceKindNm || '-'}
                  </td>
                  <td className="px-3 py-4 text-center text-blue-600">
                    {item.bidNtceUrl ? (
                      <a href={item.bidNtceUrl} target="_blank" rel="noopener noreferrer">
                        {item.bidNtceNo}
                      </a>
                    ) : (
                      item.bidNtceNo || '-'
                    )}
                  </td>
                  <td className="px-6 py-4">{item.bidNtceNm || '-'}</td>
                  <td className="px-4 py-4">{item.ntceInsttNm || '-'}</td>
                  <td className="px-4 py-4">
                    {item.dminsttNm || item.ntceInsttNm || '-'}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <div>{formatDate(item.bidNtceDt)}</div>
                    <div className="text-xs text-gray-400">
                      ({formatDate(item.bidClseDt)})
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      getBiddingStage(item) === '입찰중' ? 'bg-green-100 text-green-800' :
                      getBiddingStage(item) === '입찰예정' ? 'bg-blue-100 text-blue-800' :
                      getBiddingStage(item) === '마감' ? 'bg-gray-100 text-gray-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {getBiddingStage(item)}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center">
                    {getBiddingSummary(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={searchParams.pageNo === '1'}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            이전
          </button>
          <span>페이지 {searchParams.pageNo}</span>
          <button
            onClick={() => handlePageChange('next')}
            className="px-4 py-2 border rounded-md"
          >
            다음
          </button>
        </div>
      </div>
    )}
  </div>
);
```

---

## 전체 소스코드

완전한 구현 코드는 [`src/pages/BiddingInfo.jsx`](./src/pages/BiddingInfo.jsx) 파일을 참고하세요.

---

## 주요 기능 설명

### 1. XML 파싱

조달청 API는 XML 형식으로 응답을 반환합니다. 브라우저 내장 `DOMParser`를 사용하여 파싱합니다.

```javascript
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
```

**장점:**
- 추가 라이브러리 불필요
- 브라우저 네이티브 지원
- 빠른 파싱 속도

**대안:**
- `fast-xml-parser` 라이브러리 사용
- `xml2js` 라이브러리 사용

### 2. 날짜 처리

API는 두 가지 날짜 형식을 사용합니다:
- 요청: `YYYYMMDDHHMM` (예: `202512010000`)
- 응답: `YYYY-MM-DD HH:MM:SS` (예: `2025-12-01 10:00:00`)

`formatDate` 함수는 두 형식을 모두 처리합니다.

### 3. 입찰 단계 시각화

입찰 진행 상태를 4단계로 구분:

| 단계 | 조건 | 색상 |
|------|------|------|
| 입찰예정 | 현재 < 입찰시작일 | 파랑 |
| 입찰중 | 입찰시작일 ≤ 현재 < 입찰마감일 | 녹색 |
| 마감 | 입찰마감일 ≤ 현재 < 개찰일 | 회색 |
| 개찰완료 | 개찰일 ≤ 현재 | 보라 |

### 4. D-day 계산

입찰중인 공고에 대해 마감까지 남은 일수를 표시합니다.

```javascript
const daysLeft = Math.ceil((bidClose - now) / (1000 * 60 * 60 * 24));
```

---

## 커스터마이징

### 조회 기간 변경

기본값은 최근 30일입니다. 이를 변경하려면:

```javascript
// 최근 7일로 변경
const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

// 최근 3개월로 변경
const startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
```

### 페이지당 행 수 변경

```javascript
const [searchParams, setSearchParams] = useState({
  numOfRows: '20', // 10에서 20으로 변경
  // ...
});
```

### 특정 입찰공고 조회

입찰공고번호로 직접 조회하려면:

```javascript
const [searchParams, setSearchParams] = useState({
  numOfRows: '10',
  pageNo: '1',
  inqryDiv: '2', // 입찰공고번호로 조회
  bidNtceNo: 'R25BK00934017' // 특정 공고번호
});
```

### 컬럼 추가/제거

테이블 컬럼을 추가하거나 제거하려면:

1. `parseXML` 함수에서 필요한 필드 추가:
```javascript
const itemData = {
  // 기존 필드들...
  presmptPrce: getTextContent(item, 'presmptPrce'), // 추정가격 추가
  asignBdgtAmt: getTextContent(item, 'asignBdgtAmt'), // 배정예산 추가
};
```

2. 테이블에 컬럼 추가:
```jsx
<th>추정가격</th>
// ...
<td>{item.presmptPrce || '-'}</td>
```

### 필터링 추가

특정 조건으로 필터링하려면:

```javascript
// 특정 기관만 표시
const filteredData = biddingData.filter(item =>
  item.ntceInsttNm.includes('서울특별시')
);

// 특정 금액 이상만 표시
const filteredData = biddingData.filter(item =>
  parseInt(item.presmptPrce) >= 100000000
);
```

### 정렬 기능 추가

```javascript
// 마감일 기준 정렬
const sortedData = [...biddingData].sort((a, b) =>
  new Date(a.bidClseDt) - new Date(b.bidClseDt)
);

// 금액 기준 정렬
const sortedData = [...biddingData].sort((a, b) =>
  parseInt(b.presmptPrce) - parseInt(a.presmptPrce)
);
```

---

## 트러블슈팅

### 1. CORS 에러 발생

**문제:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**해결방법:**

**옵션 A: 프록시 서버 사용 (개발 환경)**

`package.json`에 프록시 설정:
```json
{
  "proxy": "https://apis.data.go.kr"
}
```

**옵션 B: 백엔드 프록시 구현 (프로덕션)**

```javascript
// Node.js + Express 예시
app.get('/api/bidding', async (req, res) => {
  const { pageNo, inqryBgnDt, inqryEndDt } = req.query;

  const response = await fetch(
    `https://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoServc?` +
    `ServiceKey=${process.env.API_KEY}&pageNo=${pageNo}&...`
  );

  const data = await response.text();
  res.send(data);
});
```

### 2. API 키 인증 실패

**문제:**
```
resultCode: 30
resultMsg: SERVICE_KEY_IS_NOT_REGISTERED_ERROR
```

**해결방법:**
1. API 키가 **Decoding된 키**인지 확인
2. 공공데이터포털에서 활용신청 승인 확인
3. API 키에 공백이나 특수문자가 포함되지 않았는지 확인

### 3. 데이터가 표시되지 않음

**문제:** 빈 테이블만 표시됨

**해결방법:**

1. 브라우저 콘솔에서 API 응답 확인:
```javascript
console.log('API 응답 (XML):', xmlText);
console.log('파싱된 데이터:', result.items);
```

2. 날짜 범위 확인:
```javascript
console.log('조회 기간:', searchParams.inqryBgnDt, '~', searchParams.inqryEndDt);
```

3. resultCode 확인:
- `00`: 정상
- `03`: 데이터 없음
- `30`: 인증키 오류
- `99`: 기타 오류

### 4. XML 파싱 오류

**문제:**
```
Cannot read properties of null
```

**해결방법:**

XML 구조 확인:
```javascript
const parseXML = (xmlString) => {
  console.log('Raw XML:', xmlString);

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // 파싱 에러 확인
  const parseError = xmlDoc.getElementsByTagName('parsererror');
  if (parseError.length > 0) {
    console.error('XML Parse Error:', parseError[0].textContent);
    return { success: false, message: 'XML 파싱 오류' };
  }

  // ...
};
```

### 5. 날짜 형식 오류

**문제:** 날짜가 제대로 표시되지 않음

**해결방법:**

날짜 검증 추가:
```javascript
const formatDate = (dateString) => {
  if (!dateString) return '-';

  console.log('Original date:', dateString);

  try {
    // 날짜 파싱 로직
    const formatted = // ...
    console.log('Formatted date:', formatted);
    return formatted;
  } catch (error) {
    console.error('Date format error:', error);
    return dateString; // 원본 반환
  }
};
```

---

## API 응답 필드 전체 목록

<details>
<summary>펼쳐보기 (클릭)</summary>

| 필드명 | 설명 | 예시 |
|--------|------|------|
| bidNtceNo | 입찰공고번호 | R25BK00934017 |
| bidNtceOrd | 입찰공고차수 | 000 |
| reNtceYn | 재공고여부 | Y/N |
| rgstTyNm | 등록유형명 | 조달청 또는 나라장터 자체 공고건 |
| ntceKindNm | 공고종류명 | 등록공고 |
| intrbidYn | 국제입찰여부 | Y/N |
| bidNtceDt | 입찰공고일시 | 2025-07-01 13:21:14 |
| refNo | 참조번호 | 서울특별시 재무공고 제2025-1698호 |
| bidNtceNm | 입찰공고명 | 공사명 |
| ntceInsttCd | 공고기관코드 | 6110000 |
| ntceInsttNm | 공고기관명 | 서울특별시 |
| dminsttCd | 수요기관코드 | 6114454 |
| dminsttNm | 수요기관명 | 서울특별시 서울아리수본부 |
| bidMethdNm | 입찰방법명 | 전자입찰 |
| cntrctCnclsMthdNm | 계약체결방법명 | 제한경쟁 |
| ntceInsttOfclNm | 공고기관담당자명 | 홍길동 |
| ntceInsttOfclTelNo | 공고기관담당자전화번호 | 02-1234-5678 |
| ntceInsttOfclEmailAdrs | 공고기관담당자이메일 | example@seoul.go.kr |
| bidQlfctRgstDt | 입찰참가자격등록일시 | 2025-07-07 18:00 |
| bidBeginDt | 입찰시작일시 | 2025-07-04 10:00:00 |
| bidClseDt | 입찰마감일시 | 2025-07-08 14:00:00 |
| opengDt | 개찰일시 | 2025-07-08 15:00:00 |
| asignBdgtAmt | 배정예산금액 | 142817400 |
| presmptPrce | 추정가격 | 129834000 |
| opengPlce | 개찰장소 | 국가종합전자조달시스템 |
| bidNtceDtlUrl | 입찰공고상세URL | https://www.g2b.go.kr/... |
| bidNtceUrl | 입찰공고URL | https://www.g2b.go.kr/... |
| srvceDivNm | 용역구분명 | 일반용역 |
| sucsfbidMthdNm | 낙찰방법명 | 적격심사제 |
| rgstDt | 등록일시 | 2025-07-01 13:21:14 |
| VAT | 부가가치세 | 12983400 |
| pubPrcrmntLrgClsfcNm | 공공조달대분류명 | 폐기물 처리 서비스 |
| pubPrcrmntMidClsfcNm | 공공조달중분류명 | 폐기물 처리 |
| pubPrcrmntClsfcNm | 공공조달분류명 | 건설폐기물처리서비스 |

</details>

---

## 참고 자료

- [공공데이터포털](https://www.data.go.kr/)
- [조달청 나라장터](https://www.g2b.go.kr/)
- [공공입찰정보서비스 API 문서](https://www.data.go.kr/data/15076930/openapi.do)
- React 공식 문서: [useEffect](https://react.dev/reference/react/useEffect)
- MDN: [DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)

---

## 라이선스

이 코드는 자유롭게 사용, 수정, 배포할 수 있습니다.

---

## 문의

이슈나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.

---

**작성일:** 2025-12-03
**버전:** 1.0.0
