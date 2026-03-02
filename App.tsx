

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { HashRouter, Routes, Route, useNavigate, useLocation, Outlet, Navigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { PortalNavigation } from './components/Navigation';
import { PublicHeader } from './components/PublicHeader';
import { DailyLogCard } from './components/DailyLogCard';
import { StudentSkillsChart, ClassDistributionChart, WeeklyActivityChart } from './components/Charts';
import { SYLLABUS_DATA, GALLERY_IMAGES } from './constants';
import { Student, SyllabusItem, UserRole, Teacher, DailyLog, Artwork, DirectMessage, ClassLevel, GalleryItem } from './types';
import { Database } from './services/database';
import { getArtisticAdvice } from './services/geminiService';
import { Lightbox } from './components/Lightbox';
import { HomePage } from './pages/HomePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { PublicLayout } from './layouts/PublicLayout';
import { PortalLayout } from './layouts/PortalLayout';

// --- Utility for Colors ---
const PIGMENTS = ['text-cobalt', 'text-vermilion', 'text-ochre', 'text-viridian', 'text-violet'];
const BG_PIGMENTS = ['bg-cobalt', 'bg-vermilion', 'bg-ochre', 'bg-viridian', 'bg-violet'];

// --- Helper Functions ---
const formatLastSeen = (dateString?: string) => {
    if (!dateString) return 'Offline';
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    
    if (isToday) {
        return `Last seen today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `Last seen on ${date.toLocaleDateString()}`;
};

// --- Shared Components ---



const NotificationBell: React.FC<{ userId: string }> = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const announcements = Database.getAnnouncements(userId);
    const unreadCount = announcements.filter(a => !a.read).length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-secondary hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-vermilion rounded-full border border-white"></span>
                )}
            </button>

            {isOpen && (
                <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-80 bg-white border border-primary/5 shadow-xl rounded-sm z-50 animate-fade-in origin-top-right">
                    <div className="p-4 border-b border-primary/5 bg-subtle/30">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Notifications</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {announcements.length === 0 ? (
                            <div className="p-6 text-center text-xs text-secondary">No new notifications.</div>
                        ) : (
                            announcements.map(a => (
                                <div key={a.id} className={`p-4 border-b border-primary/5 hover:bg-subtle/50 transition-colors ${a.priority === 'high' ? 'border-l-4 border-l-vermilion' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-serif text-sm text-primary">{a.title}</h4>
                                        <span className="text-[9px] text-secondary">{a.date}</span>
                                    </div>
                                    <p className="text-xs text-secondary leading-snug">{a.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                </>
            )}
        </div>
    );
}

const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, maxWidth?: string }> = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`bg-surface w-full ${maxWidth} p-0 shadow-2xl border border-white/20 relative flex flex-col max-h-[90vh]`} onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center p-6 border-b border-primary/5 bg-white">
                     <h2 className="text-xl font-serif text-primary">{title}</h2>
                     <button onClick={onClose} className="text-secondary hover:text-primary text-xl">×</button>
                 </div>
                 <div className="overflow-y-auto p-6 flex-1">
                    {children}
                 </div>
            </div>
        </div>,
        document.body
    );
}

const EditProfileModal: React.FC<{ isOpen: boolean, onClose: () => void, user: Student | Teacher, onSave: (name: string, image: string) => void }> = ({ isOpen, onClose, user, onSave }) => {
    const [name, setName] = useState(user.name);
    const [image, setImage] = useState(user.profileImage);

    useEffect(() => {
        setName(user.name);
        setImage(user.profileImage);
    }, [user, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if(ev.target?.result) setImage(ev.target.result as string);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <div className="space-y-6">
                <div className="flex flex-col items-center gap-4 mb-6">
                    <img src={image} className="w-24 h-24 rounded-full object-cover border-2 border-primary/10" />
                    <label className="text-[10px] uppercase tracking-[0.2em] text-cobalt cursor-pointer hover:underline">
                        Change Photo
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Full Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-white border border-primary/10 px-4 py-3 font-serif text-lg outline-none rounded-sm focus:border-cobalt transition-colors shadow-sm"
                    />
                </div>
                <button 
                    onClick={() => { onSave(name, image); onClose(); }}
                    className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-primary text-white hover:bg-cobalt transition-colors shadow-md rounded-sm"
                >
                    Save Changes
                </button>
            </div>
        </Modal>
    );
}

const ChangePasswordModal: React.FC<{ isOpen: boolean, onClose: () => void, userId: string }> = ({ isOpen, onClose, userId }) => {
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const getStrength = (pass: string) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length > 6) score += 1;
        if (pass.length > 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    }

    const strength = getStrength(newPass);

    const strengthColor = (score: number) => {
        if (score < 2) return 'bg-vermilion';
        if (score < 4) return 'bg-ochre';
        return 'bg-viridian';
    }

    const strengthText = (score: number) => {
        if (score < 2) return 'Weak';
        if (score < 4) return 'Moderate';
        return 'Strong';
    }

    const handleSubmit = async () => {
        if (newPass !== confirmPass) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true);
        await Database.changePassword(userId, newPass);
        setLoading(false);
        setNewPass('');
        setConfirmPass('');
        onClose();
        alert("Password updated successfully.");
    };

    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Secure Access">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">New Password</label>
                    <input 
                        type="password" 
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                        className="w-full bg-white border border-primary/10 px-4 py-3 font-serif text-lg outline-none rounded-sm focus:border-cobalt transition-colors shadow-sm"
                    />
                    {newPass && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${strengthColor(strength)} transition-all duration-300`} 
                                    style={{ width: `${(strength / 5) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-secondary">{strengthText(strength)}</span>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Confirm Password</label>
                    <input 
                        type="password" 
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        className="w-full bg-white border border-primary/10 px-4 py-3 font-serif text-lg outline-none rounded-sm focus:border-cobalt transition-colors shadow-sm"
                    />
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={loading || !newPass}
                    className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-primary text-white hover:bg-cobalt transition-colors shadow-md rounded-sm disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </div>
         </Modal>
    );
};

// --- NEW: Full Page Student Details ---
const StudentDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const student = Database.getStudentById(id || '');
    const logs = Database.getLogsForStudent(id || '');

    // Calculate attendance based on logs (Simple logic: if log exists, present)
    const attendanceDates = logs.map(l => l.date);

    if (!student) return <div>Student not found</div>;

    return (
        <div className="space-y-8 animate-fade-in pt-4 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 border-b border-primary/5 pb-4">
                <button onClick={() => navigate(-1)} className="text-secondary hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <h1 className="text-2xl font-serif">Student Profile</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start bg-white p-8 border border-primary/5 shadow-sm rounded-sm">
                <div className="relative">
                    <img src={student.profileImage} className="w-32 h-32 md:w-48 md:h-48 rounded-sm object-cover border border-primary/10 shadow-md" />
                    {student.isOnline && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border-4 border-white">
                            Online
                        </div>
                    )}
                </div>
                <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-serif text-primary mb-2">{student.name}</h2>
                            <span className="bg-cobalt/10 text-cobalt text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-bold rounded-sm">Level 0{student.currentLevel}</span>
                        </div>
                        <button 
                            onClick={() => navigate(`/portal/teacher/messages/${student.id}`)}
                            className="bg-primary text-white px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-cobalt transition-colors shadow-md flex items-center gap-2"
                        >
                            <span>Message Parent</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm pt-4 border-t border-primary/5">
                        <div>
                            <span className="block text-[9px] uppercase tracking-wider text-secondary mb-1">Student ID</span>
                            <span className="font-serif text-lg">{student.id}</span>
                        </div>
                        <div>
                            <span className="block text-[9px] uppercase tracking-wider text-secondary mb-1">Age</span>
                            <span className="font-serif text-lg">{student.age} Years</span>
                        </div>
                        <div>
                            <span className="block text-[9px] uppercase tracking-wider text-secondary mb-1">School</span>
                            <span className="font-medium text-primary">{student.schoolName}</span>
                        </div>
                         <div>
                            <span className="block text-[9px] uppercase tracking-wider text-secondary mb-1">Joined</span>
                            <span className="font-medium text-primary">{student.admissionDate}</span>
                        </div>
                        <div className="col-span-2">
                             <span className="block text-[9px] uppercase tracking-wider text-secondary mb-1">Address</span>
                             <span className="font-medium text-primary">{student.address}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 border border-primary/5 shadow-sm rounded-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-6 border-b border-primary/5 pb-2">Class Schedule</h3>
                    {student.schedule.length > 0 ? (
                        <div className="space-y-3">
                            {student.schedule.map((sch, i) => (
                                <div key={i} className="flex justify-between items-center bg-subtle p-4 rounded-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cobalt"></div>
                                        <span className="font-bold text-primary">{sch.day}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-medium">{sch.time}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-secondary">{sch.subject}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-secondary italic">No schedule assigned.</p>
                    )}
                </div>
                
                 <div className="bg-white p-6 border border-primary/5 shadow-sm rounded-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-6 border-b border-primary/5 pb-2">Attendance History</h3>
                    {attendanceDates.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {attendanceDates.slice(0, 15).map((date, i) => (
                                <div key={i} className="px-3 py-2 bg-green-50 text-green-700 border border-green-100 rounded-sm text-xs font-bold">
                                    {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    <span className="block text-[8px] uppercase tracking-wide opacity-70">Present</span>
                                </div>
                            ))}
                            {attendanceDates.length > 15 && (
                                <span className="text-xs text-secondary self-center">+{attendanceDates.length - 15} more</span>
                            )}
                        </div>
                    ) : (
                         <p className="text-sm text-secondary italic">No attendance recorded.</p>
                    )}
                </div>
            </div>

            <div className="bg-white p-0 border border-primary/5 shadow-sm rounded-sm overflow-hidden">
                 <StudentSkillsChart student={student} />
            </div>
        </div>
    )
}

// --- NEW: Full Page WhatsApp Style Chat ---
const ChatPage: React.FC<{ currentUser: Student | Teacher, role: UserRole }> = ({ currentUser, role }) => {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // State
    const [contacts, setContacts] = useState<(Student | Teacher)[]>([]);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(chatId || null);
    const [messages, setMessages] = useState<DirectMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [attachment, setAttachment] = useState<{ type: 'image' | 'video', url: string } | null>(null);

    const activeContact = contacts.find(c => c.id === selectedContactId);

    // Effect to fetch contacts and poll for status changes
    useEffect(() => {
        const fetchContacts = () => {
            const data = role === 'teacher' ? Database.getAllStudents() : Database.getAllTeachers();
            setContacts(data);
        };
        fetchContacts();
        const interval = setInterval(fetchContacts, 3000); // Poll status every 3s
        return () => clearInterval(interval);
    }, [role]);

    // Effect to handle URL param changes
    useEffect(() => {
        setSelectedContactId(chatId || null);
    }, [chatId]);

    // Polling for messages (Real-time simulation)
    useEffect(() => {
        if (!activeContact) return;

        const fetchMessages = () => {
            const msgs = Database.getMessages(currentUser.id, activeContact.id);
            
            // Mark messages from activeContact as read
            Database.markAsRead(activeContact.id, currentUser.id);

            setMessages(prev => {
                // Check if any message status changed (e.g. read status)
                const hasChanges = prev.length !== msgs.length || prev.some((m, i) => m.read !== msgs[i]?.read);
                if (hasChanges) return [...msgs];
                return prev;
            });
        };

        fetchMessages(); 
        const interval = setInterval(fetchMessages, 1000); 

        return () => clearInterval(interval);
    }, [activeContact, currentUser.id]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages.length, activeContact, attachment]);

    const handleSend = () => {
        if ((!inputText.trim() && !attachment) || !activeContact) return;
        
        const msgContent = inputText.trim() || (attachment ? (attachment.type === 'image' ? '📷 Image' : '🎥 Video') : '');
        
        Database.sendMessage(currentUser.id, activeContact.id, msgContent, attachment || undefined);
        
        // Optimistic update
        setMessages(prev => [...prev, {
            id: `temp-${Date.now()}`,
            senderId: currentUser.id,
            receiverId: activeContact.id,
            content: msgContent,
            timestamp: new Date().toISOString(),
            read: false,
            attachment: attachment || undefined
        }]);
        
        setInputText('');
        setAttachment(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleContactSelect = (id: string) => {
        setSelectedContactId(id);
        navigate(role === 'teacher' ? `/portal/teacher/messages/${id}` : `/portal/parent/messages/${id}`);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    const type = file.type.startsWith('video') ? 'video' : 'image';
                    setAttachment({ type, url: ev.target.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex h-full bg-white md:border-l border-primary/10 overflow-hidden animate-fade-in">
            
            {/* Sidebar / Contacts List */}
            <div className={`w-full md:w-1/3 border-r border-primary/10 flex flex-col ${selectedContactId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 bg-subtle/30 border-b border-primary/5">
                    <h2 className="text-xl font-serif mb-4">Messages</h2>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search contacts..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-primary/10 rounded-sm text-sm outline-none focus:border-cobalt/50 transition-colors"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-2.5 text-secondary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {filteredContacts.map(contact => {
                        // Get last message snippet (mock efficiency)
                        const lastMsg = Database.getMessages(currentUser.id, contact.id).pop();
                        return (
                            <div 
                                key={contact.id} 
                                onClick={() => handleContactSelect(contact.id)}
                                className={`p-4 border-b border-primary/5 cursor-pointer hover:bg-subtle transition-colors flex items-center gap-3 ${selectedContactId === contact.id ? 'bg-subtle/70 border-l-4 border-l-cobalt' : ''}`}
                            >
                                <div className="relative">
                                    <img src={contact.profileImage} className="w-12 h-12 rounded-full object-cover border border-primary/10" />
                                    {contact.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-serif text-sm truncate text-primary">{contact.name}</h4>
                                        {lastMsg && <span className="text-[9px] text-secondary">{new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                                    </div>
                                    <p className="text-xs text-secondary truncate flex items-center gap-1">
                                        {lastMsg ? (
                                            <>
                                                {lastMsg.senderId === currentUser.id && <span>You: </span>}
                                                {lastMsg.attachment && (
                                                    <span className="flex items-center gap-0.5">
                                                        {lastMsg.attachment.type === 'image' ? '📷' : '🎥'} 
                                                        {lastMsg.attachment.type === 'image' ? 'Image' : 'Video'}
                                                    </span>
                                                )}
                                                {!lastMsg.attachment && lastMsg.content}
                                            </>
                                        ) : <span className="italic opacity-50">Start a conversation</span>}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-[#e5ddd5]/30 ${!selectedContactId ? 'hidden md:flex' : 'flex'}`} style={{ backgroundImage: 'radial-gradient(#00000005 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                {activeContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-3 bg-white border-b border-primary/5 flex items-center gap-3 shadow-sm z-10">
                            <button onClick={() => navigate(role === 'teacher' ? '/portal/teacher/messages' : '/portal/parent/messages')} className="md:hidden text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <img src={activeContact.profileImage} className="w-10 h-10 rounded-full object-cover border border-primary/10" />
                            <div className="flex-1 cursor-pointer" onClick={() => role === 'teacher' && navigate(`/portal/teacher/students/${activeContact.id}`)}>
                                <h3 className="font-serif text-lg leading-none text-primary hover:underline">{activeContact.name}</h3>
                                {activeContact.isOnline ? (
                                    <span className="text-[10px] uppercase tracking-wider text-green-600 font-bold">Online</span>
                                ) : (
                                    <span className="text-[10px] uppercase tracking-wider text-secondary">{formatLastSeen(activeContact.lastSeen)}</span>
                                )}
                            </div>
                        </div>

                        {/* Messages List */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId === currentUser.id;
                                
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                                        <div className={`max-w-[85%] md:max-w-[60%] p-2 shadow-sm text-sm rounded-lg relative ${isMe ? 'bg-cobalt text-white rounded-tr-none' : 'bg-white text-primary rounded-tl-none'}`}>
                                            {msg.attachment && (
                                                <div className="mb-2 rounded overflow-hidden">
                                                    {msg.attachment.type === 'image' ? (
                                                        <img src={msg.attachment.url} alt="Attachment" className="max-w-full h-auto max-h-64 object-cover" />
                                                    ) : (
                                                        <video src={msg.attachment.url} controls className="max-w-full h-auto max-h-64" />
                                                    )}
                                                </div>
                                            )}
                                            {msg.content && <p className="px-1">{msg.content}</p>}
                                            <div className={`text-[9px] mt-1 text-right opacity-70 flex items-center justify-end gap-1 ${isMe ? 'text-white' : 'text-secondary'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                {isMe && <span className={msg.read ? 'text-cyan-300 font-bold' : 'text-white/70'}>✓✓</span>}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-secondary opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    </svg>
                                    <p className="text-sm uppercase tracking-widest">No messages yet</p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-primary/5 flex flex-col gap-2">
                            {attachment && (
                                <div className="flex items-center gap-4 p-2 bg-subtle rounded-lg relative">
                                    <button onClick={() => setAttachment(null)} className="absolute -top-2 -right-2 bg-vermilion text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                        {attachment.type === 'image' ? (
                                            <img src={attachment.url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-black text-white text-[8px]">VIDEO</div>
                                        )}
                                    </div>
                                    <span className="text-xs text-secondary">Ready to send</span>
                                </div>
                            )}
                            <div className="flex gap-2 items-end">
                                <label className="p-3 text-secondary hover:text-primary cursor-pointer transition-colors">
                                    <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                    </svg>
                                </label>
                                <textarea 
                                    className="flex-1 bg-subtle/50 rounded-lg border border-transparent focus:border-cobalt/30 outline-none p-3 text-sm resize-none max-h-32 min-h-[44px]"
                                    placeholder="Type a message..."
                                    rows={1}
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!inputText.trim() && !attachment}
                                    className="p-3 bg-cobalt text-white rounded-full hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-0.5 -translate-y-0.5">
                                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-secondary opacity-40 select-none">
                         <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.186.078-2.1 1.051-2.1 2.238v.342m0 0a48.11 48.11 0 01-2.976 0c-1.135-.09-1.98-1.057-1.98-2.193v-4.286c0-.966.615-1.813 1.5-2.097a48.105 48.105 0 016.102-.94c.391-.049.78-.09 1.175-.118 1.175-.084 2.36-.125 3.55-.125 1.19 0 2.375.041 3.55.125.395.028.784.069 1.175.118a48.104 48.104 0 016.102.94z" />
                            </svg>
                         </div>
                         <h3 className="font-serif text-2xl mb-2 text-primary">KashArts Messenger</h3>
                         <p className="text-sm font-light tracking-wide">Select a contact to start chatting</p>
                         <div className="mt-8 flex gap-2 text-[10px] uppercase tracking-widest opacity-60">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full"></span> Offline</span>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const FeesModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-surface/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
             <div className="bg-surface w-full max-w-lg p-12 shadow-2xl border border-subtle relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-viridian to-ochre"></div>
                
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary hover:text-primary p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex justify-between items-start mb-12 mt-2">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-secondary block mb-2">Statement</span>
                        <h2 className="text-3xl font-serif text-primary">Financial Status</h2>
                    </div>
                    <span className="bg-viridian/10 text-viridian px-4 py-1 text-[9px] uppercase tracking-[0.2em] font-bold">Paid</span>
                </div>

                <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center pb-6 border-b border-subtle">
                        <span className="text-secondary font-light text-sm">Tuition (Term 3)</span>
                        <span className="font-serif text-xl text-primary">₹ 4,500</span>
                    </div>
                    <div className="flex justify-between items-center pb-6 border-b border-subtle">
                        <span className="text-secondary font-light text-sm">Materials & Assets</span>
                        <span className="font-serif text-xl text-primary">₹ 1,200</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-serif text-2xl text-primary">Total</span>
                        <span className="font-serif text-2xl text-primary">₹ 5,700</span>
                    </div>
                </div>

                <button onClick={onClose} className="w-full border border-subtle text-secondary py-4 text-[10px] uppercase tracking-[0.2em] hover:border-viridian hover:text-viridian transition-colors">
                    Close Statement
                </button>
             </div>
        </div>,
        document.body
    );
};



const ProgramsPage = () => {
    const navigate = useNavigate();
    // Use Database state for updates
    const syllabus = Database.getSyllabus(); 

    return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-fade-in relative">
        <button onClick={() => navigate('/')} className="mb-8 text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-primary">
            ← Back Home
        </button>
        <h1 className="text-4xl font-serif mb-12 pl-4 border-l-4 border-cobalt">Curriculum</h1>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {syllabus.map((item, i) => (
                <div key={item.level} className="group">
                    <div className="flex items-baseline justify-between border-b border-primary/10 pb-4 mb-4">
                        <span className={`text-3xl font-serif ${PIGMENTS[i % PIGMENTS.length]}`}>0{item.level}</span>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-secondary font-bold">{item.title}</span>
                    </div>
                    <p className="text-sm text-secondary font-light mb-4 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {item.modules.map((mod, j) => (
                            <span key={j} className="text-[9px] uppercase tracking-wider border border-primary/10 px-3 py-1 text-secondary bg-surface">
                                {mod}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};

const GalleryPage = () => {
    const navigate = useNavigate();
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    // Use Database state for gallery
    const images: GalleryItem[] = Database.getGallery();

    return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-fade-in">
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        <button onClick={() => navigate('/')} className="mb-8 text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-primary">
            ← Back Home
        </button>
        <h1 className="text-4xl font-serif mb-8 text-primary">Student Work</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {images.map((item, idx) => (
                <div key={idx} className="aspect-[3/4] relative group overflow-hidden bg-gray-100 cursor-zoom-in" onClick={() => setLightboxSrc(item.url)}>
                    <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                             <span className="text-[9px] text-white/70 uppercase tracking-widest mb-1 block">{item.date}</span>
                             <h4 className="text-white font-serif text-xl italic leading-none">{item.title}</h4>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};

const ContactPage = () => {
    const navigate = useNavigate();
    return (
    <div className="min-h-screen flex flex-col justify-center max-w-lg mx-auto py-12 px-6 animate-fade-in bg-background">
        <button onClick={() => navigate('/')} className="mb-8 text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-primary text-left">
            ← Back Home
        </button>
        
        <h1 className="text-4xl font-serif mb-12">Get in Touch</h1>
        
        <div className="space-y-8 mb-12">
                <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-viridian mb-2 font-bold">Studio Location</span>
                <p className="text-lg font-light leading-relaxed">Mit Residency, Lane Number 3B, Kalyani Nagar,<br/>Pune, Maharashtra 411006</p>
                </div>
                <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-viridian mb-2 font-bold">Admissions</span>
                <p className="text-lg font-light leading-relaxed">+91 98817 21288<br/>contact@kashartss.com</p>
                </div>
        </div>

        <form className="space-y-6">
            <input type="text" className="w-full bg-transparent border-b border-primary/20 py-3 font-serif text-xl outline-none placeholder-primary/30" placeholder="Name" />
            <input type="email" className="w-full bg-transparent border-b border-primary/20 py-3 font-serif text-xl outline-none placeholder-primary/30" placeholder="Email" />
            <textarea className="w-full bg-transparent border-b border-primary/20 py-3 font-serif text-xl outline-none placeholder-primary/30 h-32 resize-none" placeholder="Message"></textarea>
            <button className="w-full border border-primary bg-primary text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-cobalt transition-colors">
                Send Message
            </button>
        </form>
    </div>
    );
};

const LoginPage: React.FC<{ onLogin: (role: UserRole, user: Student | Teacher) => void }> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Auto login check for admin secret access from PublicHeader
    useEffect(() => {
        const adminAuth = searchParams.get('admin_auth');
        const id = searchParams.get('id');
        const pass = searchParams.get('pass');
        
        if (adminAuth === 'true' && id && pass) {
            const doLogin = async () => {
                const user = await Database.login('admin', id, pass);
                if (user) {
                    onLogin('admin', user as any);
                    navigate('/portal/admin/admin-dashboard');
                }
            }
            doLogin();
        }
    }, [searchParams]);

    const [activeRole, setActiveRole] = useState<UserRole>('parent');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const demoHint = activeRole === 'parent' ? "Try ID: ST-2024-001 (Password: 1234)" : "Try ID: T-001 (Password: 1234)";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const user = await Database.login(activeRole, userId, password);
        setLoading(false);

        if (user) {
            onLogin(activeRole, user as any);
            navigate(activeRole === 'teacher' ? '/portal/teacher' : '/portal/parent');
        } else {
            setError('Invalid credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
            <div className="w-full max-w-sm animate-fade-in">
                <button onClick={() => navigate('/')} className="mb-12 text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-primary block text-center w-full">
                    Return Home
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-4xl font-serif mb-2 text-primary">Portal Login</h2>
                    <div className="h-1 w-12 bg-gradient-to-r from-cobalt to-vermilion mx-auto mt-4"></div>
                </div>

                <div className="flex bg-subtle/50 p-1 mb-8 rounded-sm">
                    <button 
                        onClick={() => { setActiveRole('parent'); setError(''); }}
                        className={`flex-1 py-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all rounded-sm ${activeRole === 'parent' ? 'bg-white shadow-sm text-cobalt' : 'text-secondary hover:text-primary'}`}
                    >
                        Parent
                    </button>
                    <button 
                        onClick={() => { setActiveRole('teacher'); setError(''); }}
                        className={`flex-1 py-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all rounded-sm ${activeRole === 'teacher' ? 'bg-white shadow-sm text-vermilion' : 'text-secondary hover:text-primary'}`}
                    >
                        Teacher
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">
                            {activeRole === 'parent' ? 'Student ID' : 'Faculty ID'}
                        </label>
                        <input 
                            type="text" 
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-transparent border border-primary/10 px-4 py-3 font-serif text-lg outline-none focus:border-primary transition-colors bg-white"
                            placeholder={activeRole === 'parent' ? 'ST-...' : 'T-...'}
                        />
                    </div>
                    <div className="group">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border border-primary/10 px-4 py-3 font-serif text-lg outline-none focus:border-primary transition-colors bg-white"
                            placeholder="••••••"
                        />
                    </div>

                    {error && <p className="text-vermilion text-xs text-center">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all shadow-lg ${loading ? 'bg-secondary cursor-wait' : 'bg-primary hover:bg-black'}`}
                    >
                        {loading ? '...' : 'Enter Portal'}
                    </button>
                </form>

                <p className="text-center mt-8 text-[9px] text-gray-400">
                    {demoHint}
                </p>
            </div>
        </div>
    );
};

// ... (Existing Portal Components like StudentDetailsPage, etc. remain unchanged but are included in the routing below) ...
const SyllabusView: React.FC = () => {
    const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
    const syllabusData = Database.getSyllabus();

    return (
        <div className="space-y-8 animate-fade-in pt-4 max-w-4xl">
            <h1 className="text-2xl font-serif border-b border-primary/5 pb-4">My Syllabus</h1>
            <div className="space-y-3">
                {syllabusData.map((item, i) => (
                    <div key={item.level} className="bg-white border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                        <button 
                            onClick={() => setExpandedLevel(expandedLevel === item.level ? null : item.level)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <span className="font-serif text-lg"><span className={`${PIGMENTS[i % PIGMENTS.length]} mr-2`}>0{item.level}</span> {item.title}</span>
                            <span className={`text-[9px] transition-transform duration-300 opacity-50 ${expandedLevel === item.level ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {expandedLevel === item.level && (
                            <div className="p-6 pt-0 border-t border-dashed border-primary/5 mt-2">
                                <p className="text-sm text-secondary mb-6 leading-relaxed max-w-2xl">{item.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {item.modules.map((mod, idx) => (
                                        <span key={idx} className="text-[10px] uppercase tracking-[0.1em] border border-primary/10 px-3 py-1 text-secondary bg-subtle/30">
                                            {mod}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ParentDashboard: React.FC<{ student: Student }> = ({ student }) => {
    return (
        <div className="space-y-8 animate-fade-in pt-4">
            <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                <h1 className="text-3xl font-serif text-primary">Welcome, {student.name.split(' ')[0]}</h1>
                <NotificationBell userId={student.id} />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-cobalt to-primary text-white p-8 shadow-lg rounded-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="text-[10px] uppercase tracking-[0.2em] opacity-80 block mb-2">Current Status</span>
                            <h2 className="text-4xl font-serif mb-4">Level 0{student.currentLevel}</h2>
                            <p className="text-sm opacity-90 max-w-xs">You are currently mastering advanced composition and shading techniques.</p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                            <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor"><path d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100 100-44.77 100-100S155.23 0 100 0zm0 180c-44.11 0-80-35.89-80-80s35.89-80 80-80 80 35.89 80 80-35.89 80-80 80z"/></svg>
                        </div>
                    </div>
                    <StudentSkillsChart student={student} />
                </div>
                
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Recent Feedback</h3>
                        <Link to="/portal/parent/logs" className="text-[10px] uppercase tracking-[0.2em] text-cobalt hover:underline">View All</Link>
                    </div>
                    {/* Show last log */}
                     {(() => {
                        const logs = Database.getLogsForStudent(student.id);
                        if (logs.length === 0) return <p className="text-sm text-secondary italic">No logs yet.</p>;
                        return <DailyLogCard log={logs[0]} />;
                     })()}
                </div>
            </div>
        </div>
    );
};

const LogsView: React.FC<{ student: Student }> = ({ student }) => {
    const logs = Database.getLogsForStudent(student.id);
    return (
        <div className="space-y-8 animate-fade-in pt-4 max-w-3xl">
             <h1 className="text-2xl font-serif border-b border-primary/5 pb-4">Daily Logs & Progress</h1>
             {logs.length === 0 ? (
                 <p className="text-secondary italic">No activity logs found.</p>
             ) : (
                 logs.map(log => <DailyLogCard key={log.id} log={log} />)
             )}
        </div>
    );
}

const PortalGalleryPage: React.FC<{ role: UserRole, studentId?: string }> = ({ role, studentId }) => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        imageUrl: '',
        studentId: studentId || ''
    });
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [filterStudent, setFilterStudent] = useState<string>('all');
    const [studentSearch, setStudentSearch] = useState('');

    useEffect(() => {
        if (role === 'parent' && studentId) {
            setArtworks(Database.getArtworksForStudent(studentId));
        } else if (role === 'teacher') {
            const allStudents = Database.getAllStudents();
            setStudents(allStudents);
            const allArts = allStudents.flatMap(s => Database.getArtworksForStudent(s.id));
            allArts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setArtworks(allArts);
        }
    }, [role, studentId]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadForm.title || !uploadForm.imageUrl || !uploadForm.studentId) return;

        await Database.addArtwork({
            title: uploadForm.title,
            description: uploadForm.description,
            imageUrl: uploadForm.imageUrl,
            studentId: uploadForm.studentId
        });
        
        setIsUploadOpen(false);
        setUploadForm({ title: '', description: '', imageUrl: '', studentId: studentId || '' });
        
        if (role === 'teacher') {
             const allStudents = Database.getAllStudents();
             const allArts = allStudents.flatMap(s => Database.getArtworksForStudent(s.id));
             allArts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
             setArtworks(allArts);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if(ev.target?.result) {
                     setUploadForm(prev => ({...prev, imageUrl: ev.target!.result as string}));
                }
            }
            reader.readAsDataURL(file);
        }
    }

    const filteredArtworks = filterStudent === 'all' 
        ? artworks 
        : artworks.filter(a => a.studentId === filterStudent);

    const filteredStudents = students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()));

    return (
        <div className="space-y-8 animate-fade-in pt-4">
            <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                <h1 className="text-2xl font-serif">Student Gallery</h1>
                {role === 'teacher' && (
                    <button 
                        onClick={() => setIsUploadOpen(true)}
                        className="bg-primary text-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors"
                    >
                        Upload Art
                    </button>
                )}
            </div>

            {role === 'teacher' && (
                <div className="space-y-2">
                    <div className="relative max-w-xs">
                         <input 
                            type="text" 
                            placeholder="Filter students..." 
                            className="w-full pl-8 pr-4 py-2 bg-white border border-primary/10 rounded-full text-xs outline-none focus:border-primary"
                            value={studentSearch}
                            onChange={e => setStudentSearch(e.target.value)}
                        />
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 absolute left-3 top-2.5 text-secondary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <button 
                            onClick={() => setFilterStudent('all')}
                            className={`px-3 py-1 text-[10px] uppercase tracking-widest border rounded-full whitespace-nowrap transition-colors ${filterStudent === 'all' ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-primary/10 hover:border-primary'}`}
                        >
                            All Students
                        </button>
                        {filteredStudents.map(s => (
                            <button 
                                key={s.id}
                                onClick={() => setFilterStudent(s.id)}
                                className={`px-3 py-1 text-[10px] uppercase tracking-widest border rounded-full whitespace-nowrap transition-colors ${filterStudent === s.id ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-primary/10 hover:border-primary'}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtworks.map(art => (
                    <div key={art.id} className="group relative bg-white border border-primary/5 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                        <div className="aspect-square overflow-hidden bg-gray-100">
                            <img src={art.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-serif text-lg">{art.title}</h3>
                            <p className="text-xs text-secondary mt-1 line-clamp-2">{art.description}</p>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-primary/5">
                                <span className="text-[9px] uppercase tracking-wider text-secondary">{art.date}</span>
                                {role === 'teacher' && (
                                    <span className="text-[9px] font-bold text-primary">
                                        {students.find(s => s.id === art.studentId)?.name || art.studentId}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredArtworks.length === 0 && (
                    <div className="col-span-full text-center py-12 text-secondary opacity-50">
                        <p>No artworks found.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Artwork">
                <form onSubmit={handleUpload} className="space-y-4">
                    {role === 'teacher' && (
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Student</label>
                            <div className="relative">
                                <select 
                                    className="w-full p-2 border border-primary/10 rounded-sm text-sm outline-none focus:border-primary appearance-none bg-white"
                                    value={uploadForm.studentId}
                                    onChange={e => setUploadForm({...uploadForm, studentId: e.target.value})}
                                    required
                                >
                                    <option value="">Select Student</option>
                                    {students.sort((a,b) => a.name.localeCompare(b.name)).map(s => (
                                        <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3 pointer-events-none text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Title</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-primary/10 rounded-sm text-sm outline-none focus:border-primary"
                            value={uploadForm.title}
                            onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Description</label>
                        <textarea 
                            className="w-full p-2 border border-primary/10 rounded-sm text-sm outline-none focus:border-primary resize-none h-24"
                            value={uploadForm.description}
                            onChange={e => setUploadForm({...uploadForm, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Image</label>
                        <div className="border-2 border-dashed border-primary/10 p-4 text-center rounded-sm hover:bg-subtle/50 transition-colors cursor-pointer relative">
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileSelect} required={!uploadForm.imageUrl} />
                            {uploadForm.imageUrl ? (
                                <img src={uploadForm.imageUrl} className="h-32 mx-auto object-contain" />
                            ) : (
                                <div className="text-secondary text-xs">
                                    <span className="block text-2xl mb-2">+</span>
                                    Click to upload image
                                </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary text-white py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors mt-4">
                        Upload to Gallery
                    </button>
                </form>
            </Modal>
        </div>
    );
};

const ProfileView: React.FC<{ user: Student | Teacher, role: UserRole, onLogout: () => void, onUpdate: (u: Student|Teacher) => void }> = ({ user, role, onLogout, onUpdate }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [showFees, setShowFees] = useState(false);

    const handleSave = (name: string, image: string) => {
        let updated;
        if (role === 'parent') {
            updated = Database.updateStudent(user.id, { name, profileImage: image });
        } else if (role === 'teacher') {
            updated = Database.updateTeacher(user.id, { name, profileImage: image });
        }
        if (updated) onUpdate(updated as Student | Teacher);
    };

    return (
        <div className="space-y-8 animate-fade-in pt-4 max-w-2xl">
            <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={user} onSave={handleSave} />
            <ChangePasswordModal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} userId={user.id} />
            <FeesModal isOpen={showFees} onClose={() => setShowFees(false)} />

            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                 <h1 className="text-2xl font-serif">My Profile</h1>
                 <button onClick={onLogout} className="text-[10px] uppercase tracking-[0.2em] text-vermilion hover:underline font-bold">Sign Out</button>
            </div>

            <div className="flex gap-8 items-start">
                <img src={user.profileImage} className="w-32 h-32 rounded-sm object-cover border border-primary/10 shadow-md" />
                <div className="space-y-2 flex-1">
                    <h2 className="text-3xl font-serif text-primary">{user.name}</h2>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-secondary block bg-subtle w-fit px-2 py-1 rounded-sm">{role}</span>
                    <p className="text-sm text-secondary font-light pt-2">ID: {user.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setIsEditOpen(true)} className="p-4 border border-primary/10 hover:bg-subtle text-left transition-colors">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-1">Edit Details</span>
                    <span className="text-xs text-secondary">Update your name and photo</span>
                </button>
                {role === 'parent' && (
                    <button onClick={() => setShowFees(true)} className="p-4 border border-primary/10 hover:bg-subtle text-left transition-colors">
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-1">Fee Status</span>
                        <span className="text-xs text-secondary">View statements and invoices</span>
                    </button>
                )}
                 <button onClick={() => setIsPasswordOpen(true)} className="p-4 border border-primary/10 hover:bg-subtle text-left transition-colors">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-1">Change Password</span>
                    <span className="text-xs text-secondary">Secure your account</span>
                </button>
            </div>
        </div>
    );
};

const TeacherDashboard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
    const students = Database.getAllStudents();
    return (
        <div className="space-y-8 animate-fade-in pt-4">
             <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                <h1 className="text-3xl font-serif text-primary">Hello, {teacher.name.split(' ')[0]}</h1>
                <NotificationBell userId={teacher.id} />
            </div>

             <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="bg-primary text-white p-8 shadow-lg rounded-sm">
                         <h2 className="text-4xl font-serif mb-2">{teacher.upcomingClasses}</h2>
                         <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">Classes Today</span>
                    </div>
                    <ClassDistributionChart students={students} />
                 </div>
                 <div className="space-y-6">
                      <WeeklyActivityChart />
                      <div className="bg-white p-6 border border-primary/5 shadow-sm">
                          <h3 className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-4">Quick Actions</h3>
                          <div className="grid grid-cols-2 gap-4">
                              <Link to="/portal/teacher/add-log" className="p-4 bg-subtle hover:bg-cobalt hover:text-white transition-colors text-center rounded-sm">
                                  <span className="text-xs font-bold uppercase tracking-wider">Add Daily Log</span>
                              </Link>
                              <Link to="/portal/teacher/students" className="p-4 bg-subtle hover:bg-vermilion hover:text-white transition-colors text-center rounded-sm">
                                  <span className="text-xs font-bold uppercase tracking-wider">View Students</span>
                              </Link>
                          </div>
                      </div>
                 </div>
             </div>
        </div>
    );
};

const TeacherStudentList: React.FC<{ teacherId: string }> = ({ teacherId }) => {
    const students = Database.getAllStudents();
    const [search, setSearch] = useState('');

    const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
         <div className="space-y-8 animate-fade-in pt-4">
             <div className="flex justify-between items-end border-b border-primary/5 pb-4">
                <h1 className="text-2xl font-serif">Students</h1>
                <input 
                    type="text" 
                    placeholder="Search by name..." 
                    className="border-b border-primary/20 pb-1 text-sm outline-none focus:border-primary w-48"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(student => (
                    <Link to={`/portal/teacher/students/${student.id}`} key={student.id} className="group block bg-white border border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all p-6 rounded-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={student.profileImage} className="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            <div>
                                <h3 className="font-serif text-lg group-hover:text-cobalt transition-colors">{student.name}</h3>
                                <span className="text-[10px] uppercase tracking-wider text-secondary block">Level 0{student.currentLevel}</span>
                            </div>
                        </div>
                        <div className="text-xs text-secondary space-y-1">
                            <p>Age: {student.age}</p>
                            <p>{student.schoolName}</p>
                        </div>
                    </Link>
                ))}
            </div>
         </div>
    );
};

const TeacherAddLog: React.FC = () => {
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [form, setForm] = useState({
        activityTitle: '',
        activityDescription: '',
        homework: '',
        entryTime: '16:00',
        exitTime: '17:30',
        date: new Date().toISOString().split('T')[0],
        mediaUrls: [] as string[]
    });
    const navigate = useNavigate();
    const students = Database.getAllStudents();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStudents.length === 0) return alert("Select at least one student");
        
        await Database.addLog({
            ...form,
            studentIds: selectedStudents
        });
        navigate('/portal/teacher/teacher-home');
    };

    const toggleStudent = (id: string) => {
        setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if(ev.target?.result) {
                     setForm(prev => ({...prev, mediaUrls: [...prev.mediaUrls, ev.target!.result as string]}));
                }
            }
            reader.readAsDataURL(file);
        }
    }

    const generateAdvice = async () => {
        if (!form.activityTitle) return;
        // Mock age for advice context
        const advice = await getArtisticAdvice(form.activityTitle, 10);
        setForm(prev => ({ ...prev, activityDescription: prev.activityDescription + "\n\nAI Tip: " + advice }));
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pt-4">
             <h1 className="text-2xl font-serif border-b border-primary/5 pb-4 mb-8">New Daily Log</h1>
             
             <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                     <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-3">Select Students</label>
                     <div className="flex flex-wrap gap-2">
                         {students.map(s => (
                             <button
                                key={s.id}
                                type="button"
                                onClick={() => toggleStudent(s.id)}
                                className={`px-3 py-1 text-xs border rounded-full transition-colors ${selectedStudents.includes(s.id) ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-primary/10 hover:border-primary'}`}
                             >
                                 {s.name}
                             </button>
                         ))}
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Date</label>
                         <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full p-2 border border-primary/10 rounded-sm" />
                     </div>
                      <div>
                         <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Topic</label>
                         <input required type="text" value={form.activityTitle} onChange={e => setForm({...form, activityTitle: e.target.value})} className="w-full p-2 border border-primary/10 rounded-sm" placeholder="e.g. Color Theory" />
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Entry Time</label>
                         <input required type="time" value={form.entryTime} onChange={e => setForm({...form, entryTime: e.target.value})} className="w-full p-2 border border-primary/10 rounded-sm" />
                     </div>
                      <div>
                         <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Exit Time</label>
                         <input required type="time" value={form.exitTime} onChange={e => setForm({...form, exitTime: e.target.value})} className="w-full p-2 border border-primary/10 rounded-sm" />
                     </div>
                 </div>

                 <div>
                     <div className="flex justify-between items-center mb-2">
                         <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary">Description</label>
                         <button type="button" onClick={generateAdvice} className="text-[9px] text-cobalt hover:underline flex items-center gap-1">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
                            </svg>
                             Get AI Suggestions
                         </button>
                     </div>
                     <textarea required rows={4} value={form.activityDescription} onChange={e => setForm({...form, activityDescription: e.target.value})} className="w-full p-2 border border-primary/10 rounded-sm resize-none" placeholder="What did they learn today?" />
                 </div>
                 
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Media Uploads (Images/Videos)</label>
                    <div className="flex items-center gap-4">
                         <label className="cursor-pointer bg-subtle hover:bg-primary hover:text-white transition-colors px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <span>+ Upload File</span>
                            <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                        </label>
                        <span className="text-xs text-secondary">{form.mediaUrls.length} file(s) selected</span>
                    </div>
                     {form.mediaUrls.length > 0 && (
                        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                             {form.mediaUrls.map((url, i) => (
                                <div key={i} className="w-16 h-16 bg-gray-100 border rounded-sm flex-shrink-0 relative overflow-hidden">
                                     {url.startsWith('data:video') ? (
                                         <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-[8px]">VIDEO</div>
                                     ) : (
                                         <img src={url} className="w-full h-full object-cover" />
                                     )}
                                </div>
                             ))}
                        </div>
                     )}
                 </div>

                 <button type="submit" className="w-full py-4 bg-primary text-white text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors">
                     Save Log Entry
                 </button>
             </form>
        </div>
    );
};

const AdminDashboard: React.FC<{ admin: any }> = ({ admin }) => {
    return (
        <div className="animate-fade-in pt-4">
             <h1 className="text-3xl font-serif mb-8 text-primary">Admin Control Center</h1>
             <div className="bg-red-50 border border-red-100 p-6 rounded-sm text-center">
                 <h2 className="text-red-800 font-bold mb-2">Restricted Area</h2>
                 <p className="text-red-600 text-sm">System configuration and user management would go here.</p>
             </div>
        </div>
    );
}

// --- Main App ---

const App: React.FC = () => {
    const [userRole, setUserRole] = useState<UserRole>('guest');
    const [currentUser, setCurrentUser] = useState<Student | Teacher | null>(null);

    const handleLogin = (role: UserRole, user: Student | Teacher) => {
        setUserRole(role);
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setUserRole('guest');
        setCurrentUser(null);
        window.location.hash = '/login';
    };

    const handleUserUpdate = (updatedUser: Student | Teacher) => {
        setCurrentUser(updatedUser);
    };

    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsConditionsPage />} />
            </Route>

            <Route path="/portal/parent" element={(userRole === 'parent' && currentUser) ? <PortalLayout role="parent" /> : <Navigate to="/login" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ParentDashboard student={currentUser as Student} />} />
                <Route path="syllabus" element={<SyllabusView />} />
                <Route path="logs" element={<LogsView student={currentUser as Student} />} />
                <Route path="gallery" element={<PortalGalleryPage role="parent" studentId={currentUser?.id} />} />
                <Route path="messages" element={<ChatPage currentUser={currentUser!} role="parent" />} />
                <Route path="messages/:chatId" element={<ChatPage currentUser={currentUser!} role="parent" />} />
                <Route path="profile" element={<ProfileView user={currentUser!} role="parent" onLogout={handleLogout} onUpdate={handleUserUpdate} />} />
            </Route>

            <Route path="/portal/teacher" element={(userRole === 'teacher' && currentUser) ? <PortalLayout role="teacher" /> : <Navigate to="/login" />}>
                <Route index element={<Navigate to="teacher-home" replace />} />
                <Route path="teacher-home" element={<TeacherDashboard teacher={currentUser as Teacher} />} />
                <Route path="students" element={<TeacherStudentList teacherId={currentUser?.id || ''} />} />
                <Route path="students/:id" element={<StudentDetailsPage />} />
                <Route path="gallery" element={<PortalGalleryPage role="teacher" />} />
                <Route path="messages" element={<ChatPage currentUser={currentUser!} role="teacher" />} />
                <Route path="messages/:chatId" element={<ChatPage currentUser={currentUser!} role="teacher" />} />
                <Route path="add-log" element={<TeacherAddLog />} />
                <Route path="teacher-profile" element={<ProfileView user={currentUser!} role="teacher" onLogout={handleLogout} onUpdate={handleUserUpdate} />} />
            </Route>

            <Route path="/portal/admin" element={(userRole === 'admin' && currentUser) ? <PortalLayout role="admin" /> : <Navigate to="/login" />}>
                <Route index element={<Navigate to="admin-dashboard" replace />} />
                <Route path="admin-dashboard" element={<AdminDashboard admin={currentUser} />} />
                <Route path="profile" element={<ProfileView user={currentUser!} role="admin" onLogout={handleLogout} onUpdate={handleUserUpdate} />} />
            </Route>
        </Routes>
    );
};

const Root = () => (
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Root />);
}