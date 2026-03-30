import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-12 pt-6 px-4 max-w-lg mx-auto bg-[#0012ee] flower-bg">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground/70 font-body text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-foreground/80 font-body text-sm leading-relaxed">
        <p><strong className="text-foreground">Last updated:</strong> March 2026</p>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">What We Collect</h2>
          <p>When you create an account, we collect your email address and password (encrypted). As you use the app, we store your name preferences (likes, passes), culture and gender filter selections, partner connection data, and optional name preview information (middle name, last name).</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">How We Use Your Data</h2>
          <p>Your data is used solely to provide the Ingoa service — showing you Pacific baby names, saving your preferences, and matching liked names with your partner in couple mode. We do not sell, share, or monetise your personal data.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Data Storage</h2>
          <p>All data is stored securely using industry-standard encryption and hosted on trusted cloud infrastructure. Access to your data is restricted to authenticated sessions only.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Third-Party Services</h2>
          <p>We use secure cloud authentication and database services to operate the app. We do not integrate with advertising networks or analytics platforms that track individual users.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Your Rights</h2>
          <p>You can delete your account and all associated data at any time from the Settings page. This permanently removes your profile, liked names, passed names, partner connections, and authentication record.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Children's Privacy</h2>
          <p>Ingoa is intended for adults (parents and caregivers). We do not knowingly collect data from children under 13.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Contact</h2>
          <p>For privacy-related questions, please use the Send Feedback option in Settings or email us at privacy@ingoa.app.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
