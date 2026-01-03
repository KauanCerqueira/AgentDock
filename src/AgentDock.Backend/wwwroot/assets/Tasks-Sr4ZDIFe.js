import { r as reactExports, j as jsxRuntimeExports } from "./index-DyS2O7OR.js";
import { a as api, L as Layout, b as Button, P as Play, B as Badge } from "./Layout-DOD7-pon.js";
import { I as Input } from "./input-D25jqzhw.js";
import { L as Loader2 } from "./loader-2-C0xyLfl7.js";
import { T as Terminal } from "./terminal-CAcU7LJo.js";
function Tasks() {
  const [tasks, setTasks] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showWizard, setShowWizard] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({ name: "", type: "analysis", instruction: "" });
  reactExports.useEffect(() => {
    api.getTasks().then(setTasks).finally(() => setLoading(false));
  }, []);
  const handleCreateTask = async (e) => {
    e.preventDefault();
    const task = await api.createTask(formData.name, formData.type, formData.instruction);
    setTasks((prev) => [...prev, task]);
    setFormData({ name: "", type: "analysis", instruction: "" });
    setShowWizard(false);
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-green-500/10 text-green-500 border-green-500/20 text-[10px] font-normal", children: "Completed" });
      case "Running":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-normal animate-pulse", children: "Running" });
      case "Failed":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-red-500/10 text-red-500 border-red-500/20 text-[10px] font-normal", children: "Failed" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-[#111] text-[#666] border-[#333] text-[10px] font-normal", children: "Queued" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Tasks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#888]", children: "Monitor background processes and jobs." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowWizard(!showWizard), size: "sm", className: "h-8 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 mr-2" }),
        "New Task"
      ] })
    ] }),
    showWizard && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-[#333] bg-[#0A0A0A] p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-4", children: "Create New Task" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateTask, className: "space-y-4 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-[#888]", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              placeholder: "e.g. Index Documentation",
              className: "bg-[#111] border-[#333] h-9 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-[#888]", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: formData.type,
              onChange: (e) => setFormData({ ...formData, type: e.target.value }),
              className: "w-full bg-[#111] border border-[#333] rounded-md h-9 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#666]",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "analysis", children: "Analysis" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "indexing", children: "Indexing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "extraction", children: "Extraction" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", className: "h-8 text-xs", children: "Create Task" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setShowWizard(false), className: "h-8 text-xs", children: "Cancel" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-[#333] overflow-hidden bg-[#0A0A0A]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-4 p-3 bg-[#111] border-b border-[#333] text-xs font-medium text-[#666] uppercase tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4", children: "Task" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-right", children: "Created" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-[#222]", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-6 h-6 animate-spin text-[#444]" }) }) : tasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-8 h-8 text-[#333] mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#666]", children: "No tasks running" })
      ] }) : tasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#111] transition-colors text-sm group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-4 font-medium text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded bg-[#222] flex items-center justify-center border border-[#333]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-4 h-4 text-[#666]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: task.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-[#888] text-xs capitalize", children: task.type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: getStatusBadge(task.status) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-right text-xs text-[#666] font-mono", children: task.createdAt ? new Date(task.createdAt).toLocaleTimeString() : "-" })
      ] }, task.id)) })
    ] })
  ] }) });
}
export {
  Tasks as default
};
//# sourceMappingURL=Tasks-Sr4ZDIFe.js.map
