const Footer = () => {
  return (
    <footer className="mt-auto pt-8 text-sm text-gray-400">
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <a 
            href="https://lukasjost.de" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            lukasjost.de
          </a>
          <a 
            href="https://github.com/noplacetoh1de/programmable-soundboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub Repository
          </a>
        </div>
        <div>
          © {new Date().getFullYear()} Lukas Jost
        </div>
      </div>
    </footer>
  );
};

export default Footer;