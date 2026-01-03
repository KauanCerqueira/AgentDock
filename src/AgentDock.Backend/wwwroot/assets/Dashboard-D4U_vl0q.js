import { r as reactExports, j as jsxRuntimeExports } from "./index-DyS2O7OR.js";
import { c as createLucideIcon, a as api, L as Layout, b as Button, e as Box, B as Badge, A as Activity, C as Cpu, H as HardDrive } from "./Layout-DOD7-pon.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-V4dOD_wf.js";
import { T as Terminal } from "./terminal-CAcU7LJo.js";
import { Z as Zap } from "./zap-B6E0oIMH.js";
import { G as Gauge, W as Wifi } from "./wifi-BQiYzSA3.js";
import { C as Clock } from "./clock-xhbtV0eg.js";
const ArrowUpRight = createLucideIcon("ArrowUpRight", [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
]);
const GitCommitHorizontal = createLucideIcon("GitCommitHorizontal", [
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ["line", { x1: "3", x2: "9", y1: "12", y2: "12", key: "1dyftd" }],
  ["line", { x1: "15", x2: "21", y1: "12", y2: "12", key: "oup4p8" }]
]);
const Globe = createLucideIcon("Globe", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  [
    "path",
    { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }
  ],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
]);
function Dashboard() {
  const [models, setModels] = reactExports.useState([]);
  const [tasks, setTasks] = reactExports.useState([]);
  const [systemStats, setSystemStats] = reactExports.useState(null);
  reactExports.useEffect(() => {
    api.getModels().then(setModels);
    api.getTasks().then(setTasks);
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/system/stats");
        if (response.ok) {
          setSystemStats(await response.json());
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5e3);
    return () => clearInterval(interval);
  }, []);
  const activeModel = models.find((m) => m.isActive) || models[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Real-time overview of your local AI infrastructure." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-8 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3 mr-2" }),
          "Community"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "h-8 text-xs bg-foreground text-background hover:bg-[#CCC]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-3 h-3 mr-2" }),
          "New Session"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border hover:border-muted-foreground/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Model Repository" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-foreground", children: models.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "bg-[#111] border-[#333] text-[#888] text-[10px] h-5", children: [
              models.filter((m) => m.status === "Installed").length,
              " Installed"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#666]", children: "Local storage" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border hover:border-muted-foreground/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Task Throughput" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-foreground", children: tasks.filter((t) => t.status === "Completed").length }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-green-500 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-3 h-3 mr-1" }),
              "+12%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#666]", children: "vs last week" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border hover:border-muted-foreground/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "System Resources" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-foreground", children: systemStats ? `${systemStats.cpuUsagePercent.toFixed(0)}%` : "..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-[#222] h-1.5 rounded-full mt-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-green-500 h-full rounded-full transition-all duration-500",
              style: { width: `${(systemStats == null ? void 0 : systemStats.cpuUsagePercent) || 0}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-[#666] mt-1.5", children: systemStats ? `${systemStats.usedMemoryGb.toFixed(1)}GB / ${systemStats.totalMemoryGb.toFixed(1)}GB RAM` : "Loading..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border hover:border-muted-foreground/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Active Engine" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-foreground truncate", children: (activeModel == null ? void 0 : activeModel.name) || "Ollama" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#666]", children: "Inference Ready" })
          ] })
        ] })
      ] }),
      (systemStats == null ? void 0 : systemStats.gpuInfo) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border hover:border-muted-foreground/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "GPU Accelerator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
            systemStats.gpuInfo.usagePercent.toFixed(0),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-[#222] h-1.5 rounded-full mt-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-orange-500 h-full rounded-full transition-all duration-500",
              style: { width: `${systemStats.gpuInfo.usagePercent}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-[#666] mt-1.5", children: [
            systemStats.gpuInfo.memoryUsedGb.toFixed(1),
            "GB / ",
            systemStats.gpuInfo.memoryTotalGb.toFixed(1),
            "GB VRAM � ",
            systemStats.gpuInfo.temperatureCelsius.toFixed(0),
            "�C"
          ] })
        ] })
      ] }),
      (systemStats == null ? void 0 : systemStats.networkInfo) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border hover:border-muted-foreground/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Network Activity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
            systemStats.networkInfo.downloadSpeedMbps.toFixed(1),
            " Mbps"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-[#666]", children: [
                "? ",
                systemStats.networkInfo.downloadSpeedMbps.toFixed(1),
                " Mbps"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-purple-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-[#666]", children: [
                "? ",
                systemStats.networkInfo.uploadSpeedMbps.toFixed(1),
                " Mbps"
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-medium", children: "Resource Usage History" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Real-time monitoring of local inference performance." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] w-full flex items-end gap-1 pt-4 border-b border-[#222] pb-2", children: Array.from({ length: 40 }).map((_, i) => {
              const height = Math.max(10, Math.random() * 100);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 bg-[#222] hover:bg-[#444] transition-colors rounded-t-sm",
                  style: { height: `${height}%` }
                },
                i
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-2 text-[10px] text-[#666] font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1 hour ago" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Now" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-foreground", children: "Recent Activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 text-xs text-[#888]", children: "View All" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-[#333] bg-[#0A0A0A] overflow-hidden", children: tasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-8 h-8 text-[#333] mx-auto mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#666]", children: "No recent activity found." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-[#222]", children: tasks.slice(0, 5).map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 hover:bg-[#111] transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-8 rounded flex items-center justify-center border border-[#333] bg-[#111]`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-4 h-4 text-[#666]" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground group-hover:text-white transition-colors", children: task.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#666] font-mono", children: task.id.substring(0, 8) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#444]", children: "�" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#666] capitalize", children: task.type })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#666] font-mono", children: new Date(task.createdAt).toLocaleTimeString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-[#111] border-[#333] text-[#888] text-[10px] font-normal w-20 justify-center", children: task.status })
            ] })
          ] }, task.id)) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Quick Start" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start h-10 bg-[#111] border-[#333] hover:bg-[#222] text-[#888] hover:text-foreground transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-4 h-4 mr-3" }),
              "Start Chat Session"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start h-10 bg-[#111] border-[#333] hover:bg-[#222] text-[#888] hover:text-foreground transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "w-4 h-4 mr-3" }),
              "Install New Model"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start h-10 bg-[#111] border-[#333] hover:bg-[#222] text-[#888] hover:text-foreground transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GitCommitHorizontal, { className: "w-4 h-4 mr-3" }),
              "Index Repository"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Storage Status" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#888]", children: "Models" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "12.4 GB" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-[#222] h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500 h-full rounded-full w-[45%]" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#888]", children: "Vector Index" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "2.1 GB" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-[#222] h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-purple-500 h-full rounded-full w-[15%]" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-[#222] flex items-center gap-2 text-xs text-[#666]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "14.5 GB Total Used" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-gradient-to-br from-[#111] to-[#000] border border-[#333] p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-yellow-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Pro Tip" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#888] leading-relaxed", children: "Connect your local repositories in the Workspaces tab to enable context-aware coding assistance." })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  Dashboard as default
};
//# sourceMappingURL=Dashboard-D4U_vl0q.js.map
