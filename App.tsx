
import React, { useState, useCallback } from 'react';
import { MAX_INPUT_LENGTH } from './constants';
import { rewriteContent } from './services/geminiService';
import Header from './components/Header';
import { Spinner } from './components/Spinner';
import { WriteIcon, CopyIcon, CheckIcon } from './components/Icons';

enum Status {
  Idle,
  Loading,
  Success,
  Error,
}

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [rewrittenText, setRewrittenText] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= MAX_INPUT_LENGTH) {
      setInputText(text);
    }
  };

  const handleRewrite = useCallback(async () => {
    if (!inputText.trim()) return;

    setStatus(Status.Loading);
    setError(null);
    setRewrittenText('');

    try {
      const result = await rewriteContent(inputText);
      setRewrittenText(result);
      setStatus(Status.Success);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus(Status.Error);
    }
  }, [inputText]);
  
  const handleCopy = useCallback(() => {
    if (rewrittenText) {
      navigator.clipboard.writeText(rewrittenText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [rewrittenText]);

  const charCount = inputText.length;
  const isButtonDisabled = status === Status.Loading || !inputText.trim();

  return (
    <div className="min-h-screen bg-base-100 text-text-primary font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Input Panel */}
          <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
            <h2 className="text-xl font-bold mb-4 text-text-primary">Original Content</h2>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Paste your AI-generated content here... (e.g., YouTube script)"
                className="w-full h-80 p-4 bg-base-300 text-text-secondary rounded-lg border-2 border-transparent focus:border-brand-primary focus:ring-brand-primary transition-colors duration-200 resize-none"
                disabled={status === Status.Loading}
              />
              <div className="absolute bottom-3 right-3 text-sm text-text-secondary">
                <span className={charCount > MAX_INPUT_LENGTH ? 'text-red-500' : ''}>{charCount}</span> / {MAX_INPUT_LENGTH}
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-text-primary">Rewritten Content</h2>
               {status === Status.Success && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-base-300 hover:bg-brand-dark text-sm rounded-lg transition-colors duration-200"
                >
                  {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
               )}
            </div>
            <div className="w-full h-80 p-4 bg-base-300 text-text-secondary rounded-lg overflow-y-auto relative">
              {status === Status.Loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Spinner />
                  <p className="mt-4 text-text-secondary">Rewriting in progress...</p>
                </div>
              )}
              {status === Status.Error && (
                <div className="absolute inset-0 flex items-center justify-center text-red-400">
                  <p>Error: {error}</p>
                </div>
              )}
              {status === Status.Idle && (
                 <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
                  <p>Your rewritten content will appear here.</p>
                </div>
              )}
              {status === Status.Success && (
                <p className="whitespace-pre-wrap">{rewrittenText}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRewrite}
            disabled={isButtonDisabled}
            className="flex items-center justify-center space-x-3 w-full max-w-sm px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-lg"
          >
            {status === Status.Loading ? <Spinner /> : <WriteIcon className="w-6 h-6" />}
            <span>{status === Status.Loading ? 'Rewriting...' : 'Rewrite Content'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
