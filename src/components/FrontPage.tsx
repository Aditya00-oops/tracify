
import React from 'react';
import { Task, Project, ViewType } from '../types';
import { isBefore, parseISO, startOfDay } from 'date-fns';

interface FrontPageProps {
  tasks: Task[];
  projects: Project[];
  onNavigate: (view: ViewType) => void;
}

const FrontPage: React.FC<FrontPageProps> = ({ tasks, projects, onNavigate }) => {
  const activeTasks = tasks.filter(t => !t.completed).length;
  const completedToday = tasks.filter(t => t.completed && t.date === new Date().toISOString().split('T')[0]).length;
  
  const today = startOfDay(new Date());
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && isBefore(parseISO(t.dueDate), today));

  const quickOptions: { id: ViewType; label: string; icon: string; desc: string; color: string }[] = [
    { id: 'Calendar', label: 'Calendar', icon: '🗓️', desc: 'Map your week', color: 'text-blue-500' },
    { id: 'Tasks', label: 'Tasks', icon: '✅', desc: 'Focus on now', color: 'text-emerald-500' },
    { id: 'AI', label: 'AI Strategist', icon: '🧠', desc: 'Get smart tips', color: 'text-purple-500' },
    { id: 'Stats', label: 'Insights', icon: '📈', desc: 'Track growth', color: 'text-amber-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden group">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-12 rounded-[2.5rem] text-white shadow-2xl relative z-10 border border-slate-800/50">
          <div className="max-w-lg space-y-6">
            <span className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md">Your Zen State</span>
            <h3 className="text-5xl font-extrabold leading-tight tracking-tight">Focus on what <br/><span className="text-indigo-300">truly matters.</span></h3>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              You have <span className="text-white font-bold">{activeTasks} intentions</span> remaining for this week. Take a deep breath and start small.
            </p>
            {overdueTasks.length > 0 && (
              <div className="bg-rose-500/20 border border-rose-500/30 p-4 rounded-2xl flex items-center space-x-3 backdrop-blur-sm animate-pulse">
                <span className="text-xl">⚠️</span>
                <p className="text-rose-200 text-sm font-bold">You have {overdueTasks.length} overdue tasks that need attention.</p>
              </div>
            )}
            <div className="flex space-x-4 pt-4">
               <button 
                onClick={() => onNavigate('Tasks')}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
              >
                Start Focused Session
              </button>
            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:flex items-center justify-center opacity-20 pointer-events-none">
             <div className="text-[240px] font-black italic select-none transform translate-x-12 translate-y-12">ZEN</div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-lg dark:hover:shadow-indigo-900/10 transition-all">
             <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🎯</div>
             <div className="mt-8">
               <p className="text-3xl font-black text-slate-800 dark:text-white">{completedToday}</p>
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Completed Today</p>
             </div>
          </div>
          <div className="bg-white dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-lg dark:hover:shadow-indigo-900/10 transition-all">
             <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🚀</div>
             <div className="mt-8">
               <p className="text-3xl font-black text-slate-800 dark:text-white">{projects.length}</p>
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Active Projects</p>
             </div>
          </div>
        </div>

        {/* Quick Nav Grid */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          {quickOptions.map(opt => (
            <button 
              key={opt.id}
              onClick={() => onNavigate(opt.id)}
              className="p-6 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-[2rem] hover:shadow-soft transition-all text-left group flex items-start space-x-4"
            >
              <span className="text-2xl pt-1 group-hover:scale-125 transition-transform">{opt.icon}</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{opt.label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Projects Progress */}
      <section className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-white">Your Ecosystem</h4>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Real-time progress across all active projects</p>
          </div>
          <button 
            onClick={() => onNavigate('Projects')} 
            className="px-6 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Manage Projects
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map(proj => {
            const projTasks = tasks.filter(t => t.projectId === proj.id);
            const completed = projTasks.filter(t => t.completed).length;
            const progress = projTasks.length ? Math.round((completed / projTasks.length) * 100) : 0;
            return (
              <div key={proj.id} className="bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-soft dark:shadow-none hover:shadow-xl dark:hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-8 h-8 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-300">→</div>
                </div>
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-4 h-4 rounded-full shadow-inner ring-4 ring-slate-50 dark:ring-slate-800" style={{ backgroundColor: proj.color }} />
                  <span className="font-bold text-slate-800 dark:text-white tracking-tight">{proj.name}</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-black text-slate-800 dark:text-white">{progress}<span className="text-sm text-slate-300 dark:text-slate-600 ml-1">%</span></span>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{completed} of {projTasks.length} Done</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-900 h-3 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full transition-all duration-1000 rounded-full shadow-lg" 
                      style={{ backgroundColor: proj.color, width: `${progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FrontPage;
