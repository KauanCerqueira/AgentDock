import { r as reactExports, j as jsxRuntimeExports } from "./index-yUZxNUXu.js";
import { c as createLucideIcon, k as api, L as Layout, B as Button, p as Bot, C as Card, a as CardHeader, e as Badge, b as CardTitle, f as CardDescription, d as CardContent, P as Play } from "./card-Dttt0EL0.js";
import { Z as Zap } from "./zap-bUakK8Os.js";
import { F as FileText } from "./file-text-B9co8qSp.js";
const Bug = createLucideIcon("Bug", [
  ["path", { d: "m8 2 1.88 1.88", key: "fmnt4t" }],
  ["path", { d: "M14.12 3.88 16 2", key: "qol33r" }],
  ["path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1", key: "d7y7pr" }],
  [
    "path",
    {
      d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",
      key: "xs1cw7"
    }
  ],
  ["path", { d: "M12 20v-9", key: "1qisl0" }],
  ["path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5", key: "32zzws" }],
  ["path", { d: "M6 13H2", key: "82j7cp" }],
  ["path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4", key: "4p0ekp" }],
  ["path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4", key: "18gb23" }],
  ["path", { d: "M22 13h-4", key: "1jl80f" }],
  ["path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4", key: "k3fwyw" }]
]);
const Code = createLucideIcon("Code", [
  ["polyline", { points: "16 18 22 12 16 6", key: "z7tu5w" }],
  ["polyline", { points: "8 6 2 12 8 18", key: "1eg1df" }]
]);
const Network = createLucideIcon("Network", [
  [
    "rect",
    { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }
  ],
  [
    "rect",
    { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }
  ],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
  ["path", { d: "M12 12V8", key: "2874zd" }]
]);
const Shield = createLucideIcon("Shield", [
  ["path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10", key: "1irkt0" }]
]);
const TestTube = createLucideIcon("TestTube", [
  [
    "path",
    {
      d: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2",
      key: "187lwq"
    }
  ],
  ["path", { d: "M8.5 2h7", key: "csnxdl" }],
  ["path", { d: "M14.5 16h-5", key: "1ox875" }]
]);
const Wand = createLucideIcon("Wand", [
  ["path", { d: "M15 4V2", key: "z1p9b7" }],
  ["path", { d: "M15 16v-2", key: "px0unx" }],
  ["path", { d: "M8 9h2", key: "1g203m" }],
  ["path", { d: "M20 9h2", key: "19tzq7" }],
  ["path", { d: "M17.8 11.8 19 13", key: "yihg8r" }],
  ["path", { d: "M15 9h0", key: "kg5t1u" }],
  ["path", { d: "M17.8 6.2 19 5", key: "fd4us0" }],
  ["path", { d: "m3 21 9-9", key: "1jfql5" }],
  ["path", { d: "M12.2 6.2 11 5", key: "i3da3b" }]
]);
const iconMap = {
  code: Code,
  "file-text": FileText,
  bug: Bug,
  shield: Shield,
  "test-tube": TestTube,
  wand: Wand,
  network: Network,
  zap: Zap,
  bot: Bot
};
function AgentPresets() {
  const [presets, setPresets] = reactExports.useState([]);
  const [category, setCategory] = reactExports.useState("");
  const [selectedPreset, setSelectedPreset] = reactExports.useState(null);
  reactExports.useEffect(() => {
    loadPresets();
  }, [category]);
  const loadPresets = async () => {
    const data = await api.getAgentPresets(category || void 0);
    setPresets(data);
  };
  const handleUsePreset = async (preset) => {
    await api.useAgentPreset(preset.id);
    setSelectedPreset(preset);
    loadPresets();
  };
  const categories = Array.from(new Set(presets.map((p) => p.category)));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Agent Presets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#888]", children: "Pre-configured AI agents for specific tasks." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCategory(""),
            className: `h-8 ${category === "" ? "bg-[#222] border-[#666]" : "bg-[#0A0A0A] border-[#333]"}`,
            children: "All"
          }
        ),
        categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCategory(cat),
            className: `h-8 capitalize ${category === cat ? "bg-[#222] border-[#666]" : "bg-[#0A0A0A] border-[#333]"}`,
            children: cat
          },
          cat
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: presets.map((preset) => {
      const Icon = iconMap[preset.icon] || Bot;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: `bg-[#0A0A0A] border-[#333] hover:border-[#444] transition-all cursor-pointer ${(selectedPreset == null ? void 0 : selectedPreset.id) === preset.id ? "border-blue-500" : ""}`,
          onClick: () => setSelectedPreset(preset),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-[#111] border border-[#333] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-[#666]" }) }),
                preset.isBuiltIn && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] font-normal", children: "Built-in" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base mt-3", children: preset.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: preset.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-[#111] border-[#333] text-[9px] font-normal capitalize", children: preset.category }),
                preset.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-[#111] border-[#333] text-[9px] font-normal", children: tag }, tag))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-[#666] space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Temperature:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: preset.modelSettings.temperature })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Max Tokens:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: preset.modelSettings.maxTokens })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Used:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    preset.useCount,
                    " times"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleUsePreset(preset);
                  },
                  size: "sm",
                  className: "w-full h-8 text-xs",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 mr-2" }),
                    "Use Preset"
                  ]
                }
              )
            ] }) })
          ]
        },
        preset.id
      );
    }) }),
    selectedPreset && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "System Prompt Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "The following instructions will be sent to the AI model" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#111] border border-[#222] rounded-md p-4 text-sm text-[#888] whitespace-pre-wrap font-mono", children: selectedPreset.systemPrompt }) })
    ] }),
    presets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-12 h-12 text-[#333] mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#666]", children: "No presets available" })
    ] })
  ] }) });
}
export {
  AgentPresets as default
};
//# sourceMappingURL=AgentPresets-axw1hnhu.js.map
