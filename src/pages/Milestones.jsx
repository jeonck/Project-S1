import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const Milestones = () => {
  const { milestones, projects, addMilestone, deleteMilestone } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('전체');
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    date: '',
    status: '예정',
    description: '',
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const handleOpenModal = () => {
    setFormData({
      name: '',
      project: selectedProject === '전체' ? (projects.length > 0 ? projects[0].name : '') : selectedProject,
      date: '',
      status: '예정',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      project: '',
      date: '',
      status: '예정',
      description: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMilestone(formData);
    handleCloseModal();
  };

  const handleDelete = (index) => {
    const milestone = filteredMilestones[index];
    if (confirm(`"${milestone.name}" 마일스톤을 삭제하시겠습니까?`)) {
      // 원본 배열에서의 인덱스를 찾아서 삭제
      const originalIndex = milestones.findIndex(m =>
        m.name === milestone.name &&
        m.project === milestone.project &&
        m.date === milestone.date
      );
      deleteMilestone(originalIndex);
    }
  };

  // 프로젝트별 필터링 및 날짜 정렬
  const filteredMilestones = milestones
    .filter(milestone => selectedProject === '전체' || milestone.project === selectedProject)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="main-title">마일스톤</h1>
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
            + New Milestone
          </button>
        </div>
      </div>

      {filteredMilestones.length > 0 ? (
        <div className="timeline ml-4">
          {filteredMilestones.map((milestone, index) => (
            <div key={index} className="milestone-item bg-white p-4 rounded-md shadow-md hover:translate-y-[-2px] transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{milestone.name}</h3>
                  <p className="text-sm text-gray-600">
                    {milestone.project} · {formatDate(milestone.date)}
                  </p>
                  <p className="text-sm mt-1">
                    <StatusBadge status={milestone.status} />
                  </p>
                  {milestone.description && (
                    <p className="text-sm text-gray-600 mt-3">{milestone.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">마일스톤이 없습니다</p>
          <p className="text-gray-400 text-sm mt-2">새로운 마일스톤을 추가해보세요</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="마일스톤 추가"
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
              마일스톤 이름
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
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              날짜
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            />
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
              <option value="예정">예정</option>
              <option value="진행 중">진행 중</option>
              <option value="완료">완료</option>
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

export default Milestones;
