import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/superadmin/Dashboard';
import GestionsUsers from './components/superadmin/GestionUsers';
import GestionPackages from './components/superadmin/GestionPackages';
import GestionDomaines from './components/superadmin/GestionDomaines';
import GestionRoles from './components/superadmin/GestionRoles';
import VerifAuth from './VerifAuth.jsx';
import ForgotPassword from './components/resetpassword/ForgotPassword.jsx';
import ResetPassword from './components/resetpassword/ResetPassword.jsx';
import GestionPermissions from './components/superadmin/GestionPermissions.jsx';
import GestionChatbots from './components/superadmin/GestionChatbots.jsx';
import GestionWorkspaces from './components/superadmin/GestionWorkspaces.jsx';
import DashboardUser from './components/user/DashboardUser.jsx';
import PackagesUser from './components/user/PackagesUser.jsx';
import ChatbotsUser from './components/user/ChatbotsUser.jsx';
import DashboardLiveAgent from './components/liveagent/DashboardLiveAgent.jsx';
import ChatbotsLiveAgent from './components/liveagent/ChatbotsLiveAgent.jsx';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* Super Admin */}
                <Route path="/superadmin/dashboard" element={<VerifAuth><Dashboard /></VerifAuth>} />
                <Route path="/superadmin/users" element={<VerifAuth><GestionsUsers /></VerifAuth>} />
                <Route path="/superadmin/packages" element={<VerifAuth><GestionPackages /></VerifAuth>} />
                <Route path="/superadmin/domaines" element={<VerifAuth><GestionDomaines /></VerifAuth>} />
                <Route path="/superadmin/workspaces" element={<VerifAuth><GestionWorkspaces /></VerifAuth>} />
                <Route path="/superadmin/roles" element={<VerifAuth><GestionRoles /></VerifAuth>} />
                <Route path="/superadmin/permissions" element={<VerifAuth><GestionPermissions /></VerifAuth>} />
                <Route path="/superadmin/chatbots" element={<VerifAuth><GestionChatbots /></VerifAuth>} />
                {/* User */}
                <Route path="/user/dashboard" element={<VerifAuth><DashboardUser /></VerifAuth>} />
                <Route path="/user/packages" element={<VerifAuth><PackagesUser /></VerifAuth>} />
                <Route path="/user/chatbots" element={<VerifAuth><ChatbotsUser/></VerifAuth>} />
                {/* Live Agent */}
                <Route path="/liveagent/dashboard" element={<VerifAuth><DashboardLiveAgent /></VerifAuth>} />
                <Route path="/liveagent/chatbots" element={<VerifAuth><ChatbotsLiveAgent /></VerifAuth>} />
            </Routes>
        </Router>
    );
}