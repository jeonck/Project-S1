import { useState, useEffect } from 'react';

const BiddingInfo = () => {
  const [biddingData, setBiddingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    numOfRows: '10',
    pageNo: '1',
    inqryDiv: '1', // 1: 등록일시, 2: 입찰공고번호, 3: 변경일시
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

  const API_KEY = 'm/kMIZWbdINXLJBty7vYEUnARJSXEoVJnwDULZlLDHIOVF4byNSTH1RIVv/ag8S0QsNujnoRppEleapTI2ldcg==';
  const BASE_URL = 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService';
  const ENDPOINT = '/getBidPblancListInfoServc';

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

      const itemData = {
        bidNtceNo: getTextContent(item, 'bidNtceNo'),
        bidNtceOrd: getTextContent(item, 'bidNtceOrd'),
        reNtceYn: getTextContent(item, 'reNtceYn'),
        rgstTyNm: getTextContent(item, 'rgstTyNm'),
        ntceKindNm: getTextContent(item, 'ntceKindNm'),
        intrbidYn: getTextContent(item, 'intrbidYn'),
        bidNtceDt: getTextContent(item, 'bidNtceDt'),
        refNo: getTextContent(item, 'refNo'),
        bidNtceNm: getTextContent(item, 'bidNtceNm'),
        ntceInsttCd: getTextContent(item, 'ntceInsttCd'),
        ntceInsttNm: getTextContent(item, 'ntceInsttNm'),
        dminsttCd: getTextContent(item, 'dminsttCd'),
        dminsttNm: getTextContent(item, 'dminsttNm'),
        bidMethdNm: getTextContent(item, 'bidMethdNm'),
        cntrctCnclsMthdNm: getTextContent(item, 'cntrctCnclsMthdNm'),
        ntceInsttOfclNm: getTextContent(item, 'ntceInsttOfclNm'),
        ntceInsttOfclTelNo: getTextContent(item, 'ntceInsttOfclTelNo'),
        ntceInsttOfclEmailAdrs: getTextContent(item, 'ntceInsttOfclEmailAdrs'),
        exctvNm: getTextContent(item, 'exctvNm'),
        bidQlfctRgstDt: getTextContent(item, 'bidQlfctRgstDt'),
        cmmnSpldmdAgrmntRcptdocMethd: getTextContent(item, 'cmmnSpldmdAgrmntRcptdocMethd'),
        cmmnSpldmdAgrmntClseDt: getTextContent(item, 'cmmnSpldmdAgrmntClseDt'),
        cmmnSpldmdCorpRgnLmtYn: getTextContent(item, 'cmmnSpldmdCorpRgnLmtYn'),
        bidBeginDt: getTextContent(item, 'bidBeginDt'),
        bidClseDt: getTextContent(item, 'bidClseDt'),
        opengDt: getTextContent(item, 'opengDt'),
        asignBdgtAmt: getTextContent(item, 'asignBdgtAmt'),
        presmptPrce: getTextContent(item, 'presmptPrce'),
        opengPlce: getTextContent(item, 'opengPlce'),
        dcmtgOprtnDt: getTextContent(item, 'dcmtgOprtnDt'),
        dcmtgOprtnPlce: getTextContent(item, 'dcmtgOprtnPlce'),
        bidNtceDtlUrl: getTextContent(item, 'bidNtceDtlUrl'),
        bidNtceUrl: getTextContent(item, 'bidNtceUrl'),
        bidPrtcptFeePaymntYn: getTextContent(item, 'bidPrtcptFeePaymntYn'),
        bidPrtcptFee: getTextContent(item, 'bidPrtcptFee'),
        bidGrntymnyPaymntYn: getTextContent(item, 'bidGrntymnyPaymntYn'),
        crdtrNm: getTextContent(item, 'crdtrNm'),
        ppswGnrlSrvceYn: getTextContent(item, 'ppswGnrlSrvceYn'),
        srvceDivNm: getTextContent(item, 'srvceDivNm'),
        prdctClsfcLmtYn: getTextContent(item, 'prdctClsfcLmtYn'),
        mnfctYn: getTextContent(item, 'mnfctYn'),
        purchsObjPrdctList: getTextContent(item, 'purchsObjPrdctList'),
        untyNtceNo: getTextContent(item, 'untyNtceNo'),
        cmmnSpldmdMethdCd: getTextContent(item, 'cmmnSpldmdMethdCd'),
        cmmnSpldmdMethdNm: getTextContent(item, 'cmmnSpldmdMethdNm'),
        stdNtceDocUrl: getTextContent(item, 'stdNtceDocUrl'),
        brffcBidprcPermsnYn: getTextContent(item, 'brffcBidprcPermsnYn'),
        dsgntCmptYn: getTextContent(item, 'dsgntCmptYn'),
        arsltCmptYn: getTextContent(item, 'arsltCmptYn'),
        pqEvalYn: getTextContent(item, 'pqEvalYn'),
        tpEvalYn: getTextContent(item, 'tpEvalYn'),
        ntceDscrptYn: getTextContent(item, 'ntceDscrptYn'),
        rsrvtnPrceReMkngMthdNm: getTextContent(item, 'rsrvtnPrceReMkngMthdNm'),
        arsltApplDocRcptMthdNm: getTextContent(item, 'arsltApplDocRcptMthdNm'),
        arsltReqstdocRcptDt: getTextContent(item, 'arsltReqstdocRcptDt'),
        orderPlanUntyNo: getTextContent(item, 'orderPlanUntyNo'),
        sucsfbidLwltRate: getTextContent(item, 'sucsfbidLwltRate'),
        rgstDt: getTextContent(item, 'rgstDt'),
        bfSpecRgstNo: getTextContent(item, 'bfSpecRgstNo'),
        infoBizYn: getTextContent(item, 'infoBizYn'),
        sucsfbidMthdCd: getTextContent(item, 'sucsfbidMthdCd'),
        sucsfbidMthdNm: getTextContent(item, 'sucsfbidMthdNm'),
        chgDt: getTextContent(item, 'chgDt'),
        dminsttOfclEmailAdrs: getTextContent(item, 'dminsttOfclEmailAdrs'),
        indstrytyLmtYn: getTextContent(item, 'indstrytyLmtYn'),
        chgNtceRsn: getTextContent(item, 'chgNtceRsn'),
        rbidOpengDt: getTextContent(item, 'rbidOpengDt'),
        VAT: getTextContent(item, 'VAT'),
        indutyVAT: getTextContent(item, 'indutyVAT'),
        pubPrcrmntLrgClsfcNm: getTextContent(item, 'pubPrcrmntLrgClsfcNm'),
        pubPrcrmntMidClsfcNm: getTextContent(item, 'pubPrcrmntMidClsfcNm'),
        pubPrcrmntClsfcNo: getTextContent(item, 'pubPrcrmntClsfcNo'),
        pubPrcrmntClsfcNm: getTextContent(item, 'pubPrcrmntClsfcNm')
      };

      items.push(itemData);
    }

    const totalCount = getTextContent(xmlDoc, 'totalCount');
    const numOfRows = getTextContent(xmlDoc, 'numOfRows');

    return { success: true, items, totalCount, numOfRows };
  };

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

  // 입찰진행 단계 계산
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

  // 입찰진행 요약
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
                    <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
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
                  disabled={searchParams.pageNo === '1'}
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
                      disabled={searchParams.pageNo === '1'}
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
    </div>
  );
};

export default BiddingInfo;
