import React, { useState } from "react";

export default function AuditPage() {
  const [files, setFiles] = useState([]);
  const [hashes, setHashes] = useState({});

  // Convert ArrayBuffer to hex string
  const bufferToHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files));
    setHashes({}); // reset previous hashes
  };

  const computeHashes = async () => {
    const newHashes = {};
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      newHashes[file.name] = bufferToHex(hashBuffer);
    }
    setHashes(newHashes);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Audit Logs - Evidence Integrity Check</h1>
      <p>
        Upload CSV files to verify the integrity of evidence items using SHA-256
        hashes.
      </p>

      <input
        type="file"
        accept=".csv"
        multiple
        onChange={handleFilesChange}
        style={{ margin: "10px 0" }}
      />

      {files.length > 0 && (
        <div>
          <button
            onClick={computeHashes}
            style={{
              padding: "8px 16px",
              marginBottom: "20px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Compute SHA-256 Hashes
          </button>

          <h2>Hashes:</h2>
          <ul>
            {Object.entries(hashes).map(([filename, hash]) => (
              <li key={filename}>
                <strong>{filename}:</strong> {hash}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
