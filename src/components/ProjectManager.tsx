
import React, { useState } from 'react';
import { Project } from '../types';
import { COLOR_PALETTE } from '../constants';

interface ProjectManagerProps {
  projects: Project[];
  onAdd: (name: string, color: string, description: string) => void;
  onDelete: (id: string) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[2]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, selectedColor, description);
    setName('');
    setDescription('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Launch New Project</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Project Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Website Launch, Fitness Journey..."
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What is the goal of this project?"
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm h-24"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Branding Color</label>
            <div className="grid grid-cols-5 gap-3">
              {COLOR_PALETTE.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-2xl border-4 transition-all ${selectedColor === color ? 'border-slate-800 dark:border-white scale-110 shadow-lg' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="pt-6">
              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
              >
                Create Project
              </button>
            </div>
          </div>
        </form>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(proj => (
          <div key={proj.id} className="bg-white dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: proj.color }} />
            <div className="flex justify-between items-start mb-4 pl-2">
              <h4 className="font-bold text-slate-800 dark:text-white text-lg">{proj.name}</h4>
              <button 
                onClick={() => onDelete(proj.id)}
                className="text-slate-300 dark:text-slate-600 hover:text-rose-500 p-1 transition-colors"
                title="Delete Project"
              >
                🗑️
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 pl-2 mb-4 line-clamp-2 h-10">
              {proj.description || "No description provided."}
            </p>
            <div className="pl-2 pt-4 border-t border-slate-50 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Status: Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;
