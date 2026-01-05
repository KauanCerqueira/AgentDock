import { useState, useEffect } from 'react'
import { Play, Trash2, Settings2, FileText, Zap, Copy, Check, ExternalLink, Terminal, Loader2 } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Model {
  name: string
  size: number
  path: string
}

export default function APIPlayground() {
  const [copied, setCopied] = useState(false)
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState<string>('tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf')

  const apiKey = "sk-agentdock-admin"
  const baseUrl = "http://localhost:5000/v1"

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/models')
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            setModels(data)
            setSelectedModel(data[0].name)
          }
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const openSwagger = () => {
    window.open('http://localhost:5000/swagger', '_blank')
  }

  const pythonExample = `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="${apiKey}"
)

response = client.chat.completions.create(
    model="${selectedModel}",
    messages=[
        {"role": "user", "content": "Hello, how are you?"}
    ]
)

print(response.choices[0].message.content)`

  const curlExample = `curl ${baseUrl}/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'`

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-6 flex-shrink-0">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">API Integration</h1>
            <p className="text-sm text-muted-foreground">Connect external applications to your local AI engine.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openSwagger}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Swagger UI
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid gap-6 max-w-5xl mx-auto">
            {/* Connection Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Connection Details
                </CardTitle>
                <CardDescription>Use these credentials to connect any OpenAI-compatible client.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Base URL</label>
                  <div className="flex gap-2">
                    <Input value={baseUrl} readOnly className="font-mono bg-muted" />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(baseUrl)}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    To access from another device, replace <code>localhost</code> with your PC's IP address (e.g., <code>http://192.168.1.x:5000/v1</code>).
                  </p>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">API Key</label>
                  <div className="flex gap-2">
                    <Input value={apiKey} readOnly className="font-mono bg-muted" type="password" />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(apiKey)}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This key is configured in your appsettings.json. Keep it secure.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Code Examples */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-blue-500" />
                      Python (OpenAI SDK)
                    </CardTitle>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 bg-[#0d1117] p-0 overflow-hidden rounded-b-lg mx-6 mb-6 border">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]">
                    <span className="text-xs text-gray-400">example.py</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-400 hover:text-white" onClick={() => handleCopy(pythonExample)}>
                      Copy
                    </Button>
                  </div>
                  <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                    {pythonExample}
                  </pre>
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-green-500" />
                      cURL / Terminal
                    </CardTitle>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 bg-[#0d1117] p-0 overflow-hidden rounded-b-lg mx-6 mb-6 border">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]">
                    <span className="text-xs text-gray-400">bash</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-400 hover:text-white" onClick={() => handleCopy(curlExample)}>
                      Copy
                    </Button>
                  </div>
                  <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
                    {curlExample}
                  </pre>
                </CardContent>
              </Card>
            </div>

            {/* Supported Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Supported Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <Badge className="mt-1 bg-green-500 hover:bg-green-600">POST</Badge>
                    <div>
                      <p className="font-mono text-sm font-medium">/v1/chat/completions</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generate chat completions. Supports streaming and standard mode.
                        Compatible with OpenAI Chat Completion API.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <Badge className="mt-1 bg-blue-500 hover:bg-blue-600">GET</Badge>
                    <div>
                      <p className="font-mono text-sm font-medium">/v1/models</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        List available models. Returns the currently loaded model and other available GGUF files.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
