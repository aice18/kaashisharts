import React from 'react';
import { DailyLog } from '../types';

interface DailyLogCardProps {
  log: DailyLog;
}

// Map the log date/id to a color deterministically
const getBorderColor = (id: string) => {
  const colors = ['border-l-cobalt', 'border-l-vermilion', 'border-l-ochre', 'border-l-viridian', 'border-l-violet'];
  const index = id.charCodeAt(id.length - 1) % colors.length;
  return colors[index];
}

const getTextColor = (id: string) => {
  const colors = ['text-cobalt', 'text-vermilion', 'text-ochre', 'text-viridian', 'text-violet'];
  const index = id.charCodeAt(id.length - 1) % colors.length;
  return colors[index];
}

export const DailyLogCard: React.FC<DailyLogCardProps> = ({ log }) => {
  const borderColor = getBorderColor(log.id);
  const textColor = getTextColor(log.id);

  return (
    <div className={`py-8 pl-8 border-l-4 ${borderColor} bg-surface shadow-sm mb-6`}>
      <div className="flex justify-between items-baseline mb-6">
        <h3 className="font-serif text-2xl text-primary">{log.date}</h3>
        <span className="text-[9px] uppercase tracking-[0.2em] text-secondary">Log ID: {log.id}</span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
            <div>
                <span className={`text-[9px] uppercase tracking-[0.2em] ${textColor} mb-2 block font-bold`}>Module Focus</span>
                <h4 className="text-xl font-serif text-primary mb-2 italic">{log.activityTitle}</h4>
                <p className="text-sm font-light text-secondary leading-relaxed">
                    {log.activityDescription}
                </p>
            </div>
            
            {log.mediaUrls.length > 0 && (
                <div className="flex gap-4 pt-2">
                    {log.mediaUrls.map((url, idx) => (
                        <img 
                            key={idx} 
                            src={url} 
                            alt="Work" 
                            className="w-20 h-20 object-cover grayscale hover:grayscale-0 transition-all cursor-pointer border border-primary/5 hover:border-primary/20"
                        />
                    ))}
                </div>
            )}

            <div className="flex gap-12 pt-4 border-t border-primary/5">
                <div>
                     <span className="text-[9px] uppercase tracking-[0.2em] text-secondary block mb-1">In</span>
                     <p className="font-serif text-lg">{log.entryTime}</p>
                </div>
                <div>
                     <span className="text-[9px] uppercase tracking-[0.2em] text-secondary block mb-1">Out</span>
                     <p className="font-serif text-lg">{log.exitTime}</p>
                </div>
            </div>
            
             <div className="bg-background p-6 mt-2 border border-primary/5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-secondary block mb-2">Independent Study</span>
                <p className="text-xs font-medium italic text-primary">"{log.homework}"</p>
            </div>
      </div>
    </div>
  );
};
