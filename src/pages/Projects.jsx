import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const Projects = () => {
  const { projects, teamMembers, addProject, updateProject, deleteProject } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dueDate: '',
    status: '계획',
    description: '',
    assignee: '',
    startDate: '', // Added startDate
    auditType: '요구정의', // Added auditType
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const handleOpenModal = (index = null) => {
    if (index !== null) {
      setEditMode(true);
      setEditIndex(index);
      setFormData(projects[index]);
    } else {
      setEditMode(false);
      setEditIndex(null);
      setFormData({
        name: '',
        dueDate: '',
        status: '계획',
        description: '',
        assignee: teamMembers.length > 0 ? teamMembers[0].name : '',
        startDate: '', // Initialize startDate for new projects
        auditType: '요구정의', // Initialize auditType for new projects
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      dueDate: '',
      status: '계획',
      description: '',
      assignee: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      updateProject(editIndex, formData);
    } else {
      const isDuplicate = projects.some((p) => p.name === formData.name);
      if (isDuplicate) {
        alert('이미 존재하는 프로젝트 이름입니다.');
        return;
      }
      addProject(formData);
    }

    handleCloseModal();
  };

  const handleDelete = (index) => {
    const project = projects[index];
    if (confirm(`"${project.name}" 프로젝트를 삭제하시겠습니까?`)) {
      deleteProject(index);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="main-title mb-4 md:mb-0">프로젝트</h1>
        <button
          onClick={() => handleOpenModal()}
          className="new-project-btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          + New Project
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                감리 단계
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                시작일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마감일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                편집
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200" id="projects-table-body">
            {projects.map((project, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {project.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.auditType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.assignee}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.startDate ? formatDate(project.startDate) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(project.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleOpenModal(index)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editMode ? '프로젝트 수정' : '프로젝트 추가'}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
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
            <label htmlFor="auditType" className="block text-sm font-medium text-gray-700 mb-1">
              감리 단계
            </label>
            <select
              id="auditType"
              value={formData.auditType}
              onChange={(e) => setFormData({ ...formData, auditType: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="요구정의">요구정의</option>
              <option value="설계">설계</option>
              <option value="종료">종료</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
              담당자
            </label>
            <select
              id="assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="">담당자 선택</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              시작일
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              마감일
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
              <option value="계획">계획</option>
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
              {editMode ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
