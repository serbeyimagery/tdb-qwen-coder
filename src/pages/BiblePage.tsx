import { Layout } from '@/components/Layout';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

const oldTestament = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
];

const newTestament = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

const BiblePage = () => {
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">KJV Bible</h1>
          </div>

          {/* Search */}
          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by keyword or verse (e.g., John 3:16)"
              className="w-full pl-12 pr-4 py-3 bg-card border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Old Testament */}
          <div className="mb-8">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full" />
              Old Testament
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {oldTestament.map((book) => (
                <button key={book} className="flex items-center justify-between p-3 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors text-left group">
                  <span className="text-sm font-medium text-foreground">{book}</span>
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
                <button key={book} className="flex items-center justify-between p-3 bg-card rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors text-left group">
                  <span className="text-sm font-medium text-foreground">{book}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BiblePage;
