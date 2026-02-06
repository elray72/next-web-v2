namespace DW.Cms.Services;

public interface ITenantService
{
    string? Tenant { get; }
    string? Zone { get; }
    void SetContext(string tenant, string zone);
}
