import { useState, useEffect } from 'react'
import { Bot, Play, Code, FileText, Bug, Shield, TestTube, Wand, Network, Zap } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/api/client'
import { AgentPreset } from '@/types'

const iconMap: Record<string, any> = {
  code: Code,
  'file-text': FileText,
  bug: Bug,
  shield: Shield,
  'test-tube': TestTube,
  wand: Wand,
  network: Network,
  zap: Zap,
  bot: Bot,
}

export default function AgentPresets() {
  const [presets, setPresets] = useState<AgentPreset[]>([])
  const [category, setCategory] = useState<string>('')
  const [selectedPreset, setSelectedPreset] = useState<AgentPreset | null>(null)

  useEffect(() => {
    loadPresets()
  }, [category])

  const loadPresets = async () => {
    const data = await api.getAgentPresets(category || undefined)
    setPresets(data)
  }

  const handleUsePreset = async (preset: AgentPreset) => {
    await api.useAgentPreset(preset.id)
    setSelectedPreset(preset)
    loadPresets()
  }

  const categories = Array.from(new Set(presets.map((p) => p.category)))

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Agent Presets</h1>
            <p className="text-sm text-[#888]">Pre-configured AI agents for specific tasks.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCategory('')}
              className={`h-8 ${category === '' ? 'bg-[#222] border-[#666]' : 'bg-[#0A0A0A] border-[#333]'}`}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="outline"
                size="sm"
                onClick={() => setCategory(cat)}
                className={`h-8 capitalize ${category === cat ? 'bg-[#222] border-[#666]' : 'bg-[#0A0A0A] border-[#333]'}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {presets.map((preset) => {
            const Icon = iconMap[preset.icon] || Bot
            return (
              <Card
                key={preset.id}
                className={`bg-[#0A0A0A] border-[#333] hover:border-[#444] transition-all cursor-pointer ${
                  selectedPreset?.id === preset.id ? 'border-blue-500' : ''
                }`}
                onClick={() => setSelectedPreset(preset)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#333] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#666]" />
                    </div>
                    {preset.isBuiltIn && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] font-normal">
                        Built-in
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base mt-3">{preset.name}</CardTitle>
                  <CardDescription className="text-xs">{preset.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="bg-[#111] border-[#333] text-[9px] font-normal capitalize">
                        {preset.category}
                      </Badge>
                      {preset.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-[#111] border-[#333] text-[9px] font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-[10px] text-[#666] space-y-1">
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span className="font-mono">{preset.modelSettings.temperature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Tokens:</span>
                        <span className="font-mono">{preset.modelSettings.maxTokens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Used:</span>
                        <span className="font-mono">{preset.useCount} times</span>
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUsePreset(preset)
                      }}
                      size="sm"
                      className="w-full h-8 text-xs"
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Use Preset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {selectedPreset && (
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="text-base">System Prompt Preview</CardTitle>
              <CardDescription>The following instructions will be sent to the AI model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-[#111] border border-[#222] rounded-md p-4 text-sm text-[#888] whitespace-pre-wrap font-mono">
                {selectedPreset.systemPrompt}
              </div>
            </CardContent>
          </Card>
        )}

        {presets.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <p className="text-sm text-[#666]">No presets available</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
