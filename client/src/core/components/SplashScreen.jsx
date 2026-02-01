/**
 * Splash Screen Component
 * 
 * Loading indicator shown during session initialization.
 */
const SplashScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
      {/* Animated Logo */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-2xl animate-pulse">
        E
      </div>
      
      {/* Loading Text */}
      <p className="mt-6 text-slate-400 text-sm font-medium">
        Initializing...
      </p>
      
      {/* Loading Spinner */}
      <div className="mt-4 w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
};

export default SplashScreen;
