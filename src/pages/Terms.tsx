import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-12 pt-6 px-4 max-w-lg mx-auto bg-[#0012ee] flower-bg">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground/70 font-body text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight mb-8">Terms of Service</h1>

      <div className="space-y-6 text-foreground/80 font-body text-sm leading-relaxed">
        <p><strong className="text-foreground">Last updated:</strong> March 2026</p>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Acceptance of Terms</h2>
          <p>By using Ingoa, you agree to these terms. If you do not agree, please do not use the app.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">The Service</h2>
          <p>Ingoa provides a curated collection of Pacific baby names from Māori, Samoan, Tongan, Fijian, Hawaiian, Niuean, Cook Islands, and Tahitian cultures. You can browse names, save favourites, and match names with a partner.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Accounts</h2>
          <p>You must create an account to use Ingoa. You are responsible for maintaining the security of your account credentials. One account per person.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Free & Premium Plans</h2>
          <p>Free accounts receive a limited number of daily swipes. Premium subscriptions unlock unlimited swipes, couple mode, and the full name catalogue. Subscription terms and pricing are displayed before purchase.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Cultural Respect</h2>
          <p>The names in Ingoa carry deep cultural significance. We ask all users to approach these names with respect and genuine interest in Pacific cultures. Misuse or disrespectful use of culturally significant names is not tolerated.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Name Accuracy</h2>
          <p>While we strive for accuracy in meanings, origins, and cultural attributions, language and naming traditions are living practices. We welcome corrections and contributions from cultural experts and native speakers.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Termination</h2>
          <p>You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Limitation of Liability</h2>
          <p>Ingoa is provided "as is" without warranties. We are not liable for any damages arising from your use of the service.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-bold text-foreground uppercase mb-2">Contact</h2>
          <p>For questions about these terms, please use the Send Feedback option in Settings or email us at support@ingoa.app.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
