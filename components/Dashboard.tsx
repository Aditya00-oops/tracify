
import React, { useMemo } from 'react';
import { Task } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { subDays, format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const weeklyData = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 6);
    const interval = eachDayOfInterval({ start, end });

    return interval.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayTasks = tasks.filter(t => t.date === dateStr);
      const done = dayTasks.filter(t => t.completed).length;
      return {
        name: format(day, 'EEE'),
        completed: done,
        total: dayTasks.length,
        rate: dayTasks.length ? Math.round((done / dayTasks.length) * 100) : 0
      };
    });
  }, [tasks]);

  // Radar data for category distribution (Mocking categories for visualization)
  const categoryData = useMemo(() => {
    const categories = ['Study', 'Work', 'Health', 'Personal', 'Social'];
    return categories.map(cat => ({
      subject: cat,
      A: Math.floor(Math.random() * 80) + 20,
      fullMark: 100,
    }));
  }, [tasks]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
          <p className="text-xl font-black text-white">{payload[0].value}% <span className="text-[10px] font-bold text-slate-500">EFFICIENCY</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in zoom-in-95 duration-700">
      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 dark:shadow-none flex flex-col justify-between h-48 group hover:-translate-y-1 transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Mastery</p>
          <div>
            <h3 className="text-5xl font-black tracking-tighter">{completionRate}%</h3>
            <p className="text-xs font-bold opacity-60 mt-1">LIFETIME COMPLETION RATE</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col justify-between h-48 group hover:-translate-y-1 transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Items</p>
          <div>
            <h3 className="text-5xl font-black tracking-tighter text-slate-800 dark:text-white">{totalTasks}</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">INTENTIONS LOGGED</p>
          </div>
        </div>
        <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200 dark:shadow-none flex flex-col justify-between h-48 group hover:-translate-y-1 transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Done</p>
          <div>
            <h3 className="text-5xl font-black tracking-tighter">{completedTasks}</h3>
            <p className="text-xs font-bold opacity-60 mt-1">MILESTONES REACHED</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col justify-between h-48 group hover:-translate-y-1 transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pending</p>
          <div>
            <h3 className="text-5xl font-black tracking-tighter text-rose-500">{totalTasks - completedTasks}</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">AWAITING FOCUS</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Focus Trend */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-soft">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Productivity Flow</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Performance over the last 7 days</p>
            </div>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase rounded-full">Weekly Analysis</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Balance Radar */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col">
          <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tight mb-2 text-center">Focus Balance</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-8">Category equilibrium</p>
          <div className="flex-1 flex items-center justify-center">
             <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                  <PolarGrid stroke="#f1f5f9" className="dark:stroke-slate-700" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                  <Radar name="Activity" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} strokeWidth={3} />
                </RadarChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-6 border-t border-slate-50 dark:border-slate-700">
             <p className="text-[9px] text-center font-bold text-slate-400 uppercase leading-relaxed">Your most balanced focus area is currently <span className="text-emerald-500 font-black">HEALTH</span>. Maintain this rhythm.</p>
          </div>
        </div>
      </div>

      {/* Task Intensity Bar Chart */}
      <section className="bg-slate-900 p-12 rounded-[3.5rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 select-none pointer-events-none">
           <div className="text-[180px] font-black leading-none">INTENSITY</div>
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
           <div>
              <h4 className="text-3xl font-black tracking-tight mb-4">Task Velocity</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">A visualization of raw output volume. Use this to identify peak performance windows in your weekly schedule.</p>
              <div className="flex items-center space-x-4">
                 <div className="flex flex-col">
                    <span className="text-2xl font-black text-emerald-400">12.5%</span>
                    <span className="text-[10px] font-black uppercase text-slate-500">Vs Last Week</span>
                 </div>
                 <div className="h-8 w-px bg-slate-800"></div>
                 <div className="flex flex-col">
                    <span className="text-2xl font-black text-white">42</span>
                    <span className="text-[10px] font-black uppercase text-slate-500">Tasks Avg.</span>
                 </div>
              </div>
           </div>
           <div className="lg:col-span-2 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={weeklyData}>
                    <XAxis dataKey="name" hide />
                    <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px'}} />
                    <Bar dataKey="completed" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={40} />
                    <Bar dataKey="total" fill="#334155" radius={[8, 8, 8, 8]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
