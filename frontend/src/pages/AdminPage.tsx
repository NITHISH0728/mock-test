
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Reusing some styles

const AdminPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
            <h1 style={{ color: '#121212', marginBottom: '20px' }}>Admin Dashboard</h1>
            <p style={{ color: '#666', marginBottom: '40px' }}>Welcome back, Admin. Manage the hive here.</p>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <button className="btn-primary" onClick={() => navigate('/')}>
                    Go to Home
                </button>
                <button className="btn-primary" style={{ backgroundColor: '#121212', color: '#fff' }} onClick={() => navigate('/login')}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminPage;
