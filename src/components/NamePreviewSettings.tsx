import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
export default function NamePreviewSettings({onSave}:{onSave:()=>void}) {
 const {showNamePreview,setShowNamePreview,lastName,setLastName,middleName,setMiddleName}=useApp();
 const handleNamePreviewToggle=setShowNamePreview;
 const handleSaveNamePreview=onSave;
 return (

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-body font-bold text-foreground/60 uppercase tracking-widest">
              Name Preview
            </h2>
            <Switch checked={showNamePreview} onCheckedChange={handleNamePreviewToggle} />
          </div>
          <AnimatePresence initial={false}>
            {showNamePreview && (
              <motion.div
                key="name-preview-fields"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Middle name (optional)"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body border-0 focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-foreground/40"
                  />
                  <input
                    type="text"
                    placeholder="Last name (optional)"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full frosted-pill text-foreground text-sm font-body border-0 focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-foreground/40"
                  />
                  <Button variant="unstyled"
                    onClick={handleSaveNamePreview}
                    className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-body font-bold uppercase tracking-wider hover:bg-primary/80 active:scale-[0.98] transition-all"
                  >
                    Save
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
 );
}
