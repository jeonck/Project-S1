const Guide = () => {
  return (
    <div className="p-6">
      <h1 className="main-title mb-6">사용 가이드</h1>

      {/* 시스템 사용법 섹션 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">시스템 사용법</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 가이드 카드 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">프로젝트 생성하기</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>프로젝트 페이지로 이동</li>
              <li>"+ New Project" 버튼 클릭</li>
              <li>프로젝트 이름, 마감일, 상태, 설명 입력</li>
              <li>추가 버튼을 눌러 프로젝트 생성</li>
            </ol>
          </div>

          {/* 가이드 카드 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">작업 관리하기</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>작업 페이지에서 프로젝트 선택</li>
              <li>"+ New Task" 버튼으로 작업 추가</li>
              <li>작업 이름, 담당자, 마감일 설정</li>
              <li>상태를 업데이트하여 진행상황 추적</li>
            </ol>
          </div>

          {/* 가이드 카드 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">마일스톤 설정하기</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>마일스톤 페이지 접속</li>
              <li>프로젝트별로 중요한 이정표 추가</li>
              <li>날짜와 설명을 입력하여 목표 설정</li>
              <li>타임라인에서 진행상황 시각화</li>
            </ol>
          </div>

          {/* 가이드 카드 4 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">대시보드 활용하기</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>대시보드에서 전체 프로젝트 현황 확인</li>
              <li>진행 중인 프로젝트 수 모니터링</li>
              <li>다가오는 마일스톤 미리 확인</li>
              <li>통계 카드로 빠른 인사이트 획득</li>
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
        <div className="space-y-4">
          {/* FAQ 1 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Q: 프로젝트를 삭제하면 관련된 작업도 삭제되나요?
            </h3>
            <p className="text-gray-600">
              A: 네, 프로젝트를 삭제하면 해당 프로젝트에 연결된 모든 마일스톤, 산출물, 작업이 함께 삭제됩니다.
              삭제하기 전에 중요한 데이터는 백업하시기 바랍니다.
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Q: 작업의 담당자를 어떻게 변경하나요?
            </h3>
            <p className="text-gray-600">
              A: 작업 페이지에서 해당 작업의 "수정" 버튼을 클릭한 후, 담당자 필드를 수정하고 저장하면 됩니다.
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Q: 프로젝트 상태는 어떤 종류가 있나요?
            </h3>
            <p className="text-gray-600">
              A: 프로젝트 상태는 "계획", "진행 중", "완료" 세 가지로 구분됩니다.
              프로젝트의 현재 진행 상황에 맞게 상태를 업데이트하시면 됩니다.
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Q: 데이터는 어디에 저장되나요?
            </h3>
            <p className="text-gray-600">
              A: 모든 데이터는 브라우저의 로컬 스토리지에 저장됩니다.
              같은 브라우저에서는 데이터가 유지되지만, 다른 기기나 브라우저에서는 접근할 수 없습니다.
            </p>
          </div>

          {/* FAQ 5 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Q: 마일스톤과 산출물의 차이점은 무엇인가요?
            </h3>
            <p className="text-gray-600">
              A: 마일스톤은 프로젝트의 중요한 이정표나 목표 시점을 나타내며,
              산출물은 프로젝트 진행 중 생성되는 구체적인 결과물(문서, 디자인, 코드 등)을 의미합니다.
            </p>
          </div>

          {/* FAQ 6 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Q: 프로젝트를 필터링할 수 있나요?
            </h3>
            <p className="text-gray-600">
              A: 네, 작업, 마일스톤, 산출물, 요구사항 페이지에서는 프로젝트별로 필터링할 수 있는 드롭다운이 제공됩니다.
              "전체 프로젝트"를 선택하면 모든 항목을 볼 수 있습니다.
            </p>
          </div>

          {/* FAQ 7 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Q: 모바일에서도 사용할 수 있나요?
            </h3>
            <p className="text-gray-600">
              A: 네, ProjectPRO는 반응형 디자인으로 제작되어 데스크톱, 태블릿, 모바일 등
              다양한 기기에서 원활하게 사용하실 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide;
