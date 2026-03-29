import type { AccessEntry } from "@/context/SimulationContext";

// Simulated API endpoints data
export const mockUsers = [
  { id: "u1", name: "Alice Chen", email: "alice@company.com", department: "Engineering" },
  { id: "u2", name: "Bob Martinez", email: "bob@company.com", department: "Finance" },
  { id: "u3", name: "Claire Vendor", email: "claire@vendor.io", department: "External" },
  { id: "u4", name: "Dave Intern", email: "dave@company.com", department: "Engineering" },
  { id: "u5", name: "Eve Admin", email: "eve@company.com", department: "IT" },
  { id: "u6", name: "Frank HR", email: "frank@company.com", department: "HR" },
  { id: "u7", name: "Grace Ops", email: "grace@company.com", department: "Operations" },
  { id: "u8", name: "Hank Sales", email: "hank@company.com", department: "Sales" },
];

export const mockRoles = [
  { userId: "u1", role: "Engineer", source: "Azure AD" },
  { userId: "u2", role: "Admin", source: "Okta" },
  { userId: "u3", role: "Vendor", source: "Google Workspace" },
  { userId: "u4", role: "Intern", source: "Azure AD" },
  { userId: "u5", role: "Admin", source: "Okta" },
  { userId: "u6", role: "Employee", source: "HRIS" },
  { userId: "u7", role: "Employee", source: "HRIS" },
  { userId: "u8", role: "Employee", source: "Google Workspace" },
];

export const mockPermissions = [
  { userId: "u1", resource: "GitHub Repo", permission: "write" },
  { userId: "u1", resource: "Cloud Storage", permission: "read" },
  { userId: "u2", resource: "Payment System", permission: "admin" },
  { userId: "u2", resource: "Customer Database", permission: "admin" },
  { userId: "u3", resource: "GitHub Repo", permission: "write" },
  { userId: "u3", resource: "Payment System", permission: "read" },
  { userId: "u4", resource: "Customer Database", permission: "read" },
  { userId: "u4", resource: "GitHub Repo", permission: "read" },
  { userId: "u5", resource: "Auth Service", permission: "admin" },
  { userId: "u5", resource: "Cloud Storage", permission: "admin" },
  { userId: "u6", resource: "Cloud Storage", permission: "read" },
  { userId: "u7", resource: "Customer Database", permission: "read" },
  { userId: "u8", resource: "Cloud Storage", permission: "read" },
];

export const mockActivityLogs = [
  { userId: "u2", action: "Modified admin settings", resource: "Payment System", timestamp: "2024-01-15T14:23:00Z" },
  { userId: "u4", action: "Exported customer records", resource: "Customer Database", timestamp: "2024-01-15T03:42:00Z" },
  { userId: "u3", action: "Pushed code update", resource: "GitHub Repo", timestamp: "2024-01-14T22:10:00Z" },
  { userId: "u5", action: "Created new admin account", resource: "Auth Service", timestamp: "2024-01-14T16:30:00Z" },
  { userId: "u1", action: "Accessed production logs", resource: "Cloud Storage", timestamp: "2024-01-14T09:15:00Z" },
];

export function fetchMockAccessEntries(): AccessEntry[] {
  return mockPermissions.map(p => {
    const roleEntry = mockRoles.find(r => r.userId === p.userId);
    return {
      userId: p.userId,
      role: roleEntry?.role ?? "Unknown",
      resource: p.resource,
      permission: p.permission,
    };
  });
}

// Simulate async API fetch with delay
export async function simulateApiFetch<T>(data: T, delayMs = 800): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs));
  return data;
}
