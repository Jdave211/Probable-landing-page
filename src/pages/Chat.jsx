import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Plus, MessageSquare, Clock, Search, Bot, User as UserIcon, Trash2 } from 'lucide-react';
import { getInsights } from '../services/marketAPI';
import MarketCard from '../components/MarketCard';
import AnalysisDashboard from '../dashboard/AnalysisDashboard';
import ResearchPanel from '../components/ResearchPanel';
import './Chat.css';

const STORAGE_KEY = 'probable-ai-sessions';

export default function Chat() {
  // State for sessions and current session
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredSession, setHoveredSession] = useState(null);
  const messagesEndRef = useRef(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migration check: if it's an array of messages (old format), convert to a session
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].id) {
          const legacySession = {
            id: 'legacy-' + Date.now(),
            title: 'Previous Chat',
            timestamp: new Date().toISOString(),
            messages: parsed
          };
          setSessions([legacySession]);
          setCurrentSessionId(legacySession.id);
          setMessages(parsed);
        } else {
          setSessions(parsed);
          if (parsed.length > 0) {
            // Don't auto-select, let user start new or pick
            // Actually, auto-selecting the most recent is nice
            const mostRecent = parsed[0];
            setCurrentSessionId(mostRecent.id);
            setMessages(mostRecent.messages);
          }
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }, []);

  // Save sessions whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const createNewSession = () => {
    setMessages([]);
    setCurrentSessionId(null); // Null means "New Chat" mode
    setInput('');
  };

  const selectSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setInput('');
    }
  };

  const deleteSession = (sessionId, e) => {
    e.stopPropagation();
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
    }
    if (updatedSessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSend = async (e, suggestedQuery = null) => {
    if (e) e.preventDefault();
    const queryText = suggestedQuery || input;
    
    if (!queryText.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: queryText,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // If this is the first message of a new session, create the session
    let sessionId = currentSessionId;
    let currentSessions = [...sessions];

    if (!sessionId) {
      sessionId = 'session-' + Date.now();
      const newSession = {
        id: sessionId,
        title: queryText.length > 30 ? queryText.substring(0, 30) + '...' : queryText,
        timestamp: new Date().toISOString(),
        messages: newMessages
      };
      currentSessions = [newSession, ...sessions];
      setSessions(currentSessions);
      setCurrentSessionId(sessionId);
    } else {
      // Update existing session
      const sessionIndex = currentSessions.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        currentSessions[sessionIndex] = {
          ...currentSessions[sessionIndex],
          messages: newMessages,
          timestamp: new Date().toISOString()
        };
        setSessions(currentSessions);
      }
    }

    try {
      const data = await getInsights(queryText);
      
      const assistantMessage = {
        role: 'assistant',
        content: data.markets?.length > 0 ? '' : "I couldn't find any relevant markets for that query.",
        timestamp: new Date().toISOString(),
        insights: data,
        markets: data.markets,
        research: data.research || null
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Update session with AI response
      const sessionIndex = currentSessions.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        currentSessions[sessionIndex] = {
          ...currentSessions[sessionIndex],
          messages: updatedMessages
        };
        setSessions(currentSessions);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Group sessions by date
  const getGroupedSessions = () => {
    const groups = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    sessions.forEach(session => {
      const date = new Date(session.timestamp);
      if (date >= today) {
        groups.Today.push(session);
      } else if (date >= yesterday) {
        groups.Yesterday.push(session);
      } else if (date >= lastWeek) {
        groups['Previous 7 Days'].push(session);
      }
    });

    return groups;
  };

  const groupedSessions = getGroupedSessions();

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <button className="btn-new-chat" onClick={createNewSession}>
          <Plus size={16} /> New chat
        </button>
        
        <div className="sidebar-history">
          <h2 style={{ padding: '0 8px', marginBottom: '4px' }}>Chat</h2>
          {Object.entries(groupedSessions).map(([label, group]) => (
            group.length > 0 && (
              <div key={label} className="history-group">
                <h3 className="history-label">{label}</h3>
                <div className="history-list">
                  {group.map(session => (
                    <button
                      key={session.id}
                      className={`history-item ${currentSessionId === session.id ? 'active' : ''}`}
                      onClick={() => selectSession(session.id)}
                      onMouseEnter={() => setHoveredSession(session.id)}
                      onMouseLeave={() => setHoveredSession(null)}
                    >
                      <MessageSquare size={16} className="history-icon" />
                      <span className="history-title">{session.title}</span>
                      {hoveredSession === session.id && (
                        <button
                          className="history-delete"
                          onClick={(e) => deleteSession(session.id, e)}
                          title="Delete chat"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {!currentSessionId && messages.length === 0 ? (
          // Empty State
          <div className="chat-empty-state">
            <div className="empty-state-content">
              <h1>Hey there!<br />Ask me anything</h1>
              
              <form onSubmit={(e) => handleSend(e)} className="main-search-form">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  autoFocus
                />
                <button type="submit" disabled={!input.trim()}>
                  <ArrowUp size={20} />
                </button>
              </form>

              <div className="suggestion-pills">
                <button onClick={() => handleSend(null, "Will Fed cut rates in 2025?")}>
                  Will Fed cut rates in 2025?
                </button>
                <button onClick={() => handleSend(null, "Who will win the 2024 election?")}>
                  Who will win the 2024 election?
                </button>
                <button onClick={() => handleSend(null, "Bitcoin price prediction 2025")}>
                  Bitcoin price prediction 2025
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Chat Interface
          <div className="chat-interface">
            <div className="chat-messages-scroll">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-wrapper ${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="message-content assistant">
                      <div className="message-avatar assistant">
                        <Bot size={18} />
                      </div>
                      <div className="message-body">
                        {msg.content && <p>{msg.content}</p>}
                      
                        {msg.insights && msg.markets?.length > 0 && (
                          <div className="message-dashboard">
                            <AnalysisDashboard 
                              markets={msg.markets} 
                              query={msg.insights.question} 
                              insights={msg.insights} 
                            />
                          </div>
                        )}

                        {msg.research && (
                          <div className="message-research">
                            <ResearchPanel 
                              research={msg.research} 
                              query={msg.insights?.question || msg.content} 
                            />
                          </div>
                        )}

                        {!msg.insights && msg.markets && msg.markets.length > 0 && (
                           <div className="message-markets">
                             <div className="markets-grid">
                               {msg.markets.slice(0, 3).map((market, i) => (
                                 <MarketCard key={market.id || i} market={market} />
                               ))}
                             </div>
                           </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {msg.role === 'user' && (
                    <div className="message-content user">
                      <div className="message-body">
                        <p>{msg.content}</p>
                      </div>
                      <div className="message-avatar user">
                        <UserIcon size={18} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="message-wrapper assistant">
                  <div className="message-content assistant loading">
                    <div className="message-avatar assistant">
                      <Bot size={18} />
                    </div>
                    <div className="message-body">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                      <p>Analyzing markets...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <form onSubmit={(e) => handleSend(e)} className="chat-input-form">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()}>
                  <ArrowUp size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}