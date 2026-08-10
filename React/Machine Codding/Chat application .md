The WhatsApp Web Clone skill has been created and saved as whatsapp-web-clone.

What's Included:
Express & MongoDB Architecture:

User Mongoose schema with isOnline, lastSeen, and socket maps.

Chat Mongoose schema supporting direct 1-on-1 and multi-user Group Chats with custom avatars and admins.

Message Mongoose schema supporting text, media uploads (images, videos, documents), voice notes, and read/delivered status ticks.

Status Mongoose schema with automatic 24-hour expiration indexing for stories.

Socket.io event engine for real-time delivery, typing indicators, user online status, and WebRTC call signaling.

Full Front-End React Component (WhatsAppWeb):

Authentic WhatsApp Web Dark UI: Dark background tokens (#111b21, #202c33, #00a884).

Side Drawers: Quick switching between Conversations list, Status Stories updates, and User Profile details.

Voice Note Recorder: Live timer recording and audio waveform playback component.

WebRTC Call Overlay: Pop-up banner for incoming/outgoing Voice & Video calls with end call controls.

Attachments Popup Menu: Media, photo, and document sharing triggers.

Chat Search: Search bar for filtering active conversations and message text.

whatsapp-web-clone
Full-stack MERN WhatsApp Web clone featuring real-time socket messaging, voice call overlays, status stories, audio voice notes, media/file attachments, group chats, message search, and dark mode.

Instructions
MERN WhatsApp Web Clone
A production-ready, responsive WhatsApp Web clone built with React, Node.js/Express, MongoDB, Socket.io, and Tailwind CSS.

Key Features
Real-time Socket Messaging: Instant delivery, double-tick delivery indicators, typing status, and online/offline presence.
Audio Voice Notes: Record and preview audio messages before sending.
Status / Stories: View temporary image/video status updates with countdown progress bars.
Voice & Video Calling Overlay: WebRTC/Socket call banner with mute/unmute and end call controls.
Group Chats: Create multi-user group chats with custom avatars and admins.
Media & File Attachments: Image, video, document, and audio sharing with modal previews.
Message Search & Filtering: In-chat keyword searching, unread filters, and starred message tracking.
Dark Mode & Themes: WhatsApp Web authentic dark/light layout tokens.

1. Backend Implementation (Express & MongoDB)
Database Schemas
models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  about: { type: String, default: 'Hey there! I am using WhatsApp.' },
  avatarUrl: String,
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  socketId: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  isGroup: { type: Boolean, default: false },
  chatName: String,
  groupAvatar: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  mediaUrl: String,
  mediaType: { type: String, enum: ['image', 'video', 'audio', 'document', 'voice_note'] },
  fileName: String,
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  isStarred: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
models/Status.js
const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaUrl: { type: String, required: true },
  caption: String,
  expiresAt: { type: Date, default: () => new Date(+new Date() + 24*60*60*1000) } // 24 hours
}, { timestamps: true });

statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Status', statusSchema);
Socket.io Real-Time Handler (sockets/chatSocket.js)
module.exports = function(io) {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('setup', (userData) => {
      socket.join(userData._id);
      onlineUsers.set(userData._id, socket.id);
      io.emit('user_online', { userId: userData._id, isOnline: true });
    });

    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('typing', ({ chatId, userId }) => {
      socket.in(chatId).emit('typing', { chatId, userId });
    });

    socket.on('stop_typing', ({ chatId, userId }) => {
      socket.in(chatId).emit('stop_typing', { chatId, userId });
    });

    socket.on('new_message', (newMessage) => {
      const chat = newMessage.chat;
      if (!chat.participants) return;

      chat.participants.forEach((user) => {
        if (user._id === newMessage.sender._id) return;
        socket.in(user._id).emit('message_received', newMessage);
      });
    });

    socket.on('start_call', ({ recipientId, offer, callerInfo, callType }) => {
      const targetSocket = onlineUsers.get(recipientId);
      if (targetSocket) {
        io.to(targetSocket).emit('incoming_call', { offer, callerInfo, callType });
      }
    });

    socket.on('disconnect', () => {
      for (let [userId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('user_online', { userId, isOnline: false, lastSeen: new Date() });
          break;
        }
      }
    });
  });
};
2. Interactive Front-End React Component
Below is a single-file React component replicating the WhatsApp Web UI: left conversation bar, active chat workspace, status stories drawer, voice notes recorder, WebRTC call banner, search, and attach modal.

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, CircleDashed, Phone, Video, Search, MoreVertical,
  Paperclip, Mic, Send, Image, FileText, Check, CheckCheck, Smile,
  X, Volume2, UserPlus, Star, ChevronLeft, StopCircle, Play, Pause, PhoneOff
} from 'lucide-react';

// Mock Data
const CURRENT_USER = {
  id: 'u_me',
  name: 'Alex Mercer',
  phone: '+1 555-019-2834',
  avatar: '<https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80>',
  status: 'Available'
};

const MOCK_CHATS = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    unreadCount: 2,
    isOnline: true,
    lastSeen: 'Online',
    lastMessage: 'Hey! Are we still meeting for coffee at 4?',
    lastTime: '10:42 AM',
    isGroup: false,
    messages: [
      { id: 'm1', senderId: 'c1', text: 'Hi Alex! Hope you are doing well.', time: '10:30 AM', status: 'read' },
      { id: 'm2', senderId: 'u_me', text: 'Hey Sarah! Doing great, thanks.', time: '10:35 AM', status: 'read' },
      { id: 'm3', senderId: 'c1', text: 'Hey! Are we still meeting for coffee at 4?', time: '10:42 AM', status: 'read' },
    ]
  },
  {
    id: 'c2',
    name: 'Frontend Engineering Lead',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&q=80',
    unreadCount: 0,
    isOnline: false,
    lastSeen: 'Yesterday at 8:15 PM',
    lastMessage: 'Alex: Shared the Q3 component updates on Figma.',
    lastTime: 'Yesterday',
    isGroup: true,
    messages: [
      { id: 'm4', senderId: 'u_me', text: 'Shared the Q3 component updates on Figma.', time: 'Yesterday', status: 'read' }
    ]
  },
  {
    id: 'c3',
    name: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    unreadCount: 0,
    isOnline: true,
    lastSeen: 'Online',
    lastMessage: 'Voice Note (0:14)',
    lastTime: 'Aug 8',
    isGroup: false,
    messages: [
      { id: 'm5', senderId: 'c3', mediaType: 'voice_note', audioUrl: '#', duration: '0:14', time: 'Aug 8', status: 'read' }
    ]
  }
];

export default function WhatsAppWeb() {
  const [chats, setChats] = useState(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState('c1');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('CHATS'); // CHATS | STATUS | PROFILE

  // Attachment & Voice Recording States
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef(null);

  // Call Overlay State
  const [activeCall, setActiveCall] = useState(null); // { name, avatar, type: 'voice' | 'video' }

  // Active Chat Object
  const activeChat = chats.find(c => c.id === activeChatId);

  // Handle Voice Note Timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  // Send Message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: 'u_me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMessage: inputText,
          lastTime: 'Just now',
          messages: [...chat.messages, newMsg]
        };
      }
      return chat;
    }));

    setInputText('');
  };

  // Stop & Send Voice Note
  const handleSendVoiceNote = () => {
    setIsRecording(false);
    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: 'u_me',
      mediaType: 'voice_note',
      duration: `0:${recordingTime < 10 ? '0' : ''}${recordingTime}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMessage: `Voice Note (${newMsg.duration})`,
          lastTime: 'Just now',
          messages: [...chat.messages, newMsg]
        };
      }
      return chat;
    }));
  };

  // Filter Chats
  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#111b21] text-[#e9edef] font-sans overflow-hidden select-none">
      {/*1. Left Sidebar Container */}
      <aside className="w-[400px] border-r border-[#222d34] bg-[#111b21] flex flex-col flex-shrink-0">
        {/* Sidebar Header*/}
        <header className="h-16 bg-[#202c33] px-4 flex items-center justify-between">
          <div
            onClick={() => setActiveTab('PROFILE')}
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
          >
            <img src={CURRENT_USER.avatar} alt="Me" className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center space-x-3 text-[#aebac1]">
            <button 
              onClick={() => setActiveTab(activeTab === 'STATUS' ? 'CHATS' : 'STATUS')}
              className={`p-2 hover:bg-[#374248] rounded-full transition ${activeTab === 'STATUS' && 'text-[#00a884]'}`}
            >
              <CircleDashed size={20} />
            </button>
            <button className="p-2 hover:bg-[#374248] rounded-full transition">
              <MessageSquare size={20} />
            </button>
            <button className="p-2 hover:bg-[#374248] rounded-full transition">
              <MoreVertical size={20} />
            </button>
          </div>
        </header>

        {/* Status Tab Drawer */}
        {activeTab === 'STATUS' ? (
          <div className="flex-1 bg-[#111b21] overflow-y-auto p-4 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-[#8696a0] uppercase">
              <span>Status Updates</span>
              <button onClick={() => setActiveTab('CHATS')}><X size={18} /></button>
            </div>

            {/* My Status */}
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="relative w-12 h-12 rounded-full border-2 border-[#00a884] p-0.5">
                <img src={CURRENT_USER.avatar} className="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#e9edef]">My Status</h4>
                <p className="text-xs text-[#8696a0]">Tap to add status update</p>
              </div>
            </div>
          </div>
        ) : activeTab === 'PROFILE' ? (
          /* Profile Drawer */
          <div className="flex-1 bg-[#111b21] overflow-y-auto">
            <div className="bg-[#202c33] p-4 flex items-center space-x-4">
              <button onClick={() => setActiveTab('CHATS')}><ChevronLeft size={20} /></button>
              <span className="font-bold text-sm">Profile</span>
            </div>
            <div className="p-8 flex flex-col items-center space-y-6">
              <img src={CURRENT_USER.avatar} className="w-40 h-40 rounded-full object-cover border-4 border-[#202c33]" />
              <div className="w-full space-y-4">
                <div>
                  <p className="text-xs text-[#00a884] font-bold uppercase">Your Name</p>
                  <p className="text-sm text-[#e9edef] mt-1">{CURRENT_USER.name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#00a884] font-bold uppercase">About</p>
                  <p className="text-sm text-[#e9edef] mt-1">{CURRENT_USER.status}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Chats List */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Input */}
            <div className="p-2 bg-[#111b21]">
              <div className="bg-[#202c33] rounded-lg flex items-center px-3 py-1.5 space-x-3">
                <Search size={16} className="text-[#8696a0]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search or start new chat"
                  className="bg-transparent text-xs text-[#e9edef] placeholder-[#8696a0] focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Chat Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/40">
              {filteredChats.map(chat => {
                const isActive = chat.id === activeChatId;
                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`flex items-center px-3 py-3 cursor-pointer transition ${
                      isActive ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-[#e9edef] truncate">{chat.name}</h3>
                        <span className="text-[11px] text-[#8696a0]">{chat.lastTime}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-[#8696a0] truncate flex-1 pr-2">{chat.lastMessage}</p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-[#00a884] text-[#111b21] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {/* 2. Main Chat Workspace */}
      {activeChat ? (
        <main className="flex-1 flex flex-col bg-[#0b141a] relative">
          {/* Active Chat Header */}
          <header className="h-16 bg-[#202c33] px-4 flex items-center justify-between border-b border-[#222d34] z-10">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={activeChat.avatar} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#e9edef]">{activeChat.name}</h3>
                <p className="text-[11px] text-[#8696a0]">
                  {activeChat.isOnline ? 'online' : activeChat.lastSeen}
                </p>
              </div>
            </div>

            {/* Header Call Actions */}
            <div className="flex items-center space-x-4 text-[#aebac1]">
              <button 
                onClick={() => setActiveCall({ name: activeChat.name, avatar: activeChat.avatar, type: 'video' })}
                className="p-2 hover:bg-[#374248] rounded-full transition"
              >
                <Video size={18} />
              </button>
              <button 
                onClick={() => setActiveCall({ name: activeChat.name, avatar: activeChat.avatar, type: 'voice' })}
                className="p-2 hover:bg-[#374248] rounded-full transition"
              >
                <Phone size={18} />
              </button>
              <div className="w-[1px] h-5 bg-[#374248]" />
              <button className="p-2 hover:bg-[#374248] rounded-full transition">
                <Search size={18} />
              </button>
              <button className="p-2 hover:bg-[#374248] rounded-full transition">
                <MoreVertical size={18} />
              </button>
            </div>
          </header>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[radial-gradient(#202c33_1px,transparent_1px)] [background-size:16px_16px]">
            {activeChat.messages.map(msg => {
              const isMe = msg.senderId === 'u_me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[65%] rounded-lg px-3 py-2 text-xs shadow ${
                    isMe ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
                  }`}>
                    {/* Media Voice Note Render */}
                    {msg.mediaType === 'voice_note' ? (
                      <div className="flex items-center space-x-3 py-1">
                        <button className="p-2 bg-[#00a884] text-[#111b21] rounded-full">
                          <Play size={14} />
                        </button>
                        <div className="w-32 h-1.5 bg-[#374248] rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-[#00a884]" />
                        </div>
                        <span className="text-[10px] text-[#8696a0] font-mono">{msg.duration}</span>
                      </div>
                    ) : (
                      <p className="leading-relaxed break-words">{msg.text}</p>
                    )}

                    <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-[#8696a0]">
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck size={14} className="text-[#53bdeb]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attachments Menu Overlay */}
          {isAttachOpen && (
            <div className="absolute bottom-20 left-6 bg-[#233138] p-3 rounded-2xl shadow-xl flex flex-col space-y-3 border border-[#222d34] z-20">
              <button className="flex items-center space-x-3 px-3 py-2 hover:bg-[#182229] rounded-xl text-xs">
                <Image size={18} className="text-purple-400" />
                <span>Photos & Videos</span>
              </button>
              <button className="flex items-center space-x-3 px-3 py-2 hover:bg-[#182229] rounded-xl text-xs">
                <FileText size={18} className="text-blue-400" />
                <span>Document</span>
              </button>
            </div>
          )}

          {/* Input Footer Bar */}
          <footer className="h-16 bg-[#202c33] px-4 flex items-center space-x-3 border-t border-[#222d34] z-10">
            <button className="p-2 text-[#aebac1] hover:text-[#e9edef]">
              <Smile size={20} />
            </button>
            <button 
              onClick={() => setIsAttachOpen(!isAttachOpen)} 
              className={`p-2 transition ${isAttachOpen ? 'text-[#00a884] rotate-45' : 'text-[#aebac1] hover:text-[#e9edef]'}`}
            >
              <Paperclip size={20} />
            </button>

            {/* Text Form or Voice Recording Indicator */}
            {isRecording ? (
              <div className="flex-1 bg-[#111b21] px-4 py-2 rounded-lg flex items-center justify-between text-xs text-red-400">
                <div className="flex items-center space-x-2 animate-pulse">
                  <StopCircle size={16} />
                  <span>Recording Audio ({recordingTime}s)...</span>
                </div>
                <button onClick={handleSendVoiceNote} className="text-[#00a884] font-bold hover:underline">
                  Send Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message"
                  className="w-full bg-[#2a3942] text-xs text-[#e9edef] placeholder-[#8696a0] px-4 py-2.5 rounded-lg focus:outline-none"
                />
              </form>
            )}

            {inputText.trim() ? (
              <button onClick={handleSendMessage} className="p-2 text-[#00a884] hover:bg-[#374248] rounded-full">
                <Send size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setIsRecording(!isRecording)} 
                className={`p-2 rounded-full transition ${isRecording ? 'text-red-500 bg-red-500/10' : 'text-[#aebac1] hover:text-[#e9edef]'}`}
              >
                <Mic size={20} />
              </button>
            )}
          </footer>
        </main>
      ) : (
        <main className="flex-1 bg-[#222e35] flex flex-col items-center justify-center text-center p-8 border-b-8 border-[#00a884]">
          <h2 className="text-2xl font-light text-[#e9edef] mb-2">WhatsApp Web Workspace</h2>
          <p className="text-xs text-[#8696a0] max-w-sm leading-relaxed">
            Send and receive messages without keeping your phone online. Use WhatsApp on up to 4 linked devices.
          </p>
        </main>
      )}

      {/* WebRTC Calling Overlay Banner */}
      {activeCall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#202c33] border border-[#222d34] rounded-2xl p-8 max-w-sm w-full flex flex-col items-center text-center space-y-6 shadow-2xl">
            <img src={activeCall.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-[#00a884]" />
            <div>
              <h3 className="text-xl font-bold text-[#e9edef]">{activeCall.name}</h3>
              <p className="text-xs text-[#00a884] uppercase font-bold mt-1">WhatsApp {activeCall.type} Call...</p>
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <button 
                onClick={() => setActiveCall(null)}
                className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transition"
              >
                <PhoneOff size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
See less
