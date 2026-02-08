import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Student } from '../types';

const COLORS = ['#1D4ed8', '#C23B22', '#CC7722', '#40826D', '#7F00FF'];

// --- Parent Dashboard Chart ---

export const StudentSkillsChart: React.FC<{ student: Student }> = ({ student }) => {
  // Deterministic mock data based on name length to ensure consistency per student in demo
  const seed = student.name.length;
  const data = [
    { subject: 'Sketching', A: 80 + (seed % 15), fullMark: 100 },
    { subject: 'Color', A: 70 + (seed % 25), fullMark: 100 },
    { subject: 'Composition', A: 60 + (seed % 35), fullMark: 100 },
    { subject: 'Creativity', A: 85 + (seed % 10), fullMark: 100 },
    { subject: 'Discipline', A: 90 + (seed % 5), fullMark: 100 },
  ];

  return (
    <div className="h-[350px] w-full bg-white border border-primary/5 p-6 relative shadow-sm">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-secondary absolute top-6 left-6 font-bold">Skill Assessment</h3>
      <div className="w-full h-full pt-6">
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e5e5e5" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontFamily: 'Inter' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
                name={student.name}
                dataKey="A"
                stroke="#1D4ed8"
                fill="#1D4ed8"
                fillOpacity={0.1}
            />
            </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Teacher Dashboard Charts ---

export const ClassDistributionChart: React.FC<{ students: Student[] }> = ({ students }) => {
  const levelCounts: Record<string, number> = {};
  students.forEach(s => {
    const lvl = `Lvl ${s.currentLevel}`;
    levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
  });

  const data = Object.keys(levelCounts).map(key => ({ name: key, value: levelCounts[key] }));

  return (
    <div className="h-[300px] w-full bg-white border border-primary/5 p-6 relative shadow-sm">
       <h3 className="text-[10px] uppercase tracking-[0.2em] text-secondary absolute top-6 left-6 font-bold">Class Demographics</h3>
      <div className="w-full h-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
            >
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderColor: '#f0f0f0', borderRadius: '0px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#111' }}
            />
            <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '10px', fontFamily: 'Inter', paddingTop: '10px' }} />
            </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const WeeklyActivityChart: React.FC = () => {
  // Mock data for the current week
  const data = [
    { name: 'Mon', attendance: 12 },
    { name: 'Tue', attendance: 19 },
    { name: 'Wed', attendance: 15 },
    { name: 'Thu', attendance: 22 },
    { name: 'Fri', attendance: 18 },
    { name: 'Sat', attendance: 28 },
    { name: 'Sun', attendance: 25 },
  ];

  return (
    <div className="h-[300px] w-full bg-white border border-primary/5 p-6 relative shadow-sm">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-secondary absolute top-6 left-6 font-bold">Weekly Attendance</h3>
      <div className="mt-8 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} dy={10} />
            <Tooltip 
                cursor={{ fill: '#f9f9f9' }}
                contentStyle={{ backgroundColor: '#111', border: 'none', color: '#fff', fontSize: '12px' }}
            />
            <Bar dataKey="attendance" fill="#C23B22" radius={[2, 2, 0, 0]} barSize={12} activeBar={{ fill: '#1D4ed8' }} />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
