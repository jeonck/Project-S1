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
  const [selectedAuditStage, setSelectedAuditStage] = useState(''); // New state for audit stage

  // Define inspection tasks by audit stage
  const inspectionTasksByStage = {
    '요구정의': [
      '과업 및 범위 적정성',
      '사업 관리 계획 적정성/실행 가능성',
      '요구사항 분석 품질',
      '기술 요소 검토',
      '위험 및 이슈 관리',
    ],
    '설계': [
      '설계 산출물 품질',
      '시스템 구조 설계',
      '데이터 설계 품질',
      '보안 및 개인정보 보호',
      '개발 및 테스트 계획',
      '과업 이행 점검',
    ],
    '종료': [
      '시스템 테스트 및 품질',
      '산출물 및 인수인계',
      '가어 내용 이행 여부',
      '시스템 운영 준비',
      '시정조치 확인',
    ],
  };

  const [formData, setFormData] = useState({
    name: '', // This will hold the specific inspection task
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

      // Determine the audit stage for the existing task name
      let stage = '';
      for (const s in inspectionTasksByStage) {
        if (inspectionTasksByStage[s].includes(task.name)) {
          stage = s;
          break;
        }
      }
      setSelectedAuditStage(stage);
      setFormData(task);
    } else {
      setEditMode(false);
      setEditId(null);
      const defaultStage = '요구정의';
      const defaultTaskName = inspectionTasksByStage[defaultStage][0];
      setSelectedAuditStage(defaultStage);
      setFormData({
        name: defaultTaskName,
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
    setSelectedAuditStage(''); // Reset audit stage on close
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
                태스크 유형
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
                편집
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
            <label htmlFor="auditStage" className="block text-sm font-medium text-gray-700 mb-1">
              감리 단계
            </label>
            <select
              id="auditStage"
              value={selectedAuditStage}
              onChange={(e) => {
                setSelectedAuditStage(e.target.value);
                // Reset formData.name when audit stage changes
                setFormData({ ...formData, name: inspectionTasksByStage[e.target.value]?.[0] || '' });
              }}
              className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="">감리 단계 선택</option>
              {Object.keys(inspectionTasksByStage).map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          {selectedAuditStage && inspectionTasksByStage[selectedAuditStage] && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                점검 태스크
              </label>
              <select
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-600 focus:outline-none"
                required
              >
                <option value="">점검 태스크 선택</option>
                {inspectionTasksByStage[selectedAuditStage].map((taskName) => (
                  <option key={taskName} value={taskName}>
                    {taskName}
                  </option>
                ))}
              </select>
            </div>
          )}
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
              <option value="계획">계획</option>
              <option value="진행중">진행중</option>
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
