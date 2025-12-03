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

  const getRandomStartDate = (dueDate) => {
    const due = new Date(dueDate);
    const randomDays = Math.floor(Math.random() * 30) + 1; // 1 to 30 days before
    const startDate = new Date(due.setDate(due.getDate() - randomDays));
    return startDate.toISOString().split('T')[0];
  };

  const initializeLocalStorage = () => {
    if (!localStorage.getItem('projects')) {
      const initialProjects = [
        { name: '프로젝트 A', dueDate: '2025-12-31', status: '진행 중', description: '웹 애플리케이션 개발', assignee: '고재환' },
        { name: '프로젝트 B', dueDate: '2025-06-30', status: '계획', description: '모바일 앱 런칭', assignee: '김기홍' },
        { name: '프로젝트 C', dueDate: '2025-09-15', status: '진행 중', description: '인공지능 분석 시스템 개발', assignee: '김명현' },
        { name: '프로젝트 D', dueDate: '2026-02-28', status: '계획', description: '클라우드 서비스 플랫폼 구축', assignee: '김상협' },
        { name: '프로젝트 E', dueDate: '2025-03-31', status: '완료', description: '사내 그룹웨어 마이그레이션', assignee: '고재환' },
        { name: '프로젝트 F', dueDate: '2026-06-30', status: '계획', description: '새로운 서비스 런칭 준비', assignee: '김기홍' },
        { name: '프로젝트 G', dueDate: '2026-08-31', status: '계획', description: '신규 고객사 온보딩', assignee: '고재환' },
        { name: '프로젝트 H', dueDate: '2026-04-30', status: '계획', description: '기술 부채 해결', assignee: '최수석' }
      ].map(p => ({ ...p, startDate: getRandomStartDate(p.dueDate) }));
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
        { project: '프로젝트 D', name: '아키텍처 설계', date: '2025-12-01', status: '예정', description: '클라우드 아키텍처 설계 및 검증' },
        // Added for upcoming milestones test
        { project: '프로젝트 B', name: '알파 테스트', date: '2025-05-20', status: '진행 중', description: '내부 알파 테스트 진행' },
        { project: '프로젝트 A', name: 'UI 개선', date: '2025-06-10', status: '예정', description: '사용자 피드백 기반 UI 개선' },
        { project: '프로젝트 C', name: '데이터 전처리', date: '2025-05-25', status: '예정', description: '분석용 데이터 전처리' },
        { project: '프로젝트 B', name: 'QA 리뷰', date: '2025-05-18', status: '완료', description: 'QA팀의 최종 리뷰' },
        { project: '프로젝트 A', name: '최종 보고서 제출', date: '2025-12-19', status: '예정', description: '프로젝트 최종 보고서 제출' },
        // Added for guaranteed upcoming milestone
        { 
          project: '프로젝트 F', 
          name: '시장 분석 보고서', 
          date: (() => {
            const today = new Date();
            const upcomingDate = new Date(today);
            upcomingDate.setDate(today.getDate() + 15);
            return upcomingDate.toISOString().split('T')[0];
          })(), 
          status: '예정', 
          description: '신규 서비스 시장 분석 완료' 
        }
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
        { id: 1, name: '요구정의', project: '프로젝트 A', dueDate: '2025-04-15', status: '완료', assignee: '고재환', description: '프로젝트 A 요구정의 감리' },
        { id: 2, name: '설계', project: '프로젝트 A', dueDate: '2025-07-20', status: '진행 중', assignee: '김기홍', description: '프로젝트 A 설계 감리' },
        { id: 3, name: '요구정의', project: '프로젝트 B', dueDate: '2025-03-10', status: '예정', assignee: '김명현', description: '프로젝트 B 요구정의 감리' },
        { id: 4, name: '설계', project: '프로젝트 A', dueDate: '2025-05-25', status: '진행 중', assignee: '김상협', description: '프로젝트 A 설계 감리' },
        { id: 5, name: '종료', project: '프로젝트 A', dueDate: '2025-08-15', status: '예정', assignee: '김선미', description: '프로젝트 A 종료 감리' },
        { id: 6, name: '종료', project: '프로젝트 B', dueDate: '2025-04-01', status: '완료', assignee: '김연식', description: '프로젝트 B 종료 감리' },
        { id: 7, name: '요구정의', project: '프로젝트 A', dueDate: '2025-09-10', status: '예정', assignee: '김영빈', description: '프로젝트 A 요구정의 감리' },
        { id: 8, name: '설계', project: '프로젝트 B', dueDate: '2025-05-30', status: '진행 중', assignee: '김상현', description: '프로젝트 B 설계 감리' },
        { id: 9, name: '요구정의', project: '프로젝트 C', dueDate: '2025-06-15', status: '예정', assignee: '고재환', description: '프로젝트 C 요구정의 감리' },
        { id: 10, name: '종료', project: '프로젝트 B', dueDate: '2025-02-20', status: '완료', assignee: '김명현', description: '프로젝트 B 종료 감리' },
        { id: 11, name: '요구정의', project: '프로젝트 D', dueDate: '2025-07-05', status: '예정', assignee: '김상협', description: '프로젝트 D 요구정의 감리' },
        { id: 12, name: '설계', project: '프로젝트 C', dueDate: '2025-08-01', status: '예정', assignee: '김기홍', description: '프로젝트 C 설계 감리' }
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
        { id: 'tm9', name: '최수석', department: '1카미노감리', role: '수석' },
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
    if (storedProjects) loadedProjects = JSON.parse(storedProjects).map(project => ({ ...project, startDate: project.startDate || getRandomStartDate(project.dueDate) }));

    const storedMilestones = localStorage.getItem('milestones');
    if (storedMilestones) loadedMilestones = JSON.parse(storedMilestones);

    const storedDeliverables = localStorage.getItem('deliverables');
    if (storedDeliverables) loadedDeliverables = JSON.parse(storedDeliverables);

    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      loadedTasks = JSON.parse(storedTasks).map(task => {
        // Migrate old statuses to new ones
        switch (task.status) {
          case '완료':
            return { ...task, status: '종료' };
          case '진행 중':
            return { ...task, status: '설계' };
          case '예정':
            return { ...task, status: '요구정의' };
          default:
            return task;
        }
      });
    }

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

    // Update dynamic milestone dates (프로젝트 F 시장 분석 보고서)
    const today = new Date();
    const upcomingDate = new Date(today);
    upcomingDate.setDate(today.getDate() + 15);
    const dynamicDateStr = upcomingDate.toISOString().split('T')[0];

    loadedMilestones = loadedMilestones.map(milestone => {
      if (milestone.project === '프로젝트 F' && milestone.name === '시장 분석 보고서') {
        return { ...milestone, date: dynamicDateStr };
      }
      return milestone;
    });

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
