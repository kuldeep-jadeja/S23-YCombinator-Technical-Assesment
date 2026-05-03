// submit.js — Submit button that validates the pipeline via backend API
// Sends nodes and edges to the backend and displays results in a modal
import { useState } from 'react';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const SubmitButton = ({ nodes = [], edges = [] }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Send pipeline to backend for validation
  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bottom bar with stats and submit button */}
      <div style={barStyle}>
        <div style={statsStyle}>
          <Chip label="Nodes" value={nodes.length} color="var(--node-transform)" />
          <Chip label="Edges" value={edges.length} color="var(--accent-primary)" />
        </div>

        {loading && (
          <div style={loadingIndicatorStyle}>
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={loadingTextStyle}>Analyzing pipeline...</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...btnStyle, ...(loading ? btnDisabledStyle : {}) }}
          onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--accent-secondary)')}
          onMouseLeave={e => !loading && (e.currentTarget.style.background = 'var(--accent-primary)')}
        >
          {loading ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Validating...</>
          ) : (
            'Validate Pipeline'
          )}
        </button>
      </div>

      {/* Result or error modal */}
      {(result || error) && (
        <div style={overlayStyle} onClick={() => { setResult(null); setError(null); }}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            {error ? (
              // Connection error state
              <>
                <div style={errorHeaderStyle}>
                  <XCircle size={24} color="var(--node-api)" />
                  <span style={{ color: 'var(--node-api)', fontSize: 18, fontFamily: 'var(--font-heading)' }}>Connection Error</span>
                </div>
                <p style={modalBodyStyle}>{error}</p>
                <p style={{ ...modalBodyStyle, fontSize: 13, color: 'var(--text-secondary)' }}>
                  Make sure the backend is running:
                </p>
                <code style={codeStyle}>cd backend && uvicorn main:app --reload</code>
              </>
            ) : (
              // Success state — show pipeline stats
              <>
                <div style={{
                  ...modalHeaderStyle,
                  borderColor: result.is_dag ? 'var(--node-transform)' : 'var(--node-conditional)'
                }}>
                  <div style={statusIconStyle}>
                    {result.is_dag ? (
                      <CheckCircle2 size={28} color="var(--node-transform)" />
                    ) : (
                      <XCircle size={28} color="var(--node-conditional)" />
                    )}
                  </div>
                  <span style={{
                    color: result.is_dag ? 'var(--node-transform)' : 'var(--node-conditional)',
                    fontSize: 22,
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {result.is_dag ? 'Valid DAG' : 'Cycle Detected'}
                  </span>
                </div>

                <div style={metricsStyle}>
                  <Metric label="Nodes" value={result.num_nodes} color="var(--node-text-header)" />
                  <Metric label="Edges" value={result.num_edges} color="var(--accent-primary)" />
                  <Metric
                    label="Is DAG"
                    value={result.is_dag ? 'Yes' : 'No'}
                    color={result.is_dag ? 'var(--node-transform)' : 'var(--node-conditional)'}
                  />
                </div>

                {/* Warning message if present */}
                {result.warning && (
                  <div style={warningStyle}>
                    <AlertCircle size={14} />
                    <span>{result.warning}</span>
                  </div>
                )}

                <p style={{ ...modalBodyStyle, fontSize: 14, marginTop: 16 }}>
                  {result.is_dag
                    ? 'Pipeline has no cycles — safe to execute.'
                    : 'Pipeline contains a cycle. Remove circular connections before execution.'}
                </p>
              </>
            )}
            <button style={closeBtnStyle} onClick={() => { setResult(null); setError(null); }}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Small chip showing a label and value (e.g., "NODES 2")
const Chip = ({ label, value, color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
  }}>
    <span style={{ color, fontWeight: 500, fontSize: 16 }}>{value}</span>
    <span style={{ letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: 12 }}>{label}</span>
  </div>
);

// Metric display in the modal (large number with label below)
const Metric = ({ label, value, color }) => (
  <div style={{
    flex: 1,
    textAlign: 'center',
    padding: '16px 12px',
    background: 'transparent',
    border: `1px solid var(--border-medium)`,
    borderRadius: 'var(--radius-md)',
  }}>
    <div style={{ fontSize: 28, fontWeight: 400, color, fontFamily: 'var(--font-heading)' }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4 }}>{label}</div>
  </div>
);

// Styles
const barStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 24px',
  background: 'var(--bg-canvas)',
  borderTop: '1px solid var(--border-light)',
};

const statsStyle = {
  display: 'flex',
  gap: 24,
};

const loadingIndicatorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: 'var(--text-secondary)',
  fontSize: 13,
  animation: 'fadeIn 0.2s ease',
};

const loadingTextStyle = {
  fontFamily: 'var(--font-body)',
};

const btnStyle = {
  background: 'var(--accent-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 500,
  fontFamily: 'var(--font-body)',
  letterSpacing: '0',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  transition: 'background var(--transition-fast)',
  boxShadow: 'var(--shadow-sm)',
};

const btnDisabledStyle = {
  opacity: 0.6,
  cursor: 'not-allowed',
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(20, 20, 19, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  animation: 'fadeIn 0.2s ease',
};

const modalStyle = {
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-xl)',
  padding: 24,
  minWidth: 380,
  maxWidth: 460,
  boxShadow: 'var(--shadow-lg)',
  fontFamily: 'var(--font-body)',
  animation: 'slideUp 0.2s ease',
};

const modalHeaderStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  paddingBottom: 20,
  marginBottom: 20,
  borderBottom: '1px solid var(--border-light)',
};

const errorHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  paddingBottom: 16,
  marginBottom: 16,
  borderBottom: '1px solid var(--border-light)',
};

const statusIconStyle = {
  marginBottom: 4,
};

const modalBodyStyle = {
  fontSize: 13,
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  margin: 0,
  textAlign: 'center',
};

const warningStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  marginTop: 16,
  background: 'var(--node-output-bg)',
  border: '1px solid var(--node-output)',
  borderRadius: 'var(--radius-md)',
  fontSize: 12,
  color: 'var(--node-output-header)',
};

const metricsStyle = {
  display: 'flex',
  gap: 12,
};

const closeBtnStyle = {
  marginTop: 20,
  width: '100%',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'var(--font-body)',
  padding: '10px 0',
  cursor: 'pointer',
  letterSpacing: '0.02em',
  transition: 'background var(--transition-fast)',
};

const codeStyle = {
  display: 'block',
  margin: '8px 0 16px',
  background: 'var(--bg-secondary)',
  padding: '8px 12px',
  borderRadius: 'var(--radius-sm)',
  fontSize: 12,
  color: 'var(--accent-primary)',
  fontFamily: 'var(--font-mono)',
};