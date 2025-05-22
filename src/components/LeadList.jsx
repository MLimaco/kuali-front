import { LeadsController } from '../controller/leadsController.js';
import { useState, useEffect } from 'react';

export const LeadList = ({ leads, companies, loading, onSelectLead, selectedLead, onAddLead, logCountByLead }) => {
    if (loading) return <div>Cargando...</div>;

    console.log("LeadList recibió logCountByLead:", logCountByLead);

    return (
        <div>
            {/* Filtro y botón de agregar */}
            <div style={{
                marginBottom: '1em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div>
                    <label>Filtrar por empresa: </label>
                    <select>
                        <option value="">Todas</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={onAddLead} style={{ marginLeft: '1em', padding: '0.5em 1em' }}>
                    + Agregar Lead
                </button>
            </div>

            <h2>Leads</h2>

            {leads.length === 0 && <div>No hay leads para mostrar.</div>}

            {leads.map(lead => (
                <div
                    key={lead.id}
                    style={{
                        border: '1px solid #aaa',
                        borderRadius: '8px',
                        margin: '1em 0',
                        padding: '1em',
                        background: selectedLead?.id === lead.id ? '#e0f7fa' : '#fff',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                    onClick={() => onSelectLead(lead)}
                >
                    {/* Contador de logs - con corrección de tipos */}
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '16px',
                        fontWeight: 'bold',
                        fontSize: '1em', // Ligeramente más grande para visibilidad
                        color: '#17607b',
                        background: '#f0f9ff',
                        padding: '3px 10px', // Ligeramente más grande
                        borderRadius: '4px',
                        border: '1px solid #e0e7ff'
                    }}>
                        #LOGS: {logCountByLead && logCountByLead[lead.id] ?
                            logCountByLead[lead.id] : '0'}
                    </div>

                    <strong>{lead.firstName} {lead.lastName}</strong>
                    {/* Contador temporal sin CSS para debugging */}
                    <span style={{ color: 'red', fontWeight: 'bold' }}>
                        (LOGS: {logCountByLead && logCountByLead[lead.id] ? logCountByLead[lead.id] : '0'})
                    </span>
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
            ))}
        </div>
    );
};