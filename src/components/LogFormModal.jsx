import { useState } from "react";

export default function LogFormModal({ show, onClose, selectedLead, onLogAdded }) {
  const typeOptions = [
    { value: "correo", label: "Correo" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "videollamada", label: "Videollamada" },
    { value: "presencial", label: "Presencial" },
  ];

  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Función para guardar el log (usada por ambos botones)
  const saveLog = async () => {
    setError("");
    setLoading(true);
    const payload = {
      type,
      status: "Enviado",
      notes,
      leadID: Number(selectedLead.id),
      companyID: Number(selectedLead.companyID),
      userID: Number(selectedLead.ownerID),
    };
    try {
      const res = await fetch("http://localhost:3000/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al guardar el log");
      setType("");
      setNotes("");
      if (onLogAdded) onLogAdded();
      onClose();
      return true;
    } catch (err) {
      setError("No se pudo guardar el log.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handler para botón "Enviar mensaje"
  const handleSendWhatsApp = async (e) => {
    e.preventDefault();
    if (!type || !notes) {
      setError("Debes completar ambos campos.");
      return;
    }
    const ok = await saveLog();
    if (ok && selectedLead.phone) {
      // Formatea el número (quita espacios y signos)
      const phone = selectedLead.phone.replace(/\D/g, "");
      const url = `https://wa.me/${phone}?text=Hola%20te%20escribo%20de%20Kuali`;
      window.open(url, "_blank");
    }
  };

  // Handler para botón "Guardar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !notes) {
      setError("Debes completar ambos campos.");
      return;
    }
    await saveLog();
  };

  if (!show || !selectedLead) return null;

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
        <h3 style={{ color: '#17607b', marginBottom: '1em' }}>Agregar Log de Contacto</h3>
        <form onSubmit={type === "whatsapp" ? handleSendWhatsApp : handleSubmit}>
          <div>
            <label>Tipo de contacto*:</label>
            <select
              className="kuali-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Selecciona un tipo</option>
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Notas*:</label>
            <textarea
              className="kuali-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
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
            {/* Cambia el botón según el tipo seleccionado */}
            {type === "whatsapp" ? (
              <button
                type="submit"
                style={{
                  background: '#25D366',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '0.5em 1.2em',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
            ) : (
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
            )}
          </div>
        </form>
      </div>
    </div>
  );
}