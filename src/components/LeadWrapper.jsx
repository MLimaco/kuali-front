// Página principal que orquesta los componentes y el hook de lógica
import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { LeadList } from './LeadList'; // Cambiado: importa LeadList desde el archivo correcto
import LeadFormModal from './LeadFormModal';
import LogsList from './LogsList';

export const LeadsPage = () => {
    // Usa el hook para obtener datos y funciones
    const {
        leads, setLeads,
        companies, users,
        logs, fetchLogsByLead,
        loadingLeads, loadingLogs
    } = useLeads();

    const [showModal, setShowModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    // Cuando seleccionas un lead, carga sus logs
    const handleSelectLead = async (lead) => {
        setSelectedLead(lead);
        await fetchLogsByLead(lead.id);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '40%' }}>
                <LeadList // Cambiado: usa LeadList en lugar de LeadsList
                    leads={leads}
                    companies={companies}
                    loading={loadingLeads}
                    onSelectLead={handleSelectLead}
                    selectedLead={selectedLead}
                    onAddLead={() => setShowModal(true)}
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