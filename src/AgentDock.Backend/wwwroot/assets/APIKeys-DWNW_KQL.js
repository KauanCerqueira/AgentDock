import { r as reactExports, t as toast, j as jsxRuntimeExports } from "./index-yUZxNUXu.js";
import { k as api, L as Layout, B as Button, C as Card, a as CardHeader, b as CardTitle, f as CardDescription, d as CardContent, K as Key, e as Badge } from "./card-Dttt0EL0.js";
import { I as Input } from "./input-1u2MzmHM.js";
import { L as Loader2 } from "./loader-2-CdZnucsq.js";
import { P as Plus } from "./plus-BtlkF-nO.js";
import { C as Check } from "./check-BrbszB5w.js";
import { C as Copy } from "./copy-Bx2QLIQQ.js";
import { T as Trash2 } from "./trash-2-tNBXIEbb.js";
import { E as EyeOff, a as Eye } from "./eye-Doyc45Xl.js";
function APIKeys() {
  const [keys, setKeys] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [newKeyName, setNewKeyName] = reactExports.useState("");
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const [visibleKeys, setVisibleKeys] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    fetchKeys();
  }, []);
  const fetchKeys = async () => {
    try {
      const data = await api.getAPIKeys();
      setKeys(data);
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async () => {
    try {
      const newKey = await api.createAPIKey(newKeyName || "Unnamed Key");
      setKeys([...keys, newKey]);
      setNewKeyName("");
      setShowCreate(false);
      toast.success("API key created successfully");
    } catch (error) {
      console.error("Failed to create API key:", error);
      toast.error("Failed to create API key");
    }
  };
  const handleCopy = (key) => {
    navigator.clipboard.writeText(key.key);
    setCopiedId(key.id);
    toast.success("Key copied to clipboard");
    setTimeout(() => setCopiedId(null), 2e3);
  };
  const handleRevoke = async (id) => {
    try {
      await api.revokeAPIKey(id);
      setKeys(keys.map((k) => k.id === id ? { ...k, isActive: false } : k));
      toast.success("API key revoked");
    } catch (error) {
      console.error("Failed to revoke API key:", error);
      toast.error("Failed to revoke API key");
    }
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
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
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-8 h-8 animate-spin text-foreground" }) }) });
  }
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
//# sourceMappingURL=APIKeys-DWNW_KQL.js.map
