import { TemplatesController } from '../controller/templatesController.js';
import { useState, useEffect } from 'react';

export const TemplateList = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await TemplatesController.getAllTemplates();
                setTemplates(response.data);
            } catch (err) {
                setError(err.message || 'Error al cargar los templates');
            } finally {
                setLoading(false);
            }
        };
        loadTemplates();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {templates.length === 0 && <div>No hay templates para mostrar.</div>}
            {templates.map(template => (
                <div key={template.id}>
                    <h3>{template.name}</h3>
                    <p>Asunto: {template.subject}</p>
                    <p>Contenido: {template.content}</p>
                    <p>Tipo: {template.type}</p>
                    <p>Creado: {new Date(template.createAt).toLocaleString()}</p>
                    <p>Actualizado: {template.updateAt ? new Date(template.updateAt).toLocaleString() : 'N/A'}</p>
                </div>
            ))}
        </div>
    );
};