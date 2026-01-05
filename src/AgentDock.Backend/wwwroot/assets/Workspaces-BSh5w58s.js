import { r as reactExports, j as jsxRuntimeExports, t as toast } from "./index-yUZxNUXu.js";
import { c as createLucideIcon, k as api, L as Layout, B as Button, g as BarChart3, S as Search, e as Badge, C as Card, X } from "./card-Dttt0EL0.js";
import { I as Input } from "./input-1u2MzmHM.js";
import { P as Plus } from "./plus-BtlkF-nO.js";
import { L as Loader2 } from "./loader-2-CdZnucsq.js";
import { T as Trash2 } from "./trash-2-tNBXIEbb.js";
import { F as FolderOpen } from "./folder-open-BV83-Sss.js";
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
const Tag = createLucideIcon("Tag", [
  [
    "path",
    {
      d: "M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z",
      key: "14b2ls"
    }
  ],
  ["path", { d: "M7 7h.01", key: "7u93v4" }]
]);
const Upload = createLucideIcon("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
function Workspaces() {
  const [workspaces, setWorkspaces] = reactExports.useState([]);
  const [groups, setGroups] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showConnect, setShowConnect] = reactExports.useState(false);
  const [path, setPath] = reactExports.useState("");
  const [selectedWorkspace, setSelectedWorkspace] = reactExports.useState(null);
  const [workspaceFiles, setWorkspaceFiles] = reactExports.useState([]);
  const [workspaceStats, setWorkspaceStats] = reactExports.useState(null);
  const [filesLoading, setFilesLoading] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedTag, setSelectedTag] = reactExports.useState(null);
  const [showGroupModal, setShowGroupModal] = reactExports.useState(false);
  const [newGroupName, setNewGroupName] = reactExports.useState("");
  const [newGroupDesc, setNewGroupDesc] = reactExports.useState("");
  const [showTagModal, setShowTagModal] = reactExports.useState(false);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [newTag, setNewTag] = reactExports.useState("");
  reactExports.useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    var _a, _b;
    try {
      setLoading(true);
      const [workspacesData, groupsData] = await Promise.all([
        api.getWorkspaces(),
        ((_b = (_a = api).getWorkspaceGroups) == null ? void 0 : _b.call(_a)) ?? Promise.resolve([])
      ]);
      setWorkspaces(workspacesData);
      setGroups(groupsData);
    } finally {
      setLoading(false);
    }
  };
  const loadWorkspaceDetails = async (workspaceId) => {
    var _a, _b, _c, _d;
    try {
      setFilesLoading(true);
      const [files, stats] = await Promise.all([
        ((_b = (_a = api).getWorkspaceFiles) == null ? void 0 : _b.call(_a, workspaceId)) ?? Promise.resolve([]),
        ((_d = (_c = api).getWorkspaceStats) == null ? void 0 : _d.call(_c, workspaceId)) ?? Promise.resolve(null)
      ]);
      setWorkspaceFiles(files);
      setWorkspaceStats(stats);
    } finally {
      setFilesLoading(false);
    }
  };
  const handleConnect = async (e) => {
    e.preventDefault();
    try {
      const workspace = await api.connectWorkspace(path);
      setWorkspaces((prev) => [...prev, workspace]);
      setPath("");
      setShowConnect(false);
      toast.success("Workspace conectado com sucesso!");
    } catch {
      toast.error("Erro ao conectar workspace");
    }
  };
  const handleDelete = async (id) => {
    var _a, _b;
    if (!confirm("Tem certeza que deseja deletar este workspace?")) return;
    try {
      await ((_b = (_a = api).deleteWorkspace) == null ? void 0 : _b.call(_a, id));
      setWorkspaces((prev) => prev.filter((w) => w.id !== id));
      if (selectedWorkspace === id) setSelectedWorkspace(null);
      toast.success("Workspace deletado");
    } catch {
      toast.error("Erro ao deletar workspace");
    }
  };
  const handleCreateGroup = async (e) => {
    var _a, _b;
    e.preventDefault();
    try {
      const group = await ((_b = (_a = api).createWorkspaceGroup) == null ? void 0 : _b.call(_a, { name: newGroupName, description: newGroupDesc }));
      if (group) {
        setGroups((prev) => [...prev, group]);
        setNewGroupName("");
        setNewGroupDesc("");
        setShowGroupModal(false);
        toast.success("Grupo criado com sucesso!");
      }
    } catch {
      toast.error("Erro ao criar grupo");
    }
  };
  const handleAddTag = async (e) => {
    var _a, _b;
    e.preventDefault();
    if (!selectedWorkspace || !selectedFile) return;
    try {
      await ((_b = (_a = api).addFileTag) == null ? void 0 : _b.call(_a, selectedWorkspace, selectedFile.id, newTag));
      setWorkspaceFiles((prev) => prev.map(
        (f) => f.id === selectedFile.id ? { ...f, tags: [...f.tags, newTag] } : f
      ));
      setNewTag("");
      setShowTagModal(false);
      toast.success("Tag adicionada!");
    } catch {
      toast.error("Erro ao adicionar tag");
    }
  };
  const handleRemoveTag = async (fileId, tag) => {
    var _a, _b;
    if (!selectedWorkspace) return;
    try {
      await ((_b = (_a = api).removeFileTag) == null ? void 0 : _b.call(_a, selectedWorkspace, fileId, tag));
      setWorkspaceFiles((prev) => prev.map(
        (f) => f.id === fileId ? { ...f, tags: f.tags.filter((t) => t !== tag) } : f
      ));
      toast.success("Tag removida");
    } catch {
      toast.error("Erro ao remover tag");
    }
  };
  const filteredFiles = reactExports.useMemo(() => {
    return workspaceFiles.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || f.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [workspaceFiles, searchQuery, selectedTag]);
  const allTags = reactExports.useMemo(() => {
    const tags = /* @__PURE__ */ new Set();
    workspaceFiles.forEach((f) => f.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [workspaceFiles]);
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col gap-6 animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Workspaces" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Gerenciar pastas, arquivos e sincronização em nuvem" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowGroupModal(true), size: "sm", variant: "outline", className: "h-8 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-2" }),
            "Novo Grupo"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowConnect(!showConnect), size: "sm", className: "h-8 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "w-3 h-3 mr-2" }),
            "Conectar Pasta"
          ] })
        ] })
      ] }),
      showConnect && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-6 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-4", children: "Conectar Nova Pasta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConnect, className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: path,
              onChange: (e) => setPath(e.target.value),
              placeholder: "C:\\Projetos\\MeuProjeto",
              className: "bg-background h-9 text-sm font-mono flex-1",
              required: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", className: "h-9 text-xs", children: "Conectar" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 flex flex-col gap-4 overflow-y-auto", children: [
          groups.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3", children: "Grupos" }),
            groups.map((group) => {
              var _a;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card/50 p-3 hover:bg-card transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium", children: group.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                  ((_a = group.workspaceIds) == null ? void 0 : _a.length) || 0,
                  " workspace(s)"
                ] })
              ] }, group.id);
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3", children: "Workspaces" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-4 h-4 animate-spin text-muted-foreground" }) }) : workspaces.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-6", children: "Nenhum workspace" }) : workspaces.map((ws) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setSelectedWorkspace(ws.id);
                  loadWorkspaceDetails(ws.id);
                },
                className: `w-full text-left rounded-lg border transition-all p-3 text-xs ${selectedWorkspace === ws.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/50"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: ws.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground truncate mt-0.5", children: [
                      ws.fileCount,
                      " arquivos"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-shrink-0 w-2 h-2 rounded-full mt-1 ${ws.status === "Indexed" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}` })
                ] })
              },
              ws.id
            )) })
          ] })
        ] }),
        selectedWorkspace ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex flex-col gap-4 overflow-hidden", children: [
          workspaceStats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                label: "Arquivos",
                value: workspaceStats.totalFiles
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { className: "w-4 h-4" }),
                label: "Tamanho",
                value: formatSize(workspaceStats.totalSize)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4" }),
                label: "Tags",
                value: workspaceStats.taggedFiles
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    placeholder: "Buscar arquivos...",
                    className: "pl-9 h-9 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleDelete(selectedWorkspace), size: "sm", variant: "outline", className: "h-9 text-red-500 hover:text-red-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
            ] }),
            allTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: allTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: selectedTag === tag ? "default" : "outline",
                className: "cursor-pointer text-xs",
                onClick: () => setSelectedTag(selectedTag === tag ? null : tag),
                children: tag
              },
              tag
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex-1 overflow-hidden flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-sm", children: [
              "Arquivos (",
              filteredFiles.length,
              ")"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: filesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-4 h-4 animate-spin text-muted-foreground" }) }) : filteredFiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center h-full text-muted-foreground text-xs", children: "Nenhum arquivo" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: filteredFiles.map((file) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 hover:bg-accent/50 transition-colors group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: file.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatSize(file.sizeBytes) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => {
                      setSelectedFile(file);
                      setShowTagModal(true);
                    },
                    size: "icon",
                    variant: "ghost",
                    className: "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                  }
                )
              ] }),
              file.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: file.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                tag,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleRemoveTag(file.id, tag),
                    className: "ml-1 hover:text-destructive",
                    children: "×"
                  }
                )
              ] }, tag)) })
            ] }, file.id)) }) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Selecione um workspace para ver detalhes" })
        ] }) })
      ] })
    ] }),
    showGroupModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Criar Novo Grupo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowGroupModal(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateGroup, className: "p-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newGroupName,
              onChange: (e) => setNewGroupName(e.target.value),
              placeholder: "Projeto A",
              className: "h-9",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Descrição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newGroupDesc,
              onChange: (e) => setNewGroupDesc(e.target.value),
              placeholder: "Descrição...",
              className: "h-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setShowGroupModal(false), size: "sm", variant: "outline", children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", children: "Criar" })
        ] })
      ] })
    ] }) }),
    showTagModal && selectedFile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm", children: "Adicionar Tag" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowTagModal(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddTag, className: "p-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: selectedFile.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: newTag,
            onChange: (e) => setNewTag(e.target.value),
            placeholder: "Nova tag...",
            className: "h-9 text-sm",
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setShowTagModal(false), size: "sm", variant: "outline", children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", children: "Adicionar" })
        ] })
      ] })
    ] }) })
  ] });
}
function StatCard({ icon, label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 flex flex-col items-center justify-center gap-1 bg-card/50 border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: value })
  ] });
}
export {
  Workspaces as default
};
//# sourceMappingURL=Workspaces-BSh5w58s.js.map
