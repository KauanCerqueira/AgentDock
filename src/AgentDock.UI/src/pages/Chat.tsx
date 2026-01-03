import { useState, useRef, useEffect } from 'react'
import { Send, Plus, Paperclip, Settings2, Trash2, Copy, Check, RefreshCw, Download, Star } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { api } from '@/api/client'
import type { ChatMessage } from '@/types'

interface ExtendedMessage extends ChatMessage {
  id: string
  timestamp: Date
  isStreaming?: boolean
  tokens?: number
  favorite?: boolean
}

export default function Chat() {
  const [messages, setMessages] = useState<ExtendedMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState('llama2')
  const [temperature, setTemperature] = useState(0.7)
  const [showSettings, setShowSettings] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load chat history on mount
    const loadHistory = async () => {
      const history = await api.getChatHistory()
      setMessages(
        history.map((msg, i) => ({
          ...msg,
          id: `msg-${i}`,
          timestamp: new Date(),
        }))
      )
    }
    loadHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return

    const userMessage: ExtendedMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await api.sendMessage(input)
      
      const assistantMessage: ExtendedMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        tokens: 145, // Mock - será real quando conectar com Ollama
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
      setAttachedFiles([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopyCode = (code: string, messageId: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRegenerateResponse = (messageId: string) => {
    // TODO: Implement regenerate
    console.log('Regenerating response for:', messageId)
  }

  const toggleFavorite = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, favorite: !msg.favorite } : msg
      )
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNewConversation = () => {
    setMessages([])
    setInput('')
    setAttachedFiles([])
  }

  const handleExportConversation = () => {
    const markdown = messages
      .map((msg) => `**${msg.role === 'user' ? 'You' : 'AI'}:**\n\n${msg.content}\n\n---\n`)
      .join('\n')
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${new Date().toISOString()}.md`
    a.click()
  }

  return (
    <Layout>
      <div className="flex h-full gap-4">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">AI Chat</h1>
              <p className="text-sm text-muted-foreground">
                Powered by {selectedModel} • {messages.length} messages
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportConversation}
                className="h-8 text-xs"
                disabled={messages.length === 0}
              >
                <Download className="w-3 h-3 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="h-8 text-xs"
              >
                <Settings2 className="w-3 h-3 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewConversation}
                className="h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-2" />
                New Chat
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <Card className="mt-4 mb-4 p-4 bg-card border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-muted border border-input rounded-md h-9 px-3 text-sm text-foreground"
                  >
                    <option value="llama2">Llama 2 7B</option>
                    <option value="mistral">Mistral 7B</option>
                    <option value="codellama">Code Llama 7B</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Temperature: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-6 min-h-0">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-foreground">Start a Conversation</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Ask me anything! I can help with coding, writing, analysis, and much more.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-6 max-w-2xl">
                  {[
                    'Explain quantum computing',
                    'Write a Python function',
                    'Review my code',
                    'Generate test cases',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="p-3 text-left rounded-lg bg-card border border-border hover:border-muted-foreground transition-colors text-sm text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      }`}
                    >
                      {message.role === 'user' ? 'U' : 'AI'}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`flex-1 max-w-3xl ${
                        message.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-card border border-border text-foreground'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none text-foreground">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ className, children, ...props }: any) {
                                  const match = /language-(\w+)/.exec(className || '')
                                  const codeString = String(children).replace(/\n$/, '')
                                  
                                  const inline = !match
                                  
                                  return !inline && match ? (
                                    <div className="relative group">
                                      <SyntaxHighlighter
                                        style={oneDark as any}
                                        language={match[1]}
                                        PreTag="div"
                                        className="rounded-lg text-xs !bg-[#1e1e1e] !p-4"
                                        {...props}
                                      >
                                        {codeString}
                                      </SyntaxHighlighter>
                                      <button
                                        onClick={() => handleCopyCode(codeString, message.id)}
                                        className="absolute top-2 right-2 p-1.5 rounded bg-muted hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        {copiedId === message.id ? (
                                          <Check className="w-3 h-3 text-green-500" />
                                        ) : (
                                          <Copy className="w-3 h-3 text-foreground" />
                                        )}
                                      </button>
                                    </div>
                                  ) : (
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs text-foreground" {...props}>
                                      {children}
                                    </code>
                                  )
                                },
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>

                      {/* Message Actions */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.tokens && (
                          <>
                            <span>•</span>
                            <span>{message.tokens} tokens</span>
                          </>
                        )}
                        <div className="flex-1" />
                        {message.role === 'assistant' && (
                          <>
                            <button
                              onClick={() => toggleFavorite(message.id)}
                              className="hover:text-yellow-500 transition-colors"
                            >
                              <Star
                                className={`w-3 h-3 ${
                                  message.favorite ? 'fill-yellow-500 text-yellow-500' : ''
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => handleCopyCode(message.content, message.id)}
                              className="hover:text-foreground transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRegenerateResponse(message.id)}
                              className="hover:text-foreground transition-colors"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      AI
                    </div>
                    <div className="flex-1 max-w-3xl">
                      <div className="rounded-2xl px-4 py-3 bg-card border border-border">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="pt-4 border-t border-border">
            {attachedFiles.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground"
                  >
                    <Paperclip className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 items-end">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-10"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Ctrl+Enter to send)"
                  className="w-full bg-card border border-input rounded-xl px-4 py-3 pr-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 max-h-32 text-foreground placeholder:text-muted-foreground"
                  rows={1}
                  style={{
                    height: 'auto',
                    minHeight: '44px',
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = target.scrollHeight + 'px'
                  }}
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">
                  {input.length} chars
                </div>
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() && attachedFiles.length === 0}
                className="h-10 px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
              <span>Ctrl+Enter to send</span>
              <span>•</span>
              <span>Shift+Enter for new line</span>
              <span>•</span>
              <span>Markdown supported</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
