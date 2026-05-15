import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      {/* Header */}
      <div className="app-header">
        Forensic CMS — Dashboard
      </div>

      {/* Main content */}
      <div className="app-container">
        <div className="dashboard-title">Dashboard</div>

        <div className="card-grid">
          {/* Cases */}
          <div className="dashboard-card">
            <h3>Ongoing Cases</h3>
            <p>View and manage active forensic investigations.</p>
            <Link to="/cases">View cases →</Link>
          </div>

          {/* Evidence */}
          <div className="dashboard-card">
            <h3>Evidence Uploads</h3>
            <p>Upload and analyze digital evidence securely.</p>
            <Link to="/upload">Upload evidence →</Link>
          </div>

          {/* Audit */}
          <div className="dashboard-card">
            <h3>Audit Logs</h3>
            <p>Track system activity and investigator actions.</p>
            <Link to="/audit">View audit logs →</Link>
          </div>
        </div>
      </div>
    </>
  );
}
