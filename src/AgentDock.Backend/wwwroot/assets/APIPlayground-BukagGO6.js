import { r as reactExports, j as jsxRuntimeExports, t as toast } from "./index-yUZxNUXu.js";
import { c as createLucideIcon, L as Layout, B as Button, C as Card, a as CardHeader, b as CardTitle, f as CardDescription, d as CardContent, e as Badge } from "./card-Dttt0EL0.js";
import { I as Input } from "./input-1u2MzmHM.js";
import { Z as Zap } from "./zap-bUakK8Os.js";
import { C as Check } from "./check-BrbszB5w.js";
import { C as Copy } from "./copy-Bx2QLIQQ.js";
import { T as Terminal } from "./terminal-aDXRLsyi.js";
import { L as Loader2 } from "./loader-2-CdZnucsq.js";
import { F as FileText } from "./file-text-B9co8qSp.js";
const ExternalLink = createLucideIcon("ExternalLink", [
  [
    "path",
    {
      d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
      key: "a6xqqp"
    }
  ],
  ["polyline", { points: "15 3 21 3 21 9", key: "mznyad" }],
  ["line", { x1: "10", x2: "21", y1: "14", y2: "3", key: "18c3s4" }]
]);
function APIPlayground() {
  const [copied, setCopied] = reactExports.useState(false);
  const [, setModels] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [selectedModel, setSelectedModel] = reactExports.useState("tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf");
  const apiKey = "sk-agentdock-admin";
  const baseUrl = "http://localhost:5000/v1";
  reactExports.useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/models");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setModels(data);
            setSelectedModel(data[0].name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2e3);
  };
  const openSwagger = () => {
    window.open("http://localhost:5000/swagger", "_blank");
  };
  const pythonExample = `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="${apiKey}"
)

response = client.chat.completions.create(
    model="${selectedModel}",
    messages=[
        {"role": "user", "content": "Hello, how are you?"}
    ]
)

print(response.choices[0].message.content)`;
  const curlExample = `curl ${baseUrl}/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-500 h-full flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-6 flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "API Integration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Connect external applications to your local AI engine." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: openSwagger, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 mr-2" }),
        "Open Swagger UI"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-yellow-500" }),
            "Connection Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Use these credentials to connect any OpenAI-compatible client." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Base URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: baseUrl, readOnly: true, className: "font-mono bg-muted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: () => handleCopy(baseUrl), children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "To access from another device, replace ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "localhost" }),
              " with your PC's IP address (e.g., ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "http://192.168.1.x:5000/v1" }),
              ")."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "API Key" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: apiKey, readOnly: true, className: "font-mono bg-muted", type: "password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: () => handleCopy(apiKey), children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This key is configured in your appsettings.json. Keep it secure." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-5 h-5 text-blue-500" }),
              "Python (OpenAI SDK)"
            ] }),
            loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-4 h-4 animate-spin text-muted-foreground" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 bg-[#0d1117] p-0 overflow-hidden rounded-b-lg mx-6 mb-6 border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "example.py" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-6 text-xs text-gray-400 hover:text-white", onClick: () => handleCopy(pythonExample), children: "Copy" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "p-4 text-sm font-mono text-gray-300 overflow-x-auto", children: pythonExample })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-5 h-5 text-green-500" }),
              "cURL / Terminal"
            ] }),
            loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-4 h-4 animate-spin text-muted-foreground" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 bg-[#0d1117] p-0 overflow-hidden rounded-b-lg mx-6 mb-6 border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "bash" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-6 text-xs text-gray-400 hover:text-white", onClick: () => handleCopy(curlExample), children: "Copy" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "p-4 text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap", children: curlExample })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-purple-500" }),
          "Supported Endpoints"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mt-1 bg-green-500 hover:bg-green-600", children: "POST" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-medium", children: "/v1/chat/completions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Generate chat completions. Supports streaming and standard mode. Compatible with OpenAI Chat Completion API." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mt-1 bg-blue-500 hover:bg-blue-600", children: "GET" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-medium", children: "/v1/models" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "List available models. Returns the currently loaded model and other available GGUF files." })
            ] })
          ] })
        ] }) })
      ] })
    ] }) })
  ] }) });
}
export {
  APIPlayground as default
};
//# sourceMappingURL=APIPlayground-BukagGO6.js.map
