import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      category: '개요',
      items: [
        {
          path: '/',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          ),
          text: '대시보드',
        },
        {
          path: '/biddinginfo',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          ),
          text: '입찰정보',
        },
        {
          path: '/schedule',
          icon: (
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          ),
          text: '일정표',
        },
        {
          path: '/resourceplanner',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h.01M7 11h.01M7 15h.01M17 15h.01M17 11h.01M14 15h.01M14 11h.01M12 4v2m0 6v2m0 6v2M12 3h.01M12 7h.01M12 11h.01M12 15h.01M12 19h.01M12 23h.01M3 8h.01M7 8h.01M11 8h.01M15 8h.01M19 8h.01M23 8h.01M3 12h.01M7 12h.01M11 12h.01M15 12h.01M19 12h.01M23 12h.01M3 16h.01M7 16h.01M11 16h.01M15 16h.01M19 16h.01M23 16h.01M3 20h.01M7 20h.01M11 20h.01M15 20h.01M19 20h.01M23 20h.01M3 4h.01M7 4h.01M11 4h.01M15 4h.01M19 4h.01M23 4h.01M3 24h.01M7 24h.01M11 24h.01M15 24h.01M19 24h.01M23 24h.01M3 0h.01M7 0h.01M11 0h.01M15 0h.01M19 0h.01M23 0h.01M0 3h.01M0 7h.01M0 11h.01M0 15h.01M0 19h.01M0 23h.01M4 3h.01M4 7h.01M4 11h.01M4 15h.01M4 19h.01M4 23h.01M8 3h.01M8 7h.01M8 11h.01M8 15h.01M8 19h.01M8 23h.01M12 3h.01M12 7h.01M12 11h.01M12 15h.01M12 19h.01M12 23h.01M16 3h.01M16 7h.01M16 11h.01M16 15h.01M16 19h.01M16 23h.01M20 3h.01M20 7h.01M20 11h.01M20 15h.01M20 19h.01M20 23h.01M24 3h.01M24 7h.01M24 11h.01M24 15h.01M24 19h.01M24 23h.01M3 3h.01M7 3h.01M11 3h.01M15 3h.01M19 3h.01M23 3h.01M3 7h.01M7 7h.01M11 7h.01M15 7h.01M19 7h.01M23 7h.01M3 11h.01M7 11h.01M11 11h.01M15 11h.01M19 11h.01M23 11h.01M3 15h.01M7 15h.01M11 15h.01M15 15h.01M19 15h.01M23 15h.01M3 19h.01M7 19h.01M11 19h.01M15 19h.01M19 19h.01M23 19h.01M3 23h.01M7 23h.01M11 23h.01M15 23h.01M19 23h.01M23 23h.01"
            />
          ),
          text: '리소스 플래너',
        },
        {
          path: '/milestones',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ),
          text: '마일스톤',
        },
      ],
    },
    {
      category: '작업 관리',
      items: [
        {
          path: '/projects',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          ),
          text: '프로젝트',
        },
        {
          path: '/tasks',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 19l3-3m0 0l3 3m-3-3v8"
            />
          ),
          text: '태스크',
        },
      ],
    },
    {
      category: '설정',
      items: [
        {
          path: '/teammembers',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.197-1.272-.544-1.802M7 20v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M12 10a2 2 0 11-4 0 2 2 0 014 0zm0 0c1.767 0 2.651.884 3.256 1.488S16.29 13 18 13c1.767 0 2.651.884 3.256 1.488S22.29 16 24 16m-4-6a2 2 0 11-4 0 2 2 0 014 0z"
            />
          ),
          text: '팀원 관리',
        },
        {
          path: '/guide',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          ),
          text: '가이드',
        },
        {
          path: '/requirements',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          ),
          text: '요구사항 관리',
        },
        {
          path: '/deliverables',
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          ),
          text: '산출물',
        },
      ],
    },
  ];

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`overlay fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden backdrop-blur-sm ${
          isOpen ? '' : 'hidden'
        }`}
        onClick={onClose}
      ></div>

      {/* 사이드바 */}
      <aside
        className={`sidebar w-64 fixed top-14 bottom-14 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="sidebar-container p-6 h-full overflow-y-auto">
          <Link to="/" onClick={onClose} className="sidebar-header flex items-center pb-6 mb-6 border-b border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
              P
            </div>
            <div className="text-xl font-semibold text-indigo-600">ProjectManager</div>
          </Link>

          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              <div className="text-xs uppercase font-semibold text-gray-400 mb-3 pl-2 tracking-wider">
                {section.category}
              </div>
              <ul className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg text-gray-700 cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100 hover:text-indigo-600 hover:translate-x-1 ${
                        location.pathname === item.path
                          ? 'bg-blue-50 text-indigo-600 font-medium border-l-4 border-indigo-600'
                          : ''
                      }`}
                      onClick={onClose}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-3 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {item.icon}
                      </svg>
                      <span className="text-sm">{item.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center px-4 py-3 rounded-lg bg-blue-50">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-xs text-gray-600">
                <strong className="block text-gray-700 font-medium">도움이 필요하신가요?</strong>
                가이드를 확인하세요
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
