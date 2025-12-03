import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';

const BiddingInfo = () => {
  const [biddingData, setBiddingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('service'); // service, goods, construction, etc
  const [searchParams, setSearchParams] = useState({
    numOfRows: '10',
    pageNo: '1',
    inqryDiv: '1', // 1: 공고일시, 2: 입찰마감일시
    inqryBgnDt: '', // YYYYMMDDHHMM 형식
    inqryEndDt: '' // YYYYMMDDHHMM 형식
  });

  // 기본 조회 기간 설정 (최근 30일)
  const getDefaultDateRange = () => {
    const now = new Date();
    const endDate = now;
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30일 전

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

  const API_KEY = import.meta.env.VITE_PROCUREMENT_API_KEY;
  const BASE_URL = 'https://apis.data.go.kr/1230000/ao/PrvtBidNtceService';

  // 카테고리별 엔드포인트
  const endpoints = {
    service: '/getPrvtBidPblancListInfoServc', // 용역
    goods: '/getPrvtBidPblancListInfoThng', // 물품
    construction: '/getPrvtBidPblancListInfoCnstwk', // 공사
    etc: '/getPrvtBidPblancListInfoEtc' // 기타
  };

  const categoryNames = {
    service: '용역',
    goods: '물품',
    construction: '공사',
    etc: '기타'
  };

  useEffect(() => {
    // 초기 날짜 범위 설정
    const dateRange = getDefaultDateRange();
    setSearchParams(prev => ({
      ...prev,
      ...dateRange
    }));
  }, []);

  useEffect(() => {
    if (API_KEY && searchParams.inqryBgnDt && searchParams.inqryEndDt) {
      fetchBiddingData();
    } else if (!API_KEY) {
      setError('API 키가 설정되지 않았습니다. .env 파일을 확인하세요.');
    }
  }, [selectedCategory, searchParams.pageNo, searchParams.inqryBgnDt, searchParams.inqryEndDt]);

  // XML 파싱 함수
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
      return { success: false, message: resultMsg || '데이터를 불러오는데 실패했습니다.' };
    }

    const items = [];
    const itemElements = xmlDoc.getElementsByTagName('item');

    for (let i = 0; i < itemElements.length; i++) {
      const item = itemElements[i];

      // 업종코드 추출 (servcDtlList에서 파싱)
      const servcDtlList = getTextContent(item, 'servcDtlList');
      let indstryCode = '';

      // servcDtlList 형식: [1^블록히팅배관 설치사업^충청북도 진천군 덕산면 두촌리 일대^2016-09-30^업종코드]
      // 또는 다른 필드에서 업종코드를 찾을 수 있음
      if (servcDtlList) {
        const parts = servcDtlList.split('^');
        if (parts.length >= 5) {
          indstryCode = parts[4]; // 5번째 요소가 업종코드일 가능성
        }
      }

      const itemData = {
        bidNtceNo: getTextContent(item, 'bidNtceNo'),
        bidNtceOrd: getTextContent(item, 'bidNtceOrd'),
        bidNtceClsfc: getTextContent(item, 'bidNtceClsfc'),
        nticeDt: getTextContent(item, 'nticeDt'),
        refNo: getTextContent(item, 'refNo'),
        ntceNm: getTextContent(item, 'ntceNm'),
        ntceDivNm: getTextContent(item, 'ntceDivNm'),
        ntceInsttNm: getTextContent(item, 'ntceInsttNm'),
        bidMethdNm: getTextContent(item, 'bidMethdNm'),
        cntrctMthdNm: getTextContent(item, 'cntrctMthdNm'),
        sucsfbidMthdNm: getTextContent(item, 'sucsfbidMthdNm'),
        rbidDivNm: getTextContent(item, 'rbidDivNm'),
        bidQlfctNm: getTextContent(item, 'bidQlfctNm'),
        ofclNm: getTextContent(item, 'ofclNm'),
        ofclTelNo: getTextContent(item, 'ofclTelNo'),
        ofclEmail: getTextContent(item, 'ofclEmail'),
        bidBeginDt: getTextContent(item, 'bidBeginDt'),
        bidClseDt: getTextContent(item, 'bidClseDt'),
        opengDt: getTextContent(item, 'opengDt'),
        opengPlce: getTextContent(item, 'opengPlce'),
        refAmt: getTextContent(item, 'refAmt'),
        asignBdgtAmt: getTextContent(item, 'asignBdgtAmt'),
        rgstDt: getTextContent(item, 'rgstDt'),
        servcDtlList: servcDtlList,
        indstryCode: indstryCode
      };

      // 업종코드 1108만 필터링 (업종코드가 있는 경우만)
      // 업종코드가 없거나 빈 경우는 모두 포함
      if (!indstryCode || indstryCode === '1108' || indstryCode.includes('1108')) {
        items.push(itemData);
      }
    }

    const totalCount = getTextContent(xmlDoc, 'totalCount');

    return { success: true, items, totalCount };
  };

  const fetchBiddingData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = endpoints[selectedCategory];
      const params = new URLSearchParams({
        serviceKey: API_KEY,
        numOfRows: searchParams.numOfRows,
        pageNo: searchParams.pageNo,
        inqryDiv: searchParams.inqryDiv,
        inqryBgnDt: searchParams.inqryBgnDt,
        inqryEndDt: searchParams.inqryEndDt,
        indstrytycd: '1108' // 업종코드: 1108 (정보통신업)
      });

      const url = `${BASE_URL}${endpoint}?${params}`;
      console.log('API 요청 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlText = await response.text();
      console.log('API 응답 (XML):', xmlText.substring(0, 500));

      const result = parseXML(xmlText);

      if (result.success) {
        setBiddingData(result.items || []);
        console.log('파싱된 데이터:', result.items);
      } else {
        setError(result.message);
        setBiddingData([]);
      }
    } catch (err) {
      console.error('입찰정보 조회 오류:', err);
      setError('입찰정보를 불러오는 중 오류가 발생했습니다: ' + err.message);
      setBiddingData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams({ ...searchParams, pageNo: '1' });
  };

  const handlePageChange = (direction) => {
    const currentPage = parseInt(searchParams.pageNo);
    const newPage = direction === 'next' ? currentPage + 1 : Math.max(1, currentPage - 1);
    setSearchParams({
      ...searchParams,
      pageNo: String(newPage)
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      // "2016-06-01 13:10:26" 형식 또는 YYYYMMDDHHMM 형식 처리
      if (dateString.includes('-') || dateString.includes(':')) {
        // 이미 포맷된 날짜 (2016-06-01 13:10:26)
        return dateString;
      } else if (dateString.length >= 8) {
        // YYYYMMDD 또는 YYYYMMDDHHMM 형식
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="main-title">입찰정보 (나라장터)</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
          업종코드: 1108 (정보통신업)
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-2" aria-label="Tabs">
          {Object.entries(categoryNames).map(([key, name]) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`
                whitespace-nowrap py-3 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-colors
                ${selectedCategory === key
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {name}
            </button>
          ))}
        </nav>
      </div>

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

      {/* 입찰 목록 테이블 */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    공고번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    공고명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    공고기관
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    공고일시
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    입찰시작
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    입찰마감
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {biddingData.length > 0 ? (
                  biddingData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                        {item.bidNtceNo || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-md">
                          <div className="font-medium">{item.ntceNm || '-'}</div>
                          {item.bidMethdNm && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.bidMethdNm} | {item.cntrctMthdNm || '-'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>{item.ntceInsttNm || '-'}</div>
                        {item.ofclNm && (
                          <div className="text-xs text-gray-500 mt-1">
                            담당: {item.ofclNm}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.nticeDt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.bidBeginDt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.bidClseDt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      입찰정보가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {biddingData.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={searchParams.pageNo === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <button
                  onClick={() => handlePageChange('next')}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    페이지 <span className="font-medium">{searchParams.pageNo}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange('prev')}
                      disabled={searchParams.pageNo === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      이전
                    </button>
                    <button
                      onClick={() => handlePageChange('next')}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      다음
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* API 키 안내 */}
      {!API_KEY && (
        <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">API 키 설정 필요</h3>
          <p className="text-yellow-700 mb-2">
            입찰정보를 조회하려면 나라장터 API 키가 필요합니다.
          </p>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>프로젝트 루트에 .env 파일을 생성하세요</li>
            <li>VITE_PROCUREMENT_API_KEY=your_api_key 형식으로 키를 추가하세요</li>
            <li>개발 서버를 재시작하세요</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default BiddingInfo;
