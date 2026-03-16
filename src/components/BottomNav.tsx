import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import navHome from "@/assets/nav-home.svg";
import navLiked from "@/assets/nav-liked.svg";
import navMatches from "@/assets/nav-matches.svg";
import navSettings from "@/assets/nav-settings.svg";

const BottomNav = () => {
  const location = useLocation();
  const { likedNames } = useApp();

  const links = [
    { to: "/browse", icon: navHome, label: "Swipe" },
    { to: "/liked", icon: navLiked, label: "Liked", count: likedNames.length },
    { to: "/matches", icon: navMatches, label: "Matches" },
    { to: "/settings", icon: navSettings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg border-t border-foreground/10 bg-[#0015ff]">
      <div className="max-w-lg mx-auto flex justify-around py-3 bg-[#0015ff]">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center px-5 py-1 rounded-xl transition-all relative ${
                active ? "opacity-100" : "opacity-50 hover:opacity-70"
              }`}
            >
              <img
                src={link.icon}
                alt={link.label}
                className="w-6 h-6 invert brightness-200"
              />
              {active && <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-foreground" />}
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
