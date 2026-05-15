import React, { useEffect, useState } from "react";
import {
  fetchCasesFull,
  fetchAuditLogs,
  fetchChainOfCustody,
  createCase,
} from "../services/api";

export default function CasesList() {
  const [cases, setCases] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [custody, setCustody] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const casesData = await fetchCasesFull();
      setCases(casesData);

      const logs = await fetchAuditLogs();
      setAuditLogs(logs);

      const custodyData = await fetchChainOfCustody();
      setCustody(custodyData);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }

  async function handleCreateCase(e) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createCase({
        title: title,
        description: description,
      });

      setTitle("");
      setDescription("");

      loadAll();
    } catch (err) {
      console.error("Failed to create case:", err);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Forensic CMS Dashboard</h1>

      {/* CASES */}
      <h2>Cases</h2>
      {cases.length === 0 ? (
        <p>No cases found.</p>
      ) : (
        <ul>
          {cases.map((c) => (
            <li key={c.case_id} style={{ marginBottom: "12px" }}>
              <strong>{c.title}</strong>
              <div>{c.description}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Created: {new Date(c.created_at).toLocaleString()}
              </div>
              <div>Evidence items: {c.evidence.length}</div>
            </li>
          ))}
        </ul>
      )}

      {/* AUDIT LOGS */}
      <h2>Audit Logs</h2>
      {auditLogs.length === 0 ? (
        <p>No audit logs.</p>
      ) : (
        <ul>
          {auditLogs.map((log) => (
            <li key={log.id}>
              {log.action} – {log.timestamp}
            </li>
          ))}
        </ul>
      )}

      {/* CHAIN OF CUSTODY */}
      <h2>Chain of Custody</h2>
      {custody.length === 0 ? (
        <p>No custody records.</p>
      ) : (
        <ul>
          {custody.map((c) => (
            <li key={c.id}>
              Evidence #{c.evidence_id} – {c.action} by {c.operator}
            </li>
          ))}
        </ul>
      )}

      {/* CREATE CASE */}
      <h2>Create New Case</h2>
      <form onSubmit={handleCreateCase}>
        <input
          type="text"
          placeholder="Case title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />

        <button type="submit">Add Case</button>
      </form>
    </div>
  );
}
