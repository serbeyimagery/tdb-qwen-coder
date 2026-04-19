import { Layout } from '@/components/Layout';
import { Users, BookOpen, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">About</h1>
          </div>

          <div className="prose max-w-none">
            <div className="bg-card rounded-2xl p-8 lg:p-12 border mb-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold text-foreground m-0">The Daily Beloved</h2>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6">
                The Daily Beloved was created with a simple yet powerful mission: to provide free, 
                ad-free access to the King James Version Bible, Seventh-day Adventist Hymnal, 
                Scripture Songs, Devotional Books, and the writings of Ellen G. White — all in 
                one calm, spiritually focused platform.
              </p>
              <p className="text-foreground/80 leading-relaxed mb-6">
                We believe that God's Word should be accessible to everyone, everywhere, at any time. 
                No login required. No ads. No distractions. Just you and the Word.
              </p>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Whether you're starting your morning with a devotional reading, singing hymns with 
                your family, or listening to the Bible on your commute — this app is designed to 
                be your daily companion in spiritual growth.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 lg:p-12 border mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold text-foreground m-0">Our Mission</h2>
              </div>
              <p className="text-foreground/80 leading-relaxed italic font-serif text-lg">
                "To make the study of God's Word a daily habit for every believer, providing 
                free and unrestricted access to Bible, devotional, and inspirational content 
                that nurtures faith and spiritual growth."
              </p>
            </div>

            <div className="text-center">
              <Button variant="give" size="lg" onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'The Daily Beloved', url: window.location.origin });
                }
              }}>
                <Share2 className="h-4 w-4 mr-2" />
                Share This App
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
