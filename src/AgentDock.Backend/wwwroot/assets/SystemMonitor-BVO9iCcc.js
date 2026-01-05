import { r as reactExports, j as jsxRuntimeExports } from "./index-JhHsEzq0.js";
import { c as createLucideIcon, L as Layout, C as Card, d as CardContent, a as CardHeader, b as CardTitle, j as Cpu, A as Activity, H as HardDrive, f as CardDescription } from "./card-UbwErUzG.js";
import { P as Progress } from "./progress-DRwZIBpN.js";
import { A as AlertCircle } from "./alert-circle-B2Z5BQkT.js";
import { S as Server, D as Database } from "./server-CnZ_8Qkl.js";
import { G as Gauge } from "./gauge-Do5u4E2n.js";
import { W as Wifi } from "./wifi-DMqGTIBZ.js";
import { T as Terminal } from "./terminal-5AwkDpTk.js";
const Thermometer = createLucideIcon("Thermometer", [
  ["path", { d: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z", key: "17jzev" }]
]);
function SystemMonitor() {
  const [stats, setStats] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/system/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      } else {
        const errorText = await response.text();
        setError(`Server returned ${response.status}: ${errorText}`);
      }
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2e3);
    return () => clearInterval(interval);
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading system stats..." })
    ] }) }) });
  }
  if (error || !stats) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "System Monitor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-red-500/50 bg-red-950/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-8 w-8 text-red-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-red-500", children: "Failed to load system stats" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: error || "Unable to connect to the backend API" })
        ] })
      ] }) }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "System Monitor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#888]", children: "Real-time performance metrics and resource usage." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-[#666] font-mono bg-[#111] px-3 py-1 rounded border border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-3 h-3" }),
        stats.osDescription
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "CPU Usage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4 text-[#666]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
            stats.cpuUsagePercent.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: stats.cpuUsagePercent, className: "h-1.5 mt-3 bg-[#222]", indicatorClassName: "bg-blue-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#666] mt-2", children: [
            stats.processCount,
            " active processes"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "Memory Usage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-[#666]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
            stats.usedMemoryGb.toFixed(1),
            " GB"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: stats.usedMemoryGb / stats.totalMemoryGb * 100, className: "h-1.5 mt-3 bg-[#222]", indicatorClassName: "bg-purple-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#666] mt-2", children: [
            "of ",
            stats.totalMemoryGb.toFixed(1),
            " GB Total"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "Available RAM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-4 w-4 text-[#666]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
            stats.availableMemoryGb.toFixed(1),
            " GB"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: stats.availableMemoryGb / stats.totalMemoryGb * 100, className: "h-1.5 mt-3 bg-[#222]", indicatorClassName: "bg-green-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#666] mt-2", children: "Free memory" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "System Uptime" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-4 w-4 text-[#666]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-foreground truncate text-sm pt-1", children: stats.upTime }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 mt-3 w-full bg-[#222] rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-yellow-500 w-full animate-pulse" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#666] mt-2", children: [
            stats.architecture,
            " Architecture"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      stats.gpuInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-5 h-5 text-[#666]" }),
            "GPU Accelerator"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: stats.gpuInfo.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#888]", children: "GPU Core Load" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                stats.gpuInfo.usagePercent.toFixed(1),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: stats.gpuInfo.usagePercent, className: "h-2 bg-[#222]", indicatorClassName: "bg-orange-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#888]", children: "VRAM Usage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                stats.gpuInfo.memoryUsedGb.toFixed(1),
                " GB / ",
                stats.gpuInfo.memoryTotalGb.toFixed(1),
                " GB"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: stats.gpuInfo.memoryUsagePercent, className: "h-2 bg-[#222]", indicatorClassName: stats.gpuInfo.memoryUsagePercent > 90 ? "bg-red-500" : "bg-blue-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-[#111] border border-[#222]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Thermometer, { className: "w-4 h-4 text-[#666]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-[#888]", children: "Temperature" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-medium", children: [
              stats.gpuInfo.temperatureCelsius.toFixed(0),
              "�C"
            ] })
          ] })
        ] })
      ] }),
      stats.networkInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "w-5 h-5 text-[#666]" }),
            "Network Activity"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Real-time bandwidth monitoring." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-blue-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#888]", children: "Download Speed" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                stats.networkInfo.downloadSpeedMbps.toFixed(2),
                " Mbps"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: Math.min(stats.networkInfo.downloadSpeedMbps / 10, 100), className: "h-2 bg-[#222]", indicatorClassName: "bg-blue-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-purple-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#888]", children: "Upload Speed" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                stats.networkInfo.uploadSpeedMbps.toFixed(2),
                " Mbps"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: Math.min(stats.networkInfo.uploadSpeedMbps / 10, 100), className: "h-2 bg-[#222]", indicatorClassName: "bg-purple-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-[#111] border border-[#222]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[#666] mb-1", children: "Total Downloaded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm font-medium", children: [
                stats.networkInfo.totalDownloadedGb.toFixed(2),
                " GB"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-[#111] border border-[#222]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[#666] mb-1", children: "Total Uploaded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm font-medium", children: [
                stats.networkInfo.totalUploadedGb.toFixed(2),
                " GB"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-5 h-5 text-[#666]" }),
            "Storage Status"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Local disk usage and capacity." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-6", children: stats.disks.map((disk) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-4 h-4 text-[#666]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: disk.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#888]", children: [
              disk.usedSpaceGb.toFixed(1),
              " GB / ",
              disk.totalSizeGb.toFixed(1),
              " GB"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: disk.usagePercent, className: "h-2 bg-[#222]", indicatorClassName: disk.usagePercent > 90 ? "bg-red-500" : "bg-blue-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-[#666]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              disk.usagePercent.toFixed(1),
              "% Used"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              disk.freeSpaceGb.toFixed(1),
              " GB Free"
            ] })
          ] })
        ] }, disk.name)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-5 h-5 text-[#666]" }),
            "Top Memory Processes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Processes consuming the most RAM." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: stats.topProcesses.map((proc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-[#111] border border-[#222]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded bg-[#222] flex items-center justify-center text-xs font-mono text-[#888]", children: proc.name.substring(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm text-foreground", children: proc.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-[#666]", children: [
                "PID: ",
                proc.id
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm text-foreground", children: [
              proc.memoryMb.toFixed(0),
              " MB"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[#666]", children: "RAM" })
          ] })
        ] }, proc.id)) }) })
      ] })
    ] })
  ] }) });
}
export {
  SystemMonitor as default
};
//# sourceMappingURL=SystemMonitor-BVO9iCcc.js.map
