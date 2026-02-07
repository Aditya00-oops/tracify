
import React, { useState } from 'react';
import { format, isBefore, parseISO, startOfDay, isSameDay } from 'date-fns';
import { Task, Category, Project } from '../types';

interface DailyPanelProps {
  selectedDate: Date;
  tasks: Task[];
  categories: Category[];
  projects: Project[];
  onClose?: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  inline?: boolean;
}

const DailyPanel: React.FC<DailyPanelProps> = ({ 
  selectedDate, tasks, categories, projects, onClose, onToggle, onDelete, onAddTask, inline = false 
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [projectId, setProjectId] = useState<string>(projects[0]?.id || '');
  const [time, setTime] = useState('09:00');
  const [dueDate, setDueDate] = useState<string>('');

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr);
  const completedCount = dayTasks.filter(t => t.completed).length;
  const progress = dayTasks.length ? Math.round((completedCount / dayTasks.length) * 100) : 0;

  const today = startOfDay(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !categoryId || !projectId) return;
    onAddTask({
      title: newTaskTitle,
      date: dateStr,
      dueDate: dueDate || undefined,
      time,
      categoryId,
      projectId,
      completed: false,
      priority: 'Medium'
    });
    setNewTaskTitle('');
    setDueDate('');
  };

  const isOverdue = (task: Task) => {
    if (task.completed || !task.dueDate) return false;
    return isBefore(parseISO(task.dueDate), today);
  };

  const isDueToday = (task: Task) => {
    if (!task.dueDate) return false;
    return isSameDay(parseISO(task.dueDate), today);
  };

  const content = (
    <div className={`h-full flex flex-col ${inline ? '' : 'bg-white dark:bg-slate-900 w-full max-w-lg shadow-2xl overflow-hidden rounded-l-[3rem] border-l border-slate-50 dark:border-slate-800 transition-colors duration-500'}`}>
      <div className="p-10 pb-6 bg-white dark:bg-slate-900 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{format(selectedDate, 'MMMM do')}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-2 h-0.5 bg-indigo-500 rounded-full"></span>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{format(selectedDate, 'EEEE')}</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400">
              ✕
            </button>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[2rem] border border-slate-100/50 dark:border-slate-800/50">
           <div className="flex justify-between text-[9px] font-black text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-[0.2em]">
             <span>Daily Mastery</span>
             <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{progress}% Complete</span>
           </div>
           <div className="w-full bg-white dark:bg-slate-950 h-2.5 rounded-full overflow-hidden shadow-inner">
             <div 
               className="bg-indigo-600 h-full transition-all duration-1000 rounded-full shadow-lg" 
               style={{ width: `${progress}%` }} 
             />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-10 py-6 space-y-4 no-scrollbar">
        {dayTasks.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-40">✨</div>
            <p className="text-slate-900 dark:text-white font-bold text-lg leading-tight">Clear space, clear mind.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 max-w-[200px]">No intentions found for today. Take this as a gift of time.</p>
          </div>
        ) : (
          dayTasks.sort((a,b) => a.time.localeCompare(b.time)).map(task => {
            const cat = categories.find(c => c.id === task.categoryId);
            const proj = projects.find(p => p.id === task.projectId);
            const overdue = isOverdue(task);
            const dueToday = isDueToday(task);

            return (
              <div key={task.id} className={`group flex items-center space-x-5 p-5 rounded-[2rem] border transition-all relative ${
                overdue 
                ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/50 shadow-sm' 
                : 'bg-white dark:bg-slate-900/50 border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}>
                 <button 
                   onClick={() => onToggle(task.id)}
                   className={`shrink-0 w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all ${
                     task.completed 
                     ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none scale-95' 
                     : overdue 
                       ? 'border-rose-400 dark:border-rose-600'
                       : 'border-slate-200 dark:border-slate-700 group-hover:border-indigo-400'
                   }`}
                 >
                   {task.completed && <span className="text-xs font-bold italic">✓</span>}
                 </button>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center space-x-2">
                     <p className={`text-sm font-extrabold truncate transition-all ${task.completed ? 'text-slate-300 dark:text-slate-600 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                       {task.title}
                     </p>
                     {overdue && (
                       <span className="px-2 py-0.5 bg-rose-500 text-[8px] text-white font-black uppercase tracking-widest rounded-full animate-pulse whitespace-nowrap">Overdue</span>
                     )}
                     {dueToday && !task.completed && !overdue && (
                       <span className="px-2 py-0.5 bg-amber-500 text-[8px] text-white font-black uppercase tracking-widest rounded-full whitespace-nowrap">Due Today</span>
                     )}
                   </div>
                   <div className="flex items-center space-x-3 mt-1.5 overflow-x-auto no-scrollbar">
                     <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-widest bg-slate-100/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md uppercase whitespace-nowrap">🕒 {task.time}</span>
                     {task.dueDate && (
                       <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-md uppercase whitespace-nowrap ${overdue ? 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30' : 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800'}`}>
                         📅 Due: {task.dueDate}
                       </span>
                     )}
                     <span 
                       className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest whitespace-nowrap"
                       style={{ color: cat?.color, backgroundColor: `${cat?.color}15` }}
                     >
                       {cat?.name}
                     </span>
                     <span className="text-[9px] text-slate-400 dark:text-slate-600 font-bold truncate opacity-60 whitespace-nowrap">📁 {proj?.name}</span>
                   </div>
                 </div>
                 <button 
                  onClick={() => onDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-300 hover:text-rose-500 rounded-xl transition-all"
                 >
                   🗑️
                 </button>
              </div>
            );
          })
        )}
      </div>

      <div className="p-10 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text"
            placeholder="I intend to..."
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:border-indigo-400 dark:focus:border-indigo-600 dark:text-white focus:outline-none transition-all shadow-sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <select 
              value={categoryId} 
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none shadow-sm"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select 
              value={projectId} 
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none shadow-sm"
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Scheduled Time</label>
               <input 
                 type="time" 
                 value={time}
                 onChange={e => setTime(e.target.value)}
                 className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black focus:outline-none shadow-sm"
               />
             </div>
             <div className="flex flex-col space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Deadline / Due Date</label>
               <input 
                 type="date" 
                 value={dueDate}
                 onChange={e => setDueDate(e.target.value)}
                 className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black focus:outline-none shadow-sm"
               />
             </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl dark:shadow-none hover:shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all mt-2"
          >
            Add Intention
          </button>
        </form>
      </div>
    </div>
  );

  if (inline) return <div className="max-w-3xl mx-auto">{content}</div>;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative animate-in slide-in-from-right duration-500 h-full">
        {content}
      </div>
    </div>
  );
};

export default DailyPanel;
