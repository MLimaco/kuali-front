import { companiesService } from '../services/companies';
import { Company } from '../models/Company.js';

export const CompaniesController = {
    async getAllCompanies() {
        try {
            const response = await companiesService.getAllCompanies();
            // response es un array, no un objeto
            const data = Array.isArray(response) ? response : [];
            return {
                data: data.map(company => new Company(company))
            };
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw error;
        }
    }
};