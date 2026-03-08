import React from 'react';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '@/lib/store';
import { ArrowUpRight } from 'lucide-react';

export default function Charts() {
  const { expenses } = useAppContext();

  // Process data for a daily Area chart
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Get expenses for current month, grouped by day
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    // Map days to generic Mon, Tue, Wed for the x-axis visual match, though actual data is date based
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dateObj = new Date(currentYear, currentMonth, day);
    const dayStr = shortDays[dateObj.getDay()];
    
    return {
      date: dayStr,
      fullDate: dateObj,
      amount: 0,
    };
  });

  expenses.forEach(expense => {
    const d = new Date(expense.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        dailyData[d.getDate() - 1].amount += expense.amount;
    }
  });

  // To make it look like the beautiful reference chart even with sparse data, 
  // Let's ensure data is somewhat continuous
  const mappedData = dailyData.filter((_, i) => i % 4 === 0); // show a few ticks

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-medium flex items-center gap-2">
           Revenue <span className="text-primary text-xs flex items-center"><ArrowUpRight className="w-3 h-3"/> 2%</span>
        </h3>
        <select className="bg-transparent text-xs text-zinc-400 outline-none border-none cursor-pointer">
           <option>Last Week</option>
           <option>This Month</option>
        </select>
      </div>

      <div className="w-full h-[200px] relative -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mappedData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#71717a' }} 
              dy={10}
            />
            <RechartsTooltip 
              cursor={false}
              contentStyle={{ backgroundColor: '#1e1e2d', borderColor: 'transparent', borderRadius: '8px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}
              formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Spent']}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#8b5cf6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorAmount)"
              activeDot={{ r: 6, fill: '#1e1e2d', stroke: '#8b5cf6', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
