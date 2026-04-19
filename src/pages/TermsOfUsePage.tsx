import { Layout } from '@/components/Layout';
import { FileText } from 'lucide-react';

const TermsOfUsePage = () => (
  <Layout>
    <div className="pt-20 pb-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-accent" />
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Terms of Use</h1>
        </div>
        <div className="bg-card rounded-2xl p-8 lg:p-12 border reading-content font-serif">
          <p className="text-foreground/80 mb-6">Last updated: April 2026</p>
          <h2 className="text-xl font-bold text-foreground mb-3">Acceptable Use</h2>
          <p className="text-foreground/80 mb-6">This app is provided for personal, non-commercial devotional use. The KJV Bible text is in the public domain. EGW and SDA Hymnal content is shared for devotional purposes.</p>
          <h2 className="text-xl font-bold text-foreground mb-3">Donations</h2>
          <p className="text-foreground/80 mb-6">All donations are voluntary and non-refundable. They support the ongoing maintenance and development of this free service.</p>
          <h2 className="text-xl font-bold text-foreground mb-3">Content Moderation</h2>
          <p className="text-foreground/80 mb-6">Testimonies and reviews submitted by users are subject to admin moderation. We reserve the right to approve, reject, or remove any user-submitted content.</p>
          <h2 className="text-xl font-bold text-foreground mb-3">Disclaimer</h2>
          <p className="text-foreground/80">This app is provided "as is" without warranties of any kind. We are not responsible for any interruptions in service.</p>
        </div>
      </div>
    </div>
  </Layout>
);

export default TermsOfUsePage;
