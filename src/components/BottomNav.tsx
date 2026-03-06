import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Heart, Compass, Users } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const { mode, likedNames, matchedNames } = useApp();

  const links = [
    { to: "/browse", icon: Compass, label: "Browse" },
    { to: "/liked", icon: Heart, label: "Liked", count: likedNames.length },
    ...(mode === "couple"
      ? [{ to: "/matches", icon: Users, label: "Matches", count: matchedNames.length }]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-around py-3">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-1 px-4 py-1 relative transition-colors ${
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <link.icon className="w-5 h-5" fill={active ? "currentColor" : "none"} />
              <span className="text-[10px] font-body font-medium tracking-wider uppercase">{link.label}</span>
              {link.count !== undefined && link.count > 0 && (
                <span className="absolute -top-0.5 right-2 w-4 h-4 rounded-full gradient-ocean text-primary-foreground text-[10px] font-bold flex items-center justify-center">
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
