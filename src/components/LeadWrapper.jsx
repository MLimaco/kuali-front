// Página principal que orquesta los componentes y el hook de lógica
import { useState, useMemo, useEffect } from 'react';
import { useLeads } from '../hooks/useLeads';
import { LeadList } from './LeadList';
import LeadFormModal from './LeadFormModal';
import LogsList from './LogsList';

export const LeadsPage = () => {
    // Usa el hook para obtener datos y funciones
    const {
        leads, setLeads,
        companies, users,
        logs, fetchLogsByLead,
        loadingLeads, loadingLogs,
        fetchAllLogs
    } = useLeads();

    const [showModal, setShowModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    // Este useEffect se encarga de cargar todos los logs al inicio
    useEffect(() => {
        const loadAllLogs = async () => {
            try {
                const result = await fetchAllLogs();
                // El console.log siguiente podría mostrar el estado anterior ya que logs
                // podría no haberse actualizado en este punto del ciclo de vida
                console.log("Función fetchAllLogs ejecutada, resultado:", result);
            } catch (error) {
                console.error("Error cargando logs:", error);
            }
        };
        loadAllLogs();
    }, [fetchAllLogs]); // Mantén solo fetchAllLogs como dependencia

    // Calcular el conteo de logs por cada lead

    const logCountByLead = useMemo(() => {
        const counts = {};
        if (!logs || !logs.length) {
            console.log("No hay logs para contar");
            return {};
        }

        console.log("Logs disponibles para contar:", logs.length);

        logs.forEach(log => {
            if (log && log.leadID !== undefined) {
                const leadId = Number(log.leadID);
                console.log(`Log id:${log.id} - leadID:${leadId}`);
                counts[leadId] = (counts[leadId] || 0) + 1;
            }
        });

        console.log("Conteo de logs por lead:", counts);
        console.log("¿Hay datos en counts?", Object.keys(counts).length > 0);
        return counts;
    }, [logs]);

    // Cuando renderizamos el LeadList, asegúrate que la prop se pasa correctamente
    console.log("Pasando logCountByLead a LeadList:", logCountByLead);
    
    // Cuando seleccionas un lead, carga sus logs
    const handleSelectLead = async (lead) => {
        setSelectedLead(lead);
        await fetchLogsByLead(lead.id);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '40%' }}>
                <LeadList
                    leads={leads}
                    companies={companies}
                    loading={loadingLeads}
                    onSelectLead={handleSelectLead}
                    selectedLead={selectedLead}
                    onAddLead={() => setShowModal(true)}
                    logCountByLead={logCountByLead} // Asegúrate que esta línea existe
                />
            </div>
            <div style={{ width: '60%' }}>
                <LogsList
                    logs={logs}
                    loading={loadingLogs}
                    selectedLead={selectedLead}
                    fetchLogsByLead={fetchLogsByLead}
                />
            </div>
            <LeadFormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                companies={companies}
                users={users}
                setLeads={setLeads}
            />
        </div>
    );
};