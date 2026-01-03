import { r as reactExports, j as jsxRuntimeExports } from "./index-DyS2O7OR.js";
import { c as createLucideIcon, L as Layout, b as Button, K as Key, B as Badge } from "./Layout-DOD7-pon.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-V4dOD_wf.js";
import { I as Input } from "./input-D25jqzhw.js";
import { P as Plus, C as Copy } from "./plus-BCw_sGOB.js";
import { C as Check } from "./check-0Pu1Wq8f.js";
import { T as Trash2 } from "./trash-2-BTOCom2q.js";
const EyeOff = createLucideIcon("EyeOff", [
  ["path", { d: "M9.88 9.88a3 3 0 1 0 4.24 4.24", key: "1jxqfv" }],
  [
    "path",
    {
      d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",
      key: "9wicm4"
    }
  ],
  [
    "path",
    {
      d: "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",
      key: "1jreej"
    }
  ],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }]
]);
const Eye = createLucideIcon("Eye", [
  [
    "path",
    { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", key: "rwhkz3" }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
function APIKeys() {
  const [keys, setKeys] = reactExports.useState([
    {
      id: "1",
      key: "agdk_1234567890abcdefghijklmnopqrstuvwxyz",
      name: "Development Key",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3),
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1e3),
      requestCount: 1234,
      isActive: true
    },
    {
      id: "2",
      key: "agdk_abcdefghijklmnopqrstuvwxyz1234567890",
      name: "Production Key",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3),
      lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1e3),
      requestCount: 5678,
      isActive: true
    }
  ]);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [newKeyName, setNewKeyName] = reactExports.useState("");
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const [visibleKeys, setVisibleKeys] = reactExports.useState(/* @__PURE__ */ new Set());
  const handleCreate = () => {
    const newKey = {
      id: Date.now().toString(),
      key: `agdk_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      name: newKeyName || "Unnamed Key",
      createdAt: /* @__PURE__ */ new Date(),
      requestCount: 0,
      isActive: true
    };
    setKeys([...keys, newKey]);
    setNewKeyName("");
    setShowCreate(false);
  };
  const handleCopy = (key) => {
    navigator.clipboard.writeText(key.key);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  const handleRevoke = (id) => {
    setKeys(keys.map((k) => k.id === id ? { ...k, isActive: false } : k));
  };
  const toggleVisibility = (id) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const maskKey = (key) => {
    return `${key.substring(0, 12)}${"�".repeat(20)}${key.substring(key.length - 4)}`;
  };
  const formatDate = (date) => {
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1e3 * 60 * 60));
    const minutes = Math.floor(diff / (1e3 * 60));
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "API Keys" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#888]", children: "Manage authentication keys for API access." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowCreate(!showCreate), size: "sm", className: "h-8 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-2" }),
        "Create New Key"
      ] })
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Create New API Key" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Give your API key a descriptive name" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: newKeyName,
            onChange: (e) => setNewKeyName(e.target.value),
            placeholder: "e.g. Development Key, Production API",
            className: "bg-[#111] border-[#333] h-9",
            onKeyDown: (e) => e.key === "Enter" && handleCreate()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleCreate, size: "sm", className: "h-9", children: "Create" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setShowCreate(false), variant: "ghost", size: "sm", className: "h-9", children: "Cancel" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: keys.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: `bg-[#0A0A0A] border-[#333] ${!key.isActive ? "opacity-50" : ""}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-4 h-4 text-[#666]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: key.name }),
                key.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-green-500/10 text-green-500 border-green-500/20 text-[9px]", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-red-500/10 text-red-500 border-red-500/20 text-[9px]", children: "Revoked" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-[#666]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Created ",
                  formatDate(key.createdAt)
                ] }),
                key.lastUsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "�" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Last used ",
                    formatDate(key.lastUsed)
                  ] })
                ] })
              ] })
            ] }),
            key.isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => handleCopy(key),
                  className: "h-7 text-xs",
                  children: copiedId === key.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 mr-1.5 text-green-500" }),
                    "Copied"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3 mr-1.5" }),
                    "Copy"
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => handleRevoke(key.id),
                  className: "h-7 text-xs hover:text-red-500",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 mr-1.5" }),
                    "Revoke"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-[#111] border border-[#222]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 font-mono text-xs text-[#888] select-all", children: visibleKeys.has(key.id) ? key.key : maskKey(key.key) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => toggleVisibility(key.id),
                className: "p-1 rounded hover:bg-[#222] transition-colors",
                children: visibleKeys.has(key.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4 text-[#666]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4 text-[#666]" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#666]", children: "Total Requests" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: key.requestCount.toLocaleString() })
          ] })
        ] }) })
      },
      key.id
    )) }),
    keys.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-12 h-12 text-[#333] mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#666]", children: "No API keys created yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setShowCreate(true), size: "sm", className: "mt-4 h-8 text-xs", children: "Create Your First Key" })
    ] })
  ] }) });
}
export {
  APIKeys as default
};
//# sourceMappingURL=APIKeys-BDCPQRVX.js.map
