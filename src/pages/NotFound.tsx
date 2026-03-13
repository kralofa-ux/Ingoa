import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-display font-extrabold text-foreground">404</h1>
        <p className="mb-4 text-lg text-foreground/60 font-body">Oops! Page not found</p>
        <a href="/" className="text-foreground font-body font-bold underline hover:text-foreground/80">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
