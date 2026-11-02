import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LavaLampBackground from '@/components/LavaLampBackground';
import SEOHead from '@/components/SEOHead';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="Terms & Conditions — iRise Academy"
        description="Terms and conditions for iRise Academy, operated by Global Executive Marketing Limited."
      />
      <LavaLampBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2 lava-heading lava-adaptive-text">Terms &amp; Conditions</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: 2 November 2026</p>

          <div className="prose prose-sm max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold">1. Who we are</h2>
              <p>
                iRise Academy (iRise.academy) is operated by <strong>Global Executive Marketing Limited</strong>
                ("we", "us", "the Seller"). E-commerce operations, order fulfillment, and payment processing
                are managed by Global Executive Marketing Limited on behalf of iRise.academy. By using this
                site you are contracting with Global Executive Marketing Limited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Acceptance of these terms</h2>
              <p>
                By creating an account, purchasing a product, or continuing to use the service, you agree to
                these Terms &amp; Conditions. If you do not agree, please do not use the service. You confirm
                that you are of legal age in your jurisdiction or have authority to bind the organisation you
                represent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. The service</h2>
              <p>
                iRise Academy provides educational programmes, courses, memberships, and paid support
                consultations. Content is provided for educational purposes only; it does not constitute legal,
                financial, or professional advice, and no representation is made or implied.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Payments, billing, and subscriptions</h2>
              <p>
                Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant
                of Record for all our orders. Paddle provides all customer service inquiries and handles
                returns.
              </p>
              <p>
                Payment, billing, tax, cancellation, and refund mechanics are governed by Paddle's{' '}
                <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Buyer Terms
                </a>. Subscriptions renew monthly until canceled. You may cancel at any time; cancellation
                takes effect at the end of the current paid period, and you keep access until then. Plan
                changes (upgrades and downgrades) apply immediately with automatic proration.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Acceptable use</h2>
              <p>You must not misuse the service, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Any unlawful use, fraud, or spam;</li>
                <li>Infringing intellectual property rights;</li>
                <li>Interfering with security, including malware, probing, or scraping;</li>
                <li>Reverse engineering, reselling, or redistributing the service or its content;</li>
                <li>Sharing your account credentials or circumventing access controls.</li>
              </ul>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for
                all activity under your account, and for providing accurate information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Intellectual property</h2>
              <p>
                We retain all ownership of the service and its intellectual property, including software,
                course materials, documentation, and branding. We grant you a limited, non-exclusive,
                non-transferable right to access the service within your purchased plan or course. You grant
                us a limited licence to host and process any content you submit solely to provide the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Service level and warranties</h2>
              <p>
                We do not guarantee uninterrupted or error-free performance. To the fullest extent permitted
                by law, all implied warranties (including merchantability and fitness for a particular
                purpose) are disclaimed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Liability</h2>
              <p>
                To the fullest extent permitted by law, our aggregate liability is capped at the fees you paid
                in the 12 months preceding the claim, and we exclude liability for indirect, consequential, or
                special damages (including loss of profits, data, or goodwill). Nothing in these terms
                excludes liability for fraud, death, or personal injury where required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Suspension and termination</h2>
              <p>
                We may suspend or terminate access for material breach, non-payment, security or fraud risk,
                or repeated or serious policy violations. When access ends, your right to use the service
                stops immediately; you may request an export of your data within 30 days, after which it may
                be deleted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">10. General</h2>
              <p>
                These terms are governed by the laws of England and Wales, and disputes are subject to the
                exclusive jurisdiction of its courts. You may not assign these terms without our consent; we
                may assign them in connection with a merger or acquisition. We are not liable for delays
                caused by events beyond our reasonable control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">11. Contact</h2>
              <p>
                Questions about these terms: use our <a href="/contact" className="text-primary hover:underline">contact page</a>.
                For payment, order, or refund inquiries, contact Paddle at{' '}
                <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">paddle.net</a>.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Terms;
