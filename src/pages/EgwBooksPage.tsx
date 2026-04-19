import { Layout } from '@/components/Layout';
import { Library, ChevronRight } from 'lucide-react';

const egwBooks = [
  { title: 'Steps to Christ', abbr: 'sc', description: 'A guide to knowing Jesus and growing in faith.' },
  { title: 'Desire of Ages', abbr: 'da', description: 'The life of Christ from His birth to ascension.' },
  { title: 'Great Controversy', abbr: 'gc', description: 'The cosmic conflict between good and evil.' },
  { title: 'Patriarchs and Prophets', abbr: 'pp', description: 'From Creation to the kingdom of Israel.' },
  { title: 'Acts of the Apostles', abbr: 'aa', description: 'The early Christian church and its mission.' },
  { title: 'Ministry of Healing', abbr: 'mh', description: 'Principles of health, healing, and service.' },
];

const EgwBooksPage = () => {
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Library className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">EGW Books</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {egwBooks.map((book) => (
              <button key={book.abbr} className="bg-card rounded-xl p-6 border hover:border-accent/50 hover:shadow-md transition-all text-left group">
                <div className="w-full h-28 bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Library className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="font-serif font-semibold text-foreground group-hover:text-accent transition-colors mb-1">{book.title}</h3>
                <p className="text-xs text-muted-foreground">{book.description}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-accent">
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

export default EgwBooksPage;
