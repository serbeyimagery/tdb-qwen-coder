import { Layout } from '@/components/Layout';
import { Shield } from 'lucide-react';

const PrivacyPolicyPage = () => (
  <Layout>
    <div className="pt-20 pb-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-accent" />
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Privacy Policy</h1>
        </div>
        <div className="bg-card rounded-2xl p-8 lg:p-12 border reading-content font-serif">
          <p className="text-foreground/80 mb-6">Last updated: April 2026</p>
          <h2 className="text-xl font-bold text-foreground mb-3">Information We Collect</h2>
          <p className="text-foreground/80 mb-6">The Daily Beloved does not require user accounts or login to access any content. We only collect information you voluntarily provide through our Contact and Donation forms (name, email, messages).</p>
          <h2 className="text-xl font-bold text-foreground mb-3">How We Use Your Information</h2>
          <p className="text-foreground/80 mb-6">Information collected is used solely to respond to your messages, process donation records, and improve our service. We do not sell, share, or distribute your personal information to third parties.</p>
          <h2 className="text-xl font-bold text-foreground mb-3">Local Storage</h2>
          <p className="text-foreground/80 mb-6">We use browser localStorage to save your reading preferences (font size, last-read position). No tracking cookies are used.</p>
          <h2 className="text-xl font-bold text-foreground mb-3">Contact</h2>
          <p className="text-foreground/80">For questions about this privacy policy or data requests, please visit our Contact page.</p>
        </div>
      </div>
    </div>
  </Layout>
);

export default PrivacyPolicyPage;
