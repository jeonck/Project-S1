import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // localStorage에서 데이터 로드
  useEffect(() => {
    initializeLocalStorage();
    loadData();
  }, []);

  // 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    if (milestones.length > 0) {
      localStorage.setItem('milestones', JSON.stringify(milestones));
    }
  }, [milestones]);

  useEffect(() => {
    if (deliverables.length > 0) {
      localStorage.setItem('deliverables', JSON.stringify(deliverables));
    }
  }, [deliverables]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (teamMembers.length > 0) {
      localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    }
  }, [teamMembers]);

  const initializeLocalStorage = () => {
    if (!localStorage.getItem('projects')) {
      const initialProjects = [
        { name: '프로젝트 A', dueDate: '2025-12-31', status: '진행 중', description: '웹 애플리케이션 개발', assignee: '고재환' },
        { name: '프로젝트 B', dueDate: '2025-06-30', status: '계획', description: '모바일 앱 런칭', assignee: '김기홍' },
        { name: '프로젝트 C', dueDate: '2025-09-15', status: '진행 중', description: '인공지능 분석 시스템 개발', assignee: '김명현' },
        { name: '프로젝트 D', dueDate: '2026-02-28', status: '계획', description: '클라우드 서비스 플랫폼 구축', assignee: '김상협' },
        { name: '프로젝트 E', dueDate: '2025-03-31', status: '완료', description: '사내 그룹웨어 마이그레이션', assignee: '고재환' }
      ];
      localStorage.setItem('projects', JSON.stringify(initialProjects));
    }

    if (!localStorage.getItem('milestones')) {
      const initialMilestones = [
        { project: '프로젝트 A', name: '초기 설계 완료', date: '2025-03-01', status: '완료', description: '시스템 아키텍처 설계' },
        { project: '프로젝트 A', name: '프로토타입 개발', date: '2025-06-01', status: '진행 중', description: 'UI/UX 프로토타입' },
        { project: '프로젝트 B', name: '시장 조사', date: '2025-02-15', status: '예정', description: '사용자 요구 분석' },
        { project: '프로젝트 C', name: '기술 타당성 분석', date: '2025-04-15', status: '완료', description: 'AI 모델 선정 및 타당성 분석' },
        { project: '프로젝트 A', name: '베타 버전 개발', date: '2025-09-15', status: '예정', description: '베타 버전 개발 및 테스트' },
        { project: '프로젝트 C', name: '알고리즘 구현', date: '2025-06-30', status: '진행 중', description: '기계학습 알고리즘 구현' },
        { project: '프로젝트 D', name: '요구사항 정의', date: '2025-10-01', status: '예정', description: '플랫폼 요구사항 정의 및 분석' },
        { project: '프로젝트 B', name: '디자인 완료', date: '2025-04-30', status: '예정', description: '앱 UI/UX 디자인 완료' },
        { project: '프로젝트 E', name: '시스템 마이그레이션', date: '2025-02-28', status: '완료', description: '기존 시스템에서 새로운 시스템으로 마이그레이션' },
        { project: '프로젝트 E', name: '사용자 교육', date: '2025-03-15', status: '완료', description: '새로운 시스템 사용법 교육' },
        { project: '프로젝트 D', name: '아키텍처 설계', date: '2025-12-01', status: '예정', description: '클라우드 아키텍처 설계 및 검증' }
      ];
      localStorage.setItem('milestones', JSON.stringify(initialMilestones));
    }

    if (!localStorage.getItem('deliverables')) {
      const initialDeliverables = [
        { project: '프로젝트 A', name: '설계 문서', date: '2025-03-01', status: '완료', description: '시스템 아키텍처 문서' },
        { project: '프로젝트 A', name: '프로토타입 UI', date: '2025-06-01', status: '진행 중', description: '초기 UI 디자인' },
        { project: '프로젝트 B', name: '시장 조사 보고서', date: '2025-02-15', status: '예정', description: '사용자 요구사항 보고서' }
      ];
      localStorage.setItem('deliverables', JSON.stringify(initialDeliverables));
    }

    if (!localStorage.getItem('tasks')) {
      const initialTasks = [
        { id: 1, name: '데이터베이스 설계', project: '프로젝트 A', dueDate: '2025-04-15', status: '완료', assignee: '고재환', description: '데이터베이스 스키마 및 ERD 설계' },
        { id: 2, name: '프론트엔드 개발', project: '프로젝트 A', dueDate: '2025-07-20', status: '진행 중', assignee: '김기홍', description: 'React 기반 프론트엔드 개발' },
        { id: 3, name: '앱 디자인', project: '프로젝트 B', dueDate: '2025-03-10', status: '예정', assignee: '김명현', description: '모바일 앱 UI/UX 디자인' },
        { id: 4, name: '백엔드 API 개발', project: '프로젝트 A', dueDate: '2025-05-25', status: '진행 중', assignee: '김상협', description: 'REST API 개발 및 문서화' },
        { id: 5, name: '사용자 테스트', project: '프로젝트 A', dueDate: '2025-08-15', status: '예정', assignee: '김선미', description: '실제 사용자를 대상으로 한 앱 테스트 진행' },
        { id: 6, name: '마케팅 전략 수립', project: '프로젝트 B', dueDate: '2025-04-01', status: '완료', assignee: '김연식', description: '모바일 앱 출시를 위한 마케팅 전략 수립' },
        { id: 7, name: '기능 개선', project: '프로젝트 A', dueDate: '2025-09-10', status: '예정', assignee: '김영빈', description: '사용자 피드백을 반영한 기능 개선' },
        { id: 8, name: '앱 출시 준비', project: '프로젝트 B', dueDate: '2025-05-30', status: '진행 중', assignee: '김상현', description: '앱 스토어 등록 및 출시 업무 준비' },
        { id: 9, name: '코드 리뷰', project: '프로젝트 A', dueDate: '2025-06-15', status: '예정', assignee: '고재환', description: '코드 품질 향상을 위한 코드 리뷰 진행' },
        { id: 10, name: '사용자 인터뷰', project: '프로젝트 B', dueDate: '2025-02-20', status: '완료', assignee: '김명현', description: '사용자 요구사항 분석을 위한 인터뷰 진행' },
        { id: 11, name: '성능 최적화', project: '프로젝트 A', dueDate: '2025-07-05', status: '예정', assignee: '김상협', description: '웹 서비스 성능 최적화 작업' },
        { id: 12, name: '빌링 시스템 구현', project: '프로젝트 A', dueDate: '2025-08-01', status: '예정', assignee: '김기홍', description: '사용자 청구 및 결제 시스템 구현' }
      ];
      localStorage.setItem('tasks', JSON.stringify(initialTasks));
    }

    if (!localStorage.getItem('teamMembers')) {
      const initialTeamMembers = [
        { id: 'tm1', name: '고재환', department: '1카미노감리', role: '수석' },
        { id: 'tm2', name: '김기홍', department: '1카미노감리', role: '수석' },
        { id: 'tm3', name: '김명현', department: '1카미노감리', role: '일반' },
        { id: 'tm4', name: '김상현', department: '1카미노감리', role: '일반' },
        { id: 'tm5', name: '김상협', department: '1카미노감리', role: '수석' },
        { id: 'tm6', name: '김선미', department: '1카미노감리', role: '수석' },
        { id: 'tm7', name: '김연식', department: '1카미노감리', role: '수석' },
        { id: 'tm8', name: '김영빈', department: '1카미노감리', role: '수석' },
      ];
      localStorage.setItem('teamMembers', JSON.stringify(initialTeamMembers));
    }
  };

  const loadData = () => {
    let loadedProjects = [];
    let loadedMilestones = [];
    let loadedDeliverables = [];
    let loadedTasks = [];
    let loadedTeamMembers = [];

    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) loadedProjects = JSON.parse(storedProjects);

    const storedMilestones = localStorage.getItem('milestones');
    if (storedMilestones) loadedMilestones = JSON.parse(storedMilestones);

    const storedDeliverables = localStorage.getItem('deliverables');
    if (storedDeliverables) loadedDeliverables = JSON.parse(storedDeliverables);

    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) loadedTasks = JSON.parse(storedTasks);

    const storedTeamMembers = localStorage.getItem('teamMembers');
    if (storedTeamMembers) loadedTeamMembers = JSON.parse(storedTeamMembers);

    // Now process projects to assign missing assignees
    if (loadedTeamMembers.length > 0) {
      loadedProjects = loadedProjects.map(project => {
        if (!project.assignee) {
          const randomIndex = Math.floor(Math.random() * loadedTeamMembers.length);
          return { ...project, assignee: loadedTeamMembers[randomIndex].name };
        }
        return project;
      });
    }

    // Update states
    setProjects(loadedProjects);
    setMilestones(loadedMilestones);
    setDeliverables(loadedDeliverables);
    setTasks(loadedTasks);
    setTeamMembers(loadedTeamMembers);
  };

  // CRUD 함수들
  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  const updateProject = (index, updatedProject) => {
    const newProjects = [...projects];
    newProjects[index] = updatedProject;
    setProjects(newProjects);
  };

  const deleteProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
  };

  const addMilestone = (milestone) => {
    setMilestones([...milestones, milestone]);
  };

  const updateMilestone = (index, updatedMilestone) => {
    const newMilestones = [...milestones];
    newMilestones[index] = updatedMilestone;
    setMilestones(newMilestones);
  };

  const deleteMilestone = (index) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

  const addDeliverable = (deliverable) => {
    setDeliverables([...deliverables, deliverable]);
  };

  const updateDeliverable = (index, updatedDeliverable) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = updatedDeliverable;
    setDeliverables(newDeliverables);
  };

  const deleteDeliverable = (index) => {
    const newDeliverables = deliverables.filter((_, i) => i !== index);
    setDeliverables(newDeliverables);
  };

  const addTask = (task) => {
    const newTask = { ...task, id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1 };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updatedTask) => {
    const newTasks = tasks.map(task => task.id === id ? { ...updatedTask, id } : task);
    setTasks(newTasks);
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  };

  const addTeamMember = (teamMember) => {
    const newTeamMember = { ...teamMember, id: teamMembers.length > 0 ? `tm${Math.max(...teamMembers.map(tm => parseInt(tm.id.substring(2)))) + 1}` : 'tm1' };
    setTeamMembers([...teamMembers, newTeamMember]);
  };

  const updateTeamMember = (id, updatedTeamMember) => {
    const newTeamMembers = teamMembers.map(tm => tm.id === id ? { ...updatedTeamMember, id } : tm);
    setTeamMembers(newTeamMembers);
  };

  const deleteTeamMember = (id) => {
    const newTeamMembers = teamMembers.filter(tm => tm.id !== id);
    setTeamMembers(newTeamMembers);
  };

  const value = {
    projects,
    milestones,
    deliverables,
    tasks,
    teamMembers,
    addProject,
    updateProject,
    deleteProject,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addDeliverable,
    updateDeliverable,
    deleteDeliverable,
    addTask,
    updateTask,
    deleteTask,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
