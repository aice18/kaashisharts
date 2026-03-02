

import React, { useState } from 'react';
import { DailyLog, Student } from '../types';
import { Lightbox } from './Lightbox';
import { Database } from '../services/database';

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

const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || url.startsWith('data:video');
};

export const DailyLogCard: React.FC<DailyLogCardProps> = ({ log }) => {
  const borderColor = getBorderColor(log.id);
  const textColor = getTextColor(log.id);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const attendees = log.studentIds.map(id => {
      const student = Database.getStudentById(id);
      const attendanceCount = Database.getLogsForStudent(id).length;
      return { student, attendanceCount };
  }).filter(item => item.student !== undefined) as { student: Student, attendanceCount: number }[];

  return (
    <>
    <Lightbox src={zoomImage} onClose={() => setZoomImage(null)} />
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
                <div className="flex flex-wrap gap-4 pt-2">
                    {log.mediaUrls.map((url, idx) => {
                        if (isVideo(url)) {
                            return (
                                <video 
                                    key={idx}
                                    src={url}
                                    controls
                                    className="w-40 h-40 object-cover border border-primary/5 rounded-sm"
                                />
                            );
                        }
                        return (
                            <img 
                                key={idx} 
                                src={url} 
                                alt="Work" 
                                onClick={() => setZoomImage(url)}
                                className="w-20 h-20 object-cover grayscale hover:grayscale-0 transition-all cursor-zoom-in border border-primary/5 hover:border-primary/20"
                            />
                        );
                    })}
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

            {/* Attendance Section */}
            {attendees.length > 0 && (
                <div className="pt-4 border-t border-primary/5">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-secondary block mb-3">Attendance</span>
                    <div className="flex flex-wrap gap-3">
                        {attendees.map(({ student, attendanceCount }) => (
                            <div key={student.id} className="flex items-center gap-2 bg-subtle/30 pr-3 rounded-full border border-primary/5 relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                                <img src={student.profileImage} alt={student.name} className="w-8 h-8 rounded-full object-cover ml-2" />
                                <div>
                                    <p className="text-xs font-medium text-primary flex items-center gap-1">
                                        {student.name.split(' ')[0]}
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" title="Present"></span>
                                    </p>
                                    <p className="text-[9px] text-secondary">{attendanceCount} Classes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
             <div className="bg-background p-6 mt-2 border border-primary/5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-secondary block mb-2">Independent Study</span>
                <p className="text-xs font-medium italic text-primary">"{log.homework}"</p>
            </div>
      </div>
    </div>
    </>
  );
};