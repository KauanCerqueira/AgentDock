import { r as reactExports, j as jsxRuntimeExports } from "./index-DyS2O7OR.js";
import { c as createLucideIcon, a as api, L as Layout, b as Button, F as Folder } from "./Layout-DOD7-pon.js";
import { I as Input } from "./input-D25jqzhw.js";
import { L as Loader2 } from "./loader-2-C0xyLfl7.js";
import { R as RefreshCw } from "./refresh-cw-DIz3S5iD.js";
import { T as Trash2 } from "./trash-2-BTOCom2q.js";
const FolderPlus = createLucideIcon("FolderPlus", [
  ["path", { d: "M12 10v6", key: "1bos4e" }],
  ["path", { d: "M9 13h6", key: "1uhe8q" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
]);
function Workspaces() {
  const [workspaces, setWorkspaces] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showConnect, setShowConnect] = reactExports.useState(false);
  const [path, setPath] = reactExports.useState("");
  reactExports.useEffect(() => {
    api.getWorkspaces().then(setWorkspaces).finally(() => setLoading(false));
  }, []);
  const handleConnect = async (e) => {
    e.preventDefault();
    const workspace = await api.connectWorkspace(path);
    setWorkspaces((prev) => [...prev, workspace]);
    setPath("");
    setShowConnect(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Workspaces" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#888]", children: "Connect local directories for indexing." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowConnect(!showConnect), size: "sm", className: "h-8 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "w-3 h-3 mr-2" }),
        "Connect Folder"
      ] })
    ] }),
    showConnect && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-[#333] bg-[#0A0A0A] p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-4", children: "Connect Local Folder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConnect, className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: path,
            onChange: (e) => setPath(e.target.value),
            placeholder: "C:\\Projects\\MyProject",
            className: "bg-[#111] border-[#333] h-9 text-sm font-mono flex-1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", className: "h-9 text-xs", children: "Connect" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-6 h-6 animate-spin text-[#444]" }) }) : workspaces.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full p-12 text-center border border-dashed border-[#333] rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "w-8 h-8 text-[#333] mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#666]", children: "No workspaces connected" })
    ] }) : workspaces.map((ws) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-lg border border-[#333] bg-[#0A0A0A] p-4 hover:border-[#666] transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded bg-[#111] border border-[#333] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "w-5 h-5 text-[#666] group-hover:text-foreground transition-colors" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 hover:bg-[#222]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 hover:bg-[#222] hover:text-red-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-sm text-foreground truncate", children: ws.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#666] font-mono truncate mt-1 mb-4", children: ws.path }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-[#222]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-1.5 h-1.5 rounded-full ${ws.status === "Indexed" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#888]", children: ws.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[#666]", children: [
          ws.fileCount || 0,
          " files"
        ] })
      ] })
    ] }, ws.id)) })
  ] }) });
}
export {
  Workspaces as default
};
//# sourceMappingURL=Workspaces-G3DW6ysY.js.map
