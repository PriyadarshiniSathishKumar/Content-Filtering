
import { useState } from "react";
import ContentFilterDemo from "@/components/ContentFilterDemo";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Content Filtering in Generative AI
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto">
              See how AI systems detect and filter potentially harmful content in both input prompts and generated outputs
            </p>
          </header>
          <main>
            <ContentFilterDemo />
          </main>
          <footer className="mt-16 text-center text-sm text-slate-400">
            <p>© 2025 AI Content Guardian • Educational Demonstration</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
