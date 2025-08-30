import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-card/50 backdrop-blur-sm">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold gradient-text">404</h1>  
          <p className="text-xl text-muted-foreground">Oops! Page not found</p>
          <p className="text-sm text-muted-foreground">The page you're looking for doesn't exist</p>
        </div>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
