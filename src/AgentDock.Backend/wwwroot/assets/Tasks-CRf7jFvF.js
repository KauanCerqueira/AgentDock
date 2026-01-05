import { r as reactExports, j as jsxRuntimeExports, t as toast } from "./index-JhHsEzq0.js";
import { c as createLucideIcon, k as api, L as Layout, S as Search, B as Button, A as Activity, C as Card, F as Folder, e as Badge, P as Play } from "./card-UbwErUzG.js";
import { I as Input } from "./input-DSubU1iQ.js";
import { P as Plus } from "./plus-CTEhqDTQ.js";
import { Z as Zap } from "./zap-CVXGhbyj.js";
import { F as FileText } from "./file-text-CUxpdDaY.js";
import { P as Pause } from "./pause-B60qvGAY.js";
import { T as Trash2 } from "./trash-2-CPscp9c4.js";
import { C as Clock } from "./clock-CKkUNPKb.js";
import { X as XCircle } from "./x-circle-UMFxkjuB.js";
import { A as ArrowRight } from "./arrow-right-ChfAQJFw.js";
const CheckCircle2 = createLucideIcon("CheckCircle2", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-foreground tracking-tight", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${trendUp ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }) })
  ] }),
  trend && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: trendUp ? "text-green-500" : "text-red-500", children: trend }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "vs last month" })
  ] })
] });
const ActivityItem = ({ log }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-1 w-2 h-2 rounded-full flex-shrink-0 ${log.status === "Success" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"}` }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: log.fileName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground whitespace-nowrap", children: new Date(log.executedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground truncate flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70", children: log.automationName }),
      log.status === "Failed" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 ml-1", children: "- Error processing file" })
    ] })
  ] })
] });
function Tasks() {
  const [automations, setAutomations] = reactExports.useState([]);
  const [showNewModal, setShowNewModal] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [formData, setFormData] = reactExports.useState({
    name: "",
    folderPath: "",
    fileExtensions: "",
    prompt: "",
    outputFolder: ""
  });
  reactExports.useEffect(() => {
    loadAutomations();
  }, []);
  const loadAutomations = async () => {
    try {
      const data = await api.getTasks();
      setAutomations(data.map((t) => ({
        id: t.id,
        name: t.name,
        folderPath: t.folderPath,
        fileExtensions: t.fileExtensions,
        prompt: t.prompt,
        outputFolder: t.outputFolder,
        isActive: t.isActive ?? true,
        createdAt: new Date(t.createdAt),
        lastExecution: t.lastExecution ? new Date(t.lastExecution) : void 0,
        executionHistory: t.executionHistory ?? []
      })));
    } catch (error) {
      console.error("Failed to load automations", error);
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.folderPath || !formData.prompt) {
      toast.error("Missing required fields");
      return;
    }
    try {
      const newAuto = await api.createTask(formData.name, "automation", formData.prompt);
      const automation = {
        id: newAuto.id,
        name: newAuto.name,
        folderPath: formData.folderPath,
        fileExtensions: formData.fileExtensions || void 0,
        prompt: formData.prompt,
        outputFolder: formData.outputFolder || void 0,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date(),
        executionHistory: []
      };
      setAutomations((prev) => [...prev, automation]);
      setFormData({ name: "", folderPath: "", fileExtensions: "", prompt: "", outputFolder: "" });
      setShowNewModal(false);
      toast.success("Workflow created successfully");
    } catch (error) {
      toast.error("Failed to create workflow");
    }
  };
  const toggleStatus = (id) => {
    setAutomations((prev) => prev.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a));
    toast.success("Status updated");
  };
  const deleteAutomation = (id) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    toast.success("Workflow deleted");
  };
  const stats = reactExports.useMemo(() => {
    const total = automations.length;
    const active = automations.filter((a) => a.isActive).length;
    const allExecutions = automations.flatMap((a) => a.executionHistory);
    const processed = allExecutions.length;
    const success = allExecutions.filter((e) => e.status === "Success").length;
    const rate = processed > 0 ? Math.round(success / processed * 100) : 100;
    return { total, active, processed, rate };
  }, [automations]);
  const recentActivity = reactExports.useMemo(() => {
    return automations.flatMap((a) => a.executionHistory.map((e) => ({ ...e, automationName: a.name }))).sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()).slice(0, 10);
  }, [automations]);
  const filteredAutomations = automations.filter(
    (a) => {
      var _a;
      return a.name.toLowerCase().includes(searchQuery.toLowerCase()) || ((_a = a.folderPath) == null ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full gap-6 p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Workflow Automations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Manage your file watchers and automated processing tasks." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search workflows...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 w-64 bg-card/50 border-border/50"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowNewModal(true), className: "gap-2 shadow-lg shadow-primary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          "New Workflow"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Workflows", value: stats.total, icon: Zap, trend: "+2", trendUp: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Active Watchers", value: stats.active, icon: Activity, trend: "Stable", trendUp: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Files Processed", value: stats.processed, icon: FileText, trend: "+124", trendUp: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Success Rate", value: `${stats.rate}%`, icon: CheckCircle2, trend: "-1%", trendUp: false })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-6 min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto pr-2 -mr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 pb-6", children: [
        filteredAutomations.map((auto) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group relative overflow-hidden border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute left-0 top-0 bottom-0 w-1 transition-colors ${auto.isActive ? "bg-primary" : "bg-muted"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 pl-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${auto.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground leading-none mb-1.5", children: auto.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `text-[10px] h-5 ${auto.isActive ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-muted-foreground"}`, children: auto.isActive ? "Monitoring" : "Paused" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => toggleStatus(auto.id), children: auto.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-destructive hover:text-destructive", onClick: () => deleteAutomation(auto.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-2.5 border border-border/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Source" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground truncate", title: auto.folderPath, children: auto.folderPath })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-medium mb-1", children: "EXTENSIONS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: (auto.fileExtensions || "all").split(",").map((ext, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] px-1.5 h-5 font-mono bg-muted/50", children: ext.trim() }, i)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-medium mb-1", children: "LAST RUN" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: auto.lastExecution ? new Date(auto.lastExecution).toLocaleDateString() : "Never" })
                ] })
              ] })
            ] })
          ] })
        ] }, auto.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowNewModal(true),
            className: "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group h-full min-h-[200px]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-6 h-6 text-muted-foreground group-hover:text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Create New Workflow" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Set up a new folder watcher" })
              ] })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-80 flex-shrink-0 flex flex-col gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex-1 flex flex-col bg-card/30 border-border/50 backdrop-blur-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border/50 flex items-center justify-between bg-muted/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: "Live Activity" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] bg-background/50", children: "Real-time" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: recentActivity.length > 0 ? recentActivity.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityItem, { log }, i)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-8 h-8 mb-2 opacity-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No recent activity recorded" })
        ] }) })
      ] }) })
    ] }),
    showNewModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-lg bg-card border-border shadow-2xl animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "New Automation Workflow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setShowNewModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { className: "w-5 h-5 text-muted-foreground" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Configure a folder watcher to process files automatically." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-foreground", children: "Workflow Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "e.g., Invoice Processor",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              className: "bg-muted/30"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-foreground", children: "Watch Folder" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "C:\\Inputs",
                  value: formData.folderPath,
                  onChange: (e) => setFormData({ ...formData, folderPath: e.target.value }),
                  className: "pl-9 bg-muted/30"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-foreground", children: "Output Folder (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "C:\\Outputs",
                  value: formData.outputFolder,
                  onChange: (e) => setFormData({ ...formData, outputFolder: e.target.value }),
                  className: "pl-9 bg-muted/30"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-foreground", children: "File Extensions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "pdf, txt, docx (leave empty for all)",
              value: formData.fileExtensions,
              onChange: (e) => setFormData({ ...formData, fileExtensions: e.target.value }),
              className: "bg-muted/30"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-foreground", children: "AI Instruction Prompt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: "w-full h-32 px-3 py-2 text-sm rounded-md border border-input bg-muted/30 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              placeholder: "Describe what the AI should do with each file...",
              value: formData.prompt,
              onChange: (e) => setFormData({ ...formData, prompt: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: () => setShowNewModal(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "flex-1", children: "Create Workflow" })
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  Tasks as default
};
//# sourceMappingURL=Tasks-CRf7jFvF.js.map
