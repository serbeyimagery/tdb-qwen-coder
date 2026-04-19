import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactType, setContactType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const typeMap: Record<string, string> = { testimony: 'Testimony', review: 'Review', feedback: 'Feedback', others: 'Others' };
      const { data, error } = await supabase.functions.invoke('submit-contact', {
        body: {
          name: name.trim(),
          email: email.trim(),
          contact_type: typeMap[contactType] || 'Others',
          message: message.trim(),
          consent_publish: false,
          honeypot: '',
        },
      });
      if (error || (data && (data as { error?: string }).error)) throw new Error('submit failed');
      setSubmitted(true);
    } catch {
      toast({ title: 'Error', description: 'Failed to send message. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="container mx-auto max-w-2xl px-4 text-center py-20">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Thank You!</h2>
            <p className="text-muted-foreground mb-6">Your message has been received. We'll get back to you soon.</p>
            <Button variant="outline" onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); setContactType(''); }}>Send Another Message</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Mail className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Contact Us</h1>
          </div>

          <div className="bg-card rounded-2xl p-8 border">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className="w-full px-4 py-3 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} className="w-full px-4 py-3 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Contact Type *</label>
                <select required value={contactType} onChange={(e) => setContactType(e.target.value)} className="w-full px-4 py-3 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50">
                  <option value="">Select a type</option>
                  <option value="testimony">Testimony</option>
                  <option value="review">Review</option>
                  <option value="feedback">Feedback</option>
                  <option value="others">Others</option>
                </select>
              </div>
              {contactType === 'testimony' && (
                <div className="flex items-start gap-2 bg-accent/5 p-3 rounded-lg">
                  <input type="checkbox" id="consent" className="mt-1" />
                  <label htmlFor="consent" className="text-sm text-foreground/80">
                    I agree that this message may be used as a testimony on the site.
                  </label>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Message *</label>
                <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} className="w-full px-4 py-3 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" placeholder="Your message..." />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
