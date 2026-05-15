import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EvidenceUpload() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [message, setMessage] = useState("");

  const [evidenceId, setEvidenceId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [sourceDevice, setSourceDevice] = useState("");
  const [logType, setLogType] = useState("");
  const [metadataJson, setMetadataJson] = useState("{}");

  const allowedExtensions = [".csv", ".img", ".iso", ".dd"];

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.slice(selectedFile.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      alert("Please upload a CSV or disk image file (.csv, .img, .iso, .dd)!");
      setFile(null);
      setHash("");
      return;
    }

    setFile(selectedFile);

    // Compute SHA-256 hash
    const arrayBuffer = await selectedFile.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setHash(hashHex);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // Validation
    if (!file || !evidenceId || !caseId || !sourceDevice || !logType) {
      alert("Please fill all fields and select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("evidence_id", evidenceId);
      formData.append("case_id", parseInt(caseId, 10)); // convert to integer
      formData.append("source_device", sourceDevice);
      formData.append("log_type", logType);
      formData.append("metadata_json", metadataJson);

      const response = await axios.post(
        "http://localhost:8000/evidence/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(`Uploaded "${file.name}" successfully! SHA-256: ${response.data.sha256}`);
      setFile(null);
      setHash("");
      setEvidenceId("");
      setCaseId("");
      setSourceDevice("");
      setLogType("");
      setMetadataJson("{}");
    } catch (error) {
      console.error("Upload error:", error.response?.status, error.response?.data);
      const errMsg = error.response?.data?.detail || error.response?.data || error.message;
      setMessage(`Upload failed: ${errMsg}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload Evidence</h1>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Evidence ID"
          value={evidenceId}
          onChange={(e) => setEvidenceId(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Case ID"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Source Device"
          value={sourceDevice}
          onChange={(e) => setSourceDevice(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Log Type"
          value={logType}
          onChange={(e) => setLogType(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder='Metadata JSON (optional)'
          value={metadataJson}
          onChange={(e) => setMetadataJson(e.target.value)}
          rows={3}
        />
        <br />
        <input
          type="file"
          accept=".csv,.img,.iso,.dd"
          onChange={handleFileChange}
          required
        />
        <br />
        {file && (
          <p>
            Selected file: {file.name} <br />
            SHA-256: {hash}
          </p>
        )}
        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
          Upload
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
