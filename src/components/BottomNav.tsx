import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import NavHomeIcon from "@/components/icons/NavHomeIcon";
import NavLikedIcon from "@/components/icons/NavLikedIcon";
import NavMatchesIcon from "@/components/icons/NavMatchesIcon";
import NavSettingsIcon from "@/components/icons/NavSettingsIcon";

const BottomNav = () => {
  const location = useLocation();
  const { likedNames } = useApp();

  const links = [
    { to: "/browse", Icon: NavHomeIcon, label: "Swipe", large: true },
    { to: "/liked", Icon: NavLikedIcon, label: "Liked", count: likedNames.length },
    { to: "/matches", Icon: NavMatchesIcon, label: "Matches" },
    { to: "/settings", Icon: NavSettingsIcon, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg border-t border-foreground/10 bg-[#0012ee]">
      <div className="max-w-lg mx-auto flex justify-around py-3 bg-[#0012ee]">
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
              <link.Icon className={`text-white ${link.large ? "w-8 h-8" : "w-6 h-6"}`} />
              <span className="sr-only">{link.label}</span>
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
