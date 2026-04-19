import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { BookText, ChevronLeft, Loader2, Calendar } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type DevotionalBook = Database['public']['Tables']['devotional_books']['Row'];
type DevotionalEntry = Database['public']['Tables']['devotional_entries']['Row'];

const DevotionalBooksPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<DevotionalBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('devotional_books')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching devotional books:', error);
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
            <BookText className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Devotional Books</h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : books.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No devotional books available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.map((book) => (
                <button 
                  key={book.id} 
                  onClick={() => navigate(`/devotionals/${book.id}`)}
                  className="bg-card rounded-xl p-6 border hover:border-accent/50 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {book.cover_image_url ? (
                      <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookText className="h-12 w-12 text-muted-foreground/40" />
                    )}
                  </div>
                  <h3 className="font-serif font-semibold text-foreground group-hover:text-accent transition-colors mb-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.description || 'Daily devotional readings for spiritual growth.'}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-accent">
                    Read today's entry <ChevronLeft className="h-3 w-3 rotate-180" />
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

const DevotionalBookDetailPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<DevotionalBook | null>(null);
  const [entries, setEntries] = useState<DevotionalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DevotionalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookId) return;
      
      setLoading(true);

      // Fetch book details
      const { data: bookData } = await supabase
        .from('devotional_books')
        .select('*')
        .eq('id', bookId)
        .single();

      // Fetch entries
      const { data: entriesData } = await supabase
        .from('devotional_entries')
        .select('*')
        .eq('book_id', bookId)
        .order('month', { ascending: true })
        .order('day', { ascending: true });

      if (bookData) setBook(bookData);
      if (entriesData) setEntries(entriesData);
      
      setLoading(false);
    };

    fetchData();
  }, [bookId]);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const todaysEntry = entries.find(e => e.month === currentMonth && e.day === currentDay);

  const displayEntry = selectedEntry || todaysEntry;

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <button
            onClick={() => navigate('/devotionals')}
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
              {/* Entries List */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-4 border">
                  <h2 className="font-serif font-semibold text-lg mb-4">{book.title}</h2>
                  <div className="space-y-1 max-h-[600px] overflow-y-auto">
                    {entries.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                          displayEntry?.id === entry.id 
                            ? 'bg-accent/10 text-accent' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(2024, entry.month - 1, entry.day).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        {entry.title && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{entry.title}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Entry Content */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl p-6 border">
                  {displayEntry ? (
                    <>
                      <div className="mb-6">
                        <div className="flex items-center gap-2 text-accent mb-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(2024, displayEntry.month - 1, displayEntry.day).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        {displayEntry.title && (
                          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                            {displayEntry.title}
                          </h2>
                        )}
                        {displayEntry.scripture_ref && (
                          <p className="text-accent italic mb-4">{displayEntry.scripture_ref}</p>
                        )}
                      </div>
                      
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-foreground leading-relaxed whitespace-pre-line">
                          {displayEntry.content}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Select a day to read the devotional.
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

export { DevotionalBooksPage, DevotionalBookDetailPage };
