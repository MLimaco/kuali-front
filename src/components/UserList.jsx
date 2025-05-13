import { UsersController } from '../controller/usersController.js';
import { useState, useEffect } from 'react';

export const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await UsersController.getAllUsers();
                setUsers(response.data);
            } catch (err) {
                setError(err.message || 'Error al cargar los usuarios');
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {users.length === 0 && <div>No hay usuarios para mostrar.</div>}
            {users.map(user => (
                <div key={user.id}>
                    <h3>{user.name}</h3>
                    <p>Email: {user.email}</p>
                    <p>Teléfono: {user.phone || 'N/A'}</p>
                </div>
            ))}
        </div>
    );
};