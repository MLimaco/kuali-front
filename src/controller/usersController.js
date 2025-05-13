import { usersService } from '../services/users.js';

export const UsersController = {
    async getAllUsers() {
        try {
            const response = await usersService.getAllUsers();
            const data = Array.isArray(response) ? response : [];
            return { data };
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
};