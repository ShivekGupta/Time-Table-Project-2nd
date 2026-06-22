export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const TIME_SLOTS = [
  { label: '09:00 AM - 09:50 AM', code: 'S1' },
  { label: '10:00 AM - 10:50 AM', code: 'S2' },
  { label: '11:00 AM - 11:50 AM', code: 'S3' },
  { label: '12:00 PM - 12:50 PM', code: 'S4' },
  { label: '01:00 PM - 02:00 PM', code: 'LUNCH', isLunch: true },
  { label: '02:00 PM - 02:50 PM', code: 'S5' },
  { label: '03:00 PM - 03:50 PM', code: 'S6' },
  { label: '04:00 PM - 04:50 PM', code: 'S7' }
]

export const TIMETABLE = {
  Monday: {
    S1: { subject: 'DBMS', type: 'Lecture', faculty: 'Dr. Sharma', room: 'A-101', color: '#3b82f6' },
    S2: { subject: 'React JS', type: 'Lecture', faculty: 'Prof. Gupta', room: 'B-202', color: '#10b981' },
    S3: { subject: 'DBMS Lab', type: 'Lab', faculty: 'Dr. Sharma', room: 'Lab-3', color: '#f59e0b', duration: 2 },
    S4: { subject: 'DBMS Lab', type: 'Lab', faculty: 'Dr. Sharma', room: 'Lab-3', color: '#f59e0b', isContinuation: true },
    S5: { subject: 'Mathematics III', type: 'Lecture', faculty: 'Dr. N. Verma', room: 'A-103', color: '#8b5cf6' },
    S6: { subject: 'Operating Systems', type: 'Lecture', faculty: 'Prof. R. Singh', room: 'A-104', color: '#ec4899' },
    S7: null
  },
  Tuesday: {
    S1: { subject: 'Operating Systems', type: 'Lecture', faculty: 'Prof. R. Singh', room: 'A-104', color: '#ec4899' },
    S2: { subject: 'Discrete Math', type: 'Lecture', faculty: 'Dr. P. Iyer', room: 'A-105', color: '#06b6d4' },
    S3: null,
    S4: { subject: 'React JS', type: 'Lecture', faculty: 'Prof. Gupta', room: 'B-202', color: '#10b981' },
    S5: { subject: 'OS Lab', type: 'Lab', faculty: 'Prof. R. Singh', room: 'Lab-1', color: '#ef4444', duration: 2 },
    S6: { subject: 'OS Lab', type: 'Lab', faculty: 'Prof. R. Singh', room: 'Lab-1', color: '#ef4444', isContinuation: true },
    S7: { subject: 'Seminar', type: 'Seminar', faculty: 'Guest Lecturer', room: 'Auditorium', color: '#6366f1' }
  },
  Wednesday: {
    S1: { subject: 'React JS Lab', type: 'Lab', faculty: 'Prof. Gupta', room: 'Lab-2', color: '#10b981', duration: 2 },
    S2: { subject: 'React JS Lab', type: 'Lab', faculty: 'Prof. Gupta', room: 'Lab-2', color: '#10b981', isContinuation: true },
    S3: { subject: 'Mathematics III', type: 'Lecture', faculty: 'Dr. N. Verma', room: 'A-103', color: '#8b5cf6' },
    S4: { subject: 'DBMS', type: 'Lecture', faculty: 'Dr. Sharma', room: 'A-101', color: '#3b82f6' },
    S5: null,
    S6: { subject: 'Computer Networks', type: 'Lecture', faculty: 'Prof. V. Desai', room: 'B-101', color: '#14b8a6' },
    S7: null
  },
  Thursday: {
    S1: { subject: 'Computer Networks', type: 'Lecture', faculty: 'Prof. V. Desai', room: 'B-101', color: '#14b8a6' },
    S2: { subject: 'Discrete Math', type: 'Lecture', faculty: 'Dr. P. Iyer', room: 'A-105', color: '#06b6d4' },
    S3: { subject: 'DBMS', type: 'Lecture', faculty: 'Dr. Sharma', room: 'A-101', color: '#3b82f6' },
    S4: null,
    S5: { subject: 'Mathematics III', type: 'Lecture', faculty: 'Dr. N. Verma', room: 'A-103', color: '#8b5cf6' },
    S6: { subject: 'Operating Systems', type: 'Lecture', faculty: 'Prof. R. Singh', room: 'A-104', color: '#ec4899' },
    S7: { subject: 'Placement Session', type: 'Workshop', faculty: 'TPO Officer', room: 'Seminar Hall', color: '#f97316' }
  },
  Friday: {
    S1: null,
    S2: { subject: 'React JS', type: 'Lecture', faculty: 'Prof. Gupta', room: 'B-202', color: '#10b981' },
    S3: { subject: 'Computer Networks Lab', type: 'Lab', faculty: 'Prof. V. Desai', room: 'Lab-4', color: '#14b8a6', duration: 2 },
    S4: { subject: 'Computer Networks Lab', type: 'Lab', faculty: 'Prof. V. Desai', room: 'Lab-4', color: '#14b8a6', isContinuation: true },
    S5: { subject: 'Discrete Math', type: 'Lecture', faculty: 'Dr. P. Iyer', room: 'A-105', color: '#06b6d4' },
    S6: null,
    S7: { subject: 'Weekly Quiz', type: 'Quiz', faculty: 'TA Team', room: 'A-101', color: '#64748b' }
  },
  Saturday: {
    S1: { subject: 'Project Review', type: 'Workshop', faculty: 'Mentor', room: 'B-202', color: '#0f172a' },
    S2: null,
    S3: null,
    S4: { subject: 'Guest Lecture', type: 'Seminar', faculty: 'Dr. Watson', room: 'Auditorium', color: '#6366f1' },
    S5: null,
    S6: null,
    S7: null
  }
}

export const FACULTY_PROFILES = [
  {
    name: 'Dr. Sharma',
    role: 'Captain',
    dept: 'Navigation & Cartography',
    specialization: 'Treasure Mapping, Kraken Evasion',
    email: 'sharma.dbms@college.edu',
    phone: '+91 98765 43210',
    office: 'Block A, Captain\'s Cabin',
    timings: 'Monday - Friday (1:00 PM - 3:00 PM)',
    status: 'Ashore',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Prof. Gupta',
    role: 'Quartermaster',
    dept: 'Ship Engineering',
    specialization: 'Hull Integrity, Artillery Systems',
    email: 'gupta.react@college.edu',
    phone: '+91 98765 43211',
    office: 'Block B, Lower Deck',
    timings: 'Monday - Wednesday (10:00 AM - 12:00 PM)',
    status: 'At Sea',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Dr. N. Verma',
    role: 'First Mate',
    dept: 'Astromancy',
    specialization: 'Star Reading, Weather Prediction',
    email: 'verma.math@college.edu',
    phone: '+91 98765 43212',
    office: 'Block A, Crow\'s Nest',
    timings: 'Tuesday - Thursday (3:00 PM - 5:00 PM)',
    status: 'Marooned',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Prof. R. Singh',
    role: 'Quartermaster',
    dept: 'Navigation & Cartography',
    specialization: 'Fleet Formations, Gunpowder Mgt',
    email: 'singh.os@college.edu',
    phone: '+91 98765 43213',
    office: 'Block A, Armory',
    timings: 'Monday & Friday (11:00 AM - 1:00 PM)',
    status: 'Ashore',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Dr. P. Iyer',
    role: 'Captain',
    dept: 'Navigation & Cartography',
    specialization: 'Smuggler Routes, Archipelago Lore',
    email: 'iyer.math@college.edu',
    phone: '+91 98765 43214',
    office: 'Block A, Treasure Room',
    timings: 'Tuesday - Friday (2:00 PM - 4:00 PM)',
    status: 'Ashore',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Prof. V. Desai',
    role: 'First Mate',
    dept: 'Ship Engineering',
    specialization: 'Sailing Physics, Keel Hauling',
    email: 'desai.net@college.edu',
    phone: '+91 98765 43215',
    office: 'Block B, Galley',
    timings: 'Wednesday - Friday (10:00 AM - 12:00 PM)',
    status: 'At Sea',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150'
  }
]

export const CLASSROOM_DETAILS = [
  {
    name: 'A-101',
    building: 'Galleon Block',
    floor: 'Main Deck',
    capacity: 65,
    type: 'Captain\'s Cabin',
    facilities: ['Spyglass', 'Sea Chart', 'Compass', 'Helm'],
    status: 'Under Siege',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'B-202',
    building: 'Frigate Block',
    floor: 'Lower Deck',
    capacity: 60,
    type: 'Captain\'s Cabin',
    facilities: ['Spyglass', 'Sextant', 'Telescope'],
    status: 'Under Siege',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'A-103',
    building: 'Galleon Block',
    floor: 'Main Deck',
    capacity: 70,
    type: 'Galley',
    facilities: ['Rum Barrels', 'Cooking Pot'],
    status: 'Anchored',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'A-104',
    building: 'Galleon Block',
    floor: 'Main Deck',
    capacity: 65,
    type: 'Captain\'s Cabin',
    facilities: ['Spyglass', 'Helm'],
    status: 'Anchored',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'A-105',
    building: 'Galleon Block',
    floor: 'Main Deck',
    capacity: 55,
    type: 'Galley',
    facilities: ['Spyglass', 'Chalkboard'],
    status: 'Anchored',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'B-101',
    building: 'Frigate Block',
    floor: 'Main Deck',
    capacity: 80,
    type: 'Main Deck',
    facilities: ['Dual Cannons', 'Sails', 'Gunpowder', 'Jolly Roger'],
    status: 'Under Siege',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Lab-1',
    building: 'Galleon Block',
    floor: 'Crow\'s Nest',
    capacity: 40,
    type: 'Engine Room',
    facilities: ['Furnaces', 'Coal', 'Steam Valves', 'Pistons'],
    status: 'Sailing',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Lab-2',
    building: 'Frigate Block',
    floor: 'Lower Deck',
    capacity: 40,
    type: 'Rigging Station',
    facilities: ['Ropes', 'Pulleys', 'Canvas', 'Winch'],
    status: 'Sailing',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Lab-3',
    building: 'Galleon Block',
    floor: 'Crow\'s Nest',
    capacity: 40,
    type: 'Armory',
    facilities: ['Swords', 'Muskets', 'Cannonballs'],
    status: 'Sailing',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Lab-4',
    building: 'Frigate Block',
    floor: 'Main Deck',
    capacity: 35,
    type: 'Navigation Room',
    facilities: ['Astrolabes', 'Maps', 'Compases'],
    status: 'Anchored',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300'
  }
]

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Mid-Term Exam Registration Extended',
    desc: 'The deadline for registering for the upcoming mid-semester examinations has been extended to June 20, 2026. Make sure to clear all pending dues.',
    date: '2026-06-10',
    type: 'Important',
    sender: 'Academic Office'
  },
  {
    id: 2,
    title: 'React JS Hackathon Registration Open',
    desc: 'Register for the annual Intra-College React Hackathon. Winning team receives cash prizes and internship opportunities at top tech firms.',
    date: '2026-06-08',
    type: 'Event',
    sender: 'Coding Club'
  },
  {
    id: 3,
    title: 'Special Guest Lecture on Cyber Security',
    desc: 'Dr. Watson from CyberTech Labs will conduct a seminar on Modern Encryption Protocols on Saturday, 12:00 PM at the Auditorium.',
    date: '2026-06-05',
    type: 'Notice',
    sender: 'CSE Department'
  }
]

export const EVENTS = [
  {
    title: 'Intra-College Coding Fest',
    date: '2026-06-18',
    time: '09:00 AM onwards',
    location: 'Lab 1 & Lab 2',
    category: 'Competition'
  },
  {
    title: 'Placement Orientation Seminar',
    date: '2026-06-22',
    time: '02:00 PM - 04:00 PM',
    location: 'Seminar Hall',
    category: 'Placement'
  },
  {
    title: 'Project Expo 2026',
    date: '2026-06-28',
    time: '10:00 AM - 05:00 PM',
    location: 'College Exhibition Center',
    category: 'Exhibition'
  }
]

export const ACADEMIC_HUB = {
  assignments: [
    { id: 'a1', subject: 'DBMS', title: 'ER Diagram & Normalization Assignment', due: '2026-06-15', status: 'Pending' },
    { id: 'a2', subject: 'React JS', title: 'Interactive Dashboard App with Theme State', due: '2026-06-19', status: 'Submitted' },
    { id: 'a3', subject: 'Computer Networks', title: 'IP Subnetting and Routing Tables Worksheet', due: '2026-06-25', status: 'Pending' }
  ],
  quizzes: [
    { id: 'q1', subject: 'Discrete Math', title: 'Quiz 2: Propositional Logic', date: '2026-06-16', time: '11:00 AM', duration: '30 mins' },
    { id: 'q2', subject: 'Operating Systems', title: 'Quiz 3: Semaphores & CPU Scheduling', date: '2026-06-20', time: '04:00 PM', duration: '20 mins' }
  ],
  exams: [
    { id: 'e1', subject: 'Mathematics III', title: 'Mid-Sem Examination', date: '2026-07-02', time: '09:30 AM - 11:30 AM', room: 'Block A, Hall 1' },
    { id: 'e2', subject: 'DBMS', title: 'DBMS Practical Lab Examination', date: '2026-07-05', time: '10:00 AM - 01:00 PM', room: 'Lab 3' },
    { id: 'e3', subject: 'Operating Systems', title: 'Mid-Sem Examination', date: '2026-07-08', time: '02:00 PM - 04:00 PM', room: 'Block A, Hall 2' }
  ],
  placements: [
    { id: 'p1', company: 'Google Inc.', role: 'Software Engineer Intern', date: '2026-06-18', stage: 'Coding Round', details: 'Online Platform Test' },
    { id: 'p2', company: 'Infosys Ltd.', role: 'Systems Engineer', date: '2026-06-24', stage: 'Pre-Placement Talk', details: 'Seminar Hall, 2:00 PM' }
  ]
}

export const SELECTOR_OPTIONS = {
  semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'],
  branches: ['Computer Science & Eng', 'Information Technology', 'Electronics & Comm', 'Mechanical Eng', 'Civil Eng'],
  sections: ['Section A', 'Section B', 'Section C'],
  years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  batches: ['Batch B1', 'Batch B2', 'Batch B3', 'All Batches'],
  sessions: ['Academic Session 2025-26', 'Academic Session 2026-27']
}
