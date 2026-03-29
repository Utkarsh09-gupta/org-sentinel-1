import { createContext, useContext, useState, ReactNode } from "react";

export interface AccessEntry {
  userId: string;
  role: string;
  resource: string;
  permission: string;
}

export interface RiskFinding {
  resource: string;
  risk: string;
  description: string;
  severity: "Critical" | "High" | "Medium";
}

export interface SimulationResult {
  entries: AccessEntry[];
  nodes: { id: string; label: string; type: "user" | "resource"; risk: string }[];
  edges: { from: string; to: string; permission: string }[];
  heatmap: { label: string; risk: number; color: string }[];
  scenarios: { text: string; risk: string }[];
  blastRadius: number;
  source?: "demo" | "live" | "csv";
}

interface SimulationContextType {
  result: SimulationResult | null;
  setResult: (r: SimulationResult | null) => void;
}

const SimulationContext = createContext<SimulationContextType>({ result: null, setResult: () => {} });

export const useSimulation = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<SimulationResult | null>(null);
  return (
    <SimulationContext.Provider value={{ result, setResult }}>
      {children}
    </SimulationContext.Provider>
  );
};
