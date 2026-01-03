import { useState, useEffect, useRef } from 'react'
import { Send, Bot, Sparkles } from 'lucide-react'
import Layout from '@/components/Layout'
import { api } from '@/api/client'
import { ChatMessage } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.getChatHistory().then(setMessages)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await api.sendMessage(userMessage)
      setMessages(prev => [...prev, response])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Chat</h1>
            <p className="text-xs text-[#888]">Interactive session with local LLM.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#666]">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Online
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden rounded-lg border border-[#333] bg-[#0A0A0A] flex flex-col">
          <ScrollArea className="flex-1 p-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <div className="w-12 h-12 rounded-full bg-[#111] border border-[#333] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#666]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Start a conversation</p>
                  <p className="text-xs text-[#666] mt-1">Type a message below to begin</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {messages.map((msg, i) => (
                  <div key={i} className="flex gap-4 group">
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border text-xs font-medium",
                      msg.role === 'user' 
                        ? 'bg-[#111] border-[#333] text-[#888]' 
                        : 'bg-foreground text-background border-foreground'
                    )}>
                      {msg.role === 'user' ? 'U' : <Bot size={14} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {msg.role === 'user' ? 'You' : 'Assistant'}
                        </span>
                        <span className="text-[10px] text-[#444]">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-sm text-[#CCC] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center flex-shrink-0">
                      <Bot size={14} />
                    </div>
                    <div className="flex items-center gap-1 h-8">
                      <div className="w-1.5 h-1.5 bg-[#444] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#444] rounded-full animate-bounce delay-75" />
                      <div className="w-1.5 h-1.5 bg-[#444] rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-[#333] bg-[#0A0A0A]">
            <form onSubmit={handleSend} className="relative">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Send a message..."
                className="pr-12 bg-[#111] border-[#333] focus-visible:ring-1 focus-visible:ring-[#666] h-11 text-sm"
                disabled={loading}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim() || loading}
                className="absolute right-1.5 top-1.5 h-8 w-8 bg-foreground text-background hover:bg-[#CCC]"
              >
                <Send size={14} />
              </Button>
            </form>
            <div className="text-[10px] text-[#444] mt-2 text-center">
              AI can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
