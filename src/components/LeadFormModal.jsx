// Componente modal para agregar un nuevo lead
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
            <div style={{ background: '#fff', padding: '2em', borderRadius: '10px', minWidth: '350px', maxWidth: '90vw' }}>
                <h3>Agregar Lead</h3>
                <form onSubmit={handleSubmit}>
                    {/* Campos del formulario */}
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
                    {/* Mensajes de error y éxito */}
                    {formError && <div style={{ color: 'red', marginTop: '0.5em' }}>{formError}</div>}
                    {formSuccess && <div style={{ color: 'green', marginTop: '0.5em' }}>{formSuccess}</div>}
                    <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ marginRight: '1em' }}>Cancelar</button>
                        <button type="submit">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}