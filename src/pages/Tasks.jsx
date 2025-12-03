import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const Tasks = () => {
  const { tasks, projects, teamMembers, addTask, updateTask, deleteTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedProject, setSelectedProject] = useState('전체');
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    dueDate: '',
    status: '예정',
    assignee: '',
    description: '',
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const handleOpenModal = (id = null) => {
    if (id !== null) {
      const task = tasks.find(t => t.id === id);
      setEditMode(true);
      setEditId(id);
      setFormData(task);
    } else {
      setEditMode(false);
      setEditId(null);
      setFormData({
        name: '',
        project: selectedProject === '전체' ? (projects.length > 0 ? projects[0].name : '') : selectedProject,
        dueDate: '',
        status: '예정',
        assignee: teamMembers.length > 0 ? teamMembers[0].name : '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      project: '',
      dueDate: '',
      status: '예정',
      assignee: '',
      description: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      updateTask(editId, formData);
    } else {
      addTask(formData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (confirm(`"${task.name}" 작업을 삭제하시겠습니까?`)) {
      deleteTask(id);
    }
  };

  // 프로젝트별 필터링 및 마감일 정렬
  const filteredTasks = tasks
    .filter(task => selectedProject === '전체' || task.project === selectedProject)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="main-title">작업</h1>
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
            onClick={() => handleOpenModal()}
            className="new-project-btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all whitespace-nowrap"
          >
            + New Task
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                감리 유형
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                프로젝트
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마감일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(task.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.assignee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleOpenModal(task.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
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
                  작업이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editMode ? '작업 수정' : '작업 추가'}
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
              감리 유형
            </label>
            <select
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="">감리 유형 선택</option>
              <option value="요구정의">요구정의</option>
              <option value="설계">설계</option>
              <option value="종료">종료</option>
            </select>
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
              <option value="예정">예정</option>
              <option value="진행 중">진행 중</option>
              <option value="완료">완료</option>
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

export default Tasks;
