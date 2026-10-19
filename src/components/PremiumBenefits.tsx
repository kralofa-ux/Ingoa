import { Zap, Heart, BookOpen } from 'lucide-react';
export default function PremiumBenefits({ className = '' }: { className?: string }) {
 return <ul className={`space-y-3.5 text-sm font-body text-foreground/80 ${className}`}>
  {[{Icon:Zap,label:'Unlimited swipes'},{Icon:Heart,label:'Couple mode — match together'},{Icon:BookOpen,label:'Full name catalogue access'}].map(({Icon,label})=><li key={label} className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0"><Icon className="w-3.5 h-3.5 text-accent" /></div>{label}</li>)}
 </ul>;
}
