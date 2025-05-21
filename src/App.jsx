import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CompanyList } from './components/CompanyList.jsx'
import { UserList } from './components/UserList.jsx';
import { LeadsPage } from './pages/leadsPage.jsx';
import { ContactLogList } from './components/ContactLogList.jsx';
import { TemplateList } from './components/TemplateList.jsx';


function App() {
  return (
    <BrowserRouter>
      <main className="app-container">
        <Routes>
          <Route path="/" element={
            <div className="home-container">
              <h1>Welcome to Company Management</h1>
              <p>Navigate to companies to see the list</p>
              <div className="bg-red-500 text-white p-4">Test Tailwind</div>
            </div>
          } />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/logs" element={<ContactLogList />} />
          <Route path="/templates" element={<TemplateList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App