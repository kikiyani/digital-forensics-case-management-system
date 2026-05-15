import React, { useState } from "react";

export default function Cases() {
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  
  // Replace with your actual cases data
  const cases = [
    {
      id: 1,
      title: "murder",
      description: "i was murdered"
    },
    {
      id: 2,
      title: "digital",
      description: "dos attack"
    },
    {
      id: 3,
      title: "theft",
      description: "crime"
    },
    {
      id: 4,
      title: "stealing",
      description: ""
    }
  ];

  const handleAddCase = () => {
    if (caseTitle && caseDescription) {
      console.log("Adding case:", { caseTitle, caseDescription });
      // Add your case creation logic here
      setCaseTitle("");
      setCaseDescription("");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="app-header">
        Forensic CMS — Cases
      </div>

      {/* Main content */}
      <div className="app-container">
        <div className="dashboard-title">All Cases</div>
        
        <div className="card-grid">
          {/* Existing Cases */}
          {cases.map((caseItem) => (
            <div key={caseItem.id} className="dashboard-card">
              <h3>{caseItem.title}</h3>
              <p>{caseItem.description || "No description provided"}</p>
              <a href={`/cases/${caseItem.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                Upload evidence →
              </a>
            </div>
          ))}
        </div>

        {/* Create Case Section */}
        <div style={{ marginTop: '3rem' }}>
          <div className="dashboard-title">Create Case</div>
          
          <div className="dashboard-card" style={{ maxWidth: '600px' }}>
            <h3>New Case Information</h3>
            
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Case Title
              </label>
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="Enter case title"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem'
                }}
              />
              
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Description
              </label>
              <textarea
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                placeholder="Enter case description"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  marginBottom: '1.5rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              
              <button
                onClick={handleAddCase}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Add Case
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
