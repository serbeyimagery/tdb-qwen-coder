import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Library, ChevronLeft, Loader2, Volume2, BookOpen } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type EgwBook = Database['public']['Tables']['egw_books']['Row'];
type EgwChapter = Database['public']['Tables']['egw_chapters']['Row'];
type EgwAudio = Database['public']['Tables']['egw_audio']['Row'];

const EgwBooksPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<EgwBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('egw_books')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching EGW books:', error);
        return;
      }
      
      if (data) {
        setBooks(data);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Library className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">EGW Books</h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : books.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No EGW books available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <button 
                  key={book.id} 
                  onClick={() => navigate(`/egw/${book.book_abbr}`)}
                  className="bg-card rounded-xl p-6 border hover:border-accent/50 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-full h-28 bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {book.cover_image ? (
                      <img src={book.cover_image} alt={book.book_title} className="w-full h-full object-cover" />
                    ) : (
                      <Library className="h-10 w-10 text-muted-foreground/40" />
                    )}
                  </div>
                  <h3 className="font-serif font-semibold text-foreground group-hover:text-accent transition-colors mb-1">{book.book_title}</h3>
                  <p className="text-xs text-muted-foreground">{book.description || 'Ellen G. White classic book.'}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-xs text-accent">
                      View chapters <ChevronLeft className="h-3 w-3 rotate-180" />
                    </div>
                    {book.has_audio && (
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Volume2 className="h-3 w-3" /> Audio
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const EgwBookDetailPage = () => {
  const { bookAbbr } = useParams<{ bookAbbr: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<EgwBook | null>(null);
  const [chapters, setChapters] = useState<EgwChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<EgwChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookAbbr) return;
      
      setLoading(true);

      // Fetch book details
      const { data: bookData } = await supabase
        .from('egw_books')
        .select('*')
        .eq('book_abbr', bookAbbr)
        .single();

      // Fetch chapters
      const { data: chaptersData } = await supabase
        .from('egw_chapters')
        .select('*')
        .eq('book_abbr', bookAbbr)
        .order('chapter_number', { ascending: true });

      if (bookData) setBook(bookData);
      if (chaptersData) setChapters(chaptersData);
      
      setLoading(false);
    };

    fetchData();
  }, [bookAbbr]);

  useEffect(() => {
    const fetchAudio = async () => {
      if (!selectedChapter || !bookAbbr) {
        setAudioUrl(null);
        return;
      }

      const { data: audioData } = await supabase
        .from('egw_audio')
        .select('r2_key')
        .eq('book_abbr', bookAbbr)
        .eq('chapter_number', selectedChapter.chapter_number)
        .single();

      if (audioData?.r2_key) {
        const { data: urlData } = await supabase.storage
          .from('audio')
          .createSignedUrl(audioData.r2_key, 3600);
        if (urlData?.signedUrl) {
          setAudioUrl(urlData.signedUrl);
        }
      } else {
        setAudioUrl(null);
      }
    };

    fetchAudio();
  }, [selectedChapter, bookAbbr]);

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <button
            onClick={() => navigate('/egw')}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Books
          </button>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : !book ? (
            <p className="text-muted-foreground text-center py-8">Book not found.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chapters List */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-4 border">
                  <h2 className="font-serif font-semibold text-lg mb-4">{book.book_title}</h2>
                  <div className="space-y-1 max-h-[600px] overflow-y-auto">
                    {chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => setSelectedChapter(chapter)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                          selectedChapter?.id === chapter.id 
                            ? 'bg-accent/10 text-accent' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Chapter {chapter.chapter_number}</span>
                        </div>
                        {chapter.chapter_title && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{chapter.chapter_title}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl p-6 border">
                  {selectedChapter ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="font-serif text-xl font-bold text-foreground mb-1">
                            Chapter {selectedChapter.chapter_number}
                          </h2>
                          {selectedChapter.chapter_title && (
                            <p className="text-muted-foreground">{selectedChapter.chapter_title}</p>
                          )}
                        </div>
                        {audioUrl && (
                          <audio controls className="h-10" src={audioUrl}>
                            <Volume2 className="h-5 w-5" />
                          </audio>
                        )}
                      </div>
                      
                      <div className="prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: selectedChapter.content }} />
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Select a chapter to read.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export { EgwBooksPage, EgwBookDetailPage };
