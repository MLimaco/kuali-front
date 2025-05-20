import { useEffect, useState } from 'react';

export const ContactLogHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/logsHistory');
            const data = await response.json();
            setHistory(data);
            setLoading(false);
        };
        fetchHistory();
    }, []);

    return (
        <div>
            <h2>Historial de Logs</h2>
            {loading ? <div>Cargando historial...</div> : (
                history.length === 0
                    ? <div>No hay historial.</div>
                    : history.map(item => (
                        <div key={item.id} style={{ border: '1px solid #aaa', borderRadius: '8px', margin: '1em 0', padding: '1em' }}>
                            <strong>Log ID:</strong> {item.contactLogID} <br />
                            <strong>Status:</strong> {item.status} <br />
                            <strong>Nota:</strong> {item.notes || 'N/A'} <br />
                            <strong>Usuario:</strong> {item.userID} <br />
                            <strong>Fecha de cambio:</strong> {item.changedAt ? new Date(item.changedAt).toLocaleString() : 'N/A'} <br />
                        </div>
                    ))
            )}
        </div>
    );
};