
import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isBefore,
  parseISO,
  startOfDay
} from 'date-fns';
import { Task, DayStats, Category } from '../types';

interface CalendarProps {
  tasks: Task[];
  categories: Category[];
  onDayClick: (date: Date) => void;
  getDayStats: (date: Date) => DayStats;
}

const CalendarView: React.FC<CalendarProps> = ({ tasks, categories, onDayClick, getDayStats }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Navigate your timeline</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 transition-colors">
          <button 
            onClick={prevMonth}
            className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-[1rem] transition-all text-slate-600 dark:text-slate-300 hover:shadow-sm"
          >
            ←
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-6 py-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-[1rem] text-[11px] font-black uppercase tracking-widest transition-all text-slate-800 dark:text-slate-200 hover:shadow-sm"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-[1rem] transition-all text-slate-600 dark:text-slate-300 hover:shadow-sm"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 mb-12">
        {weekDays.map(day => (
          <div key={day} className="py-2 text-center text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          const stats = getDayStats(day);
          const isSelectedMonth = isSameMonth(day, monthStart);
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayTasks = tasks.filter(t => t.date === dateStr);
          
          // Identify if any task in this specific day (scheduled or due) is overdue
          const hasOverdue = tasks.some(t => 
            !t.completed && 
            t.dueDate && 
            (t.date === dateStr || t.dueDate === dateStr) && 
            isBefore(parseISO(t.dueDate), today)
          );
          
          let statusColor = "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900";
          if (stats.rating === 'productive') statusColor = "bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/50";
          if (stats.rating === 'average') statusColor = "bg-amber-50/30 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/50";
          if (stats.rating === 'unproductive') statusColor = "bg-rose-50/30 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/50";

          return (
            <div
              key={idx}
              onClick={() => onDayClick(day)}
              className={`
                min-h-[140px] p-5 cursor-pointer rounded-[2rem] border transition-all duration-300 group relative
                ${!isSelectedMonth ? 'opacity-20 grayscale' : 'opacity-100'}
                ${statusColor} hover:shadow-xl dark:hover:shadow-indigo-900/10 hover:-translate-y-1
                ${hasOverdue && isSelectedMonth ? 'ring-2 ring-rose-500/20 ring-inset' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`
                  text-sm font-black rounded-[1rem] w-8 h-8 flex items-center justify-center transition-all
                  ${isToday(day) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}
                `}>
                  {format(day, 'd')}
                </span>
                
                <div className="flex flex-col items-end space-y-1">
                  {hasOverdue && isSelectedMonth && (
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-sm shadow-rose-200" title="Overdue tasks present"></div>
                  )}
                  {stats.totalTasks > 0 && (
                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-tighter bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-lg">
                      {stats.completedTasks}/{stats.totalTasks}
                    </div>
                  )}
                </div>
              </div>

              {/* Category Bubbles */}
              <div className="flex flex-wrap gap-1.5 mb-4 min-h-[10px]">
                {dayTasks.slice(0, 4).map(task => {
                  const cat = categories.find(c => c.id === task.categoryId);
                  return (
                    <div 
                      key={task.id} 
                      className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm" 
                      style={{ backgroundColor: cat?.color || '#cbd5e1' }}
                    />
                  );
                })}
                {dayTasks.length > 4 && <span className="text-[8px] font-black text-slate-300 dark:text-slate-600">+{dayTasks.length - 4}</span>}
              </div>

              {stats.totalTasks > 0 && (
                <div className="absolute bottom-5 left-5 right-5">
                   <div className="w-full bg-slate-100/50 dark:bg-slate-800/50 h-1 rounded-full overflow-hidden">
                     <div 
                        className={`h-full transition-all duration-700 ${
                          stats.rating === 'productive' ? 'bg-emerald-400' : 
                          stats.rating === 'average' ? 'bg-amber-400' : 'bg-rose-400'
                        }`} 
                        style={{ width: `${stats.percentage}%` }} 
                     />
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50 dark:border-slate-800">
        <div className="flex items-center space-x-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl transition-colors">
           <div className="flex items-center space-x-2">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
             <span>Flow</span>
           </div>
           <div className="flex items-center space-x-2">
             <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
             <span>Active</span>
           </div>
           <div className="flex items-center space-x-2">
             <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
             <span>Rest</span>
           </div>
           <div className="flex items-center space-x-2">
             <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
             <span className="text-rose-500">Overdue Alert</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
