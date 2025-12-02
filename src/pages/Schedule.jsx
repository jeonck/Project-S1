import { useData } from '../context/DataContext';
import { getWeek, startOfWeek, endOfWeek, format } from 'date-fns';
import { useState } from 'react';

const Schedule = () => {
  const { teamMembers, projects, tasks } = useData();
  const [selectedYear, setSelectedYear] = useState(2025);

  // Generate years from 2025 to 2035
  const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];

  // Helper to get all weeks of a given year
  const getWeeksInYear = (year) => {
    const weeks = [];
    for (let i = 1; i <= 53; i++) {
      weeks.push(i);
    }
    return weeks;
  };

  // Get date range for a given week number in a year
  const getWeekDateRange = (year, weekNumber) => {
    // Create a date in the middle of the year, then find the specified week
    const date = new Date(year, 0, 1);

    // Find the first Monday of the year
    const dayOfWeek = date.getDay();
    const daysToMonday = dayOfWeek === 0 ? 1 : (dayOfWeek === 1 ? 0 : 8 - dayOfWeek);
    date.setDate(date.getDate() + daysToMonday);

    // Add weeks to get to the target week
    date.setDate(date.getDate() + (weekNumber - 1) * 7);

    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

    return {
      start: format(weekStart, 'M/d'),
      end: format(weekEnd, 'M/d'),
      month: weekStart.getMonth() + 1 // 1-12
    };
  };

  const weeks = getWeeksInYear(selectedYear);

  // Group weeks by month for the month header row
  const getMonthGroups = (year) => {
    const groups = [];
    let currentMonth = null;
    let weekCount = 0;

    weeks.forEach((week) => {
      const dateRange = getWeekDateRange(year, week);
      if (dateRange.month !== currentMonth) {
        if (currentMonth !== null) {
          groups.push({ month: currentMonth, weekCount });
        }
        currentMonth = dateRange.month;
        weekCount = 1;
      } else {
        weekCount++;
      }
    });

    // Push the last month group
    if (currentMonth !== null) {
      groups.push({ month: currentMonth, weekCount });
    }

    return groups;
  };

  const monthGroups = getMonthGroups(selectedYear);

  // Check if a project is active in a given week of a year
  const isProjectActive = (project, week, year) => {
    if (!project.startDate || !project.dueDate) {
      return false;
    }

    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.dueDate);

    // The getWeek function is ISO 8601 compliant (week starts on Monday)
    const startWeek = getWeek(projectStart, { weekStartsOn: 1 });
    const endWeek = getWeek(projectEnd, { weekStartsOn: 1 });

    const startYear = projectStart.getFullYear();
    const endYear = projectEnd.getFullYear();

    if (year < startYear || year > endYear) {
      return false;
    }
    if (year === startYear && year === endYear) {
      return week >= startWeek && week <= endWeek;
    }
    if (year === startYear) {
      return week >= startWeek;
    }
    if (year === endYear) {
      return week <= endWeek;
    }
    return true; // Spans the whole year
  };

  // Check if a task is active in a given week of a year
  const isTaskActive = (task, week, year) => {
    if (!task.dueDate) {
      return false;
    }

    const taskEnd = new Date(task.dueDate);
    // Assume task starts 7 days before due date (same as ResourcePlanner)
    const taskStart = new Date(taskEnd);
    taskStart.setDate(taskStart.getDate() - 7);

    const startWeek = getWeek(taskStart, { weekStartsOn: 1 });
    const endWeek = getWeek(taskEnd, { weekStartsOn: 1 });

    const startYear = taskStart.getFullYear();
    const endYear = taskEnd.getFullYear();

    if (year < startYear || year > endYear) {
      return false;
    }
    if (year === startYear && year === endYear) {
      return week >= startWeek && week <= endWeek;
    }
    if (year === startYear) {
      return week >= startWeek;
    }
    if (year === endYear) {
      return week <= endWeek;
    }
    return true;
  };

  return (
    <div className="p-6">
      <h1 className="main-title mb-6">일정표</h1>

      {/* Year Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-2" aria-label="Tabs">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`
                whitespace-nowrap py-3 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-colors
                ${selectedYear === year
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {year}년
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-blue-50 sticky top-0 z-10">
            {/* Month row */}
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-blue-50 z-20 w-32 border-b border-gray-300">
                담당자
              </th>
              {monthGroups.map((group, index) => (
                <th
                  key={index}
                  colSpan={group.weekCount}
                  className="px-3 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border-l border-r border-b border-gray-300"
                  style={{ minWidth: `${group.weekCount * 4}rem` }}
                >
                  {group.month}월
                </th>
              ))}
            </tr>
            {/* Week row */}
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-blue-50 z-20 w-32">

              </th>
              {weeks.map((week) => {
                const dateRange = getWeekDateRange(selectedYear, week);
                return (
                  <th
                    key={week}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 relative group"
                    style={{ minWidth: '4rem' }}
                    title={`${dateRange.start} ~ ${dateRange.end}`}
                  >
                    W{week}
                    <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-30 shadow-lg">
                      {dateRange.start} ~ {dateRange.end}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers.map((member) => {
              // Debug logging for 고재환
              if (member.name === '고재환') {
                const memberProjects = projects.filter(p => p.assignee === member.name);
                const memberTasks = tasks.filter(t => t.assignee === member.name);
                console.log('고재환 Projects:', memberProjects);
                console.log('고재환 Tasks:', memberTasks);
                console.log('Selected Year:', selectedYear);
              }
              return (
              <tr key={member.id}>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 w-32">
                  {member.name}
                </td>
                {weeks.map((week) => {
                  const activeProjects = projects.filter(p => p.assignee === member.name && isProjectActive(p, week, selectedYear));
                  const activeTasks = tasks.filter(t => t.assignee === member.name && isTaskActive(t, week, selectedYear));
                  return (
                    <td key={week} className="px-1 py-1 whitespace-nowrap text-xs border-l border-gray-200 h-full">
                      <div className="h-full flex flex-col items-center justify-center space-y-1">
                        {activeProjects.map(p => (
                           <div key={`project-${p.name}`} title={`[프로젝트] ${p.name}`} className="w-full bg-indigo-200 text-indigo-800 rounded-sm px-1 truncate">
                             {p.name}
                           </div>
                        ))}
                        {activeTasks.map(t => (
                           <div key={`task-${t.id}`} title={`[태스크] ${t.name}`} className="w-full bg-blue-200 text-blue-800 rounded-sm px-1 truncate">
                             {t.name}
                           </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
              );
            })}
            {teamMembers.length === 0 && (
              <tr>
                <td colSpan={weeks.length + 1} className="px-6 py-4 text-center text-gray-500">
                  등록된 팀원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
