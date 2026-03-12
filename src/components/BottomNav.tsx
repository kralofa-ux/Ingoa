import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Heart, Home, Users, Settings } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const { likedNames } = useApp();

  const links = [
    { to: "/browse", icon: Home, label: "Swipe" },
    { to: "/liked", icon: Heart, label: "Liked", count: likedNames.length },
    { to: "/matches", icon: Users, label: "Matches" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-around py-3">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center px-5 py-1 rounded-xl transition-colors relative ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <link.icon className="w-6 h-6" fill={active ? "currentColor" : "none"} />
              {active && (
                <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
              {link.count !== undefined && link.count > 0 && (
                <span className="absolute -top-0.5 right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                  {link.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
