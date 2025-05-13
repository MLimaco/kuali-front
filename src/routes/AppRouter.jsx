import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CompanyList } from '../components/CompanyList';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/companies" element={<CompanyList />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;