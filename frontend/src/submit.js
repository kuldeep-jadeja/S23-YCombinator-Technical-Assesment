// submit.js — VectorShift-styled pipeline submission (light mode)
import { useState } from 'react';

export const SubmitButton = ({ nodes = [], edges = [] }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      <div style={barStyle}>
        <div style={statsStyle}>
          <Chip label="Nodes" value={nodes.length} color="#10b981" />
          <Chip label="Edges" value={edges.length} color="#8b5cf6" />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...btnStyle, ...(loading ? btnDisabledStyle : {}) }}
          onMouseEnter={e => !loading && (e.currentTarget.style.background = '#7c3aed')}
          onMouseLeave={e => !loading && (e.currentTarget.style.background = 'var(--accent-primary)')}
        >
          {loading ? (
            <><span style={spinnerStyle}>⟳</span> Analyzing…</>
          ) : (
            '⬡ Validate Pipeline'
          )}
        </button>
      </div>

      {/* Result Modal */}
      {(result || error) && (
        <div style={overlayStyle} onClick={() => { setResult(null); setError(null); }}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            {error ? (
              <>
                <div style={{ ...modalHeaderStyle, borderColor: '#f43f5e' }}>
                  <span style={{ color: '#f43f5e', fontSize: 16 }}>✕ Connection Error</span>
                </div>
                <p style={modalBodyStyle}>{error}</p>
                <p style={{ ...modalBodyStyle, fontSize: 11, color: 'var(--text-secondary)' }}>
                  Make sure the backend is running: <code style={codeStyle}>uvicorn main:app --reload</code>
                </p>
              </>
            ) : (
              <>
                <div style={{ ...modalHeaderStyle, borderColor: result.is_dag ? '#10b981' : '#f59e0b' }}>
                  <span style={{ color: result.is_dag ? '#10b981' : '#f59e0b', fontSize: 16 }}>
                    {result.is_dag ? '✓ Valid DAG' : '⚠ Cycle Detected'}
                  </span>
                </div>
                <div style={metricsStyle}>
                  <Metric label="Nodes" value={result.num_nodes} color="#10b981" />
                  <Metric label="Edges" value={result.num_edges} color="#8b5cf6" />
                  <Metric
                    label="Is DAG"
                    value={result.is_dag ? 'Yes' : 'No'}
                    color={result.is_dag ? '#10b981' : '#f59e0b'}
                  />
                </div>
                <p style={{ ...modalBodyStyle, fontSize: 13, marginTop: 16 }}>
                  {result.is_dag
                    ? 'Pipeline has no cycles — safe to execute.'
                    : 'Pipeline contains a cycle. Fix circular connections before execution.'}
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

// ─── Sub-components ───────────────────────────────────────────────────────────
const Chip = ({ label, value, color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
  }}>
    <span style={{ color, fontWeight: 700, fontSize: 16 }}>{value}</span>
    <span style={{ letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 11 }}>{label}</span>
  </div>
);

const Metric = ({ label, value, color }) => (
  <div style={{
    flex: 1,
    textAlign: 'center',
    padding: '16px 12px',
    background: `${color}10`,
    border: `1px solid ${color}30`,
    borderRadius: 'var(--radius-md)',
  }}>
    <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: 'var(--font-body)' }}>{value}</div>
    <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
  </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const barStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 24px',
  background: 'var(--bg-primary)',
  borderTop: '1px solid var(--border-light)',
  boxShadow: 'var(--shadow-xs)',
};

const statsStyle = {
  display: 'flex',
  gap: 24,
};

const btnStyle = {
  background: 'var(--accent-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  padding: '10px 20px',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'var(--font-body)',
  letterSpacing: '0.02em',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  transition: 'background var(--transition-fast), transform var(--transition-fast)',
  boxShadow: 'var(--shadow-sm)',
};

const btnDisabledStyle = {
  opacity: 0.6,
  cursor: 'not-allowed',
  transform: 'none',
};

const spinnerStyle = {
  display: 'inline-block',
  animation: 'spin 1s linear infinite',
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-xl)',
  padding: 24,
  minWidth: 360,
  maxWidth: 440,
  boxShadow: 'var(--shadow-lg)',
  fontFamily: 'var(--font-body)',
};

const modalHeaderStyle = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 20,
  paddingBottom: 16,
  borderBottom: '1px solid var(--border-light)',
};

const modalBodyStyle = {
  fontSize: 13,
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  margin: 0,
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
  background: 'var(--bg-secondary)',
  padding: '2px 8px',
  borderRadius: 'var(--radius-sm)',
  fontSize: 11,
  color: 'var(--accent-primary)',
  fontFamily: 'var(--font-mono)',
};
