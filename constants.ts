import { Project, ProjectType, Deal, User, TaskStatus, Priority, Invoice, MessageBoardThread, ChatMessage, Task } from './types';

// Users
export const USERS: Record<string, User> = {
  harvey: { id: 'u1', name: 'Harvey Spector', email: 'harveyreginaldspector@yopmail.com', avatar: '', role: 'manager' },
  adrian: { id: 'u2', name: 'Adrian Andersomn', email: 'crm.test.alpha01@yopmail.com', avatar: 'https://i.pravatar.cc/150?u=adrian', role: 'client' },
  super: { id: 'u3', name: 'Super User', email: 'admin@collab.com', avatar: '', role: 'admin' },
  ghostDev: { id: 'u4', name: 'Shadow Dev', email: 'shadow@collab.com', avatar: 'https://i.pravatar.cc/150?u=shadow', role: 'developer' },
};

// Internal Projects with Advanced Task Data
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'ip1',
    name: 'Internal Dev: Client Portal',
    type: ProjectType.FIXED,
    status: 'active',
    ndaSigned: true,
    projectManager: USERS.harvey,
    dealId: 'd-int-1',
    description: 'Development of the client facing portal for project tracking.',
    clientName: 'CollabCRM Internal',
    progress: 65,
    clientRequests: [
      { id: 'req1', title: 'Add Dark Mode', description: 'Clients are asking for dark mode support in the dashboard.', type: 'Feature', status: 'Pending', submittedBy: USERS.adrian, submittedAt: 'Feb 10, 2026' },
      { id: 'req2', title: 'Fix Login Typo', description: 'There is a typo on the login screen "Passwrod".', type: 'Bug', status: 'Converted to Task', submittedBy: USERS.adrian, submittedAt: 'Feb 08, 2026' }
    ],
    tasks: [
      {
        id: 't1',
        title: 'Setup React Project',
        description: 'Initialize repository and install dependencies.',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        dueDate: '2023-10-01',
        assignee: USERS.harvey,
        team: [{ user: USERS.harvey, isGhost: false }],
        isClientVisible: true,
        timeLogs: { internal: 4, billable: 4 }
      },
      {
        id: 't2',
        title: 'Implement Authentication',
        description: 'JWT Auth flow with secure storage.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: '2023-10-05',
        assignee: USERS.super,
        team: [{ user: USERS.super, isGhost: false }, { user: USERS.ghostDev, isGhost: true }],
        isClientVisible: true,
        timeLogs: { internal: 12.5, billable: 10 } // Internal hours higher than billable
      },
      {
        id: 't3',
        title: 'Database Schema Optimization',
        description: 'Refactoring terrible legacy code in the backend.',
        status: TaskStatus.REVIEW,
        priority: Priority.MEDIUM,
        dueDate: '2023-10-10',
        team: [{ user: USERS.ghostDev, isGhost: true }],
        isClientVisible: false, // Internal task only
        timeLogs: { internal: 8, billable: 0 }
      },
    ]
  },
  {
    id: 'ip2',
    name: 'Marketing Website Redesign',
    type: ProjectType.HOURLY,
    status: 'active',
    ndaSigned: true,
    projectManager: USERS.harvey,
    dealId: 'd-int-2',
    description: 'Redesigning the corporate website for better conversion.',
    clientName: 'Marketing Dept',
    progress: 30,
    tasks: [
      {
        id: 't4',
        title: 'Wireframes',
        description: 'Low fidelity mockups',
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        dueDate: '2023-10-15',
        assignee: USERS.harvey,
        team: [{ user: USERS.harvey, isGhost: false }],
        isClientVisible: true,
        timeLogs: { internal: 5, billable: 5 }
      },
      {
        id: 't5',
        title: 'Content Strategy',
        description: 'Drafting copy',
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        dueDate: '2023-10-20',
        team: [{ user: USERS.harvey, isGhost: false }],
        isClientVisible: true,
        timeLogs: { internal: 0, billable: 0 }
      },
    ]
  }
];

// For the Client View Prototype, we are mapping "ip1" to be the main project used in "PROJECTS" for demonstration
// Synchronizing the data structure for the client view demo
export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Alpha Software Requirement hirebase',
    clientName: 'Alpha Corp',
    type: ProjectType.HIRE_BASE,
    status: 'Not Started',
    ndaSigned: false,
    projectManager: USERS.super,
    dealId: 'd1',
    addedOn: '09-Feb-2026',
    resources: [
      { id: 'r1', name: 'Harvey Spector', role: 'Roblox Development', startDate: '09-Feb-2026', endDate: '27-Feb-2026', totalWorkingDays: 13, expiresIn: 18, avatar: '' },
      { id: 'r2', name: 'Super User', role: 'Project Management', startDate: '09-Feb-2026', endDate: '27-Feb-2026', totalWorkingDays: 13, expiresIn: 18, avatar: '' },
    ],
    // Merging Mock Tasks for Demo
    tasks: MOCK_PROJECTS[0].tasks,
    clientRequests: MOCK_PROJECTS[0].clientRequests
  },
  {
    id: 'p2',
    name: 'Alpha Software Requirement Fixed Cost',
    clientName: 'Alpha Corp',
    type: ProjectType.FIXED,
    status: 'Not Started',
    ndaSigned: false,
    projectManager: USERS.harvey,
    dealId: 'd2',
    addedOn: '09-Feb-2026',
    milestones: [
      { id: 'm1', code: 'M-01', title: 'Discovery & Mobilization', status: 'Pending' },
      { id: 'm2', code: 'M-02', title: 'Strategic Roadmap Draft', status: 'Pending' },
      { id: 'm3', code: 'M-03', title: 'Final Delivery & Handover', status: 'Pending' },
    ],
    changeRequests: [
      { id: 'cr1', comment: 'TEST', addedOn: '05-Feb-2026', isFreeOfCost: false },
      { id: 'cr2', comment: 'Initial Top-Up', addedOn: '05-Feb-2026', isFreeOfCost: false },
    ],
    tasks: [],
    clientRequests: []
  },
  {
    id: 'p3',
    name: 'Alpha Enterprise Dev',
    clientName: 'Alpha Corp',
    type: ProjectType.HOURLY,
    status: 'Not Started',
    ndaSigned: false,
    projectManager: USERS.super,
    dealId: 'd3',
    addedOn: '05-Feb-2026',
    requiredSkills: ['Node JS', 'React JS'],
    startDate: '10-Feb-2026',
    endDate: '10-Aug-2026',
    signOffDate: '-',
    initialBoughtHours: 200,
    totalBilledHours: 16.00,
    topUps: [
      { id: 'tu1', comment: 'New Top-UP', topUpHours: 1000, addedOn: '05-Feb-2026', addedBy: USERS.harvey },
      { id: 'tu2', comment: 'Initial top-up', topUpHours: 200, addedOn: '05-Feb-2026', addedBy: USERS.harvey },
    ],
    tasks: MOCK_PROJECTS[0].tasks, // Reusing tasks for demo
    clientRequests: MOCK_PROJECTS[0].clientRequests
  }
];

// Deals (Unchanged)
export const DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'Alpha Software Requirement Hired',
    owner: USERS.harvey,
    closingDate: '09-Feb-2026',
    associatedProjectId: 'p1',
    contacts: [USERS.adrian]
  },
  {
    id: 'd2',
    title: 'Alpha Software Requirement Fixed',
    owner: USERS.harvey,
    closingDate: '09-Feb-2026',
    associatedProjectId: 'p2',
    contacts: [USERS.adrian]
  },
  {
    id: 'd3',
    title: 'Alpha Software Requirement',
    owner: USERS.harvey,
    closingDate: '05-Feb-2026',
    associatedProjectId: 'p3',
    contacts: [USERS.adrian]
  }
];

// Invoices (Mock) (Unchanged)
export const INVOICES: Invoice[] = [
  { id: 'i1', invoiceId: 'INV-00000178', title: 'Project Top-Up (Sprin...', date: '05-Feb-2026', dueDate: '12-Feb-2026', status: 'FULLY PAID', amount: 30000.00, currency: 'EUR', balanceDue: 0.00 },
  { id: 'i2', invoiceId: 'INV-00000176', title: 'Initial Project Top-Up ...', date: '05-Feb-2026', dueDate: '12-Feb-2026', status: 'FULLY PAID', amount: 6000.00, currency: 'EUR', balanceDue: 0.00 },
];

// Mock Message Data (Unchanged)
export const MESSAGE_BOARDS: MessageBoardThread[] = [
  {
    id: 'mb1',
    projectId: 'p3',
    title: 'Hello Everyone',
    content: 'Hi, this is my first time using the client portal.',
    author: USERS.super,
    createdAt: '05-Feb-2026',
    repliesCount: 3,
    replies: [
      { id: 'r1', author: USERS.super, content: 'Ok Capeesh', createdAt: '05-Feb-2026, 01:59 PM' },
      { id: 'r2', author: USERS.super, content: 'ok Got it', createdAt: '05-Feb-2026, 02:22 PM' }
    ]
  },
  {
    id: 'mb2',
    projectId: 'p3',
    title: 'Test',
    content: 'TestTestTestTestTestTestTestTestTest...',
    author: USERS.adrian,
    createdAt: '05-Feb-2026',
    repliesCount: 2
  },
  {
    id: 'mb3',
    projectId: 'p3',
    title: 'Hello to Clients and Peers',
    content: 'Hola.',
    author: USERS.harvey,
    createdAt: '05-Feb-2026',
    repliesCount: 0
  },
  {
    id: 'mb4',
    projectId: 'p3',
    title: 'Discussion Topi',
    content: 'Hello this is a discussion topic',
    author: USERS.adrian,
    createdAt: '06-Feb-2026',
    repliesCount: 0
  }
];

export const GROUP_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'c1', sender: USERS.super, content: 'fg', timestamp: '05-Feb-2026, 04:12 PM' },
  { id: 'c2', sender: USERS.super, content: 'Hello', timestamp: '05-Feb-2026, 01:15 PM' },
  { id: 'c3', sender: USERS.adrian, content: 'Hello', timestamp: '05-Feb-2026, 01:14 PM' },
];

export const DIRECT_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'dc1', sender: USERS.adrian, content: 'hi', timestamp: '04:25 PM' },
  { id: 'dc2', sender: USERS.adrian, content: 'How are you', timestamp: '04:25 PM' },
]
