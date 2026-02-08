import { ClassLevel, DailyLog, Student, Teacher, UserRole } from '../types';

// --- INITIAL DATASET (You can replace this with your JSON later) ---

const INITIAL_STUDENTS: Student[] = [
  {
    id: "ST-2024-001",
    name: "Aarav Sharma",
    age: 9,
    schoolName: "Greenwood High International",
    address: "42, Maple Avenue, Sector 12",
    admissionDate: "2024-01-15",
    currentLevel: ClassLevel.Three,
    profileImage: "https://picsum.photos/id/237/200/200"
  },
  {
    id: "ST-2024-002",
    name: "Zara Khan",
    age: 11,
    schoolName: "Metropolis High",
    address: "10, Creative Block, City Center",
    admissionDate: "2023-08-10",
    currentLevel: ClassLevel.Five,
    profileImage: "https://picsum.photos/id/1011/200/200"
  },
  {
      id: "ST-2024-003",
      name: "Vihaan Gupta",
      age: 7,
      schoolName: "Little Stars Academy",
      address: "5, River View, East End",
      admissionDate: "2024-03-01",
      currentLevel: ClassLevel.One,
      profileImage: "https://picsum.photos/id/1005/200/200"
  }
];

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "T-001",
    name: "Kashmira Jha",
    specialization: "Fine Arts & Oil Painting",
    profileImage: "https://picsum.photos/id/64/200/200",
    upcomingClasses: 3
  }
];

const INITIAL_LOGS: DailyLog[] = [
  {
    id: "log-1",
    studentIds: ["ST-2024-001"], // Log applies to specific students or 'all' if handled differently
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
    mediaUrls: ["https://picsum.photos/id/12/400/300"]
  },
  {
    id: "log-3",
    studentIds: ["ST-2024-002"],
    date: "2024-05-18",
    entryTime: "06:00 PM",
    exitTime: "07:30 PM",
    activityTitle: "Perspective Basics",
    activityDescription: "Introduction to one-point perspective using city streets as reference.",
    homework: "Draw your bedroom using 1-point perspective.",
    mediaUrls: []
  }
];

// --- DATABASE STATE ---
// In a real app, this would be an API. Here we use in-memory state + localStorage for persistence simulation.

let students = [...INITIAL_STUDENTS];
let teachers = [...INITIAL_TEACHERS];
let logs = [...INITIAL_LOGS];

// --- PUBLIC API ---

export const Database = {
  // Authentication
  login: async (role: UserRole, id: string, password: string): Promise<Student | Teacher | null> => {
    // SIMULATED AUTH DELAY
    await new Promise(resolve => setTimeout(resolve, 800));

    // MOCK PASSWORD CHECK (For demo, password is '1234' for everyone)
    if (password !== '1234') return null;

    if (role === 'parent') {
      // Parents login with Student ID
      const student = students.find(s => s.id === id);
      return student || null;
    } else if (role === 'teacher') {
      const teacher = teachers.find(t => t.id === id);
      return teacher || null;
    }
    return null;
  },

  // Getters
  getStudentById: (id: string) => students.find(s => s.id === id),
  
  getAllStudents: () => [...students],
  
  getLogsForStudent: (studentId: string) => {
    // Filter logs that include this student ID
    return logs.filter(log => log.studentIds?.includes(studentId));
  },

  getAllLogs: () => [...logs],

  // Actions
  addLog: async (logData: Omit<DailyLog, 'id'>) => {
     await new Promise(resolve => setTimeout(resolve, 500));
     const newLog: DailyLog = {
         ...logData,
         id: `log-${Date.now()}`
     };
     logs.unshift(newLog); // Add to top
     return newLog;
  },

  addStudent: (student: Student) => {
      students.push(student);
  }
};
