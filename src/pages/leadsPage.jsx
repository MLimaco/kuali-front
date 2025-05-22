import { useState, useEffect } from 'react';
import { leadsService } from '../services/leads.js';
import { logsService } from '../services/logsService.js';
import { companiesService } from '../services/companies.js';
// Importa el modal para agregar logs
import LogFormModal from '../components/LogFormModal.jsx';
// Importa la lista de logs con edición
import { ContactLogList } from '../components/ContactLogList.jsx';

// Servicio para obtener usuarios
const fetchUsers = async () => {
    const response = await fetch('http://localhost:3000/api/users');
    return await response.json();
};

export const LeadsPage = () => {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [users, setUsers] = useState([]);

    // --- Estados para historial de cambios de logs ---
    const [history, setHistory] = useState([]);
    const [showHistoryFor, setShowHistoryFor] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // --- Estado para modal de agregar log ---
    const [showLogModal, setShowLogModal] = useState(false);

    // --- Estados para modal y formulario de agregar lead ---
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        companyID: '',
        ownerID: '',
        mail: '',
        phone: '',
        linkedinProfile: '',
        rol: '',
        senority: '',
        area: ''
        // nextStep y status se asumen como null y no se muestran en el formulario
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState(''); // Mensaje de éxito

    // --- Estado para el usuario actual (para edición de logs) ---
    // Puedes obtener este dato de tu contexto de autenticación si lo tienes
    const userID = 1; // <-- Cambia esto por el ID real del usuario logueado

    // Al montar, trae leads, companies, logs y users
    useEffect(() => {
        const fetchLeads = async () => {
            setLoadingLeads(true);
            const response = await leadsService.getAllLeads();
            setLeads(response);
            setLoadingLeads(false);
        };
        const fetchCompanies = async () => {
            const response = await companiesService.getAllCompanies();
            setCompanies(response);
        };
        const fetchAllLogs = async () => {
            setLoadingLogs(true);
            const response = await logsService.getAllLogs();
            setLogs(response);
            setLoadingLogs(false);
        };
        const loadUsers = async () => {
            const data = await fetchUsers();
            setUsers(data);
        };
        fetchLeads();
        fetchCompanies();
        fetchAllLogs();
        loadUsers();
    }, []);

    // Al seleccionar un lead, trae solo sus logs
    const handleLeadClick = async (lead) => {
        if (selectedLead && selectedLead.id === lead.id) {
            setSelectedLead(null);
            setLoadingLogs(true);
            const response = await logsService.getAllLogs();
            setLogs(response);
            setLoadingLogs(false);
            return;
        }
        setSelectedLead(lead);
        setLoadingLogs(true);
        const response = await logsService.getLogsByLeadId(lead.id);
        setLogs(response);
        setLoadingLogs(false);
    };

    const filteredLeads = selectedCompanyId
        ? leads.filter(lead => String(lead.companyID) === selectedCompanyId)
        : leads;

    // --- Función para cargar historial de un log ---
    const handleShowHistory = async (contactLogID) => {
        if (showHistoryFor === contactLogID) {
            setShowHistoryFor(null);
            setHistory([]);
            return;
        }
        setShowHistoryFor(contactLogID);
        setLoadingHistory(true);
        try {
            const response = await fetch(`http://localhost:3000/api/logsHistory/${contactLogID}`);
            const data = await response.json();
            setHistory(data);
        } catch (err) {
            setHistory([{ error: 'Error al cargar el historial.' }]);
        } finally {
            setLoadingHistory(false);
        }
    };

    // --- Handlers para el modal de agregar lead ---
    const handleOpenModal = () => {
        setForm({
            firstName: '',
            lastName: '',
            companyID: '',
            ownerID: '',
            mail: '',
            phone: '',
            linkedinProfile: '',
            rol: '',
            senority: '',
            area: ''
        });
        setFormError('');
        setFormSuccess('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormError('');
        setFormSuccess('');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        if (!form.firstName || !form.lastName || !form.companyID || !form.ownerID) {
            setFormError('Faltan datos obligatorios: Nombre, Apellido, Empresa y Dueño.');
            return;
        }
        try {
            // Convierte companyID y ownerID a número
            const response = await leadsService.createLead({
                ...form,
                companyID: Number(form.companyID),
                ownerID: Number(form.ownerID),
                nextStep: null,
                status: null
            });
            if (response.ok || response.status === 201) {
                setFormSuccess('Lead creado exitosamente.');
                setFormError('');
                setShowModal(false);
                setLoadingLeads(true);
                const leadsResp = await leadsService.getAllLeads();
                setLeads(leadsResp);
                setLoadingLeads(false);
            } else {
                setFormError('Error al crear el lead.');
                setFormSuccess('');
            }
        } catch (err) {
            setFormError('Error al crear el lead.');
            setFormSuccess('');
        }
    };

    // --- Función para refrescar logs después de agregar o editar uno ---
    const refetchLogs = async () => {
        if (!selectedLead) return;
        setLoadingLogs(true);
        const logs = await logsService.getLogsByLeadId(selectedLead.id);
        setLogs(logs);
        setLoadingLogs(false);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Columna izquierda: Leads */}
            <div style={{ width: '40%', borderRight: '1px solid #ccc', padding: '1em', overflowY: 'auto' }}>
                {/* Filtro de empresas */}
                <div style={{ marginBottom: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <label>Filtrar por empresa: </label>
                        <select
                            value={selectedCompanyId}
                            onChange={e => setSelectedCompanyId(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Botón para abrir modal de agregar lead */}
                    <button onClick={handleOpenModal} style={{ marginLeft: '1em', padding: '0.5em 1em' }}>
                        + Agregar Lead
                    </button>
                </div>
                <h2>Leads</h2>
                {loadingLeads ? <div>Cargando leads...</div> : (
                    filteredLeads.map(lead => (
                        <div
                            key={lead.id}
                            style={{
                                border: '1px solid #aaa',
                                borderRadius: '8px',
                                margin: '1em 0',
                                padding: '1em',
                                background: selectedLead?.id === lead.id ? '#e0f7fa' : '#fff',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleLeadClick(lead)}
                        >
                            <strong>{lead.firstName} {lead.lastName}</strong>
                            <div>{lead.rol || 'Sin rol'}</div>
                            <div>
                                <strong>
                                    {companies.find(c => c.id === lead.companyID)?.name || 'Sin empresa'}
                                </strong>
                            </div>
                            {selectedLead?.id === lead.id && (
                                <div style={{ marginTop: '1em', fontSize: '0.95em' }}>
                                    <div><strong>Teléfono:</strong> {lead.phone || 'N/A'}</div>
                                    <div><strong>Correo:</strong> {lead.mail || 'N/A'}</div>
                                    <div>
                                        <strong>LinkedIn:</strong> {lead.linkedinProfile
                                            ? <a href={lead.linkedinProfile} target="_blank" rel="noopener noreferrer">{lead.linkedinProfile}</a>
                                            : 'N/A'}
                                    </div>
                                    <div><strong>Seniority:</strong> {lead.senority || 'N/A'}</div>
                                    <div><strong>Área:</strong> {lead.area || 'N/A'}</div>
                                </div>
                            )}
                        </div>
                    ))
                )}
                {/* Modal para agregar lead */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{ background: '#fff', padding: '2em', borderRadius: '10px', minWidth: '350px', maxWidth: '90vw' }}>
                            <h3>Agregar Lead</h3>
                            <form onSubmit={handleFormSubmit}>
                                <div>
                                    <label>Nombre*:</label>
                                    <input name="firstName" value={form.firstName} onChange={handleFormChange} required />
                                </div>
                                <div>
                                    <label>Apellido*:</label>
                                    <input name="lastName" value={form.lastName} onChange={handleFormChange} required />
                                </div>
                                <div>
                                    <label>Empresa*:</label>
                                    <select name="companyID" value={form.companyID} onChange={handleFormChange} required>
                                        <option value="">Selecciona una empresa</option>
                                        {companies.map(company => (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Dueño*:</label>
                                    <select name="ownerID" value={form.ownerID} onChange={handleFormChange} required>
                                        <option value="">Selecciona un usuario</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Correo:</label>
                                    <input name="mail" value={form.mail} onChange={handleFormChange} />
                                </div>
                                <div>
                                    <label>Teléfono:</label>
                                    <input name="phone" value={form.phone} onChange={handleFormChange} />
                                </div>
                                <div>
                                    <label>LinkedIn:</label>
                                    <input name="linkedinProfile" value={form.linkedinProfile} onChange={handleFormChange} />
                                </div>
                                <div>
                                    <label>Rol:</label>
                                    <input name="rol" value={form.rol} onChange={handleFormChange} />
                                </div>
                                <div>
                                    <label>Seniority:</label>
                                    <input name="senority" value={form.senority} onChange={handleFormChange} />
                                </div>
                                <div>
                                    <label>Área:</label>
                                    <input name="area" value={form.area} onChange={handleFormChange} />
                                </div>
                                {/* Mensaje de error */}
                                {formError && <div style={{ color: 'red', marginTop: '0.5em' }}>{formError}</div>}
                                {/* Mensaje de éxito */}
                                {formSuccess && <div style={{ color: 'green', marginTop: '0.5em' }}>{formSuccess}</div>}
                                <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={handleCloseModal} style={{ marginRight: '1em' }}>Cancelar</button>
                                    <button type="submit">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Columna derecha: Logs */}
            <div style={{ width: '60%', padding: '1em', background: '#17607b22', overflowY: 'auto' }}>
                {/* Mostrar botón solo si hay un lead seleccionado */}
                {selectedLead && (
                    <div style={{ marginBottom: '1em' }}>
                        <button
                            onClick={() => setShowLogModal(true)}
                            className="bg-[#17607b] text-white px-4 py-2 rounded hover:bg-[#10485c] transition"
                        >
                            Agregar Log de Contacto
                        </button>
                    </div>
                )}
                {/* Modal para agregar log */}
                <LogFormModal
                    show={showLogModal}
                    onClose={() => setShowLogModal(false)}
                    selectedLead={selectedLead}
                    onLogAdded={refetchLogs}
                />

                {!selectedLead && (
                    <div style={{ marginBottom: '1em', fontStyle: 'italic' }}>
                        Selecciona un lead para filtrar sus logs.
                    </div>
                )}
                {/* Mostrar lista de logs con edición */}
                {loadingLogs ? <div>Cargando logs...</div> : (
                    <ContactLogList
                        logs={logs}
                        userID={userID}
                        onLogUpdated={refetchLogs}
                    />
                )}
            </div>
        </div>
    );
};