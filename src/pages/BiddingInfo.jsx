import { useState, useEffect } from 'react';

const BiddingInfo = () => {
  const [biddingData, setBiddingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    numOfRows: '30',
    pageNo: '1',
    inqryDiv: '1', // 1: 등록일시, 2: 입찰공고번호, 3: 변경일시
    inqryBgnDt: '', // YYYYMMDDHHMM 형식
    inqryEndDt: '' // YYYYMMDDHHMM 형식
  });

  // 기본 조회 기간 설정 (과거 30일 ~ 오늘)
  const getDefaultDateRange = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30일 전
    const endDate = now;

    const formatDate = (date, isEnd = false) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}${isEnd ? '2359' : '0000'}`;
    };

    return {
      inqryBgnDt: formatDate(startDate, false),
      inqryEndDt: formatDate(endDate, true)
    };
  };

  const API_KEY = import.meta.env.VITE_PROCUREMENT_API_KEY;
  // 개발환경: 프록시 사용, 프로덕션: 직접 호출
  const BASE_URL = import.meta.env.DEV
    ? '/api/bid/1230000/ad/BidPublicInfoService'
    : 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService';
  const ENDPOINT = '/getBidPblancListInfoServcPPSSrch';

  useEffect(() => {
    // 초기 날짜 범위 설정
    const dateRange = getDefaultDateRange();
    setSearchParams(prev => ({
      ...prev,
      ...dateRange
    }));
  }, []);

  useEffect(() => {
    if (searchParams.inqryBgnDt && searchParams.inqryEndDt) {
      fetchBiddingData();
    }
  }, [searchParams.pageNo, searchParams.inqryBgnDt, searchParams.inqryEndDt]);

  // JSON 파싱 함수
  const parseJSON = (data) => {
    try {
      const response = data?.response;
      if (!response) {
        return { success: false, message: '응답 데이터가 없습니다.' };
      }

      const header = response.header;
      if (header?.resultCode !== '00') {
        return { success: false, message: header?.resultMsg || '데이터를 불러오는데 실패했습니다.' };
      }

      const body = response.body;
      let items = body?.items || [];

      // items가 배열이 아니면 배열로 변환
      if (!Array.isArray(items)) {
        items = items ? [items] : [];
      }

      const totalCount = body?.totalCount || 0;
      return { success: true, items, totalCount };
    } catch (err) {
      console.error('JSON 파싱 오류:', err);
      return { success: false, message: 'JSON 파싱 중 오류가 발생했습니다.' };
    }
  };

  const fetchBiddingData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        numOfRows: searchParams.numOfRows,
        pageNo: searchParams.pageNo,
        inqryDiv: searchParams.inqryDiv,
        inqryBgnDt: searchParams.inqryBgnDt,
        inqryEndDt: searchParams.inqryEndDt,
        indstrytyCd: '6146',
        type: 'json'
      });

      // API 키는 이미 인코딩되어 있으므로 직접 추가
      const url = `${BASE_URL}${ENDPOINT}?serviceKey=${encodeURIComponent(API_KEY)}&${params}`;
      console.log('API 요청 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API 응답 (JSON):', data);

      const result = parseJSON(data);

      if (result.success) {
        const sortedItems = [...(result.items || [])].sort((a, b) => {
          const dateA = parseDateTime(a.bidNtceDt);
          const dateB = parseDateTime(b.bidNtceDt);
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;
          return dateB - dateA; // 내림차순 (최신순)
        });
        setBiddingData(sortedItems);
        console.log('파싱된 데이터 (게시일시 내림차순):', sortedItems);
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

  // 금액 포맷팅 (천 단위 콤마)
  const formatPrice = (price) => {
    if (!price) return '-';
    const num = parseInt(price);
    if (isNaN(num)) return '-';
    return num.toLocaleString('ko-KR') + '원';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      // "2025-07-01 13:21:14" 형식 또는 YYYYMMDDHHMM 형식 처리
      if (dateString.includes('-') || dateString.includes(':')) {
        // 이미 포맷된 날짜 (2025-07-01 13:21:14)
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

  // 날짜 문자열을 Date 객체로 변환
  const parseDateTime = (dateString) => {
    if (!dateString) return null;
    // "2025-12-26 10:00:00" 형식 처리
    if (dateString.includes('-')) {
      return new Date(dateString.replace(' ', 'T'));
    }
    // "202512261000" 형식 처리
    if (dateString.length >= 12) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(8, 10);
      const min = dateString.substring(10, 12);
      return new Date(`${year}-${month}-${day}T${hour}:${min}:00`);
    }
    return null;
  };

  // 입찰진행 단계 계산
  const getBiddingStage = (item) => {
    const now = new Date();
    const bidBegin = parseDateTime(item.bidBeginDt);
    const bidClose = parseDateTime(item.bidClseDt);
    const opening = parseDateTime(item.opengDt);

    if (!bidBegin || !bidClose) return '정보없음';

    if (now < bidBegin) return '입찰예정';
    if (now >= bidBegin && now < bidClose) return '입찰중';
    if (now >= bidClose && opening && now < opening) return '마감';
    if (opening && now >= opening) return '개찰완료';

    return '마감';
  };

  // 입찰진행 요약 (D-day 계산)
  const getBiddingSummary = (item) => {
    const stage = getBiddingStage(item);
    const now = new Date();

    const calcDday = (targetDate) => {
      if (!targetDate) return null;

      // 날짜만 비교 (시간 제외)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

      if (diffDays > 0) return `D-${diffDays}`;
      if (diffDays === 0) return 'D-Day';
      return `D+${Math.abs(diffDays)}`;
    };

    if (stage === '입찰예정') {
      const bidBegin = parseDateTime(item.bidBeginDt);
      const dday = calcDday(bidBegin);
      return dday ? `시작 ${dday}` : '-';
    }

    if (stage === '입찰중') {
      const bidClose = parseDateTime(item.bidClseDt);
      const dday = calcDday(bidClose);
      return dday ? `마감 ${dday}` : '-';
    }

    if (stage === '마감') {
      const opening = parseDateTime(item.opengDt);
      const dday = calcDday(opening);
      return dday ? `개찰 ${dday}` : '-';
    }

    return '완료';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="main-title">입찰정보 (조달청)</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
          공공입찰정보서비스
        </div>
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
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    No
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    업무구분
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    구분
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    입찰공고번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    공고명
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    공고기관
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    수요기관
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                    게시일시<br/>(입찰마감일시)
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    추정가격
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    단계
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    입찰진행요약
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {biddingData.length > 0 ? (
                  biddingData.map((item, index) => {
                    const currentPage = parseInt(searchParams.pageNo);
                    const rowsPerPage = parseInt(searchParams.numOfRows);
                    const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-4 text-center text-sm text-gray-900">
                          {rowNumber}
                        </td>
                        <td className="px-3 py-4 text-center text-sm text-gray-900">
                          {item.srvceDivNm || item.rgstTyNm || '-'}
                        </td>
                        <td className="px-3 py-4 text-center text-sm text-gray-900">
                          {item.ntceKindNm || '-'}
                        </td>
                        <td className="px-3 py-4 text-center text-sm text-blue-600 font-medium">
                          {item.bidNtceUrl ? (
                            <a
                              href={item.bidNtceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {item.bidNtceNo || '-'}
                            </a>
                          ) : (
                            item.bidNtceNo || '-'
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{item.bidNtceNm || '-'}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.ntceInsttNm || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.dminsttNm || item.ntceInsttNm || '-'}
                        </td>
                        <td className="px-3 py-4 text-center text-sm text-gray-500">
                          <div>{formatDate(item.bidNtceDt)}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            ({formatDate(item.bidClseDt)})
                          </div>
                        </td>
                        <td className="px-3 py-4 text-right text-sm text-gray-900">
                          {formatPrice(item.presmptPrce)}
                        </td>
                        <td className="px-3 py-4 text-center text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getBiddingStage(item) === '입찰중' ? 'bg-green-100 text-green-800' :
                            getBiddingStage(item) === '입찰예정' ? 'bg-blue-100 text-blue-800' :
                            getBiddingStage(item) === '마감' ? 'bg-gray-100 text-gray-800' :
                            getBiddingStage(item) === '개찰완료' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getBiddingStage(item)}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-center text-sm font-medium text-gray-900">
                          {getBiddingSummary(item)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                      입찰정보가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

export default BiddingInfo;
