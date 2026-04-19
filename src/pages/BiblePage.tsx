import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, ChevronLeft, ChevronRight, Volume2, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type BibleVerse = Database['public']['Tables']['bible_verses']['Row'];
type BibleBook = Database['public']['Tables']['bible_books']['Row'];
type BibleAudio = Database['public']['Tables']['bible_audio']['Row'];

const BiblePage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('bible_books')
        .select('*')
        .order('book_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching Bible books:', error);
        return;
      }
      
      if (data) {
        setBooks(data);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  const oldTestament = books.filter(b => b.testament.toLowerCase() === 'old');
  const newTestament = books.filter(b => b.testament.toLowerCase() === 'new');

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">KJV Bible</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Old Testament */}
              <div className="mb-8">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-accent rounded-full" />
                  Old Testament
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {oldTestament.map((book) => (
                    <button 
                      key={book.id} 
                      onClick={() => navigate(`/bible/${book.book_slug}`)}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors text-left group"
                    >
                      <span className="text-sm font-medium text-foreground">{book.book_name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                    </button>
                  ))}
                </div>
              </div>

              {/* New Testament */}
              <div>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-accent rounded-full" />
                  New Testament
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {newTestament.map((book) => (
                    <button 
                      key={book.id} 
                      onClick={() => navigate(`/bible/${book.book_slug}`)}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors text-left group"
                    >
                      <span className="text-sm font-medium text-foreground">{book.book_name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const BibleChapterPage = () => {
  const { bookSlug, chapter } = useParams<{ bookSlug: string; chapter?: string }>();
  const navigate = useNavigate();
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [bookName, setBookName] = useState<string>('');
  const [chapterNum, setChapterNum] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!bookSlug) return;
      
      setLoading(true);
      const chapterNumber = chapter ? parseInt(chapter, 10) : 1;
      setChapterNum(chapterNumber);

      // Fetch verses
      const { data: versesData, error: versesError } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('book_slug', bookSlug)
        .eq('chapter', chapterNumber)
        .order('verse', { ascending: true });

      // Fetch book name
      const { data: bookData } = await supabase
        .from('bible_books')
        .select('book_name')
        .eq('book_slug', bookSlug)
        .single();

      // Fetch audio
      const { data: audioData } = await supabase
        .from('bible_audio')
        .select('r2_key')
        .eq('book_slug', bookSlug)
        .eq('chapter_number', chapterNumber)
        .single();

      if (audioData?.r2_key) {
        const { data: urlData } = await supabase.storage
          .from('audio')
          .createSignedUrl(audioData.r2_key, 3600);
        if (urlData?.signedUrl) {
          setAudioUrl(urlData.signedUrl);
        }
      }

      if (versesError) {
        console.error('Error fetching verses:', versesError);
      } else if (versesData) {
        setVerses(versesData);
      }

      if (bookData) {
        setBookName(bookData.book_name);
      }

      setLoading(false);
    };

    fetchChapter();
  }, [bookSlug, chapter]);

  // Get max chapter for navigation
  const maxChapter = verses.length > 0 ? Math.max(...verses.map(v => v.chapter)) : 1;

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-3xl px-4">
          <button
            onClick={() => navigate('/bible')}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Books
          </button>

          <div className="bg-card rounded-xl p-6 border mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
                {bookName} {chapterNum}
              </h1>
              {audioUrl && (
                <audio controls className="h-10" src={audioUrl}>
                  <Volume2 className="h-5 w-5" />
                </audio>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : verses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No verses available for this chapter yet.
              </p>
            ) : (
              <div className="space-y-2">
                {verses.map((verse) => (
                  <div key={verse.id} className="flex gap-3">
                    <span className="text-xs font-mono text-accent mt-1 min-w-[24px]">
                      {verse.verse}
                    </span>
                    <p className="text-foreground leading-relaxed">{verse.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Chapter Navigation */}
            {!loading && verses.length > 0 && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => {
                    if (chapterNum > 1) {
                      navigate(`/bible/${bookSlug}/${chapterNum - 1}`);
                    }
                  }}
                  disabled={chapterNum <= 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/5 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (chapterNum < maxChapter) {
                      navigate(`/bible/${bookSlug}/${chapterNum + 1}`);
                    }
                  }}
                  disabled={chapterNum >= maxChapter}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/5 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { BiblePage, BibleChapterPage };
