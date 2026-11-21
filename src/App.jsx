import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Background from "./components/Background";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollManager from "./components/ScrollManager";
import GhostOverlay from "./components/GhostOverlay";
import Home from "./pages/Home";

// Secondary routes are split out so the landing page ships less JavaScript
// (the Ghost page pulls in three.js and is only needed in Crazy Mode).
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const GhostPage = lazy(() => import("./pages/GhostPage"));

export default function App() {
  return (
    <div className="relative min-h-screen">
      <a
        href="#main"
        className="sr-only z-[60] rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SplashScreen />
      <Background />
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/ghost" element={<GhostPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <GhostOverlay />
    </div>
  );
}
