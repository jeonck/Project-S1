import { useData } from '../context/DataContext';
import { getWeek } from 'date-fns';

const Schedule = () => {
  const { teamMembers, projects } = useData();

  // Helper to get all weeks of a given year
  const getWeeksInYear = (year) => {
    const weeks = [];
    for (let i = 1; i <= 53; i++) {
      weeks.push(i);
    }
    return weeks;
  };

  const currentYear = new Date().getFullYear();
  const weeks = getWeeksInYear(currentYear);

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

  return (
    <div className="p-6">
      <h1 className="main-title mb-6">일정표 ({currentYear}년)</h1>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-blue-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-blue-50 z-20 w-32">
                담당자
              </th>
              {weeks.map((week) => (
                <th key={week} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200" style={{ minWidth: '4rem' }}>
                  W{week}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 w-32">
                  {member.name}
                </td>
                {weeks.map((week) => {
                  const activeProjects = projects.filter(p => p.assignee === member.name && isProjectActive(p, week, currentYear));
                  return (
                    <td key={week} className="px-1 py-1 whitespace-nowrap text-xs border-l border-gray-200 h-full">
                      <div className="h-full flex flex-col items-center justify-center space-y-1">
                        {activeProjects.map(p => (
                           <div key={p.name} title={p.name} className="w-full bg-indigo-200 text-indigo-800 rounded-sm px-1 truncate">
                             {p.name}
                           </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
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
