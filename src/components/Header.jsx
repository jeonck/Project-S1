import { Link } from 'react-router-dom';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 text-white shadow-lg py-3 fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 mr-2 focus:outline-none hover:bg-white/10 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link to="/" className="header-title text-white font-medium flex items-center hover:opacity-90 transition-opacity cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2 text-pink-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            Project-S
          </Link>
        </div>
        <div className="flex items-center">
          <div className="relative text-white mr-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              className="bg-white/10 text-white placeholder-pink-200 border border-transparent rounded-lg py-1 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white/20 transition-all"
              placeholder="검색..."
            />
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
