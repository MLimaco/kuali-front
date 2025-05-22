import { useState } from "react";
import EditLogModal from "./EditLogModal.jsx";

export function ContactLogList({ logs, userID, onLogUpdated }) {
  // Estados para edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [logToEdit, setLogToEdit] = useState(null);

  // Estados para historial por log
  const [openHistoryId, setOpenHistoryId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Abrir modal de edición
  const handleEditClick = (log) => {
    setLogToEdit(log);
    setShowEditModal(true);
  };

  // Cerrar modal de edición
  const handleCloseModal = () => {
    setShowEditModal(false);
    setLogToEdit(null);
  };

  // Mostrar/ocultar historial de un log
  const handleShowHistory = async (logId) => {
    if (openHistoryId === logId) {
      setOpenHistoryId(null);
      setHistory([]);
      return;
    }
    setOpenHistoryId(logId);
    setLoadingHistory(true);
    try {
      const response = await fetch(`http://localhost:3000/api/logsHistory/${logId}`);
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setHistory([{ error: 'Error al cargar el historial.' }]);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div>
      {logs.map(log => (
        <div key={log.id} style={{ border: '1px solid #aaa', borderRadius: '8px', margin: '1em 0', padding: '1em', background: '#fff' }}>
          <strong>Tipo:</strong> {log.type} <br />
          <strong>Status:</strong> {log.status} <br />
          <strong>Nota:</strong> {log.notes || 'N/A'} <br />
          <strong>Fecha de creación:</strong> {log.createAt ? new Date(log.createAt).toLocaleString() : 'N/A'} <br />
          <strong>Última actualización:</strong> {log.updatedAt ? new Date(log.updatedAt).toLocaleString() : 'N/A'} <br />
          {/* Botón para actualizar */}
          <button
            onClick={() => handleEditClick(log)}
            className="bg-[#17607b] text-white px-3 py-1 rounded hover:bg-[#10485c] transition"
            style={{ marginTop: '0.5em', marginRight: '0.5em' }}
          >
            Actualizar
          </button>
          {/* Botón para ver/ocultar historial */}
          <button
            onClick={() => handleShowHistory(log.id)}
            className="bg-gray-200 text-[#17607b] px-3 py-1 rounded hover:bg-gray-300 transition"
            style={{ marginTop: '0.5em' }}
          >
            {openHistoryId === log.id ? "Ocultar historial" : "Ver historial"}
          </button>
          {/* Historial desplegable solo para este log */}
          {openHistoryId === log.id && (
            <div style={{ marginTop: '0.7em', background: '#f5f5f5', padding: '0.5em', borderRadius: '6px' }}>
              <h4>Historial de cambios</h4>
              {loadingHistory ? (
                <div>Cargando historial...</div>
              ) : (
                history.length === 0
                  ? <div>No hay historial para este log.</div>
                  : history[0]?.error
                    ? <div>{history[0].error}</div>
                    : history.map(item => (
                        <div key={item.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '0.5em', paddingBottom: '0.5em' }}>
                          <strong>Status:</strong> {item.status} <br />
                          <strong>Nota:</strong> {item.notes || 'N/A'} <br />
                          <strong>Usuario ID:</strong> {item.userID} <br />
                          <strong>Fecha de cambio:</strong> {item.changedAt ? new Date(item.changedAt).toLocaleString() : 'N/A'} <br />
                        </div>
                      ))
              )}
            </div>
          )}
        </div>
      ))}
      {/* Modal para editar log */}
      <EditLogModal
        show={showEditModal}
        onClose={handleCloseModal}
        log={logToEdit}
        userID={userID}
        onLogUpdated={onLogUpdated}
      />
    </div>
  );
}