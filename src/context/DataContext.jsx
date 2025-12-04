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
    // 데이터 버전 관리 - 버전이 다르면 tasks를 재초기화
    const DATA_VERSION = '2.7'; // 팀원 목록 업데이트
    const currentVersion = localStorage.getItem('dataVersion');

    if (currentVersion !== DATA_VERSION) {
      // 버전이 다르면 tasks, projects, milestones, deliverables, teamMembers를 삭제하여 재초기화되도록 함
      localStorage.removeItem('tasks');
      localStorage.removeItem('projects');
      localStorage.removeItem('milestones');
      localStorage.removeItem('deliverables');
      localStorage.removeItem('teamMembers'); // Add this to clear old teamMembers
      localStorage.setItem('dataVersion', DATA_VERSION);
    }

    if (!localStorage.getItem('projects')) {
      const initialProjects = [
        { name: '프로젝트 A', dueDate: '2025-12-31', status: '진행중', description: '웹 애플리케이션 개발', assignee: '고재환', auditType: '설계' },
        { name: '프로젝트 B', dueDate: '2025-06-30', status: '계획', description: '모바일 앱 런칭', assignee: '김기홍', auditType: '요구정의' },
        { name: '프로젝트 C', dueDate: '2025-09-15', status: '진행중', description: '인공지능 분석 시스템 개발', assignee: '김명현', auditType: '설계' },
        { name: '프로젝트 D', dueDate: '2026-02-28', status: '예정', description: '클라우드 서비스 플랫폼 구축', assignee: '김상협', auditType: '요구정의' },
        { name: '프로젝트 E', dueDate: '2025-03-31', status: '완료', description: '사내 그룹웨어 마이그레이션', assignee: '고재환', auditType: '종료' },
        { name: '프로젝트 F', dueDate: '2026-06-30', status: '계획', description: '새로운 서비스 런칭 준비', assignee: '김기홍', auditType: '요구정의' },
        { name: '프로젝트 G', dueDate: '2026-08-31', status: '예정', description: '신규 고객사 온보딩', assignee: '고재환', auditType: '설계' },
        { name: '프로젝트 H', dueDate: '2026-04-30', status: '계획', description: '기술 부채 해결', assignee: '최수석', auditType: '종료' }
      ].map(p => ({ ...p, startDate: getRandomStartDate(p.dueDate) }));
      localStorage.setItem('projects', JSON.stringify(initialProjects));
    }

    if (!localStorage.getItem('milestones')) {
      const initialMilestones = [
        { id: 1, project: '프로젝트 A', name: '초기 설계 완료', date: '2025-03-01', status: '완료', description: '시스템 아키텍처 설계' },
        { id: 2, project: '프로젝트 A', name: '프로토타입 개발', date: '2025-06-01', status: '진행중', description: 'UI/UX 프로토타입' },
        { id: 3, project: '프로젝트 B', name: '시장 조사', date: '2025-02-15', status: '계획', description: '사용자 요구 분석' },
        { id: 4, project: '프로젝트 C', name: '기술 타당성 분석', date: '2025-04-15', status: '완료', description: 'AI 모델 선정 및 타당성 분석' },
        { id: 5, project: '프로젝트 A', name: '베타 버전 개발', date: '2025-09-15', status: '예정', description: '베타 버전 개발 및 테스트' },
        { id: 6, project: '프로젝트 C', name: '알고리즘 구현', date: '2025-06-30', status: '진행중', description: '기계학습 알고리즘 구현' },
        { id: 7, project: '프로젝트 D', name: '요구사항 정의', date: '2025-10-01', status: '예정', description: '플랫폼 요구사항 정의 및 분석' },
        { id: 8, project: '프로젝트 B', name: '디자인 완료', date: '2025-04-30', status: '계획', description: '앱 UI/UX 디자인 완료' },
        { id: 9, project: '프로젝트 E', name: '시스템 마이그레이션', date: '2025-02-28', status: '완료', description: '기존 시스템에서 새로운 시스템으로 마이그레이션' },
        { id: 10, project: '프로젝트 E', name: '사용자 교육', date: '2025-03-15', status: '완료', description: '새로운 시스템 사용법 교육' },
        { id: 11, project: '프로젝트 D', name: '아키텍처 설계', date: '2025-12-01', status: '예정', description: '클라우드 아키텍처 설계 및 검증' },
        // Added for upcoming milestones test
        { id: 12, project: '프로젝트 B', name: '알파 테스트', date: '2025-05-20', status: '진행중', description: '내부 알파 테스트 진행' },
        { id: 13, project: '프로젝트 A', name: 'UI 개선', date: '2025-06-10', status: '예정', description: '사용자 피드백 기반 UI 개선' },
        { id: 14, project: '프로젝트 C', name: '데이터 전처리', date: '2025-05-25', status: '계획', description: '분석용 데이터 전처리' },
        { id: 15, project: '프로젝트 B', name: 'QA 리뷰', date: '2025-05-18', status: '완료', description: 'QA팀의 최종 리뷰' },
        { id: 16, project: '프로젝트 A', name: '최종 보고서 제출', date: '2025-12-19', status: '예정', description: '프로젝트 최종 보고서 제출' },
        // Added for guaranteed upcoming milestone
        {
          id: 17,
          project: '프로젝트 F',
          name: '시장 분석 보고서',
          date: (() => {
            const today = new Date();
            const upcomingDate = new Date(today);
            upcomingDate.setDate(today.getDate() + 15);
            return upcomingDate.toISOString().split('T')[0];
          })(),
          status: '계획',
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
        // 요구정의 단계 감리 점검태스크
        { id: 1, name: '과업 및 범위 적정성', project: '프로젝트 A', dueDate: '2025-04-15', status: '완료', assignee: '고재환', description: '프로젝트 A 과업 및 범위 적정성 감리', milestoneId: 1 },
        { id: 2, name: '사업 관리 계획 적정성/실행 가능성', project: '프로젝트 A', dueDate: '2025-07-20', status: '진행중', assignee: '김기홍', description: '프로젝트 A 사업 관리 계획 감리', milestoneId: 2 },
        { id: 3, name: '요구사항 분석 품질', project: '프로젝트 B', dueDate: '2025-03-10', status: '계획', assignee: '김명현', description: '프로젝트 B 요구사항 분석 품질 감리', milestoneId: 3 },
        { id: 4, name: '기술 요소 검토', project: '프로젝트 A', dueDate: '2025-05-25', status: '진행중', assignee: '김상협', description: '프로젝트 A 기술 요소 검토 감리', milestoneId: 1 },
        { id: 5, name: '위험 및 이슈 관리', project: '프로젝트 A', dueDate: '2025-08-15', status: '예정', assignee: '김선미', description: '프로젝트 A 위험 및 이슈 관리 감리', milestoneId: 5 },

        // 설계 단계 감리 점검태스크
        { id: 6, name: '설계 산출물 품질', project: '프로젝트 B', dueDate: '2025-04-01', status: '완료', assignee: '김연식', description: '프로젝트 B 설계 산출물 품질 감리', milestoneId: 3 },
        { id: 7, name: '시스템 구조 설계', project: '프로젝트 A', dueDate: '2025-09-10', status: '예정', assignee: '김영빈', description: '프로젝트 A 시스템 구조 설계 감리', milestoneId: 5 },
        { id: 8, name: '데이터 설계 품질', project: '프로젝트 B', dueDate: '2025-05-30', status: '진행중', assignee: '김상현', description: '프로젝트 B 데이터 설계 품질 감리', milestoneId: 12 },
        { id: 9, name: '보안 및 개인정보 보호', project: '프로젝트 A', dueDate: '2025-06-15', status: '진행중', assignee: '고재환', description: '프로젝트 A 보안 및 개인정보 보호 감리', milestoneId: 2 },
        { id: 10, name: '개발 및 테스트 계획', project: '프로젝트 B', dueDate: '2025-02-20', status: '완료', assignee: '김명현', description: '프로젝트 B 개발 및 테스트 계획 감리', milestoneId: 3 },

        // 종료 단계 감리 점검태스크
        { id: 11, name: '시스템 테스트 및 품질', project: '프로젝트 A', dueDate: '2025-07-05', status: '예정', assignee: '김상협', description: '프로젝트 A 시스템 테스트 및 품질 감리', milestoneId: 5 },
        { id: 12, name: '산출물 및 인수인계', project: '프로젝트 A', dueDate: '2025-08-01', status: '계획', assignee: '김기홍', description: '프로젝트 A 산출물 및 인수인계 감리', milestoneId: 5 },
        { id: 13, name: '과업 내용 이행 여부', project: '프로젝트 C', dueDate: '2025-09-01', status: '예정', assignee: '김기홍', description: '프로젝트 C 과업 내용 이행 여부 감리', milestoneId: 6 },
        { id: 14, name: '시스템 운영 준비', project: '프로젝트 E', dueDate: '2025-03-20', status: '완료', assignee: '고재환', description: '프로젝트 E 시스템 운영 준비 감리', milestoneId: 9 },
        { id: 15, name: '시정조치 확인', project: '프로젝트 E', dueDate: '2025-03-25', status: '완료', assignee: '고재환', description: '프로젝트 E 시정조치 확인 감리', milestoneId: 10 },
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
        { id: 'tm10', name: '이상인', department: '1카미노감리', role: '일반' },
        { id: 'tm11', name: '강희태', department: '1카미노감리', role: '일반' },
        { id: 'tm12', name: '김다정', department: '1카미노감리', role: '일반' },
        { id: 'tm13', name: '김종우', department: '1카미노감리', role: '일반' },
        { id: 'tm14', name: '박강효', department: '1카미노감리', role: '일반' },
        { id: 'tm15', name: '박규효', department: '1카미노감리', role: '일반' },
        { id: 'tm16', name: '박다솜', department: '1카미노감리', role: '일반' },
        { id: 'tm17', name: '박세현', department: '1카미노감리', role: '일반' },
        { id: 'tm18', name: '박용진', department: '1카미노감리', role: '일반' },
        { id: 'tm19', name: '변원규', department: '1카미노감리', role: '일반' },
        { id: 'tm20', name: '서동린', department: '1카미노감리', role: '일반' },
        { id: 'tm21', name: '서우석', department: '1카미노감리', role: '일반' },
        { id: 'tm22', name: '유순학', department: '1카미노감리', role: '일반' },
        { id: 'tm23', name: '윤석원', department: '1카미노감리', role: '일반' },
        { id: 'tm24', name: '이용준', department: '1카미노감리', role: '일반' },
        { id: 'tm25', name: '이종명', department: '1카미노감리', role: '일반' },
        { id: 'tm26', name: '이철희', department: '1카미노감리', role: '일반' },
        { id: 'tm27', name: '임소영', department: '1카미노감리', role: '일반' },
        { id: 'tm28', name: '전창국', department: '1카미노감리', role: '일반' },
        { id: 'tm29', name: '조길제', department: '1카미노감리', role: '일반' },
        { id: 'tm30', name: '최윤경', department: '1카미노감리', role: '일반' },
        { id: 'tm31', name: '최학원', department: '1카미노감리', role: '일반' },
        { id: 'tm32', name: '허상무', department: '1카미노감리', role: '일반' },
        { id: 'tm33', name: '황용철', department: '1카미노감리', role: '일반' },
      ];
      localStorage.setItem('teamMembers', JSON.stringify(initialTeamMembers));
    }


