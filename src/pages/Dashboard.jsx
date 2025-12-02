import { useData } from '../context/DataContext';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const { projects, milestones, deliverables } = useData();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  // 프로젝트 통계
  const progressProjects = projects.filter((p) => p.status === '진행 중').length;
  const completedProjects = projects.filter((p) => p.status === '완료').length;
  const plannedProjects = projects.filter((p) => p.status === '계획').length;

  // 마일스톤 통계
  const completedMilestones = milestones.filter((m) => m.status === '완료').length;
  const progressMilestones = milestones.filter((m) => m.status === '진행 중').length;
  const plannedMilestones = milestones.filter((m) => m.status === '예정').length;

  // 산출물 통계
  const completedDeliverables = deliverables.filter((d) => d.status === '완료').length;
  const progressDeliverables = deliverables.filter((d) => d.status === '진행 중').length;
  const plannedDeliverables = deliverables.filter((d) => d.status === '예정').length;

  // 다가오는 마일스톤
  const today = new Date('2025-05-15');
  today.setHours(0, 0, 0, 0);
  const upcomingLimit = new Date(today);
  upcomingLimit.setDate(today.getDate() + 30);

  const upcomingMilestones = milestones
    .filter((m) => {
      const milestoneDate = new Date(m.date);
      return (
        m.status !== '완료' &&
        milestoneDate >= today &&
        milestoneDate <= upcomingLimit
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="main-title mb-6">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 프로젝트 개요 카드 */}
        <div className="dashboard-card bg-white p-6 rounded-md shadow-sm border border-gray-100 border-l-4 border-l-indigo-600">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">프로젝트 개요</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">전체 프로젝트</span>
              <span className="font-medium">{projects.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">진행 중</span>
              <span className="text-indigo-600 font-medium">{progressProjects}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">완료</span>
              <span className="text-green-600 font-medium">{completedProjects}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">계획</span>
              <span className="text-amber-600 font-medium">{plannedProjects}</span>
            </div>
          </div>
        </div>

        {/* 마일스톤 개요 카드 */}
        <div className="dashboard-card bg-white p-6 rounded-md shadow-sm border border-gray-100 border-l-4 border-l-indigo-600">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">마일스톤 개요</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">전체 마일스톤</span>
              <span className="font-medium">{milestones.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">완료</span>
              <span className="text-green-600 font-medium">{completedMilestones}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">예정</span>
              <span className="text-amber-600 font-medium">{plannedMilestones}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">진행 중</span>
              <span className="text-indigo-600 font-medium">{progressMilestones}</span>
            </div>
          </div>
        </div>

        {/* 산출물 개요 카드 */}
        <div className="dashboard-card bg-white p-6 rounded-md shadow-sm border border-gray-100 border-l-4 border-l-indigo-600">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">산출물 개요</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">전체 산출물</span>
              <span className="font-medium">{deliverables.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">완료</span>
              <span className="text-green-600 font-medium">{completedDeliverables}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">예정</span>
              <span className="text-amber-600 font-medium">{plannedDeliverables}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">진행 중</span>
              <span className="text-indigo-600 font-medium">{progressDeliverables}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 다가오는 마일스톤 섹션 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">다가오는 마일스톤</h2>
        <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                >
                  프로젝트
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                >
                  마일스톤
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                >
                  날짜
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                >
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingMilestones.length > 0 ? (
                upcomingMilestones.map((milestone, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/4">
                      {milestone.project}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/4">
                      {milestone.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                      {formatDate(milestone.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm w-1/4">
                      <StatusBadge status={milestone.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    다가오는 마일스톤이 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
