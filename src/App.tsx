import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import BiblePage from "./pages/BiblePage.tsx";
import HymnsPage from "./pages/HymnsPage.tsx";
import ScriptureSongsPage from "./pages/ScriptureSongsPage.tsx";
import DevotionalBooksPage from "./pages/DevotionalBooksPage.tsx";
import EgwBooksPage from "./pages/EgwBooksPage.tsx";
import { ListenBiblePage, ListenEgwPage } from "./pages/ListenPage.tsx";
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
          <Route path="/hymns" element={<HymnsPage />} />
          <Route path="/songs" element={<ScriptureSongsPage />} />
          <Route path="/devotionals" element={<DevotionalBooksPage />} />
          <Route path="/egw" element={<EgwBooksPage />} />
          <Route path="/listen/bible" element={<ListenBiblePage />} />
          <Route path="/listen/egw" element={<ListenEgwPage />} />
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
