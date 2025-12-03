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
    type: 'json',
    inqryDiv: '1' // 1: 공고일시, 2: 입찰마감일시
  });

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
    if (API_KEY) {
      fetchBiddingData();
    } else {
      setError('API 키가 설정되지 않았습니다. .env 파일을 확인하세요.');
    }
  }, [selectedCategory, searchParams.pageNo]);

  const fetchBiddingData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = endpoints[selectedCategory];
      const params = new URLSearchParams({
        serviceKey: API_KEY,
        numOfRows: searchParams.numOfRows,
        pageNo: searchParams.pageNo,
        type: searchParams.type,
        inqryDiv: searchParams.inqryDiv
      });

      const url = `${BASE_URL}${endpoint}?${params}`;
      console.log('API 요청 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API 응답 데이터:', data);

      // API 응답 구조 파싱
      if (data.header?.resultCode === '00') {
        const items = data.body?.items?.item;

        // item이 배열인지 단일 객체인지 확인
        if (items) {
          setBiddingData(Array.isArray(items) ? items : [items]);
        } else {
          setBiddingData([]);
        }
      } else {
        setError(data.header?.resultMsg || '데이터를 불러오는데 실패했습니다.');
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
      // YYYYMMDD 또는 YYYYMMDDHHMM 형식 처리
      if (dateString.length >= 8) {
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
      <h1 className="main-title mb-6">입찰정보 (나라장터)</h1>

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
