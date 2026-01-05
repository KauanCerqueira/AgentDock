import { r as reactExports, t as toast, j as jsxRuntimeExports } from "./index-JhHsEzq0.js";
import { c as createLucideIcon, L as Layout, C as Card, a as CardHeader, b as CardTitle, f as CardDescription, d as CardContent, B as Button, m as Bell, i as CheckCircle, n as Settings, e as Badge } from "./card-UbwErUzG.js";
import { I as Input } from "./input-DSubU1iQ.js";
import { D as Download } from "./download-DRfTPwKs.js";
import { F as FolderOpen } from "./folder-open-g_7sskF_.js";
import { X as XCircle } from "./x-circle-UMFxkjuB.js";
const Loader = createLucideIcon("Loader", [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "6", key: "gza1u7" }],
  ["line", { x1: "12", x2: "12", y1: "18", y2: "22", key: "1qhbu9" }],
  ["line", { x1: "4.93", x2: "7.76", y1: "4.93", y2: "7.76", key: "xae44r" }],
  [
    "line",
    { x1: "16.24", x2: "19.07", y1: "16.24", y2: "19.07", key: "bxnmvf" }
  ],
  ["line", { x1: "2", x2: "6", y1: "12", y2: "12", key: "89khin" }],
  ["line", { x1: "18", x2: "22", y1: "12", y2: "12", key: "pb8tfm" }],
  ["line", { x1: "4.93", x2: "7.76", y1: "19.07", y2: "16.24", key: "1uxjnu" }],
  ["line", { x1: "16.24", x2: "19.07", y1: "7.76", y2: "4.93", key: "6duxfx" }]
]);
function DownloadSettings() {
  const [settings, setSettings] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [customFolder, setCustomFolder] = reactExports.useState("");
  reactExports.useEffect(() => {
    loadSettings();
  }, []);
  const loadSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/downloadsettings");
      const data = await response.json();
      setSettings(data);
      setCustomFolder(data.downloadPath);
    } catch (error) {
      toast.error("Falha ao carregar configura��es");
    } finally {
      setLoading(false);
    }
  };
  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await fetch("http://localhost:5000/api/downloadsettings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          downloadPath: customFolder
        })
      });
      toast.success("? Configura��es salvas com sucesso!");
      await loadSettings();
    } catch (error) {
      toast.error("? Erro ao salvar configura��es");
    } finally {
      setSaving(false);
    }
  };
  const handleChooseFolder = async () => {
    toast.info("?? Cole o caminho da pasta no campo abaixo", {
      description: "Exemplo: C:\\Users\\SeuNome\\Documents\\Models"
    });
  };
  const applyCustomFolder = async () => {
    if (!customFolder) {
      toast.error("Digite um caminho v�lido");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/downloadsettings/choose-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: customFolder })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("? Pasta de download atualizada!");
        await loadSettings();
      } else {
        toast.error(data.error || "Erro ao atualizar pasta");
      }
    } catch (error) {
      toast.error("? Erro ao atualizar pasta");
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-8 h-8 animate-spin text-muted-foreground" }) }) });
  }
  if (!settings) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Erro ao carregar configura��es" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between border-b border-border pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-6 h-6" }),
        "Configura��es de Download"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Personalize como os modelos s�o baixados e gerenciados" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-4 h-4" }),
          "Pasta de Download"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Local onde os modelos GGUF ser�o salvos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: customFolder,
              onChange: (e) => setCustomFolder(e.target.value),
              placeholder: "C:\\Users\\SeuNome\\Documents\\Models",
              className: "flex-1 bg-background border-border text-foreground"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleChooseFolder, variant: "outline", size: "sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-4 h-4 mr-1" }),
            "Ajuda"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: applyCustomFolder, size: "sm", children: "Aplicar" })
        ] }),
        settings.customPath && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-muted rounded-lg border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Pasta atual:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-foreground", children: settings.downloadPath })
        ] }),
        !settings.customPath && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-blue-500/10 rounded-lg border border-blue-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-400", children: "?? Usando pasta padr�o do sistema" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4" }),
          "Notifica��es"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Controle quando voc� quer ser notificado" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4 text-green-500" }),
              "Download Completo"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Notificar quando um modelo terminar de baixar" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSettings({ ...settings, notifyOnComplete: !settings.notifyOnComplete }),
              className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifyOnComplete ? "bg-primary" : "bg-muted"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${settings.notifyOnComplete ? "translate-x-6" : "translate-x-1"}`
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { className: "w-4 h-4 text-red-500" }),
              "Erro no Download"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Notificar quando houver um erro" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSettings({ ...settings, notifyOnError: !settings.notifyOnError }),
              className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifyOnError ? "bg-primary" : "bg-muted"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${settings.notifyOnError ? "translate-x-6" : "translate-x-1"}`
                }
              )
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4" }),
          "Op��es Avan�adas"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configura��es para usu�rios avan�ados" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Carregar Automaticamente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Tentar carregar o modelo no llama.cpp ap�s o download" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSettings({ ...settings, autoLoadAfterDownload: !settings.autoLoadAfterDownload }),
              className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoLoadAfterDownload ? "bg-primary" : "bg-muted"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${settings.autoLoadAfterDownload ? "translate-x-6" : "translate-x-1"}`
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Downloads Simult�neos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Quantidade m�xima de downloads paralelos" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-background", children: settings.maxConcurrentDownloads })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveSettings, disabled: saving, size: "lg", children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-4 h-4 mr-2 animate-spin" }),
      "Salvando..."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4 mr-2" }),
      "Salvar Configura��es"
    ] }) }) })
  ] }) });
}
export {
  DownloadSettings as default
};
//# sourceMappingURL=DownloadSettings-BqbfTkZi.js.map
