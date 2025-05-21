// Componente para mostrar los logs de un lead y su historial
import React, { useState } from 'react';

export default function LogsList({ logs, loading, selectedLead, fetchLogsByLead }) {
    // Estados para mostrar historial de un log específico
    const [showHistoryFor, setShowHistoryFor] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Maneja la visualización del historial de un log
    const handleShowHistory = async (contactLogID) => {
        if (showHistoryFor === contactLogID) {
            setShowHistoryFor(null);
            setHistory([]);
            return;
        }
        setShowHistoryFor(contactLogID);
        setLoadingHistory(true);
        try {
            // Llama al backend para obtener el historial de ese log
            const response = await fetch(`http://localhost:3000/api/logsHistory/${contactLogID}`);
            const data = await response.json();
            setHistory(data);
        } catch (err) {
            setHistory([{ error: 'Error al cargar el historial.' }]);
        } finally {
            setLoadingHistory(false);
        }
    };

    return (
        <div style={{ width: '100%', padding: '1em', background: '#17607b22', overflowY: 'auto' }}>
            {/* Mensaje si no hay lead seleccionado */}
            {!selectedLead && (
                <div style={{ marginBottom: '1em', fontStyle: 'italic' }}>
                    Selecciona un lead para filtrar sus logs.
                </div>
            )}
            {/* Muestra loading o la lista de logs */}
            {loading ? <div>Cargando logs...</div> : (
                logs.length === 0
                    ? <div>No hay logs para mostrar.</div>
                    : logs.map(log => (
                        <div key={log.id} style={{ border: '1px solid #aaa', borderRadius: '8px', margin: '1em 0', padding: '1em', background: '#fff' }}>
                            <strong>Tipo:</strong> {log.type} <br />
                            <strong>Status:</strong> {log.status} <br />
                            <strong>Nota:</strong> {log.notes || 'N/A'} <br />
                            <strong>Fecha de creación:</strong> {log.createAt ? new Date(log.createAt).toLocaleString() : 'N/A'} <br />
                            <strong>Última actualización:</strong> {log.updatedAt ? new Date(log.updatedAt).toLocaleString() : 'N/A'} <br />
                            <button
                                style={{ marginTop: '0.5em', marginBottom: '0.5em' }}
                                onClick={() => handleShowHistory(log.id)}
                            >
                                {showHistoryFor === log.id ? 'Ocultar historial' : 'Ver historial'}
                            </button>
                            {/* Si se selecciona, muestra el historial */}
                            {showHistoryFor === log.id && (
                                <div style={{ marginTop: '0.5em', background: '#f5f5f5', padding: '0.5em', borderRadius: '6px' }}>
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
                    ))
            )}
        </div>
    );
}