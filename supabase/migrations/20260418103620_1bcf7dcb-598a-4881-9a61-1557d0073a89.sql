
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.daily_verses CASCADE;
DROP TABLE IF EXISTS public.donation_submissions CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.contact_submissions CASCADE;

CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, body TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, email TEXT NOT NULL,
  contact_type TEXT NOT NULL, message TEXT NOT NULL,
  consent_publish BOOLEAN DEFAULT false,
  auto_reply_sent BOOLEAN DEFAULT false,
  forwarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT contact_type_check CHECK (contact_type IN ('Testimony', 'Review', 'Feedback', 'Others'))
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.hymns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hymn_number INT NOT NULL UNIQUE, title TEXT NOT NULL,
  r2_key TEXT NOT NULL, lyrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  has_chorus BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT hymns_number_range CHECK (hymn_number BETWEEN 1 AND 695)
);
ALTER TABLE public.hymns ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.scripture_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_number INT NOT NULL UNIQUE, title TEXT NOT NULL,
  r2_key TEXT NOT NULL, lyrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.scripture_songs ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.egw_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_title TEXT NOT NULL, book_abbr TEXT NOT NULL UNIQUE,
  description TEXT, cover_image TEXT, sort_order INT,
  is_active BOOLEAN DEFAULT true, has_audio BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.egw_books ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.egw_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_abbr TEXT NOT NULL, chapter_number INT NOT NULL,
  chapter_title TEXT, content TEXT NOT NULL, r2_key TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (book_abbr, chapter_number)
);
ALTER TABLE public.egw_chapters ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.egw_audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_abbr TEXT NOT NULL, chapter_number INT NOT NULL,
  chapter_title TEXT, r2_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (book_abbr, chapter_number)
);
ALTER TABLE public.egw_audio ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bible_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_name TEXT NOT NULL, book_slug TEXT NOT NULL UNIQUE,
  testament TEXT NOT NULL, book_order INT NOT NULL, cover_image TEXT,
  CONSTRAINT bible_testament_check CHECK (testament IN ('Old', 'New'))
);
ALTER TABLE public.bible_books ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bible_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug TEXT NOT NULL, chapter INT NOT NULL, verse INT NOT NULL,
  text TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (book_slug, chapter, verse)
);
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bible_audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug TEXT NOT NULL, chapter_number INT NOT NULL,
  r2_key TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (book_slug, chapter_number)
);
ALTER TABLE public.bible_audio ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.devotional_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, cover_image_url TEXT, description TEXT,
  is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.devotional_books ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.devotional_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.devotional_books(id) ON DELETE CASCADE,
  month INT NOT NULL, day INT NOT NULL,
  title TEXT, content TEXT NOT NULL,
  scripture_ref TEXT, scripture_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (book_id, month, day),
  CONSTRAINT entries_month_range CHECK (month BETWEEN 1 AND 12),
  CONSTRAINT entries_day_range CHECK (day BETWEEN 1 AND 31)
);
ALTER TABLE public.devotional_entries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bible_promises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_year INT NOT NULL UNIQUE,
  scripture_ref TEXT NOT NULL, kjv_verse TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT promises_day_range CHECK (day_of_year BETWEEN 1 AND 365)
);
ALTER TABLE public.bible_promises ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.promise_seeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL UNIQUE, seed INT NOT NULL
);
ALTER TABLE public.promise_seeds ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.testimonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, email TEXT, message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  consent_given BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'contact',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT testimonies_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, email TEXT, message TEXT NOT NULL,
  rating INT, status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT reviews_rating_range CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL, last_name TEXT NOT NULL,
  email TEXT NOT NULL, phone TEXT, method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  ack_email_sent BOOLEAN DEFAULT false,
  confirm_email_sent BOOLEAN DEFAULT false,
  notes TEXT, created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT donations_status_check CHECK (status IN ('pending', 'claimed', 'confirmed'))
);
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.donation_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_group TEXT NOT NULL, provider_name TEXT NOT NULL,
  qr_image_url TEXT NOT NULL, account_name TEXT, account_number TEXT,
  instructions TEXT, is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT qr_method_group_check CHECK (method_group IN ('wallet', 'online', 'bank'))
);
ALTER TABLE public.donation_qr_codes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.featured_home_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL, content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.featured_home_content ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE, email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.rate_limit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL, action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "p_read" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.announcements FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.announcements FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.announcements FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.hymns FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.hymns FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.hymns FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.hymns FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.scripture_songs FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.scripture_songs FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.scripture_songs FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.scripture_songs FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.egw_books FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.egw_books FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.egw_books FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.egw_books FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.egw_chapters FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.egw_chapters FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.egw_chapters FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.egw_chapters FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.egw_audio FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.egw_audio FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.egw_audio FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.egw_audio FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.bible_books FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.bible_books FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.bible_books FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.bible_books FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.bible_verses FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.bible_verses FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.bible_verses FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.bible_verses FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.bible_audio FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.bible_audio FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.bible_audio FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.bible_audio FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.devotional_books FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.devotional_books FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.devotional_books FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.devotional_books FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.devotional_entries FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.devotional_entries FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.devotional_entries FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.devotional_entries FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.bible_promises FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.bible_promises FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.bible_promises FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.bible_promises FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.promise_seeds FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.promise_seeds FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.promise_seeds FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.promise_seeds FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read_approved" ON public.testimonies FOR SELECT USING (status = 'approved');
CREATE POLICY "a_all" ON public.testimonies FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users)) WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read_approved" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "a_all" ON public.reviews FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users)) WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "a_all" ON public.contact_submissions FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users)) WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "a_all" ON public.donations FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users)) WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.donation_qr_codes FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.donation_qr_codes FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.donation_qr_codes FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.donation_qr_codes FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "p_read" ON public.featured_home_content FOR SELECT USING (true);
CREATE POLICY "a_ins" ON public.featured_home_content FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_upd" ON public.featured_home_content FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
CREATE POLICY "a_del" ON public.featured_home_content FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "self_read" ON public.admin_users FOR SELECT USING (auth.uid() = user_id);

-- INDEXES
CREATE INDEX hymns_number_idx ON public.hymns (hymn_number);
CREATE INDEX hymns_title_trgm_idx ON public.hymns USING GIN (title gin_trgm_ops);
CREATE INDEX songs_number_idx ON public.scripture_songs (song_number);
CREATE INDEX songs_title_trgm_idx ON public.scripture_songs USING GIN (title gin_trgm_ops);
CREATE INDEX bible_verses_lookup_idx ON public.bible_verses (book_slug, chapter, verse);
CREATE INDEX bible_verses_fts_idx ON public.bible_verses USING GIN (to_tsvector('english', text));
CREATE INDEX egw_chapters_book_idx ON public.egw_chapters (book_abbr);
CREATE INDEX egw_chapters_order_idx ON public.egw_chapters (book_abbr, chapter_number);
CREATE INDEX egw_audio_book_idx ON public.egw_audio (book_abbr);
CREATE INDEX bible_audio_book_idx ON public.bible_audio (book_slug);
CREATE INDEX bible_books_testament_idx ON public.bible_books (testament);
CREATE INDEX bible_books_order_idx ON public.bible_books (book_order);
CREATE INDEX devotional_entries_date_idx ON public.devotional_entries (book_id, month, day);
CREATE INDEX donations_status_idx ON public.donations (status);
CREATE INDEX donations_created_idx ON public.donations (created_at DESC);
CREATE INDEX announcements_active_idx ON public.announcements (is_active, starts_at, ends_at);
CREATE INDEX testimonies_status_idx ON public.testimonies (status);
CREATE INDEX reviews_status_idx ON public.reviews (status);
CREATE INDEX egw_books_sort_idx ON public.egw_books (is_active, sort_order);
CREATE INDEX rate_limit_log_idx ON public.rate_limit_log (ip_hash, action, created_at);

-- SEED DATA
INSERT INTO public.bible_books (book_name, book_slug, testament, book_order) VALUES
  ('Genesis','genesis','Old',1),('Exodus','exodus','Old',2),('Leviticus','leviticus','Old',3),
  ('Numbers','numbers','Old',4),('Deuteronomy','deuteronomy','Old',5),('Joshua','joshua','Old',6),
  ('Judges','judges','Old',7),('Ruth','ruth','Old',8),('1 Samuel','1-samuel','Old',9),
  ('2 Samuel','2-samuel','Old',10),('1 Kings','1-kings','Old',11),('2 Kings','2-kings','Old',12),
  ('1 Chronicles','1-chronicles','Old',13),('2 Chronicles','2-chronicles','Old',14),
  ('Ezra','ezra','Old',15),('Nehemiah','nehemiah','Old',16),('Esther','esther','Old',17),
  ('Job','job','Old',18),('Psalms','psalms','Old',19),('Proverbs','proverbs','Old',20),
  ('Ecclesiastes','ecclesiastes','Old',21),('Song of Solomon','song-of-solomon','Old',22),
  ('Isaiah','isaiah','Old',23),('Jeremiah','jeremiah','Old',24),('Lamentations','lamentations','Old',25),
  ('Ezekiel','ezekiel','Old',26),('Daniel','daniel','Old',27),('Hosea','hosea','Old',28),
  ('Joel','joel','Old',29),('Amos','amos','Old',30),('Obadiah','obadiah','Old',31),
  ('Jonah','jonah','Old',32),('Micah','micah','Old',33),('Nahum','nahum','Old',34),
  ('Habakkuk','habakkuk','Old',35),('Zephaniah','zephaniah','Old',36),('Haggai','haggai','Old',37),
  ('Zechariah','zechariah','Old',38),('Malachi','malachi','Old',39),('Matthew','matthew','New',40),
  ('Mark','mark','New',41),('Luke','luke','New',42),('John','john','New',43),
  ('Acts','acts','New',44),('Romans','romans','New',45),('1 Corinthians','1-corinthians','New',46),
  ('2 Corinthians','2-corinthians','New',47),('Galatians','galatians','New',48),
  ('Ephesians','ephesians','New',49),('Philippians','philippians','New',50),
  ('Colossians','colossians','New',51),('1 Thessalonians','1-thessalonians','New',52),
  ('2 Thessalonians','2-thessalonians','New',53),('1 Timothy','1-timothy','New',54),
  ('2 Timothy','2-timothy','New',55),('Titus','titus','New',56),('Philemon','philemon','New',57),
  ('Hebrews','hebrews','New',58),('James','james','New',59),('1 Peter','1-peter','New',60),
  ('2 Peter','2-peter','New',61),('1 John','1-john','New',62),('2 John','2-john','New',63),
  ('3 John','3-john','New',64),('Jude','jude','New',65),('Revelation','revelation','New',66);

INSERT INTO public.featured_home_content (section, content) VALUES
  ('hero_tagline', 'Every word. Every hymn. Every day.'),
  ('hero_intro', 'The Daily Beloved is a free, ad-free devotional platform for SDA believers and all who seek spiritual nourishment.'),
  ('about_snippet', ''),
  ('footer_note', 'If this has blessed you today, share it with someone who needs it. A little light shared goes a long way.');

INSERT INTO public.promise_seeds (year, seed) VALUES
  (2026, 847291), (2027, 302847), (2028, 593021), (2029, 748301), (2030, 129584);
