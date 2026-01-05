import { r as reactExports, t as toast, j as jsxRuntimeExports } from "./index-yUZxNUXu.js";
import { L as Layout, B as Button, M as MessageSquare, C as Card, H as HardDrive, i as CheckCircle, e as Badge, P as Play } from "./card-Dttt0EL0.js";
import { R as RefreshCw } from "./refresh-cw-DLbH_uK9.js";
import { D as Download } from "./download-DWbGc6fu.js";
import { S as Sparkles } from "./sparkles-CV0LTWr7.js";
import { T as Trash2 } from "./trash-2-tNBXIEbb.js";
function DownloadedModels() {
  const [models, setModels] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [deleting, setDeleting] = reactExports.useState(null);
  reactExports.useEffect(() => {
    loadModels();
  }, []);
  const loadModels = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/models/downloaded");
      setModels(await res.json() || []);
    } catch {
      toast.error("Falha ao carregar modelos");
    } finally {
      setLoading(false);
    }
  };
  const deleteModel = async (filename) => {
    if (!confirm(`Excluir "${filename}"?

Essa a��o n�o pode ser desfeita.`)) return;
    setDeleting(filename);
    try {
      const res = await fetch(`http://localhost:5000/api/models/delete/${encodeURIComponent(filename)}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Modelo exclu�do");
        loadModels();
      } else {
        const e = await res.json();
        toast.error("Erro", { description: e.details });
      }
    } catch {
      toast.error("Erro ao conectar");
    } finally {
      setDeleting(null);
    }
  };
  const getColor = (level) => {
    const l = String(level);
    if (l === "0" || l === "Excellent") return "bg-green-500/10 text-green-500 border-green-500/20";
    if (l === "1" || l === "Good") return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (l === "2" || l === "Adequate") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  };
  const getLabel = (level) => {
    const l = String(level);
    if (l === "0" || l === "Excellent") return "Excelente";
    if (l === "1" || l === "Good") return "Bom";
    if (l === "2" || l === "Adequate") return "Adequado";
    return "Limitado";
  };
  const totalSize = models.reduce((a, m) => a + m.sizeGb, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Meus Modelos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Modelos baixados e prontos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: loadModels, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
          "Atualizar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => window.location.hash = "/chat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4 mr-2" }),
          "Chat"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-6 h-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: models.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Modelos" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-6 h-6 text-green-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-500", children: models.filter((m) => m.isReadyToUse).length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Prontos" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-6 h-6 text-blue-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold", children: [
            totalSize.toFixed(1),
            " GB"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Usado" })
        ] })
      ] }) })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: "Carregando..." }) : models.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium mb-2", children: "Nenhum modelo baixado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => window.location.hash = "/models", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
        "Explorar"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: models.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 hover:border-primary/50 transition-all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: m.filename.replace(".gguf", "") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500/10 text-green-500 text-xs mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-3 h-3 mr-1" }),
            "Pronto"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive", onClick: () => deleteModel(m.filename), disabled: deleting === m.filename, children: deleting === m.filename ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Tamanho" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
            m.sizeGb.toFixed(2),
            " GB"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "RAM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
            m.requirements.recommendedRamGb,
            " GB"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 p-3 rounded-lg border mb-4 ${getColor(m.compatibility.level)}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: getLabel(m.compatibility.level) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-80", children: m.compatibility.performanceEstimate })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full", onClick: () => window.location.hash = "/chat", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 mr-2" }),
        "Usar no Chat"
      ] })
    ] }, m.path)) })
  ] }) });
}
export {
  DownloadedModels as default
};
//# sourceMappingURL=DownloadedModels-D756FERa.js.map
