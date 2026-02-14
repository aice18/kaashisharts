

export enum ClassLevel {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7
}

export type UserRole = 'guest' | 'parent' | 'teacher' | 'admin';

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'low' | 'high';
  read?: boolean;
  recipientId?: string; // Optional: If present, only visible to this user
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string; // ISO string
  read: boolean;
}

export interface ClassSchedule {
  day: string;
  time: string;
  subject: string;
}

export interface Artwork {
  id: string;
  studentId: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

export interface GalleryItem {
  url: string;
  title: string;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  schoolName: string;
  address: string;
  admissionDate: string;
  currentLevel: ClassLevel;
  profileImage: string;
  schedule: ClassSchedule[];
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Teacher {
  id: string;
  name: string;
  specialization: string;
  profileImage: string;
  upcomingClasses: number;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface SyllabusItem {
  level: ClassLevel;
  title: string;
  description: string;
  modules: string[];
}

export interface DailyLog {
  id: string;
  studentIds: string[]; // IDs of students present for this log
  date: string;
  entryTime: string;
  exitTime: string;
  activityTitle: string;
  activityDescription: string;
  homework: string;
  mediaUrls: string[]; // Photos/Videos of work
  teacherNote?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}