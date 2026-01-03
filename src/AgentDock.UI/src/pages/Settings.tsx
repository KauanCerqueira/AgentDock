import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Bell, Palette, Keyboard, Sliders } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import LanguageSelector from '@/components/LanguageSelector'
import { api } from '@/api/client'
import { UserSettings } from '@/types'

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getSettings().then(setSettings).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    try {
      await api.updateSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    if (settings) {
      setSettings({ ...settings, [key]: value })
    }
  }

  if (loading || !settings) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
            <p className="text-sm text-[#888]">Customize your AgentDock experience.</p>
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm" className="h-8 text-xs">
            <Save className="w-3 h-3 mr-2" />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Appearance */}
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="w-4 h-4 text-[#666]" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the visual appearance of the interface.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {['dark', 'light', 'system'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSetting('theme', theme)}
                      className={`p-3 rounded-lg border text-sm capitalize transition-all ${
                        settings.theme === theme
                          ? 'bg-[#222] border-[#666] text-foreground'
                          : 'bg-[#111] border-[#333] text-[#888] hover:border-[#444]'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <LanguageSelector />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="w-4 h-4 text-[#666]" />
                Notifications
              </CardTitle>
              <CardDescription>Configure notification preferences and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Desktop Notifications</div>
                  <div className="text-xs text-[#666]">Show system notifications for important events</div>
                </div>
                <button
                  onClick={() => updateSetting('desktopNotifications', !settings.desktopNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.desktopNotifications ? 'bg-blue-500' : 'bg-[#333]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.desktopNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#222]">
                <div className="text-xs font-medium text-[#666] uppercase tracking-wider">Notify me when</div>
                {Object.entries(settings.notificationPreferences).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <button
                      onClick={() =>
                        updateSetting('notificationPreferences', {
                          ...settings.notificationPreferences,
                          [key]: !enabled,
                        })
                      }
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        enabled ? 'bg-blue-500' : 'bg-[#333]'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Settings */}
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sliders className="w-4 h-4 text-[#666]" />
                Model Preferences
              </CardTitle>
              <CardDescription>Default parameters for AI model inference.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temperature</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={settings.modelSettings.temperature}
                      onChange={(e) =>
                        updateSetting('modelSettings', {
                          ...settings.modelSettings,
                          temperature: parseFloat(e.target.value),
                        })
                      }
                      className="bg-[#111] border-[#333] h-9 text-sm"
                    />
                    <Badge variant="outline" className="bg-[#111] border-[#333] text-[10px] font-mono">
                      {settings.modelSettings.temperature}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Tokens</label>
                  <Input
                    type="number"
                    step="256"
                    min="256"
                    max="8192"
                    value={settings.modelSettings.maxTokens}
                    onChange={(e) =>
                      updateSetting('modelSettings', {
                        ...settings.modelSettings,
                        maxTokens: parseInt(e.target.value),
                      })
                    }
                    className="bg-[#111] border-[#333] h-9 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Top P</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={settings.modelSettings.topP}
                    onChange={(e) =>
                      updateSetting('modelSettings', {
                        ...settings.modelSettings,
                        topP: parseFloat(e.target.value),
                      })
                    }
                    className="bg-[#111] border-[#333] h-9 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Top K</label>
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    max="100"
                    value={settings.modelSettings.topK}
                    onChange={(e) =>
                      updateSetting('modelSettings', {
                        ...settings.modelSettings,
                        topK: parseInt(e.target.value),
                      })
                    }
                    className="bg-[#111] border-[#333] h-9 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Keyboard className="w-4 h-4 text-[#666]" />
                Keyboard Shortcuts
              </CardTitle>
              <CardDescription>Customize keyboard shortcuts for quick actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(settings.keyBindings).map(([action, binding]) => (
                  <div key={action} className="flex items-center justify-between p-3 rounded-lg bg-[#111] border border-[#222]">
                    <span className="text-sm capitalize">{action.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Badge variant="outline" className="bg-[#0A0A0A] border-[#333] font-mono text-xs">
                      {binding}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System */}
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <SettingsIcon className="w-4 h-4 text-[#666]" />
                System
              </CardTitle>
              <CardDescription>System-level preferences and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Auto Update</div>
                  <div className="text-xs text-[#666]">Automatically install updates when available</div>
                </div>
                <button
                  onClick={() => updateSetting('autoUpdate', !settings.autoUpdate)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoUpdate ? 'bg-blue-500' : 'bg-[#333]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoUpdate ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
