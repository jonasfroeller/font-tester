const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 p-4 text-center text-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <img src="https://avatars.githubusercontent.com/u/121523551?v=4" alt="Jonas Fröller" className="w-6 h-6 rounded-full" />
          <span>
            Made by <a href="https://jonasfroeller.is-a.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Jonas Fröller</a>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <img src="https://merginit.com/favicon.png" alt="Imprint" className="w-6 h-6" />
          <a href="https://merginit.com/legal/imprint" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Imprint
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
