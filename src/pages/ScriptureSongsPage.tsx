import { Layout } from '@/components/Layout';
import { Search, Mic2, ChevronRight } from 'lucide-react';

const sampleSongs = Array.from({ length: 15 }, (_, i) => ({
  number: i + 1,
  title: ['Thy Word Is a Lamp', 'Create in Me a Clean Heart', 'Seek Ye First', 'As the Deer', 'I Will Enter His Gates', 'He Is Lord', 'Shout to the Lord', 'Open the Eyes of My Heart', 'Blessed Be Your Name', 'How Great Is Our God', 'Lord I Lift Your Name', 'Ancient of Days', 'Worthy Is the Lamb', 'Come Now Is the Time', 'Here I Am to Worship'][i]
}));

const ScriptureSongsPage = () => {
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Mic2 className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Scripture Songs</h1>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input type="text" placeholder="Search by song number or title..." className="w-full pl-12 pr-4 py-3 bg-card border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
          </div>

          <div className="space-y-1">
            {sampleSongs.map((song) => (
              <button key={song.number} className="w-full flex items-center justify-between p-4 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-muted-foreground w-8">{String(song.number).padStart(3, '0')}</span>
                  <span className="text-sm font-medium text-foreground">{song.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScriptureSongsPage;
