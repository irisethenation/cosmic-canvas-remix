import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LavaLampBackground from '@/components/LavaLampBackground';
import SEOHead from '@/components/SEOHead';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="Refund Policy — iRise Academy"
        description="Refund policy for iRise Academy purchases: 14-day money-back guarantee, processed by Paddle."
      />
      <LavaLampBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2 lava-heading lava-adaptive-text">Refund Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: 2 November 2026</p>

          <div className="prose prose-sm max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold">14-day money-back guarantee</h2>
              <p>
                We offer a 14-day money-back guarantee on all purchases made through iRise Academy,
                including course purchases, subscription plans, and paid support calls. If you're not
                satisfied with your purchase, you can request a full refund within <strong>14 days</strong> of
                your order date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">How to request a refund</h2>
              <p>
                Refunds are processed by our payment provider and Merchant of Record, Paddle. To request a
                refund, visit{' '}
                <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  paddle.net
                </a>{' '}
                and look up your order, or contact our support team via the{' '}
                <a href="/support" className="text-primary hover:underline">support page</a> and we'll help
                you through the process.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">What happens after a refund</h2>
              <p>
                Once a refund is approved, your access to the refunded product ends: course purchases are
                revoked, subscriptions are canceled, and paid call bookings are canceled. Refunds are
                returned to your original payment method by Paddle.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Subscriptions</h2>
              <p>
                You can cancel a subscription at any time from your dashboard. Cancellation is not a refund:
                you keep access until the end of your current paid period, and no further renewals are
                charged. If you cancel within 14 days of your first payment and would like a refund, request
                one as described above.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Questions</h2>
              <p>
                For any questions about this policy, contact us via the{' '}
                <a href="/contact" className="text-primary hover:underline">contact page</a>. This policy is
                operated by Global Executive Marketing Limited on behalf of iRise.academy.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default RefundPolicy;
