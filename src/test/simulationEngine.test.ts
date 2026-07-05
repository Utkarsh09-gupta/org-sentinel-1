import { describe, it, expect } from "vitest";
import { runSimulation } from "../lib/simulationEngine";
import type { AccessEntry } from "../context/SimulationContext";

describe("Simulation Rules Engine (simulationEngine.ts)", () => {
  it("should flag Intern Data Exposure when an intern reads customer data", () => {
    const entries: AccessEntry[] = [
      { userId: "u_intern", role: "Intern", resource: "Customer Database", permission: "read" }
    ];

    const result = runSimulation(entries);
    const scenario = result.scenarios.find(s => s.text.includes("exported customer data"));
    
    expect(scenario).toBeDefined();
    expect(scenario?.risk).toBe("Critical");
  });

  it("should flag Supply Chain Risk when a vendor writes to code repository", () => {
    const entries: AccessEntry[] = [
      { userId: "u_vendor", role: "Vendor", resource: "GitHub Repo", permission: "write" }
    ];

    const result = runSimulation(entries);
    const scenario = result.scenarios.find(s => s.text.includes("Vendor pushed malicious code"));
    
    expect(scenario).toBeDefined();
    expect(scenario?.risk).toBe("High");
  });

  it("should flag Critical Privilege Risk when an admin manages payment systems", () => {
    const entries: AccessEntry[] = [
      { userId: "u_admin", role: "Admin", resource: "Payment System", permission: "admin" }
    ];

    const result = runSimulation(entries);
    const scenario = result.scenarios.find(s => s.text.includes("Admin privilege misuse"));
    
    expect(scenario).toBeDefined();
    expect(scenario?.risk).toBe("Critical");
  });

  it("should flag Data Modification Risk when write/admin permissions exist on sensitive resources", () => {
    const entries: AccessEntry[] = [
      { userId: "u_engineer", role: "Engineer", resource: "Cloud Storage", permission: "write" }
    ];

    const result = runSimulation(entries);
    const scenario = result.scenarios.find(s => s.text.includes("has write access to sensitive Cloud Storage"));
    
    expect(scenario).toBeDefined();
    expect(scenario?.risk).toBe("High");
  });

  it("should flag Privilege Overlap when multiple roles access the same resource", () => {
    const entries: AccessEntry[] = [
      { userId: "u1", role: "Engineer", resource: "Shared Bucket", permission: "read" },
      { userId: "u2", role: "HR", resource: "Shared Bucket", permission: "read" }
    ];

    const result = runSimulation(entries);
    const scenario = result.scenarios.find(s => s.text.includes("Multiple roles accessed"));
    
    expect(scenario).toBeDefined();
    expect(scenario?.risk).toBe("Medium");
  });

  it("should calculate correct Blast Radius and map node risk statuses", () => {
    const entries: AccessEntry[] = [
      { userId: "u1", role: "Intern", resource: "Customer DB", permission: "read" }, // Critical (30 pts)
      { userId: "u2", role: "Vendor", resource: "GitHub Repo", permission: "write" } // High (20 pts)
    ];

    const result = runSimulation(entries);
    // Base is 15. Customer DB score: 15 + 30 = 45 (medium). GitHub Repo score: 15 + 20 = 35 (low).
    // Average score: (45 + 35) / 2 = 40.
    expect(result.blastRadius).toBe(40);
    
    const dbNode = result.nodes.find(n => n.id === "Customer DB");
    expect(dbNode?.risk).toBe("medium");

    const repoNode = result.nodes.find(n => n.id === "GitHub Repo");
    expect(repoNode?.risk).toBe("low");
  });
});
