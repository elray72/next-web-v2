namespace DW.Cms.Services;

public class TenantService : ITenantService
{
    public string? Tenant { get; private set; }
    public string? Zone { get; private set; }

    public void SetContext(string tenant, string zone)
    {
        Tenant = tenant;
        Zone = zone;
    }
}
