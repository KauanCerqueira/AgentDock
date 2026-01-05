import { r as reactExports, u as useNavigate, j as jsxRuntimeExports } from "./index-yUZxNUXu.js";
import { L as Layout, B as Button, M as MessageSquare, C as Card, a as CardHeader, b as CardTitle, d as CardContent, e as Badge, A as Activity, f as CardDescription, g as BarChart3, h as Box, i as CheckCircle } from "./card-Dttt0EL0.js";
import { P as Progress } from "./progress-DE_vT5PT.js";
import { S as Server, D as Database } from "./server-BP5Ob3vg.js";
import { H as Hash } from "./hash-BXyOhM0g.js";
import { D as Download } from "./download-DWbGc6fu.js";
import { X as XCircle } from "./x-circle-BT3BP5Nu.js";
import { T as Terminal } from "./terminal-aDXRLsyi.js";
import { C as Clock } from "./clock-Cg291ZGl.js";
import { G as Gauge } from "./gauge-y8vPJSvj.js";
function Dashboard() {
  var _a, _b, _c, _d, _e;
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/stats");
        if (response.ok) setData(await response.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2e3);
    return () => clearInterval(interval);
  }, []);
  const formatNumber = (num) => num >= 1e6 ? `${(num / 1e6).toFixed(1)}M` : num >= 1e3 ? `${(num / 1e3).toFixed(1)}K` : num.toString();
  const formatBytes = (gb) => gb >= 1 ? `${gb.toFixed(1)} GB` : `${(gb * 1024).toFixed(0)} MB`;
  const formatTime = (ts) => {
    const diff = (Date.now() - new Date(ts).getTime()) / 1e3;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-500 p-6 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight text-foreground", children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Overview of your local AI infrastructure." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${(data == null ? void 0 : data.models.activeModel) ? "bg-green-500 animate-pulse" : "bg-yellow-500"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: (data == null ? void 0 : data.models.activeModel) ? "Engine Active" : "Engine Idle" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate("/chat"), className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" }),
          "New Chat"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Active Engine" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-4 w-4 text-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: "llama.cpp" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: (data == null ? void 0 : data.models.activeModel) ? "default" : "secondary", className: "text-[10px] h-5", children: (data == null ? void 0 : data.models.activeModel) || "No model loaded" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors cursor-pointer", onClick: () => navigate("/models"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Model Repository" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-4 w-4 text-blue-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: (data == null ? void 0 : data.models.installed) ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            formatBytes((data == null ? void 0 : data.models.storageGb) ?? 0),
            " used storage"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Total Tokens" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-4 w-4 text-purple-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: formatNumber((data == null ? void 0 : data.usage.totalTokensUsed) ?? 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "~",
            ((_a = data == null ? void 0 : data.usage.avgTokensPerMessage) == null ? void 0 : _a.toFixed(0)) ?? 0,
            " tokens/msg"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "System Load" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-green-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "CPU" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                (_b = data == null ? void 0 : data.system.cpuUsagePercent) == null ? void 0 : _b.toFixed(0),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: data == null ? void 0 : data.system.cpuUsagePercent, className: "h-1.5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "RAM" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                (_c = data == null ? void 0 : data.system.memoryUsagePercent) == null ? void 0 : _c.toFixed(0),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: data == null ? void 0 : data.system.memoryUsagePercent, className: "h-1.5 bg-secondary" })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Inference Activity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Requests volume over the last 24 hours" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] flex items-end gap-1 border-b border-border/50 pb-2 px-2", children: ((data == null ? void 0 : data.usageHistory.length) ?? 0) > 0 ? data == null ? void 0 : data.usageHistory.map((p, i) => {
              const max = Math.max(...(data == null ? void 0 : data.usageHistory.map((x) => x.tokensUsed)) ?? [1], 1);
              const height = Math.max(5, p.tokensUsed / max * 100);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative flex-1 flex items-end h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full bg-primary/20 hover:bg-primary/50 transition-all rounded-t-sm",
                    style: { height: `${height}%` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-popover text-popover-foreground text-xs p-2 rounded border shadow-lg whitespace-nowrap", children: [
                  p.requests,
                  " reqs | ",
                  formatNumber(p.tokensUsed),
                  " toks",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: new Date(p.timestamp).toLocaleTimeString() })
                ] })
              ] }, i);
            }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-muted-foreground text-sm", children: "No activity recorded yet" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-2 text-[10px] text-muted-foreground font-mono px-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "24h ago" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Now" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Recent Events" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: ((data == null ? void 0 : data.recentActivities.length) ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground text-sm", children: "No recent events" }) : data == null ? void 0 : data.recentActivities.slice(0, 5).map((activity) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-1 p-2 rounded-full border ${activity.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" : activity.type === "download" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-primary/10 border-primary/20 text-primary"}`, children: activity.type === "download" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }) : activity.type === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-3 h-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: activity.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: activity.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono block", children: formatTime(activity.timestamp) }),
              activity.tokensUsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "mt-1 text-[10px] h-4 px-1", children: [
                formatNumber(activity.tokensUsed),
                " toks"
              ] })
            ] })
          ] }, activity.id)) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Quick Actions" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "justify-start", onClick: () => navigate("/chat"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "mr-2 h-4 w-4" }),
              "Start Conversation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "justify-start", onClick: () => navigate("/models"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "mr-2 h-4 w-4" }),
              "Manage Models"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "justify-start", onClick: () => navigate("/downloads"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
              "Download New Models"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Performance Metrics" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Avg Response" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium", children: (data == null ? void 0 : data.usage.avgResponseTimeMs) ? `${(data.usage.avgResponseTimeMs / 1e3).toFixed(2)}s` : "-" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Success Rate" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-mono font-medium ${((data == null ? void 0 : data.usage.successRate) ?? 100) > 90 ? "text-green-500" : "text-yellow-500"}`, children: [
                (_d = data == null ? void 0 : data.usage.successRate) == null ? void 0 : _d.toFixed(1),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Total Messages" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium", children: formatNumber((data == null ? void 0 : data.usage.totalMessages) ?? 0) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-border mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Uptime" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                (_e = data == null ? void 0 : data.meta.uptimeHours) == null ? void 0 : _e.toFixed(1),
                "h"
              ] })
            ] }) })
          ] })
        ] }),
        (data == null ? void 0 : data.system.gpu) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-4 h-4" }),
            "GPU Status"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium truncate max-w-[150px]", children: data.system.gpu.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
                data.system.gpu.temperatureCelsius,
                "�C"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Usage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  data.system.gpu.usagePercent,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: data.system.gpu.usagePercent, className: "h-1.5 bg-secondary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "VRAM" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  data.system.gpu.memoryUsedGb.toFixed(1),
                  " / ",
                  data.system.gpu.memoryTotalGb.toFixed(1),
                  " GB"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: data.system.gpu.memoryUsedGb / data.system.gpu.memoryTotalGb * 100, className: "h-1.5 bg-secondary" })
            ] })
          ] }) })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  Dashboard as default
};
//# sourceMappingURL=Dashboard-CHtCwm24.js.map
