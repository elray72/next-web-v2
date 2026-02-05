using Web.Configuration;
using Web.Services;

namespace Web.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ITenantService tenantService)
    {
        var host = context.Request.Host.Host;
        var pathSegments = context.Request.Path.Value?.TrimStart('/').Split('/', StringSplitOptions.RemoveEmptyEntries);
        var zone = pathSegments?.FirstOrDefault() ?? "marketing";

        if (TenantConfiguration.IsValidTenant(host))
        {
            if (!TenantConfiguration.IsValidZoneForTenant(host, zone))
            {
                zone = TenantConfiguration.GetDefaultZone(host);
            }

            tenantService.SetContext(host, zone);
            context.Request.Headers["X-Tenant"] = host;
            context.Request.Headers["X-Zone"] = zone;
        }

        await _next(context);
    }
}

public static class TenantMiddlewareExtensions
{
    public static IApplicationBuilder UseTenantMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<TenantMiddleware>();
    }
}
