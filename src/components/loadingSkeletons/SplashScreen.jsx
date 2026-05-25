import MasjibaLogoMark from '../../assets/masjiba-logo-mark.png';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      {/* The Logo with a 'breathing' animation: 
         - animate-pulse is a standard Tailwind utility, 
         - or we can use custom keyframes for smoother control.
      */}
      <div className="flex flex-col items-center animate-pulse">
        <img 
          src={MasjibaLogoMark} 
          alt="Masjiba Logo" 
          className="h-32 w-32 object-contain mb-6" 
        />
        
        {/* Loading dots or text */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-emerald-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-emerald-700 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-emerald-700 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;