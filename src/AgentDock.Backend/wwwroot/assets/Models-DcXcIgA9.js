import { r as reactExports, j as jsxRuntimeExports, t as toast } from "./index-yUZxNUXu.js";
import { c as createLucideIcon, l as cn, B as Button, X, e as Badge, H as HardDrive, j as Cpu, L as Layout, S as Search, C as Card } from "./card-Dttt0EL0.js";
import { P as Progress } from "./progress-DE_vT5PT.js";
import { D as Download } from "./download-DWbGc6fu.js";
import { Z as Zap } from "./zap-bUakK8Os.js";
import { S as Sparkles } from "./sparkles-CV0LTWr7.js";
import { A as ArrowRight } from "./arrow-right-D-ZisH7y.js";
const Award = createLucideIcon("Award", [
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }],
  ["path", { d: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11", key: "em7aur" }]
]);
const Calendar = createLucideIcon("Calendar", [
  [
    "rect",
    {
      width: "18",
      height: "18",
      x: "3",
      y: "4",
      rx: "2",
      ry: "2",
      key: "eu3xkr"
    }
  ],
  ["line", { x1: "16", x2: "16", y1: "2", y2: "6", key: "m3sa8f" }],
  ["line", { x1: "8", x2: "8", y1: "2", y2: "6", key: "18kwsl" }],
  ["line", { x1: "3", x2: "21", y1: "10", y2: "10", key: "xt86sb" }]
]);
const Heart = createLucideIcon("Heart", [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
]);
const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("relative overflow-auto", className),
    ...props,
    children
  }
));
ScrollArea.displayName = "ScrollArea";
function ModelDetailsDrawer({
  modelId,
  modelDetails,
  files,
  downloading,
  onClose,
  onDownload
}) {
  const getCompatibilityColor = (level) => {
    switch (level) {
      case "Excellent":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Good":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Adequate":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Poor":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Incompatible":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };
  const formatNumber = (num) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-y-0 right-0 w-[600px] bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mb-1", children: (modelDetails == null ? void 0 : modelDetails.modelName) || modelId.split("/").pop() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "por ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: (modelDetails == null ? void 0 : modelDetails.author) || modelId.split("/")[0] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatNumber((modelDetails == null ? void 0 : modelDetails.downloads) || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "downloads" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: (modelDetails == null ? void 0 : modelDetails.likes) || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "likes" })
        ] }),
        (modelDetails == null ? void 0 : modelDetails.lastModified) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: new Date(modelDetails.lastModified).toLocaleDateString("pt-BR") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollArea, { className: "flex-1 p-6", children: [
      (modelDetails == null ? void 0 : modelDetails.description) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4" }),
          "Descri��o"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: modelDetails.description })
      ] }),
      (modelDetails == null ? void 0 : modelDetails.tags) && modelDetails.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-2", children: "Tags" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: modelDetails.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: tag }, tag)) })
      ] }),
      ((modelDetails == null ? void 0 : modelDetails.pipeline_tag) || (modelDetails == null ? void 0 : modelDetails.library_name) || (modelDetails == null ? void 0 : modelDetails.license)) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-4 bg-muted/50 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Informa��es T�cnicas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          modelDetails.pipeline_tag && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tipo:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: modelDetails.pipeline_tag })
          ] }),
          modelDetails.library_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Framework:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: modelDetails.library_name })
          ] }),
          modelDetails.license && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Licen�a:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: modelDetails.license })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-4 h-4" }),
          "Arquivos GGUF Dispon�veis (",
          files.length,
          ")"
        ] }),
        files.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Nenhum arquivo GGUF encontrado" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: files.map((file) => {
          var _a, _b;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm mb-1 truncate", title: file.filename, children: file.filename }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: file.sizeFormatted }),
                    file.requirements && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "�" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-3 h-3" }),
                        file.requirements.recommendedRamGb,
                        "GB RAM"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "�" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: file.requirements.quantization })
                    ] })
                  ] })
                ] }) }),
                file.compatibility && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs ${getCompatibilityColor(file.compatibility.level)}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 mr-1" }),
                      file.compatibility.level,
                      " - ",
                      file.compatibility.performanceEstimate
                    ]
                  }
                ) }),
                downloading[file.filename] !== void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Baixando..." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                      downloading[file.filename].toFixed(0),
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: downloading[file.filename], className: "h-2" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "w-full",
                    onClick: () => onDownload(file.filename),
                    disabled: !((_a = file.compatibility) == null ? void 0 : _a.canRun),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
                      ((_b = file.compatibility) == null ? void 0 : _b.canRun) ? "Baixar Modelo" : "Hardware Incompat�vel"
                    ]
                  }
                )
              ]
            },
            file.filename
          );
        }) })
      ] })
    ] })
  ] });
}
function Models() {
  const [view, setView] = reactExports.useState("recommended");
  const [suggestions, setSuggestions] = reactExports.useState([]);
  const [hardwareInfo, setHardwareInfo] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [downloading, setDownloading] = reactExports.useState({});
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const [selectedModel, setSelectedModel] = reactExports.useState(null);
  const [modelFiles, setModelFiles] = reactExports.useState([]);
  const [showDetailsDrawer, setShowDetailsDrawer] = reactExports.useState(false);
  const [selectedModelDetails, setSelectedModelDetails] = reactExports.useState(null);
  reactExports.useEffect(() => {
    loadSuggestions();
  }, []);
  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/models/suggestions?limit=6");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setHardwareInfo(data.hardwareInfo || null);
    } catch (error) {
      console.error("Failed to load suggestions:", error);
      toast.error("N�o foi poss�vel carregar recomenda��es");
    } finally {
      setLoading(false);
    }
  };
  const searchHuggingFace = async (query) => {
    setLoading(true);
    setSearchResults([]);
    setSelectedModel(null);
    setModelFiles([]);
    try {
      const response = await fetch(`http://localhost:5000/api/models/search?query=${encodeURIComponent(query)}&limit=20`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data);
      if (data.length === 0) {
        toast.info("Nenhum modelo encontrado", {
          description: `Tente buscar por: llama, mistral, phi, qwen`
        });
      } else {
        toast.success(`${data.length} modelos encontrados`);
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Erro ao buscar modelos");
    } finally {
      setLoading(false);
    }
  };
  const viewModelDetails = async (modelId) => {
    setSelectedModel(modelId);
    setLoading(true);
    try {
      const [detailsResponse, filesResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/models/huggingface-details?modelId=${encodeURIComponent(modelId)}`),
        fetch(`http://localhost:5000/api/models/huggingface-files?modelId=${encodeURIComponent(modelId)}`)
      ]);
      if (!detailsResponse.ok || !filesResponse.ok) {
        throw new Error("Failed to fetch model data");
      }
      const details = await detailsResponse.json();
      const files = await filesResponse.json();
      setSelectedModelDetails(details);
      setModelFiles(files);
      setShowDetailsDrawer(true);
      if (files.length === 0) {
        toast.warning("Nenhum arquivo GGUF encontrado neste modelo");
      }
    } catch (error) {
      console.error("Failed to fetch model details:", error);
      toast.error("Erro ao carregar detalhes do modelo");
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async (filename) => {
    var _a, _b, _c, _d, _e;
    if (!selectedModel) {
      toast.error("Modelo n�o selecionado");
      return;
    }
    const file = modelFiles.find((f) => f.filename === filename);
    if (file) {
      if (file.compatibility && !file.compatibility.canRun) {
        toast.error("Hardware Incompat�vel", {
          description: `Este modelo requer ${(_a = file.requirements) == null ? void 0 : _a.minRamGb}GB RAM, voc� tem ${hardwareInfo == null ? void 0 : hardwareInfo.availableRamGb.toFixed(1)}GB dispon�vel`,
          duration: 5e3
        });
        return;
      }
      if (file.compatibility && file.compatibility.level === "Poor") {
        const confirmed = window.confirm(
          `?? ATEN��O: Hardware Inadequado!

Este modelo N�O � recomendado para seu hardware:

� Modelo: ${filename}
� Tamanho: ${file.sizeFormatted}
� RAM requerida: ${(_b = file.requirements) == null ? void 0 : _b.recommendedRamGb}GB
� RAM dispon�vel: ${hardwareInfo == null ? void 0 : hardwareInfo.availableRamGb.toFixed(1)}GB

Performance esperada:
${file.compatibility.performanceEstimate}

?? O modelo pode:
� Rodar MUITO LENTO (0.5-2 tokens/seg)
� Travar seu sistema
� Usar muita mem�ria swap
� Demorar 30+ segundos para responder

Deseja REALMENTE baixar mesmo assim?
(Recomendamos escolher um modelo menor)`
        );
        if (!confirmed) {
          toast.info("Download cancelado", {
            description: "Escolha um modelo compat�vel com seu hardware"
          });
          return;
        }
        toast.warning("Download iniciado com hardware inadequado", {
          description: "Performance ser� muito limitada",
          duration: 5e3
        });
      }
      if (file.compatibility && file.compatibility.level === "Adequate") {
        toast.warning("Hardware no Limite", {
          description: `Este modelo pode rodar lento. RAM: ${(_c = file.requirements) == null ? void 0 : _c.recommendedRamGb}GB requeridos, voc� tem ${hardwareInfo == null ? void 0 : hardwareInfo.availableRamGb.toFixed(1)}GB`,
          duration: 4e3
        });
      }
    }
    try {
      const response = await fetch("http://localhost:5000/api/models/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId: selectedModel, filename })
      });
      if (!response.ok) {
        const error = await response.json();
        if (error.error === "Espa�o insuficiente em disco") {
          toast.error("? Espa�o Insuficiente em Disco", {
            description: `Necess�rio: ${(_d = error.requiredGB) == null ? void 0 : _d.toFixed(1)}GB, Dispon�vel: ${(_e = error.availableGB) == null ? void 0 : _e.toFixed(1)}GB. Libere espa�o e tente novamente.`,
            duration: 8e3
          });
          return;
        }
        throw new Error(error.error || error.details || "Download failed");
      }
      const { downloadId } = await response.json();
      toast.success("Download iniciado!", {
        description: filename
      });
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`http://localhost:5000/api/models/download/${downloadId}`);
          if (!statusResponse.ok) {
            clearInterval(pollInterval);
            return;
          }
          const status = await statusResponse.json();
          setDownloading((prev) => ({
            ...prev,
            [filename]: status.percentComplete
          }));
          if (status.status === "Completed") {
            clearInterval(pollInterval);
            setDownloading((prev) => {
              const updated = { ...prev };
              delete updated[filename];
              return updated;
            });
            toast.success("Modelo pronto para usar!", {
              description: `${filename} foi baixado e est� dispon�vel`
            });
          } else if (status.status === "Failed" || status.status === "Cancelled") {
            clearInterval(pollInterval);
            setDownloading((prev) => {
              const updated = { ...prev };
              delete updated[filename];
              return updated;
            });
            if (status.status === "Failed") {
              toast.error("Download falhou", {
                description: status.errorMessage
              });
            }
          }
        } catch (err) {
          clearInterval(pollInterval);
        }
      }, 1e3);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erro ao iniciar download", {
        description: error.message || "Tente novamente"
      });
    }
  };
  const estimateModelSize = (modelId) => {
    const lower = modelId.toLowerCase();
    if (lower.includes("70b") || lower.includes("65b")) return "~40GB+";
    if (lower.includes("30b") || lower.includes("34b")) return "~20GB";
    if (lower.includes("13b") || lower.includes("14b")) return "~8GB";
    if (lower.includes("7b") || lower.includes("8b")) return "~4GB";
    if (lower.includes("3b") || lower.includes("2b")) return "~2GB";
    if (lower.includes("1b")) return "~1GB";
    return "~?GB";
  };
  const canRunModel = (sizeEstimate) => {
    if (!hardwareInfo) return false;
    const sizeGb = parseFloat(sizeEstimate.replace(/[^0-9.]/g, ""));
    if (isNaN(sizeGb)) return false;
    return hardwareInfo.availableRamGb >= sizeGb * 1.5;
  };
  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-500 bg-green-500/10 border-green-500/20";
    if (score >= 75) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    if (score >= 60) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-orange-500 bg-orange-500/10 border-orange-500/20";
  };
  const getCompatibilityColor = (level) => {
    switch (level) {
      case "Excellent":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Good":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Adequate":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Poor":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Incompatible":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "AI Models" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Modelos de IA otimizados para seu hardware" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: view === "recommended" ? "default" : "outline",
              size: "sm",
              onClick: () => setView("recommended"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 mr-2" }),
                "Recomendados"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: view === "browse" ? "default" : "outline",
              size: "sm",
              onClick: () => setView("browse"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 mr-2" }),
                "Explorar"
              ]
            }
          )
        ] })
      ] }),
      hardwareInfo && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-6 h-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-foreground", children: "Seu Hardware" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-1 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-3 h-3" }),
                hardwareInfo.availableRamGb.toFixed(1),
                "GB RAM"
              ] }),
              hardwareInfo.gpuName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
                hardwareInfo.gpuName
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-background/50", children: hardwareInfo.category })
      ] }) }),
      view === "recommended" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Modelos Recomendados para Voc�" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: loadSuggestions, children: "Atualizar" })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 bg-muted rounded" }) }, i)) }) : suggestions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 text-center border-yellow-500/20 bg-yellow-500/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-8 h-8 text-yellow-500" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-3 text-foreground", children: "Nenhum modelo recomendado para seu hardware" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm text-muted-foreground max-w-md mx-auto mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Seu hardware: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
                hardwareInfo == null ? void 0 : hardwareInfo.availableRamGb.toFixed(1),
                "GB RAM dispon�vel"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-yellow-500", children: "?? Modelos de IA geralmente precisam de pelo menos 8GB de RAM livre" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-4 bg-background/50 rounded-lg text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground mb-2", children: "Sugest�es:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "� Feche outros programas para liberar RAM" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "� Considere modelos menores (Q4 ou Q5)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "� Verifique se tem GPU com VRAM dispon�vel" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: loadSuggestions, variant: "outline", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 mr-2" }),
              "Atualizar"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setView("browse"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 mr-2" }),
              "Explorar Todos os Modelos"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: suggestions.map((suggestion, index) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 hover:border-primary/50 transition-all relative group", children: [
            index === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute top-4 right-4 bg-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-3 h-3 mr-1" }),
              "Top Pick"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: (_a = suggestion.modelId.split("/").pop()) == null ? void 0 : _a.replace(/-/g, " ") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: `text-xs ${getScoreColor(suggestion.score)}`, children: [
                    suggestion.score,
                    "/100"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: suggestion.reason }),
                suggestion.useCase && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary mt-1", children: [
                  "?? ",
                  suggestion.useCase
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Tamanho" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: suggestion.requirements.modelSize })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "RAM" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
                    suggestion.requirements.recommendedRamGb,
                    "GB"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Tipo" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono", children: suggestion.requirements.quantization })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 rounded-lg border ${getCompatibilityColor(suggestion.compatibility.level)}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium mb-1", children: suggestion.compatibility.level }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-80", children: suggestion.compatibility.performanceEstimate })
              ] }),
              downloading[suggestion.filename] !== void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Baixando..." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    downloading[suggestion.filename].toFixed(0),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: downloading[suggestion.filename], className: "h-2" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "w-full",
                  onClick: () => {
                    setSelectedModel(suggestion.modelId);
                    handleDownload(suggestion.filename);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
                    "Baixar Modelo"
                  ]
                }
              )
            ] })
          ] }, `${suggestion.modelId}-${suggestion.filename}`);
        }) })
      ] }),
      view === "browse" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4", children: "Buscar Modelos no HuggingFace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Digite o nome do modelo (ex: llama, mistral, phi)...",
                className: "flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    const query = e.target.value;
                    if (query.trim()) {
                      searchHuggingFace(query.trim());
                    }
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
              const input = document.querySelector('input[type="text"]');
              if (input == null ? void 0 : input.value.trim()) {
                searchHuggingFace(input.value.trim());
              }
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 mr-2" }),
              "Buscar"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Procure por modelos GGUF compat�veis com seu hardware" })
        ] }),
        searchResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Resultados da Busca" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: searchResults.map((result) => {
            var _a;
            const sizeEstimate = estimateModelSize(result.id);
            const canRun = canRunModel(sizeEstimate);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "p-6 hover:border-primary/50 transition-all cursor-pointer group",
                onClick: () => viewModelDetails(result.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-foreground group-hover:text-primary transition-colors", children: (_a = result.id.split("/").pop()) == null ? void 0 : _a.replace(/-/g, " ") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: `text-[10px] ${canRun ? "text-green-500 bg-green-500/10 border-green-500/20" : "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"}`,
                          children: canRun ? "? Compat�vel" : "? Verificar"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "por ",
                      result.id.split("/")[0]
                    ] })
                  ] }),
                  hardwareInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 bg-muted/50 rounded-lg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tamanho estimado:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: sizeEstimate })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "RAM necess�ria:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold", children: [
                        "~",
                        (parseFloat(sizeEstimate.replace(/[^0-9.]/g, "")) * 1.5).toFixed(1),
                        "GB"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Sua RAM livre:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-mono font-semibold ${canRun ? "text-green-500" : "text-yellow-500"}`, children: [
                        hardwareInfo.availableRamGb.toFixed(1),
                        "GB"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatNumber(result.downloads) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.likes || 0 })
                    ] }),
                    result.lastModified && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(result.lastModified).toLocaleDateString("pt-BR", { month: "short", day: "numeric" }) })
                    ] })
                  ] }),
                  result.tags && result.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                    result.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0", children: tag }, tag)),
                    result.tags.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0", children: [
                      "+",
                      result.tags.length - 3
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-primary group-hover:translate-x-1 transition-transform", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ver detalhes e arquivos" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                  ] })
                ] })
              },
              result.id
            );
          }) })
        ] })
      ] })
    ] }),
    showDetailsDrawer && selectedModel && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300",
          onClick: () => setShowDetailsDrawer(false)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ModelDetailsDrawer,
        {
          modelId: selectedModel,
          modelDetails: selectedModelDetails,
          files: modelFiles,
          downloading,
          onClose: () => setShowDetailsDrawer(false),
          onDownload: handleDownload
        }
      )
    ] })
  ] });
}
export {
  Models as default
};
//# sourceMappingURL=Models-DcXcIgA9.js.map
