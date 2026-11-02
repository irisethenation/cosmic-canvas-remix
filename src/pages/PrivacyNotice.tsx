import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LavaLampBackground from '@/components/LavaLampBackground';
import SEOHead from '@/components/SEOHead';

const PrivacyNotice = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="Privacy Notice — iRise Academy"
        description="Privacy notice for iRise Academy, operated by Global Executive Marketing Limited: what data we collect, why, and your rights."
      />
      <LavaLampBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2 lava-heading lava-adaptive-text">Privacy Notice</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: 2 November 2026</p>

          <div className="prose prose-sm max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold">1. Who we are</h2>
              <p>
                iRise Academy is operated by <strong>Global Executive Marketing Limited</strong>, which is the
                data controller for the personal data described in this notice. E-commerce operations, order
                fulfillment, and payment processing are managed by Global Executive Marketing Limited on
                behalf of iRise.academy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. What we collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Account data:</strong> name, email address, login credentials;</li>
                <li><strong>Learning data:</strong> course progress, lesson completion, agreements you accept;</li>
                <li><strong>Support data:</strong> messages you send us, support case history, call bookings;</li>
                <li><strong>Usage data:</strong> telemetry about how you use the site, device identifiers, and IP address (stored only as a one-way hash for agreement records).</li>
              </ul>
              <p>
                Payment card details are collected and processed directly by Paddle (our Merchant of Record);
                we never see or store your card number.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Why we use it (and legal basis)</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Creating and managing your account — performance of our contract with you;</li>
                <li>Providing courses, memberships, and support services — contract performance;</li>
                <li>Security and fraud prevention — our legitimate interests;</li>
                <li>Product improvement and analytics — our legitimate interests;</li>
                <li>Customer support — contract performance and legitimate interests;</li>
                <li>Marketing communications — your consent, which you can withdraw at any time;</li>
                <li>Meeting legal obligations (tax, accounting) — legal obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Who we share it with</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Service providers</strong> who host and operate the platform (cloud hosting, analytics, support tooling);</li>
                <li><strong>Paddle</strong>, our Merchant of Record, for the sale of products, subscription management, payments, tax compliance, and invoicing;</li>
                <li><strong>Professional advisers</strong> (legal, accounting) where needed;</li>
                <li><strong>Authorities</strong> where required by law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Retention</h2>
              <p>
                We keep personal data only as long as needed for the purposes above, including legal and
                accounting requirements, and delete or anonymise it when no longer needed. You may request
                deletion of your account at any time from your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Your rights</h2>
              <p>
                Depending on your location, you may have the right to access, rectify, erase, restrict, or
                port your personal data, to object to processing, and to withdraw consent. If you are in the
                UK or EEA, you also have the right to complain to your supervisory authority, and we respond
                to requests within one month. To exercise any right, contact us via the{' '}
                <a href="/contact" className="text-primary hover:underline">contact page</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. International transfers</h2>
              <p>
                Some of our service providers process data outside the UK/EEA. Where this happens, we rely on
                appropriate safeguards such as standard contractual clauses or adequacy decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Security</h2>
              <p>
                We apply appropriate technical and organisational measures, including encryption in transit,
                access controls, and row-level security on stored data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Cookies</h2>
              <p>
                We use essential cookies required for sign-in and security. Where analytics or marketing
                cookies are used, you can manage your preferences in your browser settings; disabling
                essential cookies may prevent sign-in from working.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyNotice;
