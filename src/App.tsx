import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import { BiblePage, BibleChapterPage } from "./pages/BiblePage.tsx";
import { HymnsPage, HymnDetailPage } from "./pages/HymnsPage.tsx";
import { ScriptureSongsPage, ScriptureSongDetailPage } from "./pages/ScriptureSongsPage.tsx";
import { DevotionalBooksPage, DevotionalBookDetailPage } from "./pages/DevotionalBooksPage.tsx";
import { EgwBooksPage, EgwBookDetailPage } from "./pages/EgwBooksPage.tsx";
import { ListenBiblePage, ListenBibleChapterPage, ListenEgwPage, ListenEgwChapterPage } from "./pages/ListenPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import DonationPage from "./pages/DonationPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import TermsOfUsePage from "./pages/TermsOfUsePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bible" element={<BiblePage />} />
          <Route path="/bible/:bookSlug" element={<BibleChapterPage />} />
          <Route path="/bible/:bookSlug/:chapter" element={<BibleChapterPage />} />
          <Route path="/hymns" element={<HymnsPage />} />
          <Route path="/hymns/:hymnNumber" element={<HymnDetailPage />} />
          <Route path="/songs" element={<ScriptureSongsPage />} />
          <Route path="/songs/:songNumber" element={<ScriptureSongDetailPage />} />
          <Route path="/devotionals" element={<DevotionalBooksPage />} />
          <Route path="/devotionals/:bookId" element={<DevotionalBookDetailPage />} />
          <Route path="/egw" element={<EgwBooksPage />} />
          <Route path="/egw/:bookAbbr" element={<EgwBookDetailPage />} />
          <Route path="/listen/bible" element={<ListenBiblePage />} />
          <Route path="/listen/bible/:bookSlug" element={<ListenBibleChapterPage />} />
          <Route path="/listen/bible/:bookSlug/:chapter" element={<ListenBibleChapterPage />} />
          <Route path="/listen/egw" element={<ListenEgwPage />} />
          <Route path="/listen/egw/:bookAbbr" element={<ListenEgwChapterPage />} />
          <Route path="/listen/egw/:bookAbbr/:chapter" element={<ListenEgwChapterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/donation" element={<DonationPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
