import React, { useState } from 'react';
import { Project, User, MessageBoardThread, ChatMessage } from '../types';
import { USERS, MESSAGE_BOARDS, GROUP_CHAT_MESSAGES, DIRECT_CHAT_MESSAGES } from '../constants';
import { MessageSquare, ArrowUpRight, Plus, Search, Smile, Paperclip, Send, MoreHorizontal, ArrowLeft, Bold, Italic, Underline, List, Link as LinkIcon, Image as ImageIcon, Sparkles } from 'lucide-react';

// --- Shared Small Components ---

const UserAvatar = ({ name, colorClass, size = "w-8 h-8", fontSize = "text-[10px]" }: { name: string, colorClass: string, size?: string, fontSize?: string }) => (
  <div className={`${size} rounded-full ${colorClass} flex items-center justify-center ${fontSize} font-bold text-white ring-2 ring-white shadow-sm`}>
    {name.substring(0, 2).toUpperCase()}
  </div>
);

// --- 1. Messages Project List (Entry Point) ---

export const MessagesProjectList: React.FC<{ projects: Project[]; onSelectProject: (id: string) => void }> = ({ projects, onSelectProject }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
        <p className="text-slate-500 text-sm mt-1">Select a project to view discussions and chats</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => onSelectProject(project.id)}
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[160px] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start z-10">
              <h3 className="font-bold text-slate-800 text-base group-hover:text-indigo-700 transition-colors line-clamp-2 pr-4">{project.name}</h3>
              {project.status === 'active' && <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></span>}
            </div>
            
            <div className="flex items-end justify-between mt-6 z-10">
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Internal Team</span>
                  <div className="flex -space-x-2 pl-1">
                     <UserAvatar name="Harvey Spector" colorClass="bg-gradient-to-br from-purple-500 to-indigo-600" />
                     <UserAvatar name="Super User" colorClass="bg-gradient-to-br from-rose-500 to-orange-500" />
                  </div>
               </div>
               
               <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Client</span>
                  <div className="flex -space-x-2 pl-1">
                     <UserAvatar name="Adrian Andersomn" colorClass="bg-gradient-to-br from-blue-500 to-cyan-500" />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 2. Message Hub (Main View) ---

interface MessageHubProps {
  project: Project;
  onViewBoard: (boardId: string) => void;
  onOpenGroupChat: () => void;
  onOpenDirectChat: (userId: string) => void;
}

export const MessageHub: React.FC<MessageHubProps> = ({ project, onViewBoard, onOpenGroupChat, onOpenDirectChat }) => {
  const boards = MESSAGE_BOARDS.filter(b => b.projectId === project.id || project.id); // Showing all for prototype
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  return (
    <div className="p-6 h-full flex flex-col max-w-[1600px] mx-auto w-full">
      <div className="grid grid-cols-[1fr_380px] gap-8 h-full">
        
        {/* Left Column: Message Board */}
        <div className="flex flex-col gap-6">
           {/* Controls */}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <h2 className="text-xl font-bold text-slate-800">Message Board</h2>
                 <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">{boards.length}</span>
              </div>
              <button 
                onClick={() => setShowNewMessageForm(!showNewMessageForm)}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> New Message
              </button>
           </div>

           {/* Search & Filter */}
           <div className="relative group">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="Search discussions..." className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" />
           </div>

           {/* New Message Form */}
           {showNewMessageForm && (
             <div className="bg-white border border-slate-200 rounded-2xl p-6 animate-slide-in-down shadow-lg ring-1 ring-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Create New Topic</h3>
                  <button onClick={() => setShowNewMessageForm(false)} className="text-slate-400 hover:text-slate-600"><Plus className="w-5 h-5 rotate-45" /></button>
                </div>
                <input 
                  type="text" 
                  placeholder="Topic Subject" 
                  className="w-full mb-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea 
                  placeholder="What's on your mind?..." 
                  className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-slate-600 resize-none mb-4"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowNewMessageForm(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">Post Message</button>
                </div>
             </div>
           )}

           {/* List of Boards */}
           <div className="space-y-4 pb-10">
              {boards.map(board => (
                 <div 
                  key={board.id} 
                  className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden" 
                  onClick={() => onViewBoard(board.id)}
                 >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-start gap-4">
                       <UserAvatar 
                          name={board.author.name} 
                          colorClass={board.author.role === 'client' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-purple-500 to-indigo-600'} 
                          size="w-10 h-10"
                          fontSize="text-xs"
                       />
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                             <h3 className="font-bold text-slate-800 text-base group-hover:text-indigo-700 transition-colors truncate pr-4">{board.title}</h3>
                             {board.repliesCount > 0 && (
                                <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
                                   <MessageSquare className="w-3.5 h-3.5" />
                                   <span className="text-xs font-bold">{board.repliesCount}</span>
                                </div>
                             )}
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">{board.content}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                             <div className="flex items-center gap-1.5">
                                <span className="font-medium text-slate-600">{board.author.name}</span>
                             </div>
                             <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                             <span>{board.createdAt}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Right Column: Chats & Team */}
        <div className="space-y-6">
           {/* Group Chat Preview */}
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <MessageSquare className="w-5 h-5 text-amber-500 fill-amber-500/20" /> 
                       Group Chat
                    </h3>
                    <p className="text-xs text-slate-400 font-medium ml-7">Project General Channel</p>
                 </div>
                 <button onClick={onOpenGroupChat} className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                 </button>
              </div>

              <div className="space-y-4 mb-6">
                 {GROUP_CHAT_MESSAGES.slice(0, 3).map(msg => (
                    <div key={msg.id} className="text-xs group">
                       <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-slate-700">{msg.sender.name}</span>
                          <span className="text-[10px] text-slate-300 group-hover:text-slate-400 transition-colors">{msg.timestamp.split(',')[1]}</span>
                       </div>
                       <div className="bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-lg rounded-tl-none text-slate-600 leading-relaxed shadow-sm">
                          {msg.content}
                       </div>
                    </div>
                 ))}
              </div>

              <button 
                onClick={onOpenGroupChat}
                className="w-full py-2.5 bg-white border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
              >
                 View Conversation
              </button>
           </div>

           {/* Team Members */}
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    Team Members
                 </h3>
                 <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-0.5 rounded">3</span>
              </div>

              <div className="space-y-6">
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 pl-2">Client</div>
                    <div 
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 group cursor-pointer transition-colors" 
                      onClick={() => onOpenDirectChat(USERS.adrian.id)}
                    >
                       <div className="flex items-center gap-3">
                          <UserAvatar name={USERS.adrian.name} colorClass="bg-gradient-to-br from-blue-500 to-cyan-500" />
                          <div>
                             <span className="text-sm font-semibold text-slate-700 block">{USERS.adrian.name}</span>
                             <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                             </span>
                          </div>
                       </div>
                       <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-300 shadow-sm group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">
                          <MessageSquare className="w-4 h-4" />
                       </div>
                    </div>
                 </div>

                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 pl-2">Internal Team</div>
                    <div className="space-y-1">
                       {[USERS.harvey, USERS.super].map(u => (
                          <div 
                            key={u.id} 
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 group cursor-pointer transition-colors" 
                            onClick={() => onOpenDirectChat(u.id)}
                          >
                             <div className="flex items-center gap-3">
                                <UserAvatar name={u.name} colorClass="bg-gradient-to-br from-purple-500 to-indigo-600" />
                                <div>
                                   <span className="text-sm font-semibold text-slate-700 block">{u.name}</span>
                                   <span className="text-[10px] text-slate-400">{u.role}</span>
                                </div>
                             </div>
                             <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-300 shadow-sm group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">
                                <MessageSquare className="w-4 h-4" />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Message Board Detail ---

export const MessageBoardDetail: React.FC<{ boardId: string; onBack: () => void }> = ({ boardId, onBack }) => {
  const board = MESSAGE_BOARDS.find(b => b.id === boardId);
  if (!board) return <div>Board not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto w-full">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6 bg-slate-50 w-fit px-3 py-1.5 rounded-lg">
             <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={onBack}>Message Board</span>
             <span className="text-slate-300">/</span>
             <span className="text-slate-800">{board.title}</span>
          </div>
          
          <div className="flex items-start justify-between mb-8">
             <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">{board.title}</h1>
                <div className="flex items-center gap-3 text-sm">
                   <UserAvatar name={board.author.name} colorClass="bg-gradient-to-br from-purple-500 to-indigo-600" size="w-6 h-6" fontSize="text-[8px]" />
                   <span className="text-slate-600 font-medium">{board.author.name}</span>
                   <span className="text-slate-300">•</span>
                   <span className="text-slate-500">{board.createdAt}</span>
                </div>
             </div>
             
             {/* Visibility Badge */}
             <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
                <span className="uppercase text-[10px] font-bold text-slate-400 tracking-wider">Visible To</span>
                <div className="flex -space-x-1">
                   <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 ring-2 ring-white"></div>
                   <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 ring-2 ring-white"></div>
                   <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 ring-2 ring-white"></div>
                </div>
             </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-sm text-slate-700 leading-7 mb-8">
             <p className="mb-4">{board.content}</p>
             
             {/* Styled "Rich Text" Blocks mimicking screenshot */}
             {board.content.includes("Test") && (
                <div className="space-y-1 font-mono text-xs opacity-90">
                   <div className="bg-slate-400 text-white px-2 py-1 rounded-sm w-fit">TestTestTestTestTest...</div>
                   <div className="bg-red-600 text-white px-2 py-1 rounded-sm w-fit">TestTestTestTestTest...</div>
                   <div className="bg-blue-400 text-white px-2 py-1 rounded-sm w-fit">TestTestTestTestTest...</div>
                   <div className="bg-blue-400 text-white px-2 py-1 rounded-sm w-fit">TestTestTestTestTest...</div>
                </div>
             )}
          </div>
          
          <div className="border-t border-slate-100 my-8"></div>

          {/* Replies */}
          <div className="space-y-6">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Comments ({board.replies?.length || 0})</h3>
             
             {board.replies?.map(reply => (
                <div key={reply.id} className="flex gap-4 group">
                   <UserAvatar name={reply.author.name} colorClass="bg-gradient-to-br from-purple-500 to-indigo-600" size="w-10 h-10" />
                   <div className="flex-1 max-w-3xl">
                      <div className="flex items-center justify-between mb-1.5">
                         <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800">{reply.author.name}</span>
                            <span className="text-xs text-slate-400 font-medium">{reply.createdAt}</span>
                         </div>
                         <button className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-600 transition-all"><MoreHorizontal className="w-4 h-4"/></button>
                      </div>
                      <div className="text-sm text-slate-700 bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm inline-block min-w-[200px]">
                         {reply.content}
                      </div>
                      <div className="flex gap-2 mt-2 ml-1">
                         <button className="text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-1 text-xs font-medium">
                            <Smile className="w-4 h-4"/> React
                         </button>
                         <button className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs font-medium ml-4">
                            Reply
                         </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>

          {/* Reply Editor */}
          <div className="mt-10 border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
             <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-4">
                <div className="flex items-center gap-1 pr-4 border-r border-slate-200">
                   <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                   <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors"><Italic className="w-4 h-4" /></button>
                   <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors"><Underline className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-1">
                   <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors"><List className="w-4 h-4" /></button>
                   <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors"><LinkIcon className="w-4 h-4" /></button>
                   <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                </div>
             </div>
             <textarea 
               className="w-full p-4 h-32 focus:outline-none text-sm text-slate-700 resize-none bg-white placeholder:text-slate-300" 
               placeholder="Write a comment..."
             ></textarea>
             <div className="flex justify-end p-3 gap-3 bg-white border-t border-slate-100">
                <button className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                <button className="px-6 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">Add Comment</button>
             </div>
          </div>
      </div>
    </div>
  );
};

// --- 4. Chat Views (Group & Direct) ---

const ChatLayout: React.FC<{ title: string; subtitle?: string; messages: ChatMessage[]; onBack?: () => void; isGroup?: boolean }> = ({ title, subtitle, messages, onBack, isGroup }) => {
   return (
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-5xl mx-auto my-4 w-full">
         {/* Chat Header */}
         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
            <div className="flex items-center gap-4">
               {onBack && (
                  <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                     <ArrowLeft className="w-5 h-5" />
                  </button>
               )}
               <div className="flex items-center gap-3">
                  {isGroup ? (
                     <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border-2 border-white shadow-sm">
                        <MessageSquare className="w-5 h-5" />
                     </div>
                  ) : (
                     <UserAvatar name={title} colorClass="bg-gradient-to-br from-purple-500 to-indigo-600" size="w-10 h-10" />
                  )}
                  <div>
                     <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
                     {subtitle && <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {subtitle}
                     </p>}
                  </div>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"><Search className="w-5 h-5"/></button>
               <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
            </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 bg-slate-50/50 p-6 overflow-y-auto space-y-6">
            {messages.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
               </div>
            )}
            
            {/* Date Separator */}
            {messages.length > 0 && (
               <div className="flex justify-center my-4">
                  <span className="bg-slate-200/60 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
               </div>
            )}

            {messages.map((msg, i) => {
               const isMe = msg.sender.id === USERS.adrian.id; 
               return (
                  <div key={msg.id} className={`flex group ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                     {!isMe && <UserAvatar name={msg.sender.name} colorClass="bg-gradient-to-br from-purple-500 to-indigo-600 mt-1" size="w-8 h-8" />}
                     
                     <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start ml-3'}`}>
                        {!isMe && <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1">{msg.sender.name}</span>}
                        
                        <div 
                           className={`px-5 py-3 text-sm shadow-sm leading-relaxed relative ${
                              isMe 
                              ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' 
                              : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none'
                           }`}
                        >
                           {msg.content}
                        </div>
                        
                        <div className={`flex items-center gap-1 mt-1.5 text-[10px] text-slate-400 font-medium ${isMe ? 'mr-1' : 'ml-1'}`}>
                           <span>{msg.timestamp}</span>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Input Area */}
         <div className="p-4 bg-white border-t border-slate-100 flex items-end gap-3 pb-6">
             <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-full transition-colors mb-0.5"><Smile className="w-6 h-6"/></button>
             <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-full transition-colors mb-0.5"><Paperclip className="w-5 h-5"/></button>
             
             <div className="flex-1 relative bg-slate-100 rounded-3xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
                <textarea 
                  placeholder="Type a message..." 
                  className="w-full bg-transparent border-0 rounded-3xl px-5 py-3.5 text-sm focus:ring-0 resize-none max-h-32" 
                  rows={1}
                />
             </div>
             
             <button className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95 mb-0.5">
                <Send className="w-5 h-5 ml-0.5" />
             </button>
         </div>
      </div>
   );
}

export const GroupChatView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
   <ChatLayout title="Group Chat" subtitle="4 Members" messages={GROUP_CHAT_MESSAGES} onBack={onBack} isGroup={true} />
);

export const DirectChatView: React.FC<{ userId: string; onBack: () => void }> = ({ userId, onBack }) => {
   const user = Object.values(USERS).find(u => u.id === userId) || USERS.harvey;
   return (
      <ChatLayout title={user.name} subtitle={user.role === 'client' ? 'Client' : 'Online'} messages={DIRECT_CHAT_MESSAGES} onBack={onBack} />
   );
};
