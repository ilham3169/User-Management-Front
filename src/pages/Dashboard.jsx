import React, { useState, useEffect } from 'react';
import { Home, Users, Calendar, Lock, Menu, X, LogOut, ChevronRight, Plus, Search, Edit2, Trash2, UserPlus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { checkExistingSession, getRoleDescription } from '../services/authService'
import { useNavigate } from 'react-router-dom';



const MOCK_USER = {
  name: "cartt",
  email: 'john@example.com',
  role: 'Adminsda' 
};

const MOCK_STATS = {
  Admin: [
    { label: 'Total Users', value: '248', icon: Users, color: 'blue' },
    { label: 'Appointments', value: '64', icon: Calendar, color: 'green' },
    { label: 'Pending', value: '12', icon: Clock, color: 'amber' },
  ],
  Receptionist: [
    { label: 'Today\'s Appointments', value: '18', icon: Calendar, color: 'blue' },
    { label: 'Completed', value: '12', icon: CheckCircle, color: 'green' },
    { label: 'Upcoming', value: '6', icon: Clock, color: 'amber' },
  ]
};

const MOCK_USERS = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Receptionist', status: 'Active' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Receptionist', status: 'Inactive' },
];

const MOCK_APPOINTMENTS = [
  { id: 1, patient: 'Emma Davis', doctor: 'Dr. Smith', time: '09:00 AM', status: 'Confirmed', date: '2026-01-02' },
  { id: 2, patient: 'Michael Brown', doctor: 'Dr. Jones', time: '10:30 AM', status: 'Pending', date: '2026-01-02' },
  { id: 3, patient: 'Sarah Wilson', doctor: 'Dr. Lee', time: '02:00 PM', status: 'Completed', date: '2026-01-02' },
];

// ============================================
// ROLE-BASED MENU CONFIGURATION
// ============================================
const MENU_ITEMS = [
  { path: 'home', label: 'Dashboard', icon: Home, roles: ['Admin', 'Receptionist'] },
  { path: 'users', label: 'Users', icon: Users, roles: ['Admin'] },
  { path: 'appointments', label: 'Appointments', icon: Calendar, roles: ['Admin', 'Receptionist'] },
];

// ============================================
// UTILITY COMPONENTS
// ============================================
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, className = '' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

// ============================================
// LAYOUT COMPONENTS
// ============================================
const Sidebar = ({ currentPage, setCurrentPage, userRole, sidebarOpen, setSidebarOpen }) => {
  const visibleMenuItems = MENU_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">MediDash</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    setCurrentPage(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {MOCK_USER.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{MOCK_USER.name}</p>
                <p className="text-xs text-gray-500 truncate">{MOCK_USER.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Topbar = ({ currentPage, setSidebarOpen }) => {
  const breadcrumbs = {
    home: ['Dashboard'],
    users: ['Dashboard', 'Users'],
    appointments: ['Dashboard', 'Appointments'],
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Menu + Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs[currentPage]?.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={16} className="text-gray-400" />}
                <span
                  className={
                    idx === breadcrumbs[currentPage].length - 1
                      ? 'font-semibold text-gray-900'
                      : 'text-gray-500'
                  }
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right: Role Badge + Logout */}
        <div className="flex items-center gap-4">
          <Badge variant="primary">{MOCK_USER.role}</Badge>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// ============================================
// PAGE COMPONENTS
// ============================================
const DashboardHome = ({ userRole }) => {
  const stats = MOCK_STATS[userRole] || MOCK_STATS.Admin;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {MOCK_USER.name}!</h2>
        <p className="text-gray-500 mt-1">Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New appointment scheduled</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UsersPage = ({ userRole }) => {
  if (userRole !== 'Admin') {
    return <NotAuthorized />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-500 mt-1">Manage system users and their roles.</p>
        </div>
        <Button icon={UserPlus}>Add User</Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Roles</option>
          <option>Admin</option>
          <option>Receptionist</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="default">{user.role}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={user.status === 'Active' ? 'success' : 'default'}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AppointmentsPage = ({ userRole }) => {
  const canEdit = userRole === 'Admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-500 mt-1">
            {canEdit ? 'Manage all appointments.' : 'View today\'s appointments.'}
          </p>
        </div>
        {canEdit && <Button icon={Plus}>New Appointment</Button>}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="date"
          defaultValue="2026-01-02"
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_APPOINTMENTS.map((appt) => (
          <div key={appt.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{appt.patient}</h4>
                <p className="text-sm text-gray-500">{appt.doctor}</p>
              </div>
              <Badge
                variant={
                  appt.status === 'Confirmed'
                    ? 'success'
                    : appt.status === 'Pending'
                    ? 'warning'
                    : 'default'
                }
              >
                {appt.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Clock size={16} />
              {appt.time}
            </div>

            {canEdit && (
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Button variant="ghost" size="sm" icon={Edit2} className="flex-1">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" icon={Trash2} className="flex-1 text-red-600 hover:bg-red-50">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const NotAuthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Lock size={32} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6">
          You don't have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>
        <Button>Go to Dashboard</Button>
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export default function Dashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => { 
    const verify = async () => {
        const session = await checkExistingSession();
        if (!session.isValid) { navigate('/'); return; }
        console.log(session)      
    }; verify(); }, []
  );
  
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <DashboardHome userRole={userRole} />;
      case 'users':
        return <UsersPage userRole={userRole} />;
      case 'appointments':
        return <AppointmentsPage userRole={userRole} />;
      default:
        return <DashboardHome userRole={userRole} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userRole={userRole}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar currentPage={currentPage} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}