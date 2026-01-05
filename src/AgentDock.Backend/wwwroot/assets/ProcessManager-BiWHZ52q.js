import { r as reactExports, t as toast, j as jsxRuntimeExports } from "./index-yUZxNUXu.js";
import { c as createLucideIcon, L as Layout, B as Button, C as Card, a as CardHeader, b as CardTitle, d as CardContent, A as Activity, H as HardDrive, j as Cpu, e as Badge, X } from "./card-Dttt0EL0.js";
import { P as Progress } from "./progress-DE_vT5PT.js";
import { R as RefreshCw } from "./refresh-cw-DLbH_uK9.js";
const AlertTriangle = createLucideIcon("AlertTriangle", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
      key: "c3ski4"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
function ProcessManager() {
  const [processes, setProcesses] = reactExports.useState([]);
  const [systemStats, setSystemStats] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [sortBy, setSortBy] = reactExports.useState("memory");
  const [autoRefresh, setAutoRefresh] = reactExports.useState(true);
  reactExports.useEffect(() => {
    loadProcesses();
    if (autoRefresh) {
      const interval = setInterval(loadProcesses, 3e3);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);
  const loadProcesses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/system/processes");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProcesses(data.processes || []);
      setSystemStats(data.systemStats || null);
    } catch (error) {
      console.error("Failed to load processes:", error);
      toast.error("Erro ao carregar processos");
    } finally {
      setLoading(false);
    }
  };
  const killProcess = async (processId, processName) => {
    const confirmed = window.confirm(
      `?? ATEN��O!

Deseja FOR�AR o encerramento do processo?

Processo: ${processName} (PID: ${processId})

?? Isso pode causar:
� Perda de dados n�o salvos
� Instabilidade do sistema
� Encerramento de tarefas em andamento

Tem certeza?`
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`http://localhost:5000/api/system/processes/${processId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to kill process");
      }
      toast.success("Processo encerrado", {
        description: `${processName} foi finalizado com sucesso`
      });
      setTimeout(loadProcesses, 500);
    } catch (error) {
      console.error("Failed to kill process:", error);
      toast.error("Erro ao encerrar processo", {
        description: error.message || "Permiss�es insuficientes ou processo protegido"
      });
    }
  };
  const getSortedProcesses = () => {
    const sorted = [...processes];
    switch (sortBy) {
      case "memory":
        return sorted.sort((a, b) => b.memoryMb - a.memoryMb);
      case "cpu":
        return sorted.sort((a, b) => b.cpuPercent - a.cpuPercent);
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };
  const getMemoryColor = (percent) => {
    if (percent >= 80) return "text-red-500";
    if (percent >= 50) return "text-yellow-500";
    return "text-green-500";
  };
  const formatMemory = (mb) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)}GB`;
    return `${mb.toFixed(0)}MB`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "Gerenciador de Processos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Monitore e finalize processos que consomem muita RAM" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: autoRefresh ? "default" : "outline",
            size: "sm",
            onClick: () => setAutoRefresh(!autoRefresh),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}` }),
              autoRefresh ? "Auto" : "Manual"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: loadProcesses, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
          "Atualizar"
        ] })
      ] })
    ] }),
    systemStats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Uso de RAM" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-2xl font-bold ${getMemoryColor(systemStats.memoryUsagePercent)}`, children: [
              systemStats.memoryUsagePercent.toFixed(1),
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              systemStats.usedMemoryGb.toFixed(1),
              "GB / ",
              systemStats.totalMemoryGb.toFixed(1),
              "GB"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: systemStats.memoryUsagePercent, className: "h-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Dispon�vel: ",
            systemStats.availableMemoryGb.toFixed(1),
            "GB"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Uso de CPU" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-2xl font-bold ${getMemoryColor(systemStats.cpuUsagePercent)}`, children: [
            systemStats.cpuUsagePercent.toFixed(1),
            "%"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: systemStats.cpuUsagePercent, className: "h-2" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Total de Processos" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-foreground", children: processes.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "ativos" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground my-auto", children: "Ordenar por:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: sortBy === "memory" ? "default" : "outline",
          size: "sm",
          onClick: () => setSortBy("memory"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-4 h-4 mr-2" }),
            "Mem�ria"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: sortBy === "cpu" ? "default" : "outline",
          size: "sm",
          onClick: () => setSortBy("cpu"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-4 h-4 mr-2" }),
            "CPU"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: sortBy === "name" ? "default" : "outline",
          size: "sm",
          onClick: () => setSortBy("name"),
          children: "Nome"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Processos em Execu��o" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-8 h-8 mx-auto mb-2 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Carregando processos..." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 rounded-lg text-xs font-semibold text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-5", children: "Processo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right", children: "Mem�ria" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right", children: "RAM %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right", children: "CPU %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 text-right", children: "A��o" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[500px] overflow-y-auto space-y-1", children: getSortedProcesses().map((process) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors ${process.memoryPercent > 20 ? "border-l-2 border-l-red-500" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-5 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground", children: process.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                    "PID: ",
                    process.id,
                    process.isSystemProcess && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2 text-[9px]", children: "Sistema" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right my-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-mono font-semibold ${process.memoryPercent > 20 ? "text-red-500" : ""}`, children: formatMemory(process.memoryMb) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right my-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-mono ${getMemoryColor(process.memoryPercent)}`, children: [
                process.memoryPercent.toFixed(1),
                "%"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right my-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground", children: [
                process.cpuPercent.toFixed(1),
                "%"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 text-right my-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => killProcess(process.id, process.name),
                  disabled: !process.canKill,
                  className: `h-8 w-8 p-0 ${process.canKill ? "hover:bg-red-500/20 hover:text-red-500" : "opacity-50 cursor-not-allowed"}`,
                  title: process.canKill ? "Finalizar processo" : "Processo protegido",
                  children: process.canKill ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4" })
                }
              ) })
            ]
          },
          process.id
        )) }),
        processes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Nenhum processo em execu��o" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-yellow-500/20 bg-yellow-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "?? Aten��o ao Finalizar Processos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-muted-foreground space-y-1 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "� Finalizar processos pode causar perda de dados n�o salvos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "� Processos do sistema est�o protegidos e n�o podem ser finalizados" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "� Use apenas para processos travados ou que consomem muita RAM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "� Se seu PC est� lento, considere fechar programas normalmente primeiro" })
        ] })
      ] })
    ] }) }) })
  ] }) });
}
export {
  ProcessManager as default
};
//# sourceMappingURL=ProcessManager-BiWHZ52q.js.map
