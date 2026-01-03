import { r as reactExports, t as toast, j as jsxRuntimeExports } from "./index-DyS2O7OR.js";
import { L as Layout, b as Button, H as HardDrive, k as CheckCircle, B as Badge } from "./Layout-DOD7-pon.js";
import { C as Card } from "./card-V4dOD_wf.js";
import { R as RefreshCw } from "./refresh-cw-DIz3S5iD.js";
import { D as Download } from "./download-DrUXQARq.js";
import { S as Sparkles, I as Info } from "./sparkles-Ra_XIpvK.js";
import { T as Trash2 } from "./trash-2-BTOCom2q.js";
import { A as AlertCircle } from "./alert-circle-Cu-kClYK.js";
function DownloadedModels() {
  const [models, setModels] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    loadModels();
  }, []);
  const loadModels = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/models/downloaded");
      const data = await response.json();
      setModels(data || []);
    } catch (error) {
      toast.error("Falha ao carregar modelos");
    } finally {
      setLoading(false);
    }
  };
  const getCompatibilityColor = (level) => {
    switch (level) {
      case "Excellent":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Good":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Adequate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Poor":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };
  const getCompatibilityIcon = (level) => {
    switch (level) {
      case "Excellent":
      case "Good":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4" });
      case "Adequate":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4" });
      case "Poor":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4" });
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    const diffHours = Math.floor(diffMs / 36e5);
    const diffDays = Math.floor(diffMs / 864e5);
    if (diffMins < 60) return `${diffMins} minutos atr�s`;
    if (diffHours < 24) return `${diffHours} horas atr�s`;
    if (diffDays < 7) return `${diffDays} dias atr�s`;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  };
  const totalSize = models.reduce((acc, m) => acc + m.sizeGb, 0);
  const readyModels = models.filter((m) => m.isReadyToUse).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Meus Modelos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Modelos baixados e prontos para usar" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: loadModels, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
        "Atualizar"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-6 h-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: models.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total de Modelos" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-6 h-6 text-green-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-500", children: readyModels }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Prontos para Usar" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-6 h-6 text-blue-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold", children: [
            totalSize.toFixed(1),
            " GB"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Espa�o Usado" })
        ] })
      ] }) })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 bg-muted rounded" }) }, i)) }) : models.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium mb-2", children: "Nenhum modelo baixado ainda" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Explore os modelos recomendados e baixe o ideal para voc�" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/models", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
        "Explorar Modelos"
      ] }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: models.map((model) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 hover:border-primary/50 transition-all group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: model.filename.replace(".gguf", "").replace(/-/g, " ") }),
            model.isReadyToUse && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500/10 text-green-500 border-green-500/20 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-3 h-3 mr-1" }),
              "Pronto"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Baixado ",
            formatDate(model.downloadedAt)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Tamanho" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
            model.sizeGb.toFixed(1),
            " GB"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "RAM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
            model.requirements.recommendedRamGb,
            " GB"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Tipo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: model.requirements.quantization })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 p-3 rounded-lg border ${getCompatibilityColor(model.compatibility.level)}`, children: [
        getCompatibilityIcon(model.compatibility.level),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: model.compatibility.level }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-80 truncate", children: model.compatibility.performanceEstimate })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-mono truncate", title: model.path, children: [
        "?? ",
        model.path
      ] }) })
    ] }) }, model.path)) })
  ] }) });
}
export {
  DownloadedModels as default
};
//# sourceMappingURL=DownloadedModels-BpqYWvQp.js.map
