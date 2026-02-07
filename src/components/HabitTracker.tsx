
import React, { useState, useMemo } from 'react';
import { Habit } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDaysInMonth } from 'date-fns';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string) => void;
  onAddHabit: (name: string) => void;
  onDeleteHabit: (id: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggleHabit, onAddHabit, onDeleteHabit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newHabitName, setNewHabitName] = useState('');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const totalDays = getDaysInMonth(currentDate);

  // Stats Calculations
  const stats = useMemo(() => {
    let completed = 0;
    let totalPossible = habits.length * totalDays;
    const dailyCounts: Record<string, number> = {};
    
    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      dailyCounts[dateStr] = 0;
      habits.forEach(h => {
        if (h.completions[dateStr]) {
          completed++;
          dailyCounts[dateStr]++;
        }
      });
    });

    const chartData = daysInMonth.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return {
        day: format(day, 'd'),
        count: dailyCounts[dateStr]
      };
    });

    // Cumulative data
    let runningTotal = 0;
    const cumulativeData = daysInMonth.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      runningTotal += dailyCounts[dateStr];
      return {
        day: format(day, 'd'),
        total: runningTotal
      };
    });

    return { completed, totalPossible, chartData, cumulativeData };
  }, [habits, daysInMonth, totalDays]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName);
    setNewHabitName('');
  };

  const pieData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Uncompleted', value: Math.max(0, stats.totalPossible - stats.completed) }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        <div className="bg-emerald-600 text-white p-8 rounded-[2rem] shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Smart Habit Tracker</h2>
            <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest mt-1">Master Your Routine</p>
          </div>
          <div className="mt-8">
            <p className="text-xs font-bold uppercase text-emerald-100">Total Habits Completed</p>
            <p className="text-6xl font-black">{stats.completed}</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-soft flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Habits Completed / Day</h3>
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest">Monthly Trend</span>
          </div>
          <div className="flex-1 h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b98120" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-soft flex flex-col items-center justify-center">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Monthly Progress</h3>
           <div className="relative w-full aspect-square flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} innerRadius="70%" outerRadius="90%" paddingAngle={5} dataKey="value">
                   <Cell fill="#10b981" />
                   <Cell fill="#f1f5f9" className="dark:fill-slate-700" />
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-black text-slate-800 dark:text-white">
                 {stats.totalPossible > 0 ? Math.round((stats.completed / stats.totalPossible) * 100) : 0}%
               </span>
               <span className="text-[10px] font-bold text-slate-400 uppercase">{stats.completed}/{stats.totalPossible}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Habit Matrix Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse text-left min-w-[1200px]">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                <th className="p-6 sticky left-0 z-10 bg-slate-900 min-w-[200px]">Habits</th>
                {daysInMonth.map((day, idx) => (
                  <th key={idx} className="p-3 text-center border-l border-slate-800 min-w-[35px]">
                    {format(day, 'd')}
                    <div className="text-[8px] opacity-50 mt-1">{format(day, 'EEE')[0]}</div>
                  </th>
                ))}
                <th className="p-6 border-l border-slate-800 text-center bg-indigo-600">Total</th>
                <th className="p-6 text-center bg-indigo-700">Progress</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, hIdx) => {
                const completionsCount = daysInMonth.filter(day => habit.completions[format(day, 'yyyy-MM-dd')]).length;
                const percentage = Math.round((completionsCount / totalDays) * 100);

                return (
                  <tr key={habit.id} className="border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                    <td className="p-6 sticky left-0 z-10 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-900 border-r border-slate-50 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{habit.name}</span>
                        <button 
                          onClick={() => onDeleteHabit(habit.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                    {daysInMonth.map((day, dIdx) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const isDone = habit.completions[dateStr];
                      return (
                        <td key={dIdx} className="p-2 border-l border-slate-50 dark:border-slate-700 text-center">
                          <button 
                            onClick={() => onToggleHabit(habit.id, dateStr)}
                            className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${
                              isDone 
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                              : 'border-slate-200 dark:border-slate-600 hover:border-emerald-300'
                            }`}
                          >
                            {isDone && <span className="text-[10px] font-bold italic">✓</span>}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-6 border-l border-slate-50 dark:border-slate-700 text-center font-black text-slate-800 dark:text-slate-100">
                      {completionsCount} <span className="text-slate-300 dark:text-slate-600 text-[10px]">/ {totalDays}</span>
                    </td>
                    <td className="p-6 min-w-[150px]">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-indigo-600 transition-all duration-1000 shadow-lg" 
                            style={{ width: `${percentage}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                <td className="p-6 sticky left-0 z-10 bg-slate-50/50 dark:bg-slate-900/50">
                   <form onSubmit={handleAdd} className="flex items-center space-x-3">
                     <input 
                       type="text" 
                       placeholder="Define a new habit..."
                       value={newHabitName}
                       onChange={e => setNewHabitName(e.target.value)}
                       className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                     />
                     <button type="submit" className="w-10 h-10 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center hover:bg-emerald-700 shadow-lg shadow-emerald-100 dark:shadow-none transition-all">
                       +
                     </button>
                   </form>
                </td>
                <td colSpan={totalDays + 2} className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">
                  Enter your habits and check off your daily progress.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
