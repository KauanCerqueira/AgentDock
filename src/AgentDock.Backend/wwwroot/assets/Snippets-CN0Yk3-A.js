import { r as reactExports, j as jsxRuntimeExports } from "./index-DyS2O7OR.js";
import { a as api, L as Layout, b as Button, B as Badge, h as Clipboard } from "./Layout-DOD7-pon.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-V4dOD_wf.js";
import { I as Input } from "./input-D25jqzhw.js";
import { S as Star } from "./star-DIc0grRl.js";
import { P as Plus, C as Copy } from "./plus-BCw_sGOB.js";
import { C as Check } from "./check-0Pu1Wq8f.js";
import { T as Trash2 } from "./trash-2-BTOCom2q.js";
function Snippets() {
  const [snippets, setSnippets] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const [newSnippet, setNewSnippet] = reactExports.useState({ name: "", content: "", category: "general", tags: "" });
  reactExports.useEffect(() => {
    loadSnippets();
  }, [filter]);
  const loadSnippets = async () => {
    const data = await api.getSnippets(void 0, filter === "favorites" ? true : void 0);
    setSnippets(data);
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    await api.createSnippet({
      ...newSnippet,
      tags: newSnippet.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isFavorite: false
    });
    setNewSnippet({ name: "", content: "", category: "general", tags: "" });
    setShowCreate(false);
    loadSnippets();
  };
  const handleCopy = async (snippet) => {
    await navigator.clipboard.writeText(snippet.content);
    await api.useSnippet(snippet.id);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2e3);
    loadSnippets();
  };
  const handleDelete = async (id) => {
    await api.deleteSnippet(id);
    loadSnippets();
  };
  const filteredSnippets = snippets.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.content.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Prompt Snippets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#888]", children: "Save and reuse your favorite prompts." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setFilter("all"), className: `h-8 ${filter === "all" ? "bg-[#222] border-[#666]" : "bg-[#0A0A0A] border-[#333]"}`, children: "All" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setFilter("favorites"), className: `h-8 ${filter === "favorites" ? "bg-[#222] border-[#666]" : "bg-[#0A0A0A] border-[#333]"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 mr-1.5" }),
          "Favorites"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowCreate(!showCreate), size: "sm", className: "h-8 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-2" }),
          "New Snippet"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        placeholder: "Search snippets...",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        className: "bg-[#0A0A0A] border-[#333] h-9"
      }
    ),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Create New Snippet" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-[#888]", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newSnippet.name,
                onChange: (e) => setNewSnippet({ ...newSnippet, name: e.target.value }),
                placeholder: "e.g. Code Review Template",
                className: "bg-[#111] border-[#333] h-9",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-[#888]", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: newSnippet.category,
                onChange: (e) => setNewSnippet({ ...newSnippet, category: e.target.value }),
                className: "w-full bg-[#111] border border-[#333] rounded-md h-9 px-3 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "general", children: "General" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "code", children: "Code" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "documentation", children: "Documentation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "debugging", children: "Debugging" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-[#888]", children: "Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: newSnippet.content,
              onChange: (e) => setNewSnippet({ ...newSnippet, content: e.target.value }),
              placeholder: "Enter your prompt template...",
              className: "w-full bg-[#111] border border-[#333] rounded-md p-3 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-1 focus:ring-[#666]",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-[#888]", children: "Tags (comma separated)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newSnippet.tags,
              onChange: (e) => setNewSnippet({ ...newSnippet, tags: e.target.value }),
              placeholder: "e.g. review, quality, best-practices",
              className: "bg-[#111] border-[#333] h-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", className: "h-8 text-xs", children: "Create Snippet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setShowCreate(false), className: "h-8 text-xs", children: "Cancel" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: filteredSnippets.map((snippet) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333] hover:border-[#444] transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: snippet.name }),
            snippet.isFavorite && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 fill-yellow-500 text-yellow-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-[#111] border-[#333] text-[10px] font-normal capitalize", children: snippet.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-[#666]", children: [
              "Used ",
              snippet.useCount,
              " times"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => handleCopy(snippet),
              className: "h-7 w-7 p-0",
              children: copiedId === snippet.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => handleDelete(snippet.id),
              className: "h-7 w-7 p-0 hover:text-red-500",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#111] border border-[#222] rounded-md p-3 text-xs text-[#888] font-mono whitespace-pre-wrap max-h-32 overflow-y-auto", children: snippet.content }),
        snippet.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-3", children: snippet.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-[#111] border-[#333] text-[9px] font-normal", children: tag }, tag)) })
      ] })
    ] }, snippet.id)) }),
    filteredSnippets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "w-12 h-12 text-[#333] mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-[#666]", children: [
        'No snippets found matching "',
        search,
        '"'
      ] })
    ] })
  ] }) });
}
export {
  Snippets as default
};
//# sourceMappingURL=Snippets-CN0Yk3-A.js.map
