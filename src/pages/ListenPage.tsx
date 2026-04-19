import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Headphones, BookOpen, Library, ChevronLeft, Loader2, Volume2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type BibleBook = Database['public']['Tables']['bible_books']['Row'];
type BibleAudio = Database['public']['Tables']['bible_audio']['Row'];

const ListenBiblePage = () => {
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
            <Headphones className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Listen — KJV Bible</h1>
          </div>
          <p className="text-muted-foreground mb-8">Select a book and chapter to listen to the KJV Bible audio.</p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {oldTestament.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-accent rounded-full" />
                    Old Testament
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {oldTestament.map((book) => (
                      <button 
                        key={book.id} 
                        onClick={() => navigate(`/listen/bible/${book.book_slug}`)}
                        className="flex items-center justify-between p-3 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-foreground">{book.book_name}</span>
                        </div>
                        <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-accent rotate-180" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {newTestament.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-accent rounded-full" />
                    New Testament
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {newTestament.map((book) => (
                      <button 
                        key={book.id} 
                        onClick={() => navigate(`/listen/bible/${book.book_slug}`)}
                        className="flex items-center justify-between p-3 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-foreground">{book.book_name}</span>
                        </div>
                        <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-accent rotate-180" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const ListenBibleChapterPage = () => {
  const { bookSlug, chapter } = useParams<{ bookSlug: string; chapter?: string }>();
  const navigate = useNavigate();
  const [bookName, setBookName] = useState<string>('');
  const [chapterNum, setChapterNum] = useState<number>(1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudio = async () => {
      if (!bookSlug) return;
      
      setLoading(true);
      const chapterNumber = chapter ? parseInt(chapter, 10) : 1;
      setChapterNum(chapterNumber);

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

      if (bookData) {
        setBookName(bookData.book_name);
      }

      setLoading(false);
    };

    fetchAudio();
  }, [bookSlug, chapter]);

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-2xl px-4">
          <button
            onClick={() => navigate('/listen/bible')}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Books
          </button>

          <div className="bg-card rounded-xl p-8 border text-center">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : audioUrl ? (
              <>
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  {bookName} {chapterNum}
                </h1>
                <p className="text-muted-foreground mb-6">KJV Audio Bible</p>
                <audio controls className="w-full mb-6" src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
                <div className="flex justify-center">
                  <Volume2 className="h-12 w-12 text-accent" />
                </div>
              </>
            ) : (
              <p className="text-muted-foreground py-8">
                Audio not available for this chapter yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ListenEgwPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('egw_books')
        .select('*')
        .eq('is_active', true)
        .eq('has_audio', true)
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
            <Headphones className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Listen — EGW Books</h1>
          </div>
          <p className="text-muted-foreground mb-8">Select a book to listen to EGW audiobook chapters.</p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : books.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No audiobooks available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <button 
                  key={book.id} 
                  onClick={() => navigate(`/listen/egw/${book.book_abbr}`)}
                  className="bg-card rounded-xl p-6 border hover:border-accent/50 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-full h-24 bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {book.cover_image ? (
                      <img src={book.cover_image} alt={book.book_title} className="w-full h-full object-cover" />
                    ) : (
                      <Library className="h-8 w-8 text-muted-foreground/40" />
                    )}
                  </div>
                  <h3 className="font-serif font-semibold text-foreground group-hover:text-accent transition-colors">{book.book_title}</h3>
                  <div className="flex items-center gap-1 mt-2 text-xs text-accent">
                    View chapters <ChevronLeft className="h-3 w-3 rotate-180" />
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

const ListenEgwChapterPage = () => {
  const { bookAbbr, chapter } = useParams<{ bookAbbr: string; chapter?: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number>(chapter ? parseInt(chapter, 10) : 1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookAbbr) return;
      
      setLoading(true);

      const { data: bookData } = await supabase
        .from('egw_books')
        .select('*')
        .eq('book_abbr', bookAbbr)
        .single();

      const { data: chaptersData } = await supabase
        .from('egw_chapters')
        .select('chapter_number, chapter_title')
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
      if (!bookAbbr || !selectedChapter) {
        setAudioUrl(null);
        return;
      }

      const { data: audioData } = await supabase
        .from('egw_audio')
        .select('r2_key')
        .eq('book_abbr', bookAbbr)
        .eq('chapter_number', selectedChapter)
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
  }, [bookAbbr, selectedChapter]);

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <button
            onClick={() => navigate('/listen/egw')}
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
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-4 border">
                  <h2 className="font-serif font-semibold text-lg mb-4">{book.book_title}</h2>
                  <div className="space-y-1 max-h-[600px] overflow-y-auto">
                    {chapters.map((chap) => (
                      <button
                        key={chap.chapter_number}
                        onClick={() => setSelectedChapter(chap.chapter_number)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                          selectedChapter === chap.chapter_number
                            ? 'bg-accent/10 text-accent' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        Chapter {chap.chapter_number}
                        {chap.chapter_title && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{chap.chapter_title}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl p-8 border text-center">
                  {audioUrl ? (
                    <>
                      <h2 className="font-serif text-xl font-bold text-foreground mb-2">
                        Chapter {selectedChapter}
                      </h2>
                      <p className="text-muted-foreground mb-6">{book.book_title}</p>
                      <audio controls className="w-full mb-6" src={audioUrl}>
                        Your browser does not support the audio element.
                      </audio>
                      <div className="flex justify-center">
                        <Volume2 className="h-12 w-12 text-accent" />
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground py-8">
                      Audio not available for this chapter yet.
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

export { ListenBiblePage, ListenBibleChapterPage, ListenEgwPage, ListenEgwChapterPage };
