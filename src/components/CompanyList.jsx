import { CompaniesController } from '../controller/companiesController.js';
import { useState, useEffect } from 'react';

export const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await CompaniesController.getAllCompanies();
                console.log('CompaniesController response:', response);
                setCompanies(response.data);
            } catch (err) {
                setError(err.message || 'Error al cargar las compañías');
            } finally {
                setLoading(false);
            }
        };
        loadCompanies();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    console.log('companies state:', companies);

    return (
        <div>
            {companies.length === 0 && <div>No hay compañías para mostrar.</div>}
            {companies.map(company => (
                <div key={company.id}>
                    <h3>{company.name}</h3>
                    <p>RUC: {company.ruc || 'N/A'}</p>
                    <p>Sector: {company.sector || 'N/A'}</p>
                    <p>Tamaño: {company.size || 'N/A'}</p>
                    <p>Website: {company.website || 'N/A'}</p>
                </div>
            ))}
        </div>
    );
};