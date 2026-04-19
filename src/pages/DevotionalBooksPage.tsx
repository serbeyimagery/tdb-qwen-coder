import { Layout } from '@/components/Layout';
import { BookText, ChevronRight } from 'lucide-react';

const books = [
  { title: 'My Life Today', description: 'A daily devotional for spiritual growth and reflection.' },
  { title: 'The Faith I Live By', description: 'Core beliefs explored through daily readings.' },
  { title: 'Conflict and Courage', description: 'Stories of faith from Bible heroes.' },
  { title: 'Our High Calling', description: 'Daily readings on living for God.' },
];

const DevotionalBooksPage = () => {
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <BookText className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Devotional Books</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book) => (
              <button key={book.title} className="bg-card rounded-xl p-6 border hover:border-accent/50 hover:shadow-md transition-all text-left group">
                <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <BookText className="h-12 w-12 text-muted-foreground/40" />
                </div>
                <h3 className="font-serif font-semibold text-foreground group-hover:text-accent transition-colors mb-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.description}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-accent">
                  Read today's entry <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DevotionalBooksPage;
