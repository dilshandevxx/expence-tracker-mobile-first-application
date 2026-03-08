import React, { useState } from 'react';
import { useAppContext } from '@/lib/store';
import { CATEGORIES, Category } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Settings2, Check } from 'lucide-react';

// Specific colors matching the dark reference ui
const categoryColors: Record<string, string> = {
  "Food": "#f97316", // Orange
  "Transport": "#10b981", // Emerald
  "Entertainment": "#8b5cf6", // Purple
  "Shopping": "#3b82f6", // Blue
  "Utilities": "#f43f5e", // Rose
  "Other": "#a8a29e" // Stone
};

export function CategoryCards() {
  const { expenses, limits, updateLimit } = useAppContext();
  const [isManaging, setIsManaging] = useState(false);

  // Helper to calculate spent per category
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const data = CATEGORIES.map((category: Category) => {
    const categoryExpenses = expenses.filter(e => 
      e.category === category && 
      new Date(e.date).getMonth() === currentMonth &&
      new Date(e.date).getFullYear() === currentYear
    );
    const spent = categoryExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return { name: category, value: spent > 0 ? spent : 1 }; // Return 1 minimum for visual empty state
  }).filter(d => d.value > 0);

  // If no expenses, show a dummy ring
  const chartData = data.reduce((acc, curr) => acc + curr.value, 0) > CATEGORIES.length 
    ? data 
    : [{ name: 'Empty', value: 1 }];

  if (isManaging) {
    return (
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-medium">Manage Limits</h3>
          <button onClick={() => setIsManaging(false)} className="bg-primary text-white p-1.5 rounded-lg hover:opacity-90 transition-opacity">
            <Check className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           {CATEGORIES.map(category => {
             const currentLimit = limits.find(l => l.category === category)?.amount || '';
             return (
               <div key={category} className="flex flex-col gap-1.5">
                 <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[category] || categoryColors['Other'] }} />
                   {category}
                 </label>
                 <div className="relative">
                   <span className="absolute left-3 top-3 text-zinc-500 text-sm">$</span>
                   <input 
                     type="number" 
                     value={currentLimit}
                     onChange={(e) => updateLimit(category, Number(e.target.value))}
                     className="w-full bg-[#1e1e2d] border border-transparent rounded-xl py-2.5 pl-7 pr-3 text-white focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all"
                     placeholder="0.00"
                   />
                 </div>
               </div>
             );
           })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
         <h3 className="text-white font-medium">Categories</h3>
         <button onClick={() => setIsManaging(true)} className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <Settings2 className="w-4 h-4" />
         </button>
       </div>

       <div className="flex items-center justify-between gap-4">
          {/* Legend Column */}
          <div className="flex flex-col gap-3">
             {CATEGORIES.slice(0, 4).map((category, idx) => (
                <div key={idx} className="flex items-center gap-2">
                   <div 
                     className="w-2 h-2 rounded-full" 
                     style={{ backgroundColor: categoryColors[category] || categoryColors['Other'] }} 
                   />
                   <span className="text-sm text-zinc-300">{category}</span>
                </div>
             ))}
          </div>

          {/* Donut Chart */}
          <div className="w-32 h-32 relative flex-shrink-0">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Empty' ? '#3f3f46' : categoryColors[entry.name] || categoryColors['Other']} 
                      />
                    ))}
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             
             {/* Center Label */}
             <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-lg font-bold text-white">
                  {expenses.length > 0 ? "70%" : "0%"}
                </span>
             </div>
          </div>
       </div>
    </div>
  );
}
