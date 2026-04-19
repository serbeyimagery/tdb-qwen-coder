import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Heart, Wallet, Globe, Building, Copy, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const DonationPage = () => {
  const [step, setStep] = useState<'form' | 'method' | 'thankyou'>('form');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const methods = [
    { key: 'wallet', label: 'Wallet', icon: Wallet, providers: ['GCash', 'Maya'] },
    { key: 'online', label: 'Online', icon: Globe, providers: ['Wise', 'PayPal'] },
    { key: 'bank', label: 'Bank', icon: Building, providers: ['Maribank', 'GoTyme'] },
  ];

  const handleProceedToMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-donation', {
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          method: 'wallet',
          honeypot: '',
        },
      });
      if (error || !(data as { donation_id?: string })?.donation_id) throw new Error('submit failed');
      setDonationId((data as { donation_id: string }).donation_id);
      setStep('method');
    } catch {
      toast({ title: 'Error', description: 'Failed to start donation. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSubmit = async () => {
    if (!donationId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('claim-donation', {
        body: { donation_id: donationId },
      });
      if (error || (data && (data as { error?: string }).error)) throw new Error('claim failed');
      setStep('thankyou');
    } catch {
      toast({ title: 'Error', description: 'Failed to record donation. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Give</h1>
          </div>

          <div className="bg-card rounded-2xl p-6 border mb-8">
            <p className="text-foreground/80 leading-relaxed">
              Your support helps keep Bible, hymn, and devotional access free for everyone.
              Every contribution — no matter how small — helps us maintain the servers, add new
              content, and reach more hearts for His glory.
            </p>
          </div>

          {step === 'form' && (
            <div className="bg-card rounded-2xl p-8 border mb-8">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Your Information</h2>
              <form onSubmit={handleProceedToMethod} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">First Name *</label>
                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={100} className="w-full px-4 py-3 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Last Name *</label>
                    <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={100} className="w-full px-4 py-3 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} className="w-full px-4 py-3 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Continue to Choose Payment Method'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </div>
          )}

          {step === 'method' && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {methods.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setSelectedMethod(m.key)}
                    className={`bg-card rounded-xl p-6 border text-center transition-all hover:shadow-md ${selectedMethod === m.key ? 'border-accent ring-2 ring-accent/20' : 'hover:border-accent/50'}`}
                  >
                    <m.icon className={`h-8 w-8 mx-auto mb-2 ${selectedMethod === m.key ? 'text-accent' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium text-foreground">{m.label}</span>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {m.providers.join(' • ')}
                    </div>
                  </button>
                ))}
              </div>

              {selectedMethod && (
                <div className="bg-card rounded-2xl p-6 border mb-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Payment Details</h3>
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <div className="w-48 h-48 bg-background rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">QR Code</span>
                    </div>
                    <div className="text-center text-sm text-foreground">
                      <p className="font-medium">Account Name: The Daily Beloved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-accent/10 rounded-lg p-3">
                    <span className="font-mono text-sm text-foreground font-semibold">DONATETDB</span>
                    <button className="ml-auto p-1 hover:bg-accent/20 rounded" onClick={() => navigator.clipboard.writeText('DONATETDB')}>
                      <Copy className="h-4 w-4 text-accent" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Include this as the transaction note/reference.</p>
                </div>
              )}

              <Button
                size="lg"
                variant="give"
                className="w-full"
                disabled={!selectedMethod || loading}
                onClick={handleDonationSubmit}
              >
                {loading ? 'Submitting...' : 'I Have Sent My Donation'}
              </Button>
            </>
          )}

          {step === 'thankyou' && (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-accent mx-auto mb-6" />
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Thank You!</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We've recorded your donation! We will personally review and confirm 
                receipt within 1-3 days. Check your email for updates.
              </p>
              <Link to="/contact">
                <Button variant="outline">Share a Testimony</Button>
              </Link>
            </div>
          )}

          {/* FAQs */}
          <div className="mt-12">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="support">
                <AccordionTrigger className="text-foreground">What do donations support?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Your donations directly support three things: keeping this app running (server and infrastructure costs), sustaining the developer who maintains and improves it, and funding future ministry features — so that the Word of God, hymns, and devotional resources remain freely accessible to everyone, everywhere.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="received">
                <AccordionTrigger className="text-foreground">How do I know my donation was received?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You'll receive an acknowledgment email immediately after submitting. We personally review each submission and will reach out to the email you provided to confirm receipt — usually within 1–3 days.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="receipt">
                <AccordionTrigger className="text-foreground">Will I get a receipt?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A confirmation email serves as your receipt. Please note that donations are voluntary gifts and may not be tax-deductible.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonationPage;
