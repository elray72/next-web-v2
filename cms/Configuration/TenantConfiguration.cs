namespace Web.Configuration;

public static class TenantConfiguration
{
    public static readonly Dictionary<string, string[]> TenantZones = new()
    {
        ["diet.mayoclinic.org"] = ["marketing", "member", "onboarding"],
        ["www.totalwellbeingdiet.com"] = ["marketing", "member", "onboarding"],
        ["www.digitalwellness.com"] = ["marketing"]
    };

    public static readonly Dictionary<string, string> TenantDefaultZone = new()
    {
        ["diet.mayoclinic.org"] = "marketing",
        ["www.totalwellbeingdiet.com"] = "marketing",
        ["www.digitalwellness.com"] = "marketing"
    };

    public static bool IsValidTenant(string host) => TenantZones.ContainsKey(host);

    public static bool IsValidZoneForTenant(string host, string zone) =>
        TenantZones.TryGetValue(host, out var zones) && zones.Contains(zone);

    public static string GetDefaultZone(string host) =>
        TenantDefaultZone.TryGetValue(host, out var zone) ? zone : "marketing";
}
