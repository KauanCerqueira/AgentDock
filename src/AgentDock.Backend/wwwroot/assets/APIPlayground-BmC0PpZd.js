import { r as reactExports, j as jsxRuntimeExports } from "./index-DyS2O7OR.js";
import { L as Layout, b as Button, B as Badge, P as Play } from "./Layout-DOD7-pon.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-V4dOD_wf.js";
import { I as Input } from "./input-D25jqzhw.js";
import { T as Trash2 } from "./trash-2-BTOCom2q.js";
import { S as Settings2 } from "./settings-2-BjOJpmKy.js";
import { F as FileText } from "./file-text-B1IUHdZK.js";
import { Z as Zap } from "./zap-B6E0oIMH.js";
function APIPlayground() {
  const [messages, setMessages] = reactExports.useState([]);
  const [input, setInput] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [config, setConfig] = reactExports.useState({
    model: "llama2",
    temperature: 0.7,
    maxTokens: 2048,
    stream: true,
    includeWorkspace: false
  });
  const [lastRequest, setLastRequest] = reactExports.useState(null);
  const [lastResponse, setLastResponse] = reactExports.useState(null);
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = {
      role: "user",
      content: input,
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setTimeout(() => {
      const assistantMessage = {
        role: "assistant",
        content: `This is a mock response. The actual API will be implemented in the backend.

Your request:
- Model: ${config.model}
- Temperature: ${config.temperature}
- Max Tokens: ${config.maxTokens}

Message: "${userMessage.content}"`,
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      setLastRequest({
        method: "POST",
        url: "/api/v1/chat",
        body: {
          model: config.model,
          messages: [{ role: "user", content: userMessage.content }],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: config.stream
        }
      });
      setLastResponse({
        status: 200,
        data: {
          id: "chatcmpl-" + Math.random().toString(36).substr(2, 9),
          model: config.model,
          response: assistantMessage.content,
          tokens_used: 145,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    }, 1500);
  };
  const handleClear = () => {
    setMessages([]);
    setLastRequest(null);
    setLastResponse(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: "API Playground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#888]", children: "Test and experiment with local AI models through the API." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleClear, variant: "outline", size: "sm", className: "h-8 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 mr-2" }),
        "Clear"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-4 h-4 text-[#666]" }),
            "Configuration"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Model" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: config.model,
                  onChange: (e) => setConfig({ ...config, model: e.target.value }),
                  className: "w-full bg-[#111] border border-[#333] rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#666]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "llama2", children: "Llama 2 7B" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mistral", children: "Mistral 7B" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "codellama", children: "Code Llama 7B" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "neural-chat", children: "Neural Chat 7B" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Agent Preset" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: config.preset || "",
                  onChange: (e) => setConfig({ ...config, preset: e.target.value || void 0 }),
                  className: "w-full bg-[#111] border border-[#333] rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#666]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "None" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "code-reviewer", children: "Code Reviewer" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bug-hunter", children: "Bug Hunter" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "documentation", children: "Documentation Writer" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Temperature" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#666] font-mono", children: config.temperature })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "range",
                  min: "0",
                  max: "2",
                  step: "0.1",
                  value: config.temperature,
                  onChange: (e) => setConfig({ ...config, temperature: parseFloat(e.target.value) }),
                  className: "w-full"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Max Tokens" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: config.maxTokens,
                  onChange: (e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) }),
                  className: "bg-[#111] border-[#333] h-9"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Stream Response" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setConfig({ ...config, stream: !config.stream }),
                  className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${config.stream ? "bg-blue-500" : "bg-[#333]"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${config.stream ? "translate-x-5" : "translate-x-1"}`
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Include Workspace Context" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setConfig({ ...config, includeWorkspace: !config.includeWorkspace }),
                  className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${config.includeWorkspace ? "bg-blue-500" : "bg-[#333]"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${config.includeWorkspace ? "translate-x-5" : "translate-x-1"}`
                    }
                  )
                }
              )
            ] })
          ] })
        ] }),
        lastRequest && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3 h-3 text-[#666]" }),
            "Last Request"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] font-mono", children: lastRequest.method }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[#666] font-mono", children: lastRequest.url })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-[#111] border border-[#222] rounded p-2 text-[10px] text-[#888] overflow-x-auto", children: JSON.stringify(lastRequest.body, null, 2) }),
            lastResponse && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-green-500/10 text-green-500 border-green-500/20 text-[9px] font-mono", children: lastResponse.status }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[#666]", children: "Response" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] text-[#666] font-mono", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Tokens: ",
                  lastResponse.data.tokens_used
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1.2s" })
              ] })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0A0A0A] border-[#333] h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-[#666]" }),
            "Chat Interface"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Interact with the AI model in real-time" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto space-y-4 mb-4 max-h-[500px]", children: [
            messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-sm text-[#666]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-12 h-12 text-[#333] mx-auto mb-4" }),
              "Start a conversation by typing a message below"
            ] }) : messages.map((msg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `max-w-[80%] rounded-lg p-3 ${msg.role === "user" ? "bg-blue-500/10 border border-blue-500/20 text-foreground" : "bg-[#111] border border-[#222] text-[#888]"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-[#666] mb-1 uppercase tracking-wider", children: msg.role }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm whitespace-pre-wrap", children: msg.content }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-[#666] mt-2", children: msg.timestamp.toLocaleTimeString() })
                    ]
                  }
                )
              },
              idx
            )),
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#111] border border-[#222] rounded-lg p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-[#666]", children: "AI is thinking..." })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && handleSend(),
                placeholder: "Type your message... (Shift+Enter for new line)",
                className: "bg-[#111] border-[#333] flex-1",
                disabled: isLoading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSend, disabled: isLoading || !input.trim(), className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }) })
          ] })
        ] })
      ] }) })
    ] })
  ] }) });
}
export {
  APIPlayground as default
};
//# sourceMappingURL=APIPlayground-BmC0PpZd.js.map
