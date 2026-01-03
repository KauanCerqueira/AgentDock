import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '????' },
  { code: 'pt', name: 'Português', flag: '????' },
  { code: 'es', name: 'Español', flag: '????' },
  { code: 'fr', name: 'Français', flag: '????' },
  { code: 'zh', name: '??', flag: '????' },
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Language / Idioma / ??</label>
      <div className="grid grid-cols-1 gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
              i18n.language === lang.code || i18n.language.startsWith(lang.code)
                ? 'bg-[#222] border-[#666] text-foreground'
                : 'bg-[#111] border-[#333] text-[#888] hover:border-[#444]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {(i18n.language === lang.code || i18n.language.startsWith(lang.code)) && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
