import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const Requirements = () => {
  const { projects } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('전체');
  const [requirements, setRequirements] = useState([
    { id: 1, name: '사용자 인증 시스템', project: '프로젝트 A', priority: '높음', status: '승인됨', description: 'OAuth 2.0 기반 인증' },
    { id: 2, name: '대시보드 UI', project: '프로젝트 A', priority: '중간', status: '검토 중', description: '실시간 데이터 대시보드' },
    { id: 3, name: '푸시 알림 기능', project: '프로젝트 B', priority: '높음', status: '신규', description: '모바일 푸시 알림 시스템' },
    { id: 4, name: '데이터 분석 엔진', project: '프로젝트 C', priority: '높음', status: '승인됨', description: 'AI 기반 데이터 분석' },
    { id: 5, name: '결제 시스템', project: '프로젝트 A', priority: '중간', status: '반려됨', description: '멀티 결제 게이트웨이' },
  ]);
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    priority: '중간',
    status: '신규',
    description: '',
  });

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case '높음':
        return 'bg-red-100 text-red-800';
      case '중간':
        return 'bg-yellow-100 text-yellow-800';
      case '낮음':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '신규':
        return 'bg-blue-100 text-blue-800';
      case '검토 중':
        return 'bg-yellow-100 text-yellow-800';
      case '승인됨':
        return 'bg-green-100 text-green-800';
      case '반려됨':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenModal = () => {
    setFormData({
      name: '',
      project: selectedProject === '전체' ? (projects.length > 0 ? projects[0].name : '') : selectedProject,
      priority: '중간',
      status: '신규',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      project: '',
      priority: '중간',
      status: '신규',
      description: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequirement = {
      id: requirements.length > 0 ? Math.max(...requirements.map(r => r.id)) + 1 : 1,
      ...formData
    };
    setRequirements([...requirements, newRequirement]);
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const requirement = requirements.find(r => r.id === id);
    if (confirm(`"${requirement.name}" 요구사항을 삭제하시겠습니까?`)) {
      setRequirements(requirements.filter(r => r.id !== id));
    }
  };

  // 프로젝트별 필터링
  const filteredRequirements = requirements.filter(
    req => selectedProject === '전체' || req.project === selectedProject
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="main-title">요구사항</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:border-blue-600 focus:outline-none"
          >
            <option value="전체">전체 프로젝트</option>
            {projects.map((project, index) => (
              <option key={index} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleOpenModal}
            className="new-project-btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all whitespace-nowrap"
          >
            + New Requirement
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                프로젝트
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                우선순위
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequirements.length > 0 ? (
              filteredRequirements.map((requirement) => (
                <tr key={requirement.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {requirement.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {requirement.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {requirement.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(requirement.priority)}`}>
                      {requirement.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(requirement.status)}`}>
                      {requirement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleDelete(requirement.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  요구사항이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="요구사항 추가"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              프로젝트
            </label>
            <select
              id="project"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="">프로젝트 선택</option>
              {projects.map((project, index) => (
                <option key={index} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              요구사항 이름
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              우선순위
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="높음">높음</option>
              <option value="중간">중간</option>
              <option value="낮음">낮음</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="신규">신규</option>
              <option value="검토 중">검토 중</option>
              <option value="승인됨">승인됨</option>
              <option value="반려됨">반려됨</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              추가
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Requirements;
