import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Mic2, ChevronLeft, Loader2, Volume2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ScriptureSong = Database['public']['Tables']['scripture_songs']['Row'];

const ScriptureSongsPage = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<ScriptureSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase
        .from('scripture_songs')
        .select('*')
        .order('song_number', { ascending: true });
      
      if (error) {
        console.error('Error fetching scripture songs:', error);
        return;
      }
      
      if (data) {
        setSongs(data);
      }
      setLoading(false);
    };

    fetchSongs();
  }, []);

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.song_number.toString().includes(searchTerm)
  );

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Mic2 className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Scripture Songs</h1>
          </div>

          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search by song number or title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-card border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" 
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : filteredSongs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No songs found.</p>
          ) : (
            <div className="space-y-1">
              {filteredSongs.map((song) => (
                <button 
                  key={song.id} 
                  onClick={() => navigate(`/songs/${song.song_number}`)}
                  className="w-full flex items-center justify-between p-4 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-muted-foreground w-8">{String(song.song_number).padStart(3, '0')}</span>
                    <span className="text-sm font-medium text-foreground">{song.title}</span>
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

const ScriptureSongDetailPage = () => {
  const { songNumber } = useParams<{ songNumber: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<ScriptureSong | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      if (!songNumber) return;
      
      setLoading(true);
      const num = parseInt(songNumber, 10);

      const { data: songData, error } = await supabase
        .from('scripture_songs')
        .select('*')
        .eq('song_number', num)
        .single();

      if (songData?.r2_key) {
        const { data: urlData } = await supabase.storage
          .from('audio')
          .createSignedUrl(songData.r2_key, 3600);
        if (urlData?.signedUrl) {
          setAudioUrl(urlData.signedUrl);
        }
      }

      if (error) {
        console.error('Error fetching song:', error);
      } else if (songData) {
        setSong(songData);
      }

      setLoading(false);
    };

    fetchSong();
  }, [songNumber]);

  const lyrics = song?.lyrics as unknown as { verses?: string[]; chorus?: string } | null;

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-3xl px-4">
          <button
            onClick={() => navigate('/songs')}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Songs
          </button>

          <div className="bg-card rounded-xl p-6 border mb-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : !song ? (
              <p className="text-muted-foreground text-center py-8">Song not found.</p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-1">
                      {song.title}
                    </h1>
                    <p className="text-muted-foreground">Song {song.song_number}</p>
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

export { ScriptureSongsPage, ScriptureSongDetailPage };
