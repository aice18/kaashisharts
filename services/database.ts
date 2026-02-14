

import { ClassLevel, DailyLog, Student, Teacher, UserRole, Announcement, Artwork, DirectMessage, GalleryItem } from '../types';
import { SYLLABUS_DATA, GALLERY_IMAGES } from '../constants';

// --- INITIAL DATASET ---

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "A1",
    title: "Annual Art Exhibition",
    date: "2024-06-15",
    content: "Submissions for the summer gala are due by Friday. Please ensure canvases are framed.",
    priority: 'high',
    read: false
  },
  {
    id: "A2",
    title: "Holiday Closure",
    date: "2024-05-28",
    content: "The studio will be closed this Monday for maintenance.",
    priority: 'low',
    read: true
  }
];

const INITIAL_ARTWORKS: Artwork[] = [
    {
        id: "ART-001",
        studentId: "ST-2024-001",
        title: "Sunset over Hills",
        description: "Watercolor study focusing on warm gradients.",
        imageUrl: "https://picsum.photos/id/1015/600/600",
        date: "2024-05-10"
    },
    {
        id: "ART-002",
        studentId: "ST-2024-001",
        title: "Fruit Basket",
        description: "Still life composition using oil pastels.",
        imageUrl: "https://picsum.photos/id/1080/600/600",
        date: "2024-04-22"
    }
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: "ST-2024-001",
    name: "Aarav Sharma",
    age: 9,
    schoolName: "Greenwood High International",
    address: "42, Maple Avenue, Sector 12",
    admissionDate: "2024-01-15",
    currentLevel: ClassLevel.Three,
    profileImage: "https://picsum.photos/id/237/200/200",
    schedule: [
      { day: "Monday", time: "4:00 PM - 5:30 PM", subject: "Watercolors" },
      { day: "Thursday", time: "4:00 PM - 5:30 PM", subject: "Sketching" }
    ],
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: "ST-2024-002",
    name: "Zara Khan",
    age: 11,
    schoolName: "Metropolis High",
    address: "10, Creative Block, City Center",
    admissionDate: "2023-08-10",
    currentLevel: ClassLevel.Five,
    profileImage: "https://picsum.photos/id/1011/200/200",
    schedule: [
      { day: "Tuesday", time: "5:00 PM - 6:30 PM", subject: "Oil Pastels" },
      { day: "Friday", time: "5:00 PM - 6:30 PM", subject: "Perspective" }
    ],
    isOnline: false,
    lastSeen: "2024-05-21T14:30:00.000Z"
  },
  {
      id: "ST-2024-003",
      name: "Vihaan Gupta",
      age: 7,
      schoolName: "Little Stars Academy",
      address: "5, River View, East End",
      admissionDate: "2024-03-01",
      currentLevel: ClassLevel.One,
      profileImage: "https://picsum.photos/id/1005/200/200",
      schedule: [
        { day: "Wednesday", time: "3:30 PM - 4:30 PM", subject: "Finger Painting" },
        { day: "Saturday", time: "10:00 AM - 11:30 AM", subject: "Crafts" }
      ],
      isOnline: false,
      lastSeen: "2024-05-20T09:00:00.000Z"
  }
];

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "T-001",
    name: "Kashmira Jha",
    specialization: "Fine Arts & Oil Painting",
    profileImage: "https://picsum.photos/id/64/200/200",
    upcomingClasses: 3,
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: "T-002",
    name: "Rohan Das",
    specialization: "Sculpture & Pottery",
    profileImage: "https://picsum.photos/id/91/200/200",
    upcomingClasses: 2,
    isOnline: false,
    lastSeen: "2024-05-21T16:45:00.000Z"
  },
  {
    id: "T-003",
    name: "Sarah Lee",
    specialization: "Watercolors & Landscapes",
    profileImage: "https://picsum.photos/id/65/200/200",
    upcomingClasses: 4,
    isOnline: false,
    lastSeen: "2024-05-21T10:15:00.000Z"
  }
];

const INITIAL_LOGS: DailyLog[] = [
  {
    id: "log-1",
    studentIds: ["ST-2024-001"], 
    date: "2024-05-20",
    entryTime: "04:00 PM",
    exitTime: "05:30 PM",
    activityTitle: "Watercolor Landscapes",
    activityDescription: "Today we focused on the 'wet-on-wet' technique to create a soft sky background.",
    homework: "Observe the sunset colors today and write down 3 colors you see.",
    mediaUrls: ["https://picsum.photos/id/10/400/300", "https://picsum.photos/id/11/400/300"]
  },
  {
    id: "log-2",
    studentIds: ["ST-2024-001", "ST-2024-003"],
    date: "2024-05-18",
    entryTime: "04:00 PM",
    exitTime: "05:30 PM",
    activityTitle: "Tree Textures",
    activityDescription: "Learning how to use a dry brush to create rough bark textures.",
    homework: "Collect a real leaf and bring it to the next class.",
    mediaUrls: [
        "https://picsum.photos/id/12/400/300",
        "https://www.w3schools.com/html/mov_bbb.mp4" // Sample Video
    ]
  }
];

const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: "m1",
    senderId: "ST-2024-001",
    receiverId: "T-001",
    content: "Hi Ms. Kashmira, Aarav will be 10 mins late today.",
    timestamp: "2024-05-21T15:30:00.000Z",
    read: true
  },
  {
    id: "m2",
    senderId: "T-001",
    receiverId: "ST-2024-001",
    content: "No problem, thanks for letting me know! We are starting with sketching today.",
    timestamp: "2024-05-21T15:32:00.000Z",
    read: true
  }
];

// --- DATABASE STATE ---
let students = [...INITIAL_STUDENTS];
let teachers = [...INITIAL_TEACHERS];
let logs = [...INITIAL_LOGS];
let announcements = [...INITIAL_ANNOUNCEMENTS];
let artworks = [...INITIAL_ARTWORKS];
let messages = [...INITIAL_MESSAGES];

// Simulation Interval (in memory only for demo)
if (typeof window !== 'undefined') {
  setInterval(() => {
    // Randomly toggle a student's online status
    const randomStudentIndex = Math.floor(Math.random() * students.length);
    students[randomStudentIndex].isOnline = !students[randomStudentIndex].isOnline;
    if (!students[randomStudentIndex].isOnline) {
      students[randomStudentIndex].lastSeen = new Date().toISOString();
    }
    
    // Randomly toggle a teacher's online status
    const randomTeacherIndex = Math.floor(Math.random() * teachers.length);
    teachers[randomTeacherIndex].isOnline = !teachers[randomTeacherIndex].isOnline;
     if (!teachers[randomTeacherIndex].isOnline) {
      teachers[randomTeacherIndex].lastSeen = new Date().toISOString();
    }
  }, 5000);
}

// --- PUBLIC API ---

export const Database = {
  // Authentication
  login: async (role: UserRole, id: string, password: string): Promise<Student | Teacher | null> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simple password check for demo purposes
    if (password !== '1234') return null;

    if (role === 'parent') {
      const student = students.find(s => s.id === id);
      return student || null;
    } else if (role === 'teacher') {
      const teacher = teachers.find(t => t.id === id);
      return teacher || null;
    } else if (role === 'admin') {
      return { id: 'admin', name: 'Admin', profileImage: '', role: 'admin' } as any; 
    }
    return null;
  },

  changePassword: async (userId: string, newPass: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Password changed for ${userId} to ${newPass}`);
    return true;
  },

  // Getters
  getStudentById: (id: string) => students.find(s => s.id === id),
  getAllStudents: () => [...students],
  getAllTeachers: () => [...teachers],
  getLogsForStudent: (studentId: string) => logs.filter(log => log.studentIds?.includes(studentId)),
  getAllLogs: () => [...logs],
  getAnnouncements: (userId?: string) => {
      // Return public announcements (no recipientId) OR announcements matching the userId
      return announcements.filter(a => !a.recipientId || a.recipientId === userId);
  },
  getArtworksForStudent: (studentId: string) => artworks.filter(a => a.studentId === studentId),
  getSyllabus: () => SYLLABUS_DATA,
  getGallery: (): GalleryItem[] => GALLERY_IMAGES,
  
  // Chat Methods
  getMessages: (user1Id: string, user2Id: string) => {
    return messages.filter(m => 
      (m.senderId === user1Id && m.receiverId === user2Id) || 
      (m.senderId === user2Id && m.receiverId === user1Id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage: (senderId: string, receiverId: string, content: string) => {
      const msg: DirectMessage = {
          id: `msg-${Date.now()}`,
          senderId,
          receiverId,
          content,
          timestamp: new Date().toISOString(),
          read: false
      };
      messages.push(msg);
      return msg;
  },

  // Actions
  addLog: async (logData: Omit<DailyLog, 'id'>) => {
     await new Promise(resolve => setTimeout(resolve, 500));
     const newLog: DailyLog = {
         ...logData,
         id: `log-${Date.now()}`
     };
     logs.unshift(newLog);
     return newLog;
  },

  addStudent: (student: Student) => {
      students.push(student);
  },

  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'read'>) => {
      const newAnnouncement: Announcement = {
          ...announcement,
          id: `A-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          read: false
      };
      announcements.unshift(newAnnouncement);
      return newAnnouncement;
  },

  addArtwork: async (artworkData: Omit<Artwork, 'id' | 'date'>) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newArtwork: Artwork = {
          ...artworkData,
          id: `ART-${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
      };
      artworks.unshift(newArtwork);
      return newArtwork;
  },

  updateStudent: (id: string, updates: Partial<Student>) => {
      const index = students.findIndex(s => s.id === id);
      if (index !== -1) {
          students[index] = { ...students[index], ...updates };
          return students[index];
      }
      return null;
  },

  updateTeacher: (id: string, updates: Partial<Teacher>) => {
      const index = teachers.findIndex(t => t.id === id);
      if (index !== -1) {
          teachers[index] = { ...teachers[index], ...updates };
          return teachers[index];
      }
      return null;
  }
};