import { ContactLogsController } from '../controller/contactLogsController.js';
import { useState, useEffect } from 'react';

export const ContactLogList = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await ContactLogsController.getAllLogs();
                setLogs(response.data);
            } catch (err) {
                setError(err.message || 'Error al cargar los logs');
            } finally {
                setLoading(false);
            }
        };
        loadLogs();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {logs.length === 0 && <div>No hay logs para mostrar.</div>}
            {logs.map(log => (
                <div key={log.id}>
                    <h3>Tipo: {log.type}</h3>
                    <p>Status: {log.status}</p>
                    <p>Notas: {log.notes || 'N/A'}</p>
                    <p>Creado: {log.createAt ? new Date(log.createAt).toLocaleString() : 'N/A'}</p>
                    <p>Última actualización: {log.updatedAt ? new Date(log.updatedAt).toLocaleString() : 'N/A'}</p>
                    <p>Lead ID: {log.leadID}</p>
                    <p>Usuario ID: {log.userID}</p>
                    <p>Compañía ID: {log.companyID}</p>
                </div>
            ))}
        </div>
    );
};