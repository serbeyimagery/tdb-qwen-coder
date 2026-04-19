import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Headphones, BookOpen, Library, ChevronRight } from 'lucide-react';

const ListenBiblePage = () => {
  const testaments = [
    {
      name: 'Old Testament',
      books: ['Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Daniel']
    },
    {
      name: 'New Testament',
      books: ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', 'Revelation']
    }
  ];

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Headphones className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Listen — KJV Bible</h1>
          </div>
          <p className="text-muted-foreground mb-8">Select a book and chapter to listen to the KJV Bible audio.</p>
          {testaments.map((t) => (
            <div key={t.name} className="mb-8">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full" />
                {t.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {t.books.map((book) => (
                  <button key={book} className="flex items-center justify-between p-3 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors text-left group">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">{book}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

const ListenEgwPage = () => {
  const books = [
    { title: 'Steps to Christ', abbr: 'sc' },
    { title: 'Desire of Ages', abbr: 'da' },
    { title: 'Great Controversy', abbr: 'gc' },
  ];

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Headphones className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Listen — EGW Books</h1>
          </div>
          <p className="text-muted-foreground mb-8">Select a book to listen to EGW audiobook chapters.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <button key={book.abbr} className="bg-card rounded-xl p-6 border hover:border-accent/50 hover:shadow-md transition-all text-left group">
                <div className="w-full h-24 bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Library className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h3 className="font-serif font-semibold text-foreground group-hover:text-accent transition-colors">{book.title}</h3>
                <div className="flex items-center gap-1 mt-2 text-xs text-accent">
                  View chapters <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { ListenBiblePage, ListenEgwPage };
