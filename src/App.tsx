import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SkipLink from "@/components/SkipLink";
import ScrollToTop from "@/components/ScrollToTop";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const AllPosts = lazy(() => import("./pages/AllPosts"));
const FilteredList = lazy(() => import("./pages/FilteredList"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const PostEditor = lazy(() => import("./pages/admin/PostEditor"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <SkipLink />
            <Toaster />
            <Sonner />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/posts" element={<AllPosts />} />
                <Route path="/category/:slug" element={<FilteredList type="category" />} />
                <Route path="/platform/:slug" element={<FilteredList type="platform" />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/auth" element={<Auth />} />

                <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                <Route path="/admin/posts/new" element={<ProtectedAdminRoute><PostEditor /></ProtectedAdminRoute>} />
                <Route path="/admin/posts/:id" element={<ProtectedAdminRoute><PostEditor /></ProtectedAdminRoute>} />

                {/* Legacy redirects */}
                <Route path="/business" element={<Navigate to="/category/themes" replace />} />
                <Route path="/technology" element={<Navigate to="/category/plugins" replace />} />
                <Route path="/podcast" element={<Navigate to="/category/tutorials" replace />} />

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/sitemap" element={<Sitemap />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
