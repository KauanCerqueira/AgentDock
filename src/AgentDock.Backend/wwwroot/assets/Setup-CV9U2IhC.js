import { r as reactExports, j as jsxRuntimeExports } from "./index-DyS2O7OR.js";
import { c as createLucideIcon, a as api, L as Layout, B as Badge, b as Button } from "./Layout-DOD7-pon.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-V4dOD_wf.js";
import { T as Terminal } from "./terminal-CAcU7LJo.js";
import { Z as Zap } from "./zap-B6E0oIMH.js";
import { D as Download } from "./download-DrUXQARq.js";
import { C as Check } from "./check-0Pu1Wq8f.js";
const Brain = createLucideIcon("Brain", [
  [
    "path",
    {
      d: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z",
      key: "1mhkh5"
    }
  ],
  [
    "path",
    {
      d: "M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z",
      key: "1d6s00"
    }
  ]
]);
function Setup() {
  const [models, setModels] = reactExports.useState([]);
  reactExports.useEffect(() => {
    api.getModels().then(setModels);
  }, []);
  const handleDownload = async (id) => {
    await api.pullModel(id);
    setModels(models.map((m) => m.id === id ? { ...m, status: "Downloading" } : m));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#888]", children: "Manage your local AI infrastructure and models." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-[#111] text-[#888] border-[#333] font-mono text-[10px]", children: "v1.0.0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "success", className: "bg-green-500/10 text-green-500 border-green-500/20", children: "System Online" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "Active Engine" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-4 h-4 text-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-foreground", children: "Ollama" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#666] mt-1", children: "Local inference server running" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "Installed Models" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-4 h-4 text-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-foreground", children: models.filter((m) => m.status === "Installed").length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#666] mt-1", children: "Ready for inference" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-[#888]", children: "Performance" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-foreground", children: "Optimal" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#666] mt-1", children: "GPU acceleration enabled" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-foreground", children: "Available Models" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-[#333] overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-4 p-3 bg-[#111] border-b border-[#333] text-xs font-medium text-[#888] uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-5", children: "Model Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: "Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right", children: "Action" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-[#222]", children: models.map((model) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#0A0A0A] transition-colors text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-5 font-medium text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-[#333]" }),
            model.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-[#888] font-mono text-xs", children: model.size }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3", children: [
            model.status === "Installed" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-[#111] text-foreground border-[#333] text-[10px]", children: "Installed" }),
            model.status === "Downloading" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] animate-pulse", children: "Downloading" }),
            model.status === "Available" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#666] text-xs", children: "Not installed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 text-right", children: [
            model.status === "Available" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => handleDownload(model.id),
                variant: "outline",
                size: "sm",
                className: "h-7 text-xs bg-transparent border-[#333] hover:bg-[#222] hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3 mr-1.5" }),
                  "Get"
                ]
              }
            ),
            model.status === "Installed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", disabled: true, className: "h-7 text-xs text-[#444]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 mr-1.5" }),
              "Ready"
            ] })
          ] })
        ] }, model.id)) })
      ] })
    ] })
  ] }) });
}
export {
  Setup as default
};
//# sourceMappingURL=Setup-CV9U2IhC.js.map
