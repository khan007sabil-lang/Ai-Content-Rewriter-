
import React from 'react';

function Header() {
  return (
    <header className="py-8 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-light to-brand-secondary">
        AI Content Rewriter
      </h1>
      <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
        Transform robotic AI scripts into captivating content for your YouTube videos.
      </p>
    </header>
  );
}

export default Header;
