import { r as reactExports, j as jsxRuntimeExports, t as toast } from "./index-yUZxNUXu.js";
import { L as Layout, B as Button, C as Card, i as CheckCircle, H as HardDrive, e as Badge, X } from "./card-Dttt0EL0.js";
import { P as Progress } from "./progress-DE_vT5PT.js";
import { R as RefreshCw } from "./refresh-cw-DLbH_uK9.js";
import { D as Download } from "./download-DWbGc6fu.js";
import { T as Trash2 } from "./trash-2-tNBXIEbb.js";
import { A as AlertCircle } from "./alert-circle-CX46wMop.js";
import { C as Clock } from "./clock-Cg291ZGl.js";
import { P as Pause } from "./pause-Bs6B1b8g.js";
function DownloadManager() {
  const [downloads, setDownloads] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [diskSpace, setDiskSpace] = reactExports.useState(null);
  reactExports.useEffect(() => {
    loadDownloads();
    loadDiskSpace();
    const interval = setInterval(loadDownloads, 2e3);
    return () => clearInterval(interval);
  }, []);
  const loadDownloads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/models/downloads/all");
      if (response.ok) {
        const data = await response.json();
        setDownloads(data);
      }
    } catch (error) {
      console.error("Failed to load downloads:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadDiskSpace = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/models/disk-space");
      if (response.ok) {
        const data = await response.json();
        setDiskSpace(data);
      }
    } catch (error) {
      console.error("Failed to load disk space:", error);
    }
  };
  const cancelDownload = async (downloadId) => {
    try {
      await fetch(`http://localhost:5000/api/models/download/${downloadId}/cancel`, { method: "POST" });
      toast.success("Download cancelado");
      loadDownloads();
    } catch (error) {
      toast.error("Erro ao cancelar download");
    }
  };
  const removeDownload = async (downloadId) => {
    try {
      await fetch(`http://localhost:5000/api/models/download/${downloadId}`, { method: "DELETE" });
      toast.success("Download removido");
      loadDownloads();
    } catch (error) {
      toast.error("Erro ao remover download");
    }
  };
  const retryDownload = async (download) => {
    try {
      await fetch("http://localhost:5000/api/models/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId: download.modelId, filename: download.filename })
      });
      toast.success("Download reiniciado");
      loadDownloads();
    } catch (error) {
      toast.error("Erro ao reiniciar download");
    }
  };
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };
  const formatSpeed = (mbps) => {
    if (mbps < 1) return `${(mbps * 1024).toFixed(0)} KB/s`;
    return `${mbps.toFixed(1)} MB/s`;
  };
  const formatETA = (download) => {
    if (download.speedMBps <= 0 || download.status !== "Downloading") return "--";
    const remainingBytes = download.totalBytes - download.downloadedBytes;
    const remainingSeconds = remainingBytes / (download.speedMBps * 1024 * 1024);
    if (remainingSeconds < 60) return `${Math.ceil(remainingSeconds)}s`;
    if (remainingSeconds < 3600) return `${Math.ceil(remainingSeconds / 60)}min`;
    return `${(remainingSeconds / 3600).toFixed(1)}h`;
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "Downloading":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 text-blue-500 animate-pulse" });
      case "Completed":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4 text-green-500" });
      case "Failed":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-4 h-4 text-red-500" });
      case "Queued":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-yellow-500" });
      case "Paused":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4 text-orange-500" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-gray-500" });
    }
  };
  const getStatusBadge = (status) => {
    const variants = {
      "Downloading": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Completed": "bg-green-500/10 text-green-500 border-green-500/20",
      "Failed": "bg-red-500/10 text-red-500 border-red-500/20",
      "Queued": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    };
    return variants[status] || variants["Queued"];
  };
  const activeDownloads = downloads.filter((d) => d.status === "Downloading" || d.status === "Queued");
  const completedDownloads = downloads.filter((d) => d.status === "Completed");
  const failedDownloads = downloads.filter((d) => d.status === "Failed" || d.status === "Cancelled");
  const totalSpeed = activeDownloads.reduce((acc, d) => acc + d.speedMBps, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Downloads" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Gerencie seus downloads de modelos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: loadDownloads, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
        "Atualizar"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-5 h-5 text-blue-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Ativos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: activeDownloads.length })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Conclu�dos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: completedDownloads.length })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-5 h-5 text-purple-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Espa�o Livre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: diskSpace ? `${diskSpace.available.toFixed(1)} GB` : "--" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-5 h-5 text-cyan-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Velocidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: formatSpeed(totalSpeed) })
        ] })
      ] }) })
    ] }),
    activeDownloads.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-5 h-5 text-blue-500" }),
        "Downloads em Andamento"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: activeDownloads.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border-blue-500/20 bg-blue-500/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            getStatusIcon(d.status),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-foreground", children: d.filename }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: d.modelId })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: getStatusBadge(d.status), children: d.status === "Downloading" ? "Baixando" : "Na Fila" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => cancelDownload(d.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-red-500" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: d.percentComplete, className: "h-2 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            formatBytes(d.downloadedBytes),
            " / ",
            formatBytes(d.totalBytes)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            d.percentComplete.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatSpeed(d.speedMBps) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "ETA: ",
            formatETA(d)
          ] })
        ] })
      ] }, d.id)) })
    ] }),
    completedDownloads.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }),
        "Conclu�dos"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: completedDownloads.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 border-green-500/20 bg-green-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          getStatusIcon(d.status),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-foreground", children: d.filename }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              formatBytes(d.totalBytes),
              " � Pronto para usar"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => removeDownload(d.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-muted-foreground" }) })
      ] }) }, d.id)) })
    ] }),
    failedDownloads.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-5 h-5 text-red-500" }),
        "Falhas"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: failedDownloads.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 border-red-500/20 bg-red-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          getStatusIcon(d.status),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-foreground", children: d.filename }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500", children: d.errorMessage || "Download cancelado" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => retryDownload(d), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-1" }),
            "Tentar Novamente"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => removeDownload(d.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-muted-foreground" }) })
        ] })
      ] }) }, d.id)) })
    ] }),
    downloads.length === 0 && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-12 h-12 mx-auto text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Nenhum download" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 mb-4", children: "V� para Models para baixar um modelo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => window.location.href = "#/models", children: "Explorar Modelos" })
    ] })
  ] }) });
}
export {
  DownloadManager as default
};
//# sourceMappingURL=DownloadManager-DcHfUP03.js.map
