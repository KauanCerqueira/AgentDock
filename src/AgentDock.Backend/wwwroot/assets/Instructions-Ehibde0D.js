import { r as reactExports, t as toast, j as jsxRuntimeExports } from "./index-JhHsEzq0.js";
import { c as createLucideIcon, k as api, L as Layout, B as Button, o as BookOpen, C as Card, e as Badge } from "./card-UbwErUzG.js";
import { I as Input } from "./input-DSubU1iQ.js";
import { P as Plus } from "./plus-CTEhqDTQ.js";
import { a as Eye, E as EyeOff } from "./eye-DAoo-pHq.js";
import { T as Trash2 } from "./trash-2-CPscp9c4.js";
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const GripVertical = createLucideIcon("GripVertical", [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
]);
const Pen = createLucideIcon("Pen", [
  [
    "path",
    { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z", key: "5qss01" }
  ]
]);
function Instructions() {
  const [instructions, setInstructions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showCreateModal, setShowCreateModal] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [draggedId, setDraggedId] = reactExports.useState(null);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    description: "",
    content: "",
    category: "general"
  });
  const categories = [
    { value: "general", label: "📋 General" },
    { value: "coding", label: "💻 Coding" },
    { value: "analysis", label: "📊 Analysis" },
    { value: "custom", label: "✨ Custom" }
  ];
  reactExports.useEffect(() => {
    loadInstructions();
  }, []);
  const loadInstructions = async () => {
    try {
      setLoading(true);
      const data = await api.getInstructions();
      setInstructions(data);
    } catch (error) {
      console.error("Erro ao carregar instruções:", error);
      toast.error("Falha ao carregar instruções");
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error("Nome e conteúdo são obrigatórios");
      return;
    }
    try {
      if (editingId) {
        const instruction = instructions.find((i) => i.id === editingId);
        if (instruction) {
          await api.updateInstruction(editingId, {
            ...formData,
            isEnabled: instruction.isEnabled
          });
          toast.success("Instrução atualizada");
        }
      } else {
        await api.createInstruction(formData);
        toast.success("Instrução criada");
      }
      setFormData({ name: "", description: "", content: "", category: "general" });
      setEditingId(null);
      setShowCreateModal(false);
      loadInstructions();
    } catch (error) {
      toast.error("Erro ao salvar instrução");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar esta instrução?")) return;
    try {
      await api.deleteInstruction(id);
      toast.success("Instrução deletada");
      loadInstructions();
    } catch (error) {
      toast.error("Erro ao deletar instrução");
    }
  };
  const handleToggle = async (id) => {
    try {
      await api.toggleInstruction(id);
      loadInstructions();
    } catch (error) {
      toast.error("Erro ao alternar instrução");
    }
  };
  const handleEdit = (instruction) => {
    setEditingId(instruction.id);
    setFormData({
      name: instruction.name,
      description: instruction.description,
      content: instruction.content,
      category: instruction.category
    });
    setShowCreateModal(true);
  };
  const handleDragStart = (id) => {
    setDraggedId(id);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = async (targetId) => {
    if (!draggedId || draggedId === targetId) return;
    const draggedIndex = instructions.findIndex((i) => i.id === draggedId);
    const targetIndex = instructions.findIndex((i) => i.id === targetId);
    const newInstructions = [...instructions];
    [newInstructions[draggedIndex], newInstructions[targetIndex]] = [newInstructions[targetIndex], newInstructions[draggedIndex]];
    setInstructions(newInstructions);
    setDraggedId(null);
    try {
      await api.reorderInstructions(newInstructions.map((i) => i.id));
      toast.success("Ordem atualizada");
    } catch (error) {
      toast.error("Erro ao reordenar");
      loadInstructions();
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Carregando instruções..." })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col gap-6 animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "System Instructions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage system instructions for your agents." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => {
              setEditingId(null);
              setFormData({ name: "", description: "", content: "", category: "general" });
              setShowCreateModal(true);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
              "New Instruction"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: instructions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 border-2 border-dashed rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-12 h-12 mx-auto text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", children: "No instructions yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Create your first system instruction to get started." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setEditingId(null);
              setFormData({ name: "", description: "", content: "", category: "general" });
              setShowCreateModal(true);
            },
            children: "Create Instruction"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: instructions.map((instruction) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            draggable: true,
            onDragStart: () => handleDragStart(instruction.id),
            onDragOver: handleDragOver,
            onDrop: () => handleDrop(instruction.id),
            className: `p-4 transition-all ${draggedId === instruction.id ? "opacity-50 bg-accent" : "hover:bg-accent/50"} ${!instruction.isEnabled ? "opacity-60" : ""}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { size: 18, className: "text-muted-foreground cursor-grab" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium truncate", children: instruction.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: (_a = categories.find((c) => c.value === instruction.category)) == null ? void 0 : _a.label }),
                  !instruction.isEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Disabled" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate", children: instruction.description }),
                expandedId === instruction.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-muted rounded-md text-sm font-mono whitespace-pre-wrap", children: instruction.content })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => setExpandedId(expandedId === instruction.id ? null : instruction.id),
                    title: expandedId === instruction.id ? "Collapse" : "Expand",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `w-4 h-4 transition-transform ${expandedId === instruction.id ? "rotate-180" : ""}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => handleToggle(instruction.id),
                    title: instruction.isEnabled ? "Disable" : "Enable",
                    children: instruction.isEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4 text-muted-foreground" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => handleEdit(instruction),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "text-destructive hover:text-destructive",
                    onClick: () => handleDelete(instruction.id),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] })
          },
          instruction.id
        );
      }) }) })
    ] }),
    showCreateModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: editingId ? "Edit Instruction" : "New Instruction" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 overflow-y-auto space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                placeholder: "e.g., Python Expert"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                value: formData.category,
                onChange: (e) => setFormData({ ...formData, category: e.target.value }),
                children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.value, children: c.label }, c.value))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: formData.description,
              onChange: (e) => setFormData({ ...formData, description: e.target.value }),
              placeholder: "Brief description of what this instruction does"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Instruction Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: "flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono",
              value: formData.content,
              onChange: (e) => setFormData({ ...formData, content: e.target.value }),
              placeholder: "You are a helpful AI assistant..."
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-t flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowCreateModal(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleCreate, children: editingId ? "Save Changes" : "Create Instruction" })
      ] })
    ] }) })
  ] });
}
export {
  Instructions as default
};
//# sourceMappingURL=Instructions-Ehibde0D.js.map
