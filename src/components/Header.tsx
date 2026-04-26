import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from './ThemeToggle';
import { CATEGORIES, PLATFORMS } from '@/lib/categories';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container-blog">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 group" aria-label="Denorbit home">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Den<span className="text-accent italic">orbit</span>
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center space-x-7" role="navigation" aria-label="Main navigation">
            <Link to="/posts" className="nav-link">All Posts</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="nav-link">
                {c.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link inline-flex items-center gap-1 outline-none">
                Platforms <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                {PLATFORMS.filter((p) => p.slug !== 'other').map((p) => (
                  <DropdownMenuItem key={p.slug} asChild>
                    <Link to={`/platform/${p.slug}`}>{p.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => navigate('/search')}>
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="h-4 w-4 mr-1.5" /> Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4 mr-1.5" /> Sign in
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-3" role="navigation" aria-label="Mobile navigation">
              <Link to="/posts" className="nav-link" onClick={() => setIsMenuOpen(false)}>All Posts</Link>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  {c.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-2 px-1">Platforms</p>
                {PLATFORMS.filter((p) => p.slug !== 'other').map((p) => (
                  <Link key={p.slug} to={`/platform/${p.slug}`} className="nav-link block" onClick={() => setIsMenuOpen(false)}>
                    {p.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <Button variant="ghost" size="icon" aria-label="Search" onClick={() => { navigate('/search'); setIsMenuOpen(false); }}>
                <Search className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" size="sm" onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}>
                      <LayoutDashboard className="h-4 w-4 mr-1.5" /> Admin
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-1.5" /> Sign out</Button>
                </>
              ) : (
                <Button size="sm" onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}>
                  <LogIn className="h-4 w-4 mr-1.5" /> Sign in
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
