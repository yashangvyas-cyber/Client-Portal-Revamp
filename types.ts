
export enum ViewMode {
  INTERNAL = 'INTERNAL',
  CLIENT = 'CLIENT',
}

export enum InternalModule {
  DASHBOARD = 'DASHBOARD',
  PROJECTS = 'PROJECTS',
  TASKS = 'TASKS',
  MESSAGES = 'MESSAGES',
  ALLOCATION = 'ALLOCATION',
  OCCUPANCY_REPORT = 'OCCUPANCY_REPORT',
  TIMESHEET_REPORT = 'TIMESHEET_REPORT',
  HIREBASE_REPORT = 'HIREBASE_REPORT',
  HOURLY_REPORT = 'HOURLY_REPORT',
  FIXED_REPORT = 'FIXED_REPORT',
  CONFIG = 'CONFIG',
}

export enum ProjectType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
  HIRE_BASE = 'HIRE_BASE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'developer' | 'client' | 'designer';
}

// --- Client Portal Specific Types ---

export interface Resource {
  user: User;
  role: string;
  startDate: string;
  endDate?: string;
  monthlyRate: number;
  isClientVisible?: boolean; // Defaults to true if undefined
  clientCommunication?: boolean; // Defaults to false
}

export interface TopUpLog {
  id: string;
  comment: string;
  topUpHours: number;
  addedOn: string;
  addedBy: User;
}

export interface Milestone {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate?: string;
  amount?: number;
  code?: string; // e.g., M-01
}

export interface ChangeRequest {
  id: string;
  comment: string;
  addedOn: string;
  isFreeOfCost: boolean;
}

export interface Invoice {
  id: string;
  invoiceId: string;
  title: string;
  date: string;
  dueDate: string;
  status: 'FULLY PAID' | 'PENDING' | 'OVERDUE';
  amount: number;
  currency: string;
  balanceDue: number;
}

export interface ClientRequest {
  id: string;
  title: string;
  description: string;
  type: 'Bug' | 'Feature' | 'Feedback';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Reviewing' | 'Converted to Task' | 'Rejected';
  submittedBy: User;
  submittedAt: string;
  attachments?: number;
  taskId?: string; // Optional link to an existing task
}

export interface WorkLog {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  userAvatar: string;
  date: string; // YYYY-MM-DD
  hours: number; // Actual internal hours
  billedHours?: number; // Revised hours shown to client (Manager Override)
  description: string;
  isClientVisible: boolean;
  billedAs?: {
    userId: string;
    userName: string;
  }; // The alias shown to the client
  timestamp: string;
}

export type DocumentCategory = 'VAULT' | 'ASSET_LIBRARY';
export type DocumentType = 'CONTRACT' | 'INVOICE' | 'TECHNICAL' | 'REPORT' | 'DESIGN' | 'BRANDING' | 'MEDIA' | 'OTHER';

export interface ProjectDocument {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  url: string;
  addedBy: User;
  uploadedAt: string;
  size?: string;
  isClientVisible: boolean;
  status?: 'DRAFT' | 'FINAL' | 'SIGNED';
  comments?: string;
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export interface TeamMember {
  user: User;
  role: 'Project Manager' | 'Developer' | 'Designer' | 'QA' | 'Client';
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  type: ProjectType;
  status: ProjectStatus | string;
  startDate?: string;
  endDate?: string;
  signOffDate?: string;
  description?: string; // Restored
  dealId?: string; // Restored
  ndaSigned?: boolean; // Restored
  projectManager?: User; // Restored
  dealOwner?: User; // Restored
  addedOn?: string; // Restored
  milestones?: Milestone[]; // Restored
  resources?: Resource[]; // Restored
  changeRequests?: ChangeRequest[]; // Restored
  topUps?: TopUpLog[]; // Restored
  initialBoughtHours?: number; // Restored
  totalBilledHours?: number; // Restored
  tasks?: Task[];
  team?: TeamMember[]; // Restored
  clientRequests?: ClientRequest[];
  documents?: ProjectDocument[]; // Restored
}

export interface Deal {
  id: string;
  title: string;
  owner: User;
  closingDate: string;
  associatedProjectId: string; // Simplification for prototype
  contacts: User[];
}

// --- Messaging Types ---

export interface MessageBoardThread {
  id: string;
  projectId: string;
  title: string;
  content: string; // HTML or Rich Text simulated
  author: User;
  createdAt: string;
  repliesCount: number;
  replies?: MessageBoardReply[];
}

export interface MessageBoardReply {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: User;
  content: string;
  timestamp: string;
  isDeleted?: boolean;
}

// --- Internal Task Management Types (Legacy/Internal View) ---
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface TaskTeamMember {
  user: User;
  isGhost: boolean; // If true, hidden from client
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;

  // Legacy single assignee, moving to team
  assignee?: User;

  // New Fields for Client Portal Logic
  team?: TaskTeamMember[];
  isClientVisible: boolean;
  timeLogs: {
    internal: number; // Actual hours worked
    billable: number; // Hours shown to client
  };

  dueDate: string;
  projectId?: string; // Added for reverse lookup
}
