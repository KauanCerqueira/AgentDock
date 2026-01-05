import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import {
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  History,
  Loader2,
  MessageSquare,
  Paperclip,
  Plus,
  RefreshCw,
  Send,
  Settings2,
  Sparkles,
  Star,
  Trash2,
  Wand2
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/api/client'
import type { ChatMessage } from '@/types'
import { toast } from 'sonner'

interface DownloadedModel {
  filename: string
  path: string
  sizeMb: number
  sizeGb: number
  requirements: {
    minRamGb: number
    recommendedRamGb: number
    modelSize: string
    quantization: string
  }
  compatibility: {
    canRun: boolean
    level: string
    performanceEstimate: string
  }
}

interface GenerationConfig {
  temperature: number
  maxTokens: number
  topP: number
  topK: number
  repeatPenalty: number
}

interface ExtendedMessage extends ChatMessage {
  id: string
  timestamp: Date
  isStreaming?: boolean
  tokens?: number
  favorite?: boolean
}

interface Conversation {
  id: string
  title: string
  messages: ExtendedMessage[]
  createdAt: Date
  updatedAt: Date
}

const defaultConfig: GenerationConfig = {
  temperature: 0.8,
  maxTokens: 2048,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1
}

const suggestions = [
  'Explique em 5 bullets o que este repositório faz.',
  'Gere um plano de testes rápido para a feature X.',
  'Resuma este trecho de código e aponte riscos.',
  'Liste 3 prompts úteis para analistas de dados.',
]

export default function Chat() {
  const [models, setModels] = useState<DownloadedModel[]>([])
  const [selectedModel, setSelectedModel] = useState<DownloadedModel | null>(null)
  const [loadingModel, setLoadingModel] = useState(false)
  const [config, setConfig] = useState<GenerationConfig>(() => {
    const saved = localStorage.getItem('chat-config')
    return saved ? JSON.parse(saved) : defaultConfig
  })

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ExtendedMessage[]>([])
  const [input, setInput] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isSending, setIsSending] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'config' | 'history'>('config')
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void loadModels()
    void loadHistory()
    loadConversations()
  }, [])

  useEffect(() => {
    localStorage.setItem('chat-config', JSON.stringify(config))
  }, [config])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      saveCurrentConversation()
    }
  }, [messages, currentConversationId])

  const loadModels = async () => {
    try {
      const data = await api.getDownloadedModels()
      setModels(data)
      if (data.length === 1) {
        setSelectedModel(data[0])
      }
    } catch (error) {
      console.error('Failed to load models', error)
      toast.error('Não foi possível carregar os modelos instalados')
    }
  }

  const loadHistory = async () => {
    try {
      const history = await api.getChatHistory()
      if (!history?.length) return
      setMessages(history.map((msg, i) => ({
        ...msg,
        id: `hist-${i}`,
        timestamp: new Date(),
      })))
    } catch (error) {
      console.warn('History not available', error)
    }
  }

  const loadConversations = () => {
    try {
      const saved = localStorage.getItem('chat-conversations')
      if (saved) {
        const parsed = JSON.parse(saved)
        const conversations = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          messages: c.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }))
        setConversations(conversations)
      }
    } catch (error) {
      console.error('Failed to load conversations', error)
    }
  }

  const saveCurrentConversation = () => {
    if (!currentConversationId) return

    const title = messages.length > 0 
      ? messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : '')
      : 'Nova conversa'

    const conversation: Conversation = {
      id: currentConversationId,
      title,
      messages,
      createdAt: conversations.find(c => c.id === currentConversationId)?.createdAt || new Date(),
      updatedAt: new Date()
    }

    const updated = conversations.filter(c => c.id !== currentConversationId)
    updated.unshift(conversation)
    setConversations(updated)
    localStorage.setItem('chat-conversations', JSON.stringify(updated))
  }

  const startNewConversation = () => {
    const newId = crypto.randomUUID()
    setCurrentConversationId(newId)
    setMessages([])
    setInput('')
    setAttachedFiles([])
  }

  const loadConversation = (conv: Conversation) => {
    setCurrentConversationId(conv.id)
    setMessages(conv.messages)
    setInput('')
    setAttachedFiles([])
    setActiveTab('config')
  }

  const deleteConversation = (id: string) => {
    const updated = conversations.filter(c => c.id !== id)
    setConversations(updated)
    localStorage.setItem('chat-conversations', JSON.stringify(updated))
    if (currentConversationId === id) {
      startNewConversation()
    }
    toast.success('Conversa excluída')
  }

  const selectAndLoadModel = async (model: DownloadedModel) => {
    setLoadingModel(true)
    try {
      await api.loadModel(model.filename)
      setSelectedModel(model)
      toast.success('Modelo carregado', { description: model.filename })
    } catch (error: any) {
      toast.error('Falha ao carregar modelo', { description: error?.message })
    } finally {
      setLoadingModel(false)
    }
  }

  const preparedHistory = useMemo(() => (
    messages
      .filter((m) => m.role !== ('system' as any))
      .map(({ role, content }) => ({ role, content }))
  ), [messages])

  const handleSend = async () => {
    if (!selectedModel) {
      toast.error('Selecione e carregue um modelo antes de enviar')
      return
    }
    if (!input.trim() && attachedFiles.length === 0) return

    if (!currentConversationId) {
      const newId = crypto.randomUUID()
      setCurrentConversationId(newId)
    }

    const userMessage: ExtendedMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    const assistantMessage: ExtendedMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsSending(true)

    try {
      const response = await api.sendChatWithModel({
        model: selectedModel.filename,
        messages: [...preparedHistory, { role: 'user', content: userMessage.content }],
        stream: false,
        options: {
          temperature: config.temperature,
          numPredict: config.maxTokens,
          topP: config.topP,
          topK: config.topK,
          repeatPenalty: config.repeatPenalty,
        },
      })

      const content = response.message?.content || response.content || 'Sem resposta'

      setMessages((prev) => prev.map((m) =>
        m.id === assistantMessage.id
          ? { ...m, content, isStreaming: false }
          : m
      ))
    } catch (error: any) {
      console.error('Chat send error', error)
      toast.error('Erro ao enviar mensagem', { description: error?.message })
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id))
    } finally {
      setIsSending(false)
      setAttachedFiles([])
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1600)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNewChat = () => {
    startNewConversation()
  }

  const handleExport = () => {
    if (!messages.length) return
    const markdown = messages
      .map((msg) => `**${msg.role === 'user' ? 'You' : 'AI'}**\n\n${msg.content}\n\n---\n`)
      .join('\n')

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${new Date().toISOString()}.md`
    a.click()
  }

  const canSend = (Boolean(input.trim()) || attachedFiles.length > 0) && Boolean(selectedModel) && !isSending

  const selectedModelName = selectedModel
    ? selectedModel.filename.replace('.gguf', '').replace(/-/g, ' ')
    : 'Nenhum modelo carregado'

  const renderMessage = (message: ExtendedMessage, index: number) => {
    const isUser = message.role === 'user'
    const prevMessage = messages[index - 1]
    const nextMessage = messages[index + 1]
    const isFirstInGroup = !prevMessage || prevMessage.role !== message.role
    const isLastInGroup = !nextMessage || nextMessage.role !== message.role
    const showAvatar = isLastInGroup

    return (
      <div
        key={message.id}
        className={`flex gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div className={`w-8 h-8 flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
          {showAvatar && (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm ${
                isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {isUser ? (
                <span className="text-[10px] font-bold">Você</span>
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {/* Message bubble */}
        <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`group relative px-4 py-2.5 shadow-sm transition-all hover:shadow-md ${
              isUser
                ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-md'
                : 'bg-card border border-border text-foreground rounded-2xl rounded-tl-md'
            } ${isFirstInGroup ? 'mt-3' : 'mt-0.5'}`}
          >
            {isUser ? (
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0 text-[15px] leading-relaxed">{children}</p>,
                    code({ className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      const codeString = String(children).replace(/\n$/, '')
                      const inline = !match

                      if (!inline && match) {
                        return (
                          <div className="relative my-3 rounded-xl overflow-hidden shadow-lg">
                            <div className="bg-[#0d1117] px-4 py-2 flex items-center justify-between border-b border-gray-800">
                              <span className="text-xs text-gray-400 font-mono">{match[1]}</span>
                              <button
                                onClick={() => handleCopy(codeString, message.id)}
                                className="px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-xs text-gray-300 flex items-center gap-1.5"
                              >
                                {copiedId === message.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-green-400" />
                                    <span>Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copiar</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <SyntaxHighlighter
                              style={oneDark as any}
                              language={match[1]}
                              PreTag="div"
                              className="!bg-[#0d1117] !m-0 text-[13px] !p-4"
                              {...props}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        )
                      }

                      return (
                        <code className="bg-muted/80 px-2 py-0.5 rounded-md text-[13px] font-mono text-foreground border border-border/50" {...props}>
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

            {/* Hover actions */}
            {!isUser && (
              <div className="absolute -right-20 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => handleCopy(message.content, message.id)}
                  className="p-2 rounded-lg bg-card hover:bg-accent border border-border shadow-md transition-colors"
                  title="Copiar mensagem"
                >
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={() =>
                    setMessages((prev) =>
                      prev.map((m) => (m.id === message.id ? { ...m, favorite: !m.favorite } : m))
                    )
                  }
                  className="p-2 rounded-lg bg-card hover:bg-accent border border-border shadow-md transition-colors"
                  title="Favoritar"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      message.favorite ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                    }`}
                  />
                </button>
                <button
                  onClick={() => toast.info('Regenerar ainda não implementado')}
                  className="p-2 rounded-lg bg-card hover:bg-accent border border-border shadow-md transition-colors"
                  title="Regenerar resposta"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>

          {/* Timestamp - only show for last message in group */}
          {isLastInGroup && (
            <div
              className={`flex items-center gap-1.5 mt-1 px-2 text-[11px] text-muted-foreground/70 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <span>{message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              {message.tokens && (
                <>
                  <span>•</span>
                  <span className="font-mono">{message.tokens}t</span>
                </>
              )}
              {isUser && copiedId === message.id && (
                <>
                  <span>•</span>
                  <Check className="w-3 h-3 text-green-500" />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-sm">
        <Sparkles className="w-9 h-9 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-3 text-foreground">
        Inicie sua conversa
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        Escolha um dos prompts abaixo ou digite sua própria mensagem para começar
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="group p-4 text-left rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-card/80 transition-all text-sm text-foreground shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <p className="flex-1 leading-relaxed">{suggestion}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const RightPanel = () => (
    <aside className={`shrink-0 hidden xl:flex flex-col gap-2 transition-all duration-300 overflow-hidden ${
      isPanelOpen ? 'w-[320px] opacity-100' : 'w-0 opacity-0'
    }`}>
      {isPanelOpen && (
        <>
      {/* Quick Actions */}
      <Card className="p-2 space-y-1.5 flex-shrink-0">
        <p className="text-xs font-medium text-foreground mb-1">Ações rápidas</p>
        <div className="grid grid-cols-2 gap-1.5">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleNewChat}>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Novo chat
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleExport} disabled={!messages.length}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exportar
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="p-1 flex-shrink-0">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'config'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings2 className="w-4 h-4 inline mr-2" />
            Configuração
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            Histórico
          </button>
        </div>
      </Card>

      {activeTab === 'history' ? (
        <>
          <Card className="p-2 flex-shrink-0">
            <Button size="sm" className="w-full h-8 text-xs" onClick={startNewConversation}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Nova conversa
            </Button>
          </Card>
          <Card className="flex-1 p-2 overflow-hidden flex flex-col min-h-0">
            <p className="text-xs font-medium text-foreground mb-2">Conversas anteriores</p>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Nenhuma conversa ainda</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                      currentConversationId === conv.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted/50 hover:bg-muted border border-transparent'
                    }`}
                    onClick={() => loadConversation(conv)}
                  >
                    <p className="text-sm font-medium text-foreground truncate pr-6">
                      {conv.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{conv.updatedAt.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{conv.messages.length} msgs</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteConversation(conv.id)
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      ) : (
        <>
      <Card className="p-3 space-y-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Modelo ativo</p>
            <p className="font-semibold text-sm text-foreground truncate max-w-[200px]">{selectedModelName}</p>
          </div>
          <Badge variant="outline" className="gap-1 text-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${selectedModel ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
            {selectedModel ? 'Pronto' : 'Aguardando'}
          </Badge>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] text-muted-foreground">Selecionar modelo</label>
          <select
            value={selectedModel?.filename || ''}
            onChange={(e) => {
              const model = models.find((m) => m.filename === e.target.value)
              if (model) setSelectedModel(model)
            }}
            className="w-full bg-muted border border-input rounded-md h-8 px-2 text-xs text-foreground"
          >
            <option value="" disabled>Escolha um modelo instalado</option>
            {models.map((m) => (
              <option key={m.filename} value={m.filename}>
                {m.filename.replace('.gguf', '')}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            className="w-full h-8 text-xs"
            disabled={!selectedModel || loadingModel}
            onClick={() => selectedModel && selectAndLoadModel(selectedModel)}
          >
            {loadingModel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 mr-1.5" />}
            {loadingModel ? 'Carregando...' : 'Carregar modelo'}
          </Button>
        </div>
      </Card>

      <Card className="p-3 space-y-2 flex-1 overflow-y-auto no-scrollbar min-h-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-foreground">Configuração</p>
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
              <span>Temperatura</span>
              <span className="font-mono text-foreground">{config.temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
            <label className="space-y-0.5">
              <span className="flex items-center justify-between">
                <span>Max tokens</span>
                <span className="font-mono text-foreground">{config.maxTokens}</span>
              </span>
              <input
                type="number"
                value={config.maxTokens}
                onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-xs bg-background border border-border rounded"
              />
            </label>
            <label className="space-y-0.5">
              <span className="flex items-center justify-between">
                <span>Top P</span>
                <span className="font-mono text-foreground">{config.topP.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.topP}
                onChange={(e) => setConfig({ ...config, topP: parseFloat(e.target.value) })}
                className="w-full"
              />
            </label>
            <label className="space-y-0.5">
              <span className="flex items-center justify-between">
                <span>Top K</span>
                <span className="font-mono text-foreground">{config.topK}</span>
              </span>
              <input
                type="number"
                value={config.topK}
                onChange={(e) => setConfig({ ...config, topK: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-xs bg-background border border-border rounded"
              />
            </label>
            <label className="space-y-0.5">
              <span className="flex items-center justify-between">
                <span>Repeat Penalty</span>
                <span className="font-mono text-foreground">{config.repeatPenalty.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min="1"
                max="2"
                step="0.05"
                value={config.repeatPenalty}
                onChange={(e) => setConfig({ ...config, repeatPenalty: parseFloat(e.target.value) })}
                className="w-full"
              />
            </label>
          </div>
        </div>
      </Card>
        </>
      )}
        </>
      )}
    </aside>
  )

  return (
    <Layout>
      <div className="flex h-full gap-4">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between h-10 border-b border-border flex-shrink-0 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="min-w-0">
                <h1 className="text-xs font-semibold text-foreground leading-none">Chat</h1>
                <p className="text-[9px] text-muted-foreground truncate leading-none mt-0.5">
                  {selectedModel ? selectedModelName : 'Nenhum modelo'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => isSending ? null : setMessages([])}
                disabled={!messages.length || isSending}
                title="Limpar mensagens"
                className="h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleExport}
                disabled={!messages.length}
                title="Exportar conversa"
                className="h-8 w-8 p-0"
              >
                <Download className="w-4 h-4" />
              </Button>
              <div className="h-5 w-px bg-border" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                title={isPanelOpen ? 'Ocultar painel' : 'Mostrar painel'}
                className="h-8 w-8 p-0"
              >
                {isPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 min-h-0 gap-4 pt-3">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto no-scrollbar py-1 space-y-6 min-h-0">
                {messages.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {messages.map((msg, idx) => renderMessage(msg, idx))}
                    {isSending && (
                      <div className="flex gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="w-8 h-8 flex-shrink-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-foreground shadow-sm">
                            <Bot className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="flex flex-col max-w-[75%] items-start">
                          <div className="px-4 py-3 bg-card border border-border rounded-2xl rounded-tl-md shadow-sm mt-3">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                              <span className="text-sm text-muted-foreground ml-1">Pensando...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="pt-3 border-t border-border flex-shrink-0">
                {attachedFiles.length > 0 && (
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground"
                      >
                        <Paperclip className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs truncate max-w-[140px]">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="hover:text-red-500 transition-colors"
                          aria-label="Remover anexo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 items-end">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={selectedModel ? 'Digite sua mensagem... (Enter para enviar)' : 'Selecione um modelo'}
                      className="w-full bg-card border border-input rounded-xl px-3 py-2.5 pr-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-32 text-foreground placeholder:text-muted-foreground"
                      rows={1}
                      disabled={!selectedModel || isSending}
                      style={{ height: 'auto', minHeight: '40px' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto'
                        target.style.height = target.scrollHeight + 'px'
                      }}
                    />
                    <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground">
                      {input.length}
                    </div>
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!canSend}
                    className="h-10 px-5"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
                    Enviar
                  </Button>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                  <span>Enter envia • Shift+Enter nova linha</span>
                </div>
              </div>
            </div>

            <RightPanel />
          </div>
        </div>
      </div>
    </Layout>
  )
}

