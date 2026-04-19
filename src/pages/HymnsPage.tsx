import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Music, ChevronLeft, Loader2, Volume2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Hymn = Database['public']['Tables']['hymns']['Row'];

const HymnsPage = () => {
  const navigate = useNavigate();
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    const fetchHymns = async () => {
      const { data, error } = await supabase
        .from('hymns')
        .select('*')
        .order('hymn_number', { ascending: true });
      
      if (error) {
        console.error('Error fetching hymns:', error);
        return;
      }
      
      if (data) {
        setHymns(data);
      }
      setLoading(false);
    };

    fetchHymns();
  }, []);

  const filteredHymns = hymns.filter(hymn => 
    hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hymn.hymn_number.toString().includes(searchTerm)
  ).slice(0, displayCount);

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
            <input
              type="text"
              placeholder="Search by hymn number or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-card border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Display toggle */}
          <div className="flex gap-2 mb-6">
            {[20, 50, 100].map((n) => (
              <button 
                key={n} 
                onClick={() => setDisplayCount(n)}
                className={`px-3 py-1 text-xs rounded-full border ${displayCount === n ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-muted'}`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Hymn list */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : filteredHymns.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hymns found.</p>
          ) : (
            <div className="space-y-1">
              {filteredHymns.map((hymn) => (
                <button 
                  key={hymn.id} 
                  onClick={() => navigate(`/hymns/${hymn.hymn_number}`)}
                  className="w-full flex items-center justify-between p-4 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-muted-foreground w-8">{String(hymn.hymn_number).padStart(3, '0')}</span>
                    <span className="text-sm font-medium text-foreground">{hymn.title}</span>
                  </div>
                  <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-accent rotate-180" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const HymnDetailPage = () => {
  const { hymnNumber } = useParams<{ hymnNumber: string }>();
  const navigate = useNavigate();
  const [hymn, setHymn] = useState<Hymn | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchHymn = async () => {
      if (!hymnNumber) return;
      
      setLoading(true);
      const num = parseInt(hymnNumber, 10);

      const { data: hymnData, error } = await supabase
        .from('hymns')
        .select('*')
        .eq('hymn_number', num)
        .single();

      if (hymnData?.r2_key) {
        const { data: urlData } = await supabase.storage
          .from('audio')
          .createSignedUrl(hymnData.r2_key, 3600);
        if (urlData?.signedUrl) {
          setAudioUrl(urlData.signedUrl);
        }
      }

      if (error) {
        console.error('Error fetching hymn:', error);
      } else if (hymnData) {
        setHymn(hymnData);
      }

      setLoading(false);
    };

    fetchHymn();
  }, [hymnNumber]);

  const lyrics = hymn?.lyrics as unknown as { verses?: string[]; chorus?: string } | null;

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-3xl px-4">
          <button
            onClick={() => navigate('/hymns')}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Hymns
          </button>

          <div className="bg-card rounded-xl p-6 border mb-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : !hymn ? (
              <p className="text-muted-foreground text-center py-8">Hymn not found.</p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-1">
                      {hymn.title}
                    </h1>
                    <p className="text-muted-foreground">Hymn {hymn.hymn_number}</p>
                  </div>
                  {audioUrl && (
                    <audio controls className="h-10" src={audioUrl}>
                      <Volume2 className="h-5 w-5" />
                    </audio>
                  )}
                </div>

                <div className="space-y-6 text-center">
                  {lyrics?.verses?.map((verse, idx) => (
                    <div key={idx}>
                      <p className="text-foreground leading-relaxed whitespace-pre-line">{verse}</p>
                      {lyrics.chorus && idx === 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-accent font-semibold mb-2">Chorus</p>
                          <p className="text-foreground leading-relaxed whitespace-pre-line">{lyrics.chorus}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { HymnsPage, HymnDetailPage };
