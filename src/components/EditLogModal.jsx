import { useState } from "react";

/**
 * Modal para editar un log de contacto.
 * Permite cambiar status y nota.
 */
export default function EditLogModal({ show, onClose, log, userID, onLogUpdated }) {
  // Opciones permitidas para el status
  const statusOptions = [
    "Visto",
    "Pendiente",
    "Respondido",
    "Cancelado",
    "Interesado"
  ];

  const [status, setStatus] = useState(log?.status || "");
  const [notes, setNotes] = useState(log?.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!status) {
      setError("Debes seleccionar un status.");
      return;
    }
    setLoading(true);

    try {
      // PATCH al backend
      const res = await fetch(`http://localhost:3000/api/logs/${log.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          notes,
          userID // El usuario que hace el cambio
        }),
      });
      if (!res.ok) throw new Error("Error al actualizar el log");
      if (onLogUpdated) onLogUpdated();
      onClose();
    } catch (err) {
      setError("No se pudo actualizar el log.");
    } finally {
      setLoading(false);
    }
  };

  if (!show || !log) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        padding: '2em',
        borderRadius: '10px',
        minWidth: '350px',
        maxWidth: '90vw',
        boxShadow: '0 8px 32px 0 rgba(23,96,123,0.18), 0 1.5px 6px 0 rgba(23,96,123,0.10)'
      }}>
        <h3 style={{ color: '#17607b', marginBottom: '1em' }}>Actualizar Log</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Status*:</label>
            <select
              className="kuali-input"
              value={status}
              onChange={e => setStatus(e.target.value)}
              required
            >
              <option value="">Selecciona un status</option>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Notas:</label>
            <textarea
              className="kuali-input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          {error && <div style={{ color: 'red', marginTop: '0.5em' }}>{error}</div>}
          <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                marginRight: '1em',
                background: '#fff',
                color: '#17607b',
                border: '1.5px solid #17607b',
                borderRadius: '5px',
                padding: '0.5em 1.2em',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                background: '#17607b',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '0.5em 1.2em',
                cursor: 'pointer',
                fontWeight: 500
              }}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}