const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-3 fixed bottom-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-2 md:mb-0 md:ml-64">
            <span className="text-pink-300 font-medium">ProjectPRO</span> - 프로젝트 관리를 위한 솔루션
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 ProjectPRO. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
