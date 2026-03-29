import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface Integration {
  id: string;
  name: string;
  category: "identity" | "cloud" | "hr";
  description: string;
  dataDescription: string;
  icon: string;
  status: "disconnected" | "connecting" | "connected";
}

export interface DataHealthResult {
  score: number;
  warnings: string[];
  totalRecords: number;
  validRecords: number;
  duplicates: number;
  missingFields: number;
}

export interface LiveEvent {
  id: string;
  timestamp: Date;
  type: "role_change" | "new_admin" | "suspicious_access" | "permission_grant";
  message: string;
  severity: "info" | "warning" | "critical";
}

interface IntegrationContextType {
  integrations: Integration[];
  mode: "demo" | "live" | "csv";
  setMode: (m: "demo" | "live" | "csv") => void;
  connect: (id: string) => Promise<void>;
  disconnect: (id: string) => void;
  connectedCount: number;
  liveEvents: LiveEvent[];
  dataHealth: DataHealthResult | null;
  isSyncing: boolean;
  setCSVDataHealth: (total: number) => void;
}

const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: "azure-ad", name: "Azure Active Directory", category: "identity", description: "Sync users, groups, and role assignments from Azure AD.", dataDescription: "Users, Groups, Role Assignments", icon: "shield", status: "disconnected" },
  { id: "okta", name: "Okta", category: "identity", description: "Import identity data, SSO configurations, and access policies.", dataDescription: "Identities, SSO Config, Policies", icon: "key", status: "disconnected" },
  { id: "google-workspace", name: "Google Workspace", category: "identity", description: "Pull user accounts, admin roles, and organizational units.", dataDescription: "Accounts, Admin Roles, OUs", icon: "globe", status: "disconnected" },
  { id: "aws-cloudtrail", name: "AWS CloudTrail", category: "cloud", description: "Ingest API activity logs, IAM changes, and resource access events.", dataDescription: "API Logs, IAM Events, Access Logs", icon: "cloud", status: "disconnected" },
  { id: "gcp-logs", name: "GCP Audit Logs", category: "cloud", description: "Stream audit logs, permission changes, and service account activity.", dataDescription: "Audit Logs, Permission Changes", icon: "server", status: "disconnected" },
  { id: "internal-logs", name: "Internal System Logs", category: "cloud", description: "Connect internal application logs and access monitoring systems.", dataDescription: "App Logs, Access Monitors", icon: "activity", status: "disconnected" },
  { id: "hr-roles", name: "Employee Roles (HRIS)", category: "hr", description: "Import employee roles, departments, and organizational hierarchy.", dataDescription: "Roles, Departments, Hierarchy", icon: "users", status: "disconnected" },
  { id: "hr-departments", name: "Department Data", category: "hr", description: "Sync department structures, team assignments, and reporting lines.", dataDescription: "Departments, Teams, Reports", icon: "building", status: "disconnected" },
];

const LIVE_EVENT_TEMPLATES: Omit<LiveEvent, "id" | "timestamp">[] = [
  { type: "role_change", message: "Role changed: user_42 moved from Engineer to Admin", severity: "warning" },
  { type: "new_admin", message: "New admin added: user_78 granted full admin privileges", severity: "critical" },
  { type: "suspicious_access", message: "Suspicious access: user_15 accessed Payment System from unknown IP", severity: "critical" },
  { type: "permission_grant", message: "Permission granted: Vendor account given write access to GitHub Repo", severity: "warning" },
  { type: "role_change", message: "Role change: user_23 department transfer — permissions not updated", severity: "warning" },
  { type: "suspicious_access", message: "After-hours access: user_31 accessed Customer Database at 3:42 AM", severity: "critical" },
  { type: "permission_grant", message: "Bulk permission update: 12 users granted Cloud Storage write access", severity: "info" },
  { type: "new_admin", message: "Elevated privileges: intern_05 temporarily granted admin access", severity: "critical" },
];

const IntegrationContext = createContext<IntegrationContextType>({
  integrations: DEFAULT_INTEGRATIONS,
  mode: "demo",
  setMode: () => {},
  connect: async () => {},
  disconnect: () => {},
  connectedCount: 0,
  liveEvents: [],
  dataHealth: null,
  isSyncing: false,
  setCSVDataHealth: () => {},
});

export const useIntegrations = () => useContext(IntegrationContext);

export const IntegrationProvider = ({ children }: { children: ReactNode }) => {
  const [integrations, setIntegrations] = useState<Integration[]>(DEFAULT_INTEGRATIONS);
  const [mode, setMode] = useState<"demo" | "live" | "csv">("demo");
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [dataHealth, setDataHealth] = useState<DataHealthResult | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const computeDataHealth = useCallback((connectedIds: string[]): DataHealthResult => {
    const total = connectedIds.length * 120 + Math.floor(Math.random() * 80);
    const missing = Math.floor(Math.random() * 8) + 2;
    const dupes = Math.floor(Math.random() * 5) + 1;
    const valid = total - missing - dupes;
    const score = Math.round((valid / total) * 100);
    const warnings: string[] = [];
    if (missing > 4) warnings.push("⚠ Multiple records with missing permission fields detected");
    if (dupes > 2) warnings.push("⚠ Duplicate user entries found across integrations");
    if (connectedIds.length > 2) warnings.push("⚠ Inconsistent role mapping detected across sources");
    if (score < 90) warnings.push("⚠ Some access entries have incomplete resource references");
    return { score, warnings, totalRecords: total, validRecords: valid, duplicates: dupes, missingFields: missing };
  }, []);

  const computeCSVHealth = useCallback((total: number): DataHealthResult => {
    const missing = Math.floor(Math.random() * 3);
    const dupes = Math.floor(Math.random() * 2);
    const valid = total - missing - dupes;
    const score = total > 0 ? Math.round((valid / total) * 100) : 0;
    const warnings: string[] = [];
    if (score < 95) warnings.push("⚠ Some CSV records have formatting issues");
    return { score, warnings, totalRecords: total, validRecords: valid, duplicates: dupes, missingFields: missing };
  }, []);

  const setCSVDataHealth = useCallback((total: number) => {
    setDataHealth(computeCSVHealth(total));
  }, [computeCSVHealth]);

  const generateLiveEvent = useCallback(() => {
    const template = LIVE_EVENT_TEMPLATES[Math.floor(Math.random() * LIVE_EVENT_TEMPLATES.length)];
    const event: LiveEvent = { ...template, id: crypto.randomUUID(), timestamp: new Date() };
    setLiveEvents(prev => [event, ...prev].slice(0, 20));
  }, []);

  const connect = useCallback(async (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: "connecting" as const } : i));
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
    setIntegrations(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, status: "connected" as const } : i);
      const connectedIds = updated.filter(i => i.status === "connected").map(i => i.id);
      setDataHealth(computeDataHealth(connectedIds));
      return updated;
    });
    setIsSyncing(false);
    generateLiveEvent();
  }, [computeDataHealth, generateLiveEvent]);

  const disconnect = useCallback((id: string) => {
    setIntegrations(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, status: "disconnected" as const } : i);
      const connectedIds = updated.filter(i => i.status === "connected").map(i => i.id);
      setDataHealth(connectedIds.length > 0 ? computeDataHealth(connectedIds) : null);
      return updated;
    });
  }, [computeDataHealth]);

  const connectedCount = integrations.filter(i => i.status === "connected").length;

  return (
    <IntegrationContext.Provider value={{ integrations, mode, setMode, connect, disconnect, connectedCount, liveEvents, dataHealth, isSyncing, setCSVDataHealth }}>
      {children}
    </IntegrationContext.Provider>
  );
};
