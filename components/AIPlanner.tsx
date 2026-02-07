
import React, { useState } from 'react';
import { Task } from '../types';
import { getProductivityAdvice } from '../services/geminiService';

interface AIPlannerProps {
  tasks: Task[];
}

const AIPlanner: React.FC<AIPlannerProps> = ({ tasks }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await getProductivityAdvice(tasks);
    setAdvice(result || "Could not generate advice at this time.");
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-indigo-50 rounded-full mb-6 text-indigo-600 animate-pulse">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
           </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Meet Your Personal Strategist</h2>
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
          Our advanced AI analyzes your habits, categories, and completion rates to provide 
          hyper-personalized growth strategies for Tracify users.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
           <div className="text-8xl font-black italic">TRACIFY</div>
        </div>

        {advice ? (
          <div className="space-y-6 relative animate-in slide-in-from-bottom duration-700">
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-loose text-lg font-medium">
                {advice}
              </div>
            </div>
            <button 
               onClick={() => setAdvice(null)}
               className="px-6 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all font-semibold"
            >
              Start Over
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <button 
              onClick={handleGetAdvice}
              disabled={loading}
              className={`
                px-10 py-4 rounded-2xl font-bold text-white shadow-lg shadow-indigo-200 transition-all transform active:scale-95
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1'}
              `}
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Performance...</span>
                </div>
              ) : (
                "Run Global Analysis"
              )}
            </button>
            <p className="mt-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
              Powered by Gemini 3 Pro
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPlanner;
