import { Project, ProjectType, ProjectStatus, Priority, User, Task, WorkLog, Deal, TeamMember, TaskTeamMember, TaskStatus } from '../types';

// --- USERS (10+ Profiles) ---
export const USERS: Record<string, User> = {
    ADMIN: { id: 'admin-1', name: 'Jessica Pearson', email: 'jessica@pearson.com', avatar: 'https://i.pravatar.cc/150?u=jp', role: 'admin' },
    MANAGER: { id: 'u1', name: 'Harvey Spector', email: 'harvey@pearson.com', avatar: 'https://i.pravatar.cc/150?u=hs', role: 'manager' },
    DEV_1: { id: 'u2', name: 'Mike Ross', email: 'mike@pearson.com', avatar: 'https://i.pravatar.cc/150?u=mr', role: 'developer' },
    DEV_2: { id: 'u3', name: 'Louis Litt', email: 'louis@pearson.com', avatar: 'https://i.pravatar.cc/150?u=ll', role: 'developer' },
    DEV_3: { id: 'u5', name: 'Rachel Zane', email: 'rachel@pearson.com', avatar: 'https://i.pravatar.cc/150?u=rz', role: 'developer' },
    DEV_4: { id: 'u6', name: 'Donna Paulsen', email: 'donna@pearson.com', avatar: 'https://i.pravatar.cc/150?u=dp', role: 'designer' },
    GHOST: { id: 'u4', name: 'Shadow Dev', email: 'shadow@pearson.com', avatar: '', role: 'developer' },
    CLIENT: { id: 'client-1', name: 'Adrian Anderson', email: 'adrian@alpha.com', avatar: 'https://i.pravatar.cc/150?u=aa', role: 'client' },
    CLIENT_2: { id: 'client-2', name: 'Logan Roy', email: 'logan@waystar.com', avatar: 'https://i.pravatar.cc/150?u=lr', role: 'client' }
};

// --- TASKS (Initialized empty, populated below) ---
export const TASKS: Task[] = [];
export const MOCK_TASKS: Task[] = TASKS; // Alias for compatibility

// --- PROJECTS ---
export const PROJECTS: Project[] = [
    {
        id: 'ip1',
        name: 'Internal Dev: Client Portal',
        clientName: 'CollabCRM Internal',
        type: ProjectType.FIXED,
        status: ProjectStatus.ACTIVE,
        startDate: '2023-10-01',
        dealId: 'd-int-1',
        description: 'Development of the client facing portal for project tracking.',
        ndaSigned: true,
        projectManager: USERS.MANAGER,
        tasks: [],
        clientRequests: [
            { id: 'req1', title: 'Add Dark Mode', description: 'Clients are asking for dark mode support in the dashboard.', type: 'Feature', status: 'Pending', submittedBy: USERS.CLIENT, submittedAt: 'Feb 10, 2026' },
            { id: 'req2', title: 'Fix Login Typo', description: 'There is a typo on the login screen "Passwrod".', type: 'Bug', status: 'Converted to Task', submittedBy: USERS.CLIENT, submittedAt: 'Feb 08, 2026' }
        ],
        documents: [],
        team: [
            { user: USERS.MANAGER, role: 'Project Manager' },
            { user: USERS.DEV_1, role: 'Developer' },
            { user: USERS.GHOST, role: 'Developer' } // Ghost dev for internal work
        ]
    },
    {
        id: 'p1',
        name: 'Alpha SaaS Platform',
        clientName: 'Acme Corp',
        type: ProjectType.FIXED,
        status: ProjectStatus.ACTIVE,
        startDate: '2023-01-15',
        endDate: '2023-06-30',
        signOffDate: '2023-07-15',
        dealId: 'd1',
        projectManager: USERS.MANAGER,
        description: 'Complete overhaul of the legacy SaaS platform.',
        milestones: [
            { id: 'm1', title: 'Phase 1: Discovery', dueDate: '2023-02-15', status: 'Completed', amount: 5000 },
            { id: 'm2', title: 'Phase 2: MVP Development', dueDate: '2023-04-15', status: 'In Progress', amount: 15000 },
        ],
        tasks: [],
        clientRequests: [
            { id: 'cr1', type: 'Bug', title: 'Login page formatting issue', description: 'The logo is misaligned on mobile screens.', status: 'Pending', priority: 'Medium', submittedBy: USERS.DEV_2, submittedAt: '2 days ago' }
        ],
        documents: [
            { id: 'doc1', name: 'Service Agreement.pdf', type: 'CONTRACT', category: 'VAULT', url: '#', addedBy: USERS.DEV_1, uploadedAt: '12 Jan 2023', size: '2.4 MB', isClientVisible: true, status: 'SIGNED' },
            { id: 'doc2', name: 'Technical Spec v1.pdf', type: 'TECHNICAL', category: 'VAULT', url: '#', addedBy: USERS.MANAGER, uploadedAt: '15 Jan 2023', size: '4.1 MB', isClientVisible: true, status: 'FINAL' },
            { id: 'doc3', name: 'Brand Guide', type: 'BRANDING', category: 'ASSET_LIBRARY', url: '#', addedBy: USERS.DEV_3, uploadedAt: '20 Jan 2023', size: '15 MB', isClientVisible: true },
            { id: 'doc4', name: 'Figma Prototype', type: 'DESIGN', category: 'ASSET_LIBRARY', url: 'https://figma.com', addedBy: USERS.DEV_3, uploadedAt: '22 Jan 2023', isClientVisible: true }
        ],
        team: [
            { user: USERS.MANAGER, role: 'Project Manager' },
            { user: USERS.DEV_1, role: 'Developer' },
            { user: USERS.DEV_3, role: 'Developer' },
            { user: USERS.DEV_4, role: 'Designer' }
        ]
    },
    {
        id: 'p2',
        name: 'Beta Mobile App',
        clientName: 'Beta Inc',
        type: ProjectType.HOURLY,
        status: ProjectStatus.ON_HOLD,
        startDate: '2023-03-01',
        dealId: 'd2',
        projectManager: USERS.MANAGER,
        initialBoughtHours: 100,
        totalBilledHours: 45,
        topUps: [
            { id: 't1', topUpHours: 50, addedOn: '2023-04-01', comment: 'Phase 2 Scope extension', addedBy: USERS.MANAGER }
        ],
        tasks: [],
        documents: [
            { id: 'doc5', name: 'NDA Signed.pdf', type: 'CONTRACT', category: 'VAULT', url: '#', addedBy: USERS.MANAGER, uploadedAt: '25 Feb 2023', size: '1.2 MB', isClientVisible: true, status: 'SIGNED' }
        ],
        team: [
            { user: USERS.MANAGER, role: 'Project Manager' },
            { user: USERS.DEV_1, role: 'Developer' }
        ]
    },
    {
        id: 'p3',
        name: 'Gamma Website Redesign',
        clientName: 'Gamma LLC',
        type: ProjectType.HIRE_BASE,
        status: ProjectStatus.ACTIVE,
        startDate: '2023-05-01',
        dealId: 'd3',
        projectManager: USERS.DEV_1,
        description: 'Staff augmentation for website overhaul.',
        resources: [ // Keeping resources for logic compatibility
            { user: USERS.DEV_3, role: 'Senior Designer', monthlyRate: 4000, startDate: '2023-05-01' },
            { user: USERS.DEV_4, role: 'Frontend Dev', monthlyRate: 3500, startDate: '2023-05-15' }
        ],
        team: [
            { user: USERS.DEV_1, role: 'Project Manager' },
            { user: USERS.DEV_3, role: 'Designer' },
            { user: USERS.DEV_4, role: 'Developer' }
        ],
        tasks: [],
        documents: [
            { id: 'doc-p3-1', name: 'Website Redesign Contract.pdf', type: 'CONTRACT', category: 'VAULT', url: '#', addedBy: USERS.MANAGER, uploadedAt: '1 May 2023', size: '1.2 MB', isClientVisible: true, status: 'SIGNED' },
            { id: 'doc-p3-2', name: 'Design Mockups v1.fig', type: 'DESIGN', category: 'ASSET_LIBRARY', url: 'https://figma.com', addedBy: USERS.DEV_3, uploadedAt: '5 May 2023', size: '8.5 MB', isClientVisible: true },
            { id: 'doc-p3-3', name: 'Brand Assets.zip', type: 'BRANDING', category: 'ASSET_LIBRARY', url: '#', addedBy: USERS.DEV_3, uploadedAt: '10 May 2023', size: '45 MB', isClientVisible: true },
            { id: 'doc-p3-4', name: 'Internal Notes.txt', type: 'OTHER', category: 'VAULT', url: '#', addedBy: USERS.DEV_1, uploadedAt: '12 May 2023', size: '15 KB', isClientVisible: false, comments: 'Internal team notes - not for client' },
            { id: 'doc-p3-5', name: 'Progress Report May.pdf', type: 'REPORT', category: 'VAULT', url: '#', addedBy: USERS.MANAGER, uploadedAt: '15 May 2023', size: '2.1 MB', isClientVisible: true, status: 'FINAL' }
        ]
    }
];

// Alias MOCK_PROJECTS to PROJECTS for compatibility
export const MOCK_PROJECTS = PROJECTS;


// --- TASKS (Generation Logic for Reality) ---
const TITLES = [
    'Setup React Project', 'Configure Redux Store', 'Integrate Auth0', 'Design Data Schema', 'API Endpoint: Users',
    'API Endpoint: Orders', 'Build Dashboard UI', 'Fix Login Bug', 'Refactor Navigation', 'Optimize Images',
    'Write Unit Tests', 'Deployment Pipeline', 'Mobile Responsiveness', 'Accessibility Audit', 'Client Feedback Loop'
];

let tId = 1;

// Distribute tasks to projects
PROJECTS.forEach(project => {
    // Generate 8-12 tasks per project
    const count = Math.floor(Math.random() * 5) + 8;
    for (let i = 0; i < count; i++) {
        const title = TITLES[Math.floor(Math.random() * TITLES.length)] + ` (${project.name.split(' ')[0]})`;
        const status = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'][Math.floor(Math.random() * 4)];
        const priority = ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)];

        // Generate task team from project team
        let taskTeam: TaskTeamMember[] = [];
        if (project.team && project.team.length > 0) {
            const member = project.team[Math.floor(Math.random() * project.team.length)];
            taskTeam.push({ user: member.user, isGhost: false });
        } else {
            taskTeam.push({ user: USERS.DEV_1, isGhost: false });
        }

        const task: Task = {
            id: `t${tId++}`,
            title,
            description: `Detailed implementation for ${title}. Ensuring standard compliance.`,
            status: status as TaskStatus,
            priority: priority as Priority,
            dueDate: '2026-03-15',
            isClientVisible: Math.random() > 0.3, // 70% visible
            team: taskTeam,
            timeLogs: { internal: Math.floor(Math.random() * 10), billable: Math.floor(Math.random() * 10) },
            projectId: project.id
        };
        TASKS.push(task);
        if (!project.tasks) project.tasks = [];
        project.tasks.push(task);
    }
});

// --- WORK LOGS (Generated dynamically after tasks are created) ---
const generateWorkLogs = (): WorkLog[] => {
    const logs: WorkLog[] = [];
    let logId = 1;

    // Get first 3 projects and generate logs for their tasks
    const projectsToLog = PROJECTS.slice(0, 3);

    projectsToLog.forEach(project => {
        const projectTasks = project.tasks || [];
        const tasksToLog = projectTasks;

        tasksToLog.forEach((task, idx) => {
            // Generate 2-5 logs per task for more variety
            const logCount = Math.floor(Math.random() * 4) + 2;
            const users = [USERS.DEV_1, USERS.DEV_2, USERS.DEV_3, USERS.DEV_4, USERS.MANAGER];

            for (let i = 0; i < logCount; i++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const daysAgo = Math.floor(Math.random() * 10); // Last 10 days for better distribution
                const date = new Date();
                date.setDate(date.getDate() - daysAgo);
                const dateStr = date.toISOString().split('T')[0];

                const descriptions = [
                    'Implemented core functionality and added unit tests',
                    'Fixed bugs and edge cases discovered during QA',
                    'Code review and refactoring for better performance',
                    'Updated documentation and API specifications'
                ];

                logs.push({
                    id: `log-${logId++}`,
                    taskId: task.id,
                    taskTitle: task.title,
                    userId: user.id,
                    userName: user.name,
                    userAvatar: user.avatar,
                    date: dateStr,
                    hours: Math.floor(Math.random() * 8) + 1, // 1-8 hours for more variety
                    billedHours: Math.floor(Math.random() * 8) + 1,
                    description: descriptions[Math.floor(Math.random() * descriptions.length)],
                    isClientVisible: true,
                    timestamp: `${dateStr}T${9 + Math.floor(Math.random() * 8)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00Z`
                });
            }
        });
    });

    // Sort logs by date (newest first) for better display
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return logs;
};

export const LOGS: WorkLog[] = generateWorkLogs();

const REPORT_USERS = [USERS.MANAGER, USERS.DEV_1, USERS.DEV_2, USERS.DEV_3, USERS.DEV_4, USERS.GHOST];
const DESCRIPTIONS = [
    'Refactoring usage of deprecated APIs', 'Meeting with client regarding requirements', 'Debugging build issues on staging',
    'Implementing new feature requests'
];

let lId = 1;

const today = new Date();
// Generate logic for last 45 days
for (let d = 0; d < 45; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];

    // On each day, 3-6 random logs
    const dailyCount = Math.floor(Math.random() * 4) + 3;

    for (let i = 0; i < dailyCount; i++) {
        const user = REPORT_USERS[Math.floor(Math.random() * REPORT_USERS.length)];
        const project = PROJECTS[0];
        if (project.tasks && project.tasks.length > 0) {
            const task = project.tasks[Math.floor(Math.random() * project.tasks.length)];
            const hours = parseFloat((Math.random() * 3 + 0.5).toFixed(1));
            const isGhost = user.id === USERS.GHOST.id;

            LOGS.push({
                id: `l-${lId++}`,
                taskId: task.id,
                taskTitle: task.title,
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar,
                date: dateStr,
                hours: hours,
                billedHours: isGhost ? hours : hours,
                description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
                isClientVisible: !isGhost,
                timestamp: '10:00 AM'
            });
        }
    }
}

export const DEALS: Deal[] = [
    { id: 'd-1', title: 'Alpha Software Requirement', owner: USERS.MANAGER, closingDate: '2026-01-15', associatedProjectId: 'p1', contacts: [USERS.CLIENT] },
    { id: 'd-2', title: 'Beta Mobile App MVP', owner: USERS.MANAGER, closingDate: '2026-02-20', associatedProjectId: 'p2', contacts: [USERS.CLIENT] },
    { id: 'd-3', title: 'Gamma System Maintenance', owner: USERS.MANAGER, closingDate: '2026-03-10', associatedProjectId: 'p3', contacts: [USERS.CLIENT] }
];

export const MESSAGE_BOARDS = [
    {
        id: 'mb-1',
        projectId: 'p1',
        title: 'Design System Review - Phase 1',
        content: 'We have updated the color palette and typography based on the brand guidelines.',
        author: USERS.DEV_4,
        createdAt: 'Today, 9:30 AM',
        repliesCount: 2,
        replies: [
            { id: 'r-1', author: USERS.CLIENT, content: 'Looks great! One small change: can we make the blue a bit more vibrant?', createdAt: 'Today, 10:15 AM' },
            { id: 'r-2', author: USERS.DEV_4, content: 'Sure, I will update the hex codes and re-upload.', createdAt: 'Today, 10:45 AM' }
        ]
    }
];

export const GROUP_CHAT_MESSAGES = [
    { id: 'm-1', sender: USERS.MANAGER, content: 'Good morning team! Just a reminder about the sprint review at 2 PM.', timestamp: 'Today, 09:00 AM' },
    { id: 'm-2', sender: USERS.DEV_1, content: 'I will be demoing the new dashboard widgets.', timestamp: 'Today, 09:05 AM' }
];

export const DIRECT_CHAT_MESSAGES = [
    { id: 'dm-1', sender: USERS.MANAGER, content: 'Hi Adrian, do you have a minute to discuss the timeline?', timestamp: 'Today, 11:20 AM' },
    { id: 'dm-2', sender: USERS.CLIENT, content: 'Sure Harvey, calling you now.', timestamp: 'Today, 11:21 AM' }
];

// Invoices (Mock)
export const INVOICES = [
    { id: 'inv-1', number: 'INV-2023-001', date: '2023-01-15', due_date: '2023-01-30', amount: 5000, status: 'Paid', items: [{ description: 'Phase 1 - Discovery', amount: 5000 }] },
    { id: 'inv-2', number: 'INV-2023-002', date: '2023-02-15', due_date: '2023-03-01', amount: 15000, status: 'Overdue', items: [{ description: 'Phase 2 - MVP', amount: 15000 }] }
];
