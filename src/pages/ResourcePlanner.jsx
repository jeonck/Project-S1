import React, { useState } from 'react';
import { FrappeGantt as Gantt, ViewMode } from "react-frappe-gantt";
import { useData } from '../context/DataContext';

const ResourcePlanner = () => {
  const { teamMembers, tasks, projects, updateTask, updateProject } = useData();
  const [currentViewMode, setCurrentViewMode] = useState(ViewMode.Week);

  const getProjectBarClass = (status) => {
    switch (status) {
      case '진행 중':
        return 'bar-project-progress';
      case '완료':
        return 'bar-project-completed';
      case '계획':
        return 'bar-project-planned';
      default:
        return 'bar-project-planned';
    }
  };

  const getTeamMemberAssignments = (assigneeName) => {
    const memberTasks = tasks
      .filter(task => task.assignee === assigneeName)
      .map(task => ({
        id: `task-${task.id}`,
        name: `[태스크] ${task.name}`,
        start: new Date(new Date(task.dueDate).setDate(new Date(task.dueDate).getDate() - 7)).toISOString().split('T')[0], // Shorter duration for tasks (7 days)
        end: task.dueDate,
        progress: task.status === '완료' ? 100 : Math.floor(Math.random() * 80) + 10,
        custom_class: 'bar-task',
        type: 'task', // Custom property to identify type
        originalId: task.id,
      }));

    const memberProjects = projects
      .filter(project => project.assignee === assigneeName)
      .map(project => ({
        id: `project-${project.name}`,
        name: `[프로젝트] ${project.name}`,
        start: project.startDate, // Use project's own startDate
        end: project.dueDate,
        progress: project.status === '완료' ? 100 : (project.status === '진행 중' ? 50 : 10),
        custom_class: getProjectBarClass(project.status),
        type: 'project', // Custom property to identify type
        originalName: project.name, // Use original name to find in projects array
      }));

    return [...memberTasks, ...memberProjects];
  };

  const handleDateChange = (ganttTask, start, end) => {
    const [type, originalIdOrName] = ganttTask.id.split('-');
    const newStartDate = start.toISOString().split('T')[0];
    const newDueDate = end.toISOString().split('T')[0];

    if (type === 'task') {
      const taskId = parseInt(originalIdOrName);
      const originalTask = tasks.find(t => t.id === taskId);
      if (originalTask) {
        updateTask(taskId, { ...originalTask, dueDate: newDueDate });
      }
    } else if (type === 'project') {
      const projectName = originalIdOrName;
      const originalProject = projects.find(p => p.name === projectName);
      if (originalProject) {
        // Update both startDate and dueDate to maintain the duration
        updateProject(
          projects.findIndex(p => p.name === projectName),
          { ...originalProject, startDate: newStartDate, dueDate: newDueDate }
        );
      }
    }
  };

  const handleProgressChange = (ganttTask, progress) => {
    const [type, originalIdOrName] = ganttTask.id.split('-');
    const newProgress = Math.round(progress); // Ensure integer progress

    if (type === 'task') {
      const taskId = parseInt(originalIdOrName);
      const originalTask = tasks.find(t => t.id === taskId);
      if (originalTask) {
        // Adjust status based on progress (simple logic)
        let newStatus = originalTask.status;
        if (newProgress === 100) {
          newStatus = '완료';
        } else if (newProgress > 0 && originalTask.status === '예정') {
          newStatus = '진행 중';
        } else if (newProgress === 0 && originalTask.status === '진행 중') {
          newStatus = '예정'; // Or some other default
        }
        updateTask(taskId, { ...originalTask, progress: newProgress, status: newStatus });
      }
    } else if (type === 'project') {
      const projectName = originalIdOrName;
      const originalProject = projects.find(p => p.name === projectName);
      if (originalProject) {
        let newStatus = originalProject.status;
        if (newProgress === 100) {
          newStatus = '완료';
        } else if (newProgress > 0 && originalProject.status === '계획') {
          newStatus = '진행 중';
        } else if (newProgress === 0 && originalProject.status === '진행 중') {
          newStatus = '계획';
        }
        updateProject(
          projects.findIndex(p => p.name === projectName),
          { ...originalProject, progress: newProgress, status: newStatus }
        );
      }
    }
  };

  const handleViewModeChange = (mode) => {
    setCurrentViewMode(mode);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">리소스 플래너</h1>
      <p className="text-gray-600 mb-4">
        팀원별 프로젝트 및 태스크 할당을 시각화하고 관리하는 페이지입니다.
      </p>
      
      <style>{`
        .gantt .bar-task .bar {
          fill: #60a5fa; /* Blue for tasks */
        }
        .gantt .bar-project-progress .bar {
          fill: #4f46e5; /* Indigo for 'in progress' */
        }
        .gantt .bar-project-completed .bar {
          fill: #10b981; /* Green for 'completed' */
        }
        .gantt .bar-project-planned .bar {
          fill: #f59e0b; /* Amber for 'planned' */
        }
        .gantt .bar-progress {
          fill: rgba(0, 0, 0, 0.25);
        }
      `}</style>

      <div className="flex justify-between items-start mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewModeChange(ViewMode.Day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${currentViewMode === ViewMode.Day ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Day
          </button>
          <button
            onClick={() => handleViewModeChange(ViewMode.Week)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${currentViewMode === ViewMode.Week ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Week
          </button>
          <button
            onClick={() => handleViewModeChange(ViewMode.Month)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${currentViewMode === ViewMode.Month ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Month
          </button>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm font-semibold mb-2">범례 (Legend)</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: '#4f46e5' }}></span>
              <span className="text-xs text-gray-600">진행 중 (In Progress)</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: '#10b981' }}></span>
              <span className="text-xs text-gray-600">완료 (Completed)</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: '#f59e0b' }}></span>
              <span className="text-xs text-gray-600">계획 (Planned)</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: '#60a5fa' }}></span>
              <span className="text-xs text-gray-600">태스크 (Task)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {teamMembers.map(member => {
          const memberAssignments = getTeamMemberAssignments(member.name);
          return (
            <div key={member.id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{member.name} ({member.department} - {member.role})</h2>
              {memberAssignments.length > 0 ? (
                <Gantt
                  tasks={memberAssignments}
                  viewMode={currentViewMode}
                  onDateChange={handleDateChange}
                  onProgressChange={handleProgressChange}
                  customPopupHtml={(ganttTask) => `
                    <div class="p-2">
                      <h4 class="font-bold">${ganttTask.name}</h4>
                      <p>기간: ${ganttTask.start} ~ ${ganttTask.end}</p>
                      <p>진행률: ${ganttTask.progress}%</p>
                    </div>
                  `}
                />
              ) : (
                <p className="text-gray-500">할당된 작업이 없습니다.</p>
              )}
            </div>
          );
        })}
        {teamMembers.length === 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-center text-gray-500">등록된 팀원이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePlanner;
