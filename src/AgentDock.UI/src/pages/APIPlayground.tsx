import { useState } from 'react'
import { Play, Trash2, Settings2, FileText, Zap } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface RequestConfig {
  model: string
  temperature: number
  maxTokens: number
  stream: boolean
  preset?: string
  includeWorkspace: boolean
}

export default function APIPlayground() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<RequestConfig>({
    model: 'llama2',
    temperature: 0.7,
    maxTokens: 2048,
    stream: true,
    includeWorkspace: false,
  })
  const [lastRequest, setLastRequest] = useState<any>(null)
  const [lastResponse, setLastResponse] = useState<any>(null)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Mock response por enquanto (backend será implementado depois)
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: `This is a mock response. The actual API will be implemented in the backend.\n\nYour request:\n- Model: ${config.model}\n- Temperature: ${config.temperature}\n- Max Tokens: ${config.maxTokens}\n\nMessage: "${userMessage.content}"`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // Mock request/response for display
      setLastRequest({
        method: 'POST',
        url: '/api/v1/chat',
        body: {
          model: config.model,
          messages: [{ role: 'user', content: userMessage.content }],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: config.stream,
        },
      })

      setLastResponse({
        status: 200,
        data: {
          id: 'chatcmpl-' + Math.random().toString(36).substr(2, 9),
          model: config.model,
          response: assistantMessage.content,
          tokens_used: 145,
          created_at: new Date().toISOString(),
        },
      })
    }, 1500)
  }

  const handleClear = () => {
    setMessages([])
    setLastRequest(null)
    setLastResponse(null)
  }

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">API Playground</h1>
            <p className="text-sm text-[#888]">Test and experiment with local AI models through the API.</p>
          </div>
          <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
            <Trash2 className="w-3 h-3 mr-2" />
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-4">
            <Card className="bg-[#0A0A0A] border-[#333]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings2 className="w-4 h-4 text-[#666]" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <select
                    value={config.model}
                    onChange={(e) => setConfig({ ...config, model: e.target.value })}
                    className="w-full bg-[#111] border border-[#333] rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#666]"
                  >
                    <option value="llama2">Llama 2 7B</option>
                    <option value="mistral">Mistral 7B</option>
                    <option value="codellama">Code Llama 7B</option>
                    <option value="neural-chat">Neural Chat 7B</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Agent Preset</label>
                  <select
                    value={config.preset || ''}
                    onChange={(e) => setConfig({ ...config, preset: e.target.value || undefined })}
                    className="w-full bg-[#111] border border-[#333] rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#666]"
                  >
                    <option value="">None</option>
                    <option value="code-reviewer">Code Reviewer</option>
                    <option value="bug-hunter">Bug Hunter</option>
                    <option value="documentation">Documentation Writer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Temperature</label>
                    <span className="text-xs text-[#666] font-mono">{config.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Tokens</label>
                  <Input
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                    className="bg-[#111] border-[#333] h-9"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-sm font-medium">Stream Response</label>
                  <button
                    onClick={() => setConfig({ ...config, stream: !config.stream })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.stream ? 'bg-blue-500' : 'bg-[#333]'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.stream ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Include Workspace Context</label>
                  <button
                    onClick={() => setConfig({ ...config, includeWorkspace: !config.includeWorkspace })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.includeWorkspace ? 'bg-blue-500' : 'bg-[#333]'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.includeWorkspace ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Request/Response Inspector */}
            {lastRequest && (
              <Card className="bg-[#0A0A0A] border-[#333]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="w-3 h-3 text-[#666]" />
                    Last Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-xs">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] font-mono">
                        {lastRequest.method}
                      </Badge>
                      <span className="ml-2 text-[#666] font-mono">{lastRequest.url}</span>
                    </div>
                    <pre className="bg-[#111] border border-[#222] rounded p-2 text-[10px] text-[#888] overflow-x-auto">
                      {JSON.stringify(lastRequest.body, null, 2)}
                    </pre>
                    {lastResponse && (
                      <>
                        <div className="text-xs pt-2">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] font-mono">
                            {lastResponse.status}
                          </Badge>
                          <span className="ml-2 text-[#666]">Response</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#666] font-mono">
                          <span>Tokens: {lastResponse.data.tokens_used}</span>
                          <span>1.2s</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Chat Interface */}
          <div className="col-span-2">
            <Card className="bg-[#0A0A0A] border-[#333] h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="w-4 h-4 text-[#666]" />
                  Chat Interface
                </CardTitle>
                <CardDescription>Interact with the AI model in real-time</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[500px]">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-sm text-[#666]">
                      <Zap className="w-12 h-12 text-[#333] mx-auto mb-4" />
                      Start a conversation by typing a message below
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user'
                              ? 'bg-blue-500/10 border border-blue-500/20 text-foreground'
                              : 'bg-[#111] border border-[#222] text-[#888]'
                          }`}
                        >
                          <div className="text-[10px] text-[#666] mb-1 uppercase tracking-wider">
                            {msg.role}
                          </div>
                          <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                          <div className="text-[9px] text-[#666] mt-2">
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#111] border border-[#222] rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                          <span className="text-sm text-[#666]">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    className="bg-[#111] border-[#333] flex-1"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-9">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
