import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Heart, Home, Users, List } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const { mode, likedNames, matchedNames } = useApp();

  const links = [
    { to: "/browse", icon: Home, label: "Browse" },
    { to: "/liked", icon: Heart, label: "Liked", count: likedNames.length },
    ...(mode === "couple"
      ? [{ to: "/matches", icon: Users, label: "Matches", count: matchedNames.length }]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors relative ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <link.icon className="w-5 h-5" fill={active ? "currentColor" : "none"} />
              <span className="text-xs font-body font-medium">{link.label}</span>
              {link.count !== undefined && link.count > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
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
