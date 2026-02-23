using DW.Cms.Middleware;
using DW.Cms.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Register tenant service
builder.Services.AddScoped<ITenantService, TenantService>();

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .AddUSync()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();

// Add tenant middleware before Umbraco
app.UseTenantMiddleware();

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();
