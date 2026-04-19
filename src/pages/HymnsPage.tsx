import { Layout } from '@/components/Layout';
import { Search, Music, ChevronRight } from 'lucide-react';

const sampleHymns = Array.from({ length: 20 }, (_, i) => ({
  number: i + 1,
  title: ['Praise to the Lord', 'All Creatures of Our God', 'God Himself Is with Us', 'Praise, My Soul', 'In the Beginning', 'O Worship the Lord', 'The Lord Is My Shepherd', 'Come, Thou Almighty King', 'Holy, Holy, Holy', 'Lead, Kindly Light', 'Joyful, Joyful, We Adore Thee', 'Immortal, Invisible', 'Great Is Thy Faithfulness', 'How Great Thou Art', 'Amazing Grace', 'Be Thou My Vision', 'Crown Him with Many Crowns', 'To God Be the Glory', 'A Mighty Fortress', 'Fairest Lord Jesus'][i]
}));

const HymnsPage = () => {
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Music className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">SDA Hymns</h1>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by hymn number or title..."
              className="w-full pl-12 pr-4 py-3 bg-card border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Display toggle */}
          <div className="flex gap-2 mb-6">
            {[20, 50, 100].map((n) => (
              <button key={n} className={`px-3 py-1 text-xs rounded-full border ${n === 20 ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-muted'}`}>
                {n}
              </button>
            ))}
          </div>

          {/* Hymn list */}
          <div className="space-y-1">
            {sampleHymns.map((hymn) => (
              <button key={hymn.number} className="w-full flex items-center justify-between p-4 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-muted-foreground w-8">{String(hymn.number).padStart(3, '0')}</span>
                  <span className="text-sm font-medium text-foreground">{hymn.title}</span>
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

export default HymnsPage;
