using System.Net;

namespace AgentDock.Backend.Infrastructure.Middleware;

public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    private const string APIKEYNAME = "Authorization";
    private const string APIKEYNAME_ALT = "x-api-key";

    public ApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip auth for internal API or specific paths if needed
        // For now, we apply it to /v1/ paths which are the public OpenAI ones
        if (!context.Request.Path.StartsWithSegments("/v1"))
        {
            await _next(context);
            return;
        }

        var configuredApiKey = _configuration["Security:ApiKey"];
        
        // If no key is configured, allow access (or block? let's allow for now but warn)
        if (string.IsNullOrEmpty(configuredApiKey))
        {
            await _next(context);
            return;
        }

        string? extractedApiKey = null;

        // Try Bearer token
        if (context.Request.Headers.TryGetValue(APIKEYNAME, out var extractedAuthHeader))
        {
            var authHeader = extractedAuthHeader.ToString();
            if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                extractedApiKey = authHeader.Substring(7).Trim();
            }
        }

        // Try x-api-key
        if (string.IsNullOrEmpty(extractedApiKey) && context.Request.Headers.TryGetValue(APIKEYNAME_ALT, out var extractedAltKey))
        {
            extractedApiKey = extractedAltKey.ToString();
        }

        if (string.IsNullOrEmpty(extractedApiKey) || !string.Equals(extractedApiKey, configuredApiKey, StringComparison.Ordinal))
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.WriteAsync("Unauthorized: Invalid API Key");
            return;
        }

        await _next(context);
    }
}
