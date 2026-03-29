import logo from "@/assets/logo.png";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

const PageTitle = ({ children, className = "" }: PageTitleProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <h1 className="text-3xl font-display font-extrabold text-foreground tracking-tight uppercase">
        {children}
      </h1>
      <img src={logo} alt="" className="h-7 w-auto opacity-90" loading="eager" fetchPriority="high" />
    </div>
  );
};

export default PageTitle;
