import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import './sections/sections.css';

function ScrollToTopOnRoute() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

export function App() {
  return (
    <>
      <a href="#main" className="sr-only">Skip to content</a>
      <ScrollToTopOnRoute />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
