import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/* ================= AUTH ================= */

export async function login(username, password) {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const response = await api.post("/auth/token", form.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
}

/* ================= CASES ================= */

export async function fetchCases() {
  const response = await api.get("/cases");
  return response.data;
}

export async function createCase(caseData) {
  const response = await api.post("/cases", caseData);
  return response.data;
}

/* ================= EVIDENCE ================= */

export async function uploadEvidence(formData) {
  const response = await api.post("/evidence/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function fetchEvidenceForCase(caseId) {
  const response = await api.get(`/evidence/case/${caseId}`);
  return response.data;
}

export async function fetchEvidenceDetail(evidenceId) {
  const response = await api.get(`/evidence/${evidenceId}`);
  return response.data;
}

/* ================= AUDIT & CUSTODY ================= */

export async function fetchAuditLogs() {
  const response = await api.get("/audit_logs");
  return response.data;
}

export async function fetchChainOfCustody() {
  const response = await api.get("/chain_of_custody");
  return response.data;
}
export async function fetchCasesFull() {
  const response = await api.get("/cases/full");
  return response.data;
}
