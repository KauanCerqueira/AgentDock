import { r as reactExports, j as jsxRuntimeExports } from "./index-DyS2O7OR.js";
import { L as Layout, C as Cpu, H as HardDrive, A as Activity, a as api } from "./Layout-DOD7-pon.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-V4dOD_wf.js";
import { G as Gauge, W as Wifi } from "./wifi-BQiYzSA3.js";
function Analytics() {
  const [metrics, setMetrics] = reactExports.useState([]);
  const [timeRange, setTimeRange] = reactExports.useState(60);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchMetrics = async () => {
      const data = await api.getPerformanceMetrics(timeRange);
      setMetrics(data);
      setLoading(false);
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5e3);
    return () => clearInterval(interval);
  }, [timeRange]);
  const getAverage = (key) => {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m[key], 0);
    return sum / metrics.length;
  };
  const getMax = (key) => {
    if (metrics.length === 0) return 0;
    return Math.max(...metrics.map((m) => m[key]));
  };
  const renderChart = (data, label, color) => {
    var _a;
    const max = Math.max(...data, 1);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-[#666]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: ((_a = data[data.length - 1]) == null ? void 0 : _a.toFixed(1)) || 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 flex items-end gap-0.5", children: data.map((value, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex-1 rounded-t-sm ${color} transition-all`,
          style: { height: `${value / max * 100}%`, minHeight: "2px" }
        },
        i
      )) })
    ] });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" }) }) });
  }
  const cpuData = metrics.map((m) => m.cpuUsage);
  const memoryData = metrics.map((m) => m.memoryUsage);
  const gpuData = metrics.map((m) => m.gpuUsage);
  const networkDownData = metrics.map((m) => m.networkDownload);
  const networkUpData = metrics.map((m) => m.networkUpload);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Performance Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#888]", children: "Monitor system performance and resource usage over time." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [15, 60, 240, 720].map((minutes) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setTimeRange(minutes),
          className: `px-3 py-1 rounded text-xs transition-all ${timeRange === minutes ? "bg-foreground text-background" : "bg-[#111] text-[#888] border border-[#333] hover:border-[#666]"}`,
          children: minutes < 60 ? `${minutes}m` : `${minutes / 60}h`
        },
        minutes
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "Avg CPU" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4 text-[#666]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
            getAverage("cpuUsage").toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#666] mt-1", children: [
            "Peak: ",
            getMax("cpuUsage").toFixed(1),
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "Avg Memory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-4 w-4 text-[#666]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
            getAverage("memoryUsage").toFixed(1),
            " GB"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#666] mt-1", children: [
            "Peak: ",
            getMax("memoryUsage").toFixed(1),
            " GB"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "Avg GPU" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "h-4 w-4 text-[#666]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
            getAverage("gpuUsage").toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#666] mt-1", children: [
            "Peak: ",
            getMax("gpuUsage").toFixed(1),
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "Network" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-4 w-4 text-[#666]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
            getAverage("networkDownload").toFixed(1),
            " Mbps"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#666] mt-1", children: "Download average" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-4 h-4 text-[#666]" }),
            "CPU Usage"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Processor utilization over time" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: renderChart(cpuData, "CPU %", "bg-blue-500") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-4 h-4 text-[#666]" }),
            "Memory Usage"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "RAM consumption over time" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: renderChart(memoryData, "Memory GB", "bg-purple-500") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-4 h-4 text-[#666]" }),
            "GPU Usage"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Graphics processor utilization" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: renderChart(gpuData, "GPU %", "bg-orange-500") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-[#666]" }),
            "Network Activity"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Bandwidth usage over time" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          renderChart(networkDownData, "Download Mbps", "bg-blue-500"),
          renderChart(networkUpData, "Upload Mbps", "bg-green-500")
        ] })
      ] })
    ] })
  ] }) });
}
export {
  Analytics as default
};
//# sourceMappingURL=Analytics-njLZUEly.js.map
