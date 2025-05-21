// Componente modal para agregar un nuevo lead, usando clase CSS personalizada para los campos de entrada
import React, { useState } from 'react';

export default function LeadFormModal({
    show, onClose, companies, users, setLeads
}) {
    // Estado local para el formulario y mensajes
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
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    // Maneja cambios en los campos del formulario
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Envía el formulario al backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        // Validación de campos obligatorios
        if (!form.firstName || !form.lastName || !form.companyID || !form.ownerID) {
            setFormError('Faltan datos obligatorios: Nombre, Apellido, Empresa y Dueño.');
            return;
        }
        try {
            // Hace el POST al backend
            const response = await fetch('http://localhost:3000/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    companyID: Number(form.companyID),
                    ownerID: Number(form.ownerID),
                    nextStep: null,
                    status: null
                })
            });
            if (response.ok || response.status === 201) {
                setFormSuccess('Lead creado exitosamente.');
                setFormError('');
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
                // Refresca la lista de leads
                const leadsResp = await fetch('http://localhost:3000/api/leads');
                setLeads(await leadsResp.json());
                onClose(); // Cierra el modal
            } else {
                setFormError('Error al crear el lead.');
                setFormSuccess('');
            }
        } catch (err) {
            setFormError('Error al crear el lead.');
            setFormSuccess('');
        }
    };

    // Si no está visible, no renderiza nada
    if (!show) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            {/* Modal con sombra y bordes redondeados */}
            <div style={{
                background: '#fff',
                padding: '2em',
                borderRadius: '10px',
                minWidth: '350px',
                maxWidth: '90vw',
                boxShadow: '0 8px 32px 0 rgba(23,96,123,0.18), 0 1.5px 6px 0 rgba(23,96,123,0.10)'
            }}>
                <h3 style={{ color: '#17607b', marginBottom: '1em' }}>Agregar Lead</h3>
                <form onSubmit={handleSubmit}>
                    {/* Campos del formulario usando la clase kuali-input */}
                    <div>
                        <label>Nombre*:</label>
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleFormChange}
                            required
                            className="kuali-input"
                        />
                    </div>
                    <div>
                        <label>Apellido*:</label>
                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleFormChange}
                            required
                            className="kuali-input"
                        />
                    </div>
                    <div>
                        <label>Empresa*:</label>
                        <select
                            name="companyID"
                            value={form.companyID}
                            onChange={handleFormChange}
                            required
                            className="kuali-input"
                        >
                            <option value="">Selecciona una empresa</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>{company.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Dueño*:</label>
                        <select
                            name="ownerID"
                            value={form.ownerID}
                            onChange={handleFormChange}
                            required
                            className="kuali-input"
                        >
                            <option value="">Selecciona un usuario</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Correo:</label>
                        <input
                            name="mail"
                            value={form.mail}
                            onChange={handleFormChange}
                            className="kuali-input"
                        />
                    </div>
                    <div>
                        <label>Teléfono:</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleFormChange}
                            className="kuali-input"
                        />
                    </div>
                    <div>
                        <label>LinkedIn:</label>
                        <input
                            name="linkedinProfile"
                            value={form.linkedinProfile}
                            onChange={handleFormChange}
                            className="kuali-input"
                        />
                    </div>
                    <div>
                        <label>Rol:</label>
                        <input
                            name="rol"
                            value={form.rol}
                            onChange={handleFormChange}
                            className="kuali-input"
                        />
                    </div>
                    <div>
                        <label>Seniority:</label>
                        <input
                            name="senority"
                            value={form.senority}
                            onChange={handleFormChange}
                            className="kuali-input"
                        />
                    </div>
                    <div>
                        <label>Área:</label>
                        <input
                            name="area"
                            value={form.area}
                            onChange={handleFormChange}
                            className="kuali-input"
                        />
                    </div>
                    {/* Mensajes de error y éxito */}
                    {formError && <div style={{ color: 'red', marginTop: '0.5em' }}>{formError}</div>}
                    {formSuccess && <div style={{ color: 'green', marginTop: '0.5em' }}>{formSuccess}</div>}
                    {/* Botones de acción */}
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
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}