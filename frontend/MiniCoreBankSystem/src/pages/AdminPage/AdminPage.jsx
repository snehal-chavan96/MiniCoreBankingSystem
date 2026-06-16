import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  Settings,
  LogOut,
  Menu,
  Home,
  BarChart2,
  UserCheck,
  FileText,
  Search
} from 'lucide-react';
import ShowUsersData from '../ShowUsersData/ShowUsersData';
import UserAnalyticsGraph from '../UserAnalytics/UserAnalyticsPage';
import AccountCreationPage from "../CreateAccount/AccountCreationPage.jsx";
import GetAllTransaction from '../GetAllTransaction/GetAllTransactionPage.jsx';
import GetFDByIdPage from '../GetFDByIdPage/GetFDDetailsById.jsx';
import SearchFDStatement from '../SearchFDStatement/SearchFDStatement.jsx';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as RechartsTooltip,
  Sector,
  ResponsiveContainer
} from "recharts";


const ManageAccounts = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [pendingVerification, setPendingVerification] = useState(0);
  const [activeToday, setActiveToday] = useState(0);


  useEffect(() => {
    fetch("http://localhost:8085/api/getUsers")
      .then(res => res.json())
      .then(data => {
        const nonAdminUsers = data.filter(user => user.role !== "ADMIN");
        setTotalAccounts(nonAdminUsers.length);
        setPendingVerification(nonAdminUsers.filter(user => user.status === "INACTIVE").length);
        setActiveToday(nonAdminUsers.filter(user => user.status === "ACTIVE").length);
      })
      .catch(() => {
        setTotalAccounts(0);
        setPendingVerification(0);
        setActiveToday(0);
      });
  }, []);


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Account Management</h2>
        <div className="flex space-x-2"></div>
      </div>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Accounts
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Activity Logs
          </button>
        </nav>
      </div>
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Total Accounts</h3>
              <p className="text-2xl font-bold text-blue-600">{totalAccounts}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Active Today</h3>
              <p className="text-2xl font-bold text-green-600">{activeToday}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Pending Verification</h3>
              <p className="text-2xl font-bold text-yellow-600">{pendingVerification}</p>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <GetAllTransaction />
        </div>
      )}
    </div>
  );
};


const SystemSettings = () => {
  const [username, setUsername] = useState('');


  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username') || 'Admin';
    setUsername(storedUsername);
  }, []);


  const handleChangePassword = () => {
    window.location.href = '/api/forgot-password';
  };


  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-8 gap-3">
        <Settings className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-extrabold text-gray-900">System Settings</h2>
      </div>
      <div className="bg-white border border-gray-300 rounded-xl p-8">
        <section className="flex items-center gap-6 mb-12">
          <div className="flex-shrink-0 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-full w-16 h-16 flex items-center justify-center shadow-md">
            <span className="text-black text-2xl font-extrabold uppercase">{username.slice(0, 2)}</span>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{username}</p>
          </div>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Account Security</h3>
          <button
            onClick={handleChangePassword}
            type="button"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg shadow-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Change Password
          </button>
        </section>
      </div>
    </div>
  );
};


const Reports = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [pendingVerification, setPendingVerification] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);


  useEffect(() => {
    fetch("http://localhost:8085/api/getUsers")
      .then(res => res.json())
      .then(data => {
        const nonAdminUsers = data.filter(user => user.role !== "ADMIN");
        setTotalAccounts(nonAdminUsers.length);
        setActiveUsers(nonAdminUsers.filter(user => user.status === "ACTIVE").length);
        setPendingVerification(nonAdminUsers.filter(user => user.status === "INACTIVE").length);
      })
      .catch(() => {
        setTotalAccounts(0);
        setActiveUsers(0);
        setPendingVerification(0);
      });


    fetch("http://localhost:8085/api/transactions/analytics/count")
      .then(res => res.json())
      .then(data => {
        if (typeof data === 'object' && data !== null && "totalTransactions" in data)
          setTotalTransactions(Number(data.totalTransactions) || 0);
        else setTotalTransactions(Number(data) || 0);
      })
      .catch(() => {
        setTotalTransactions(0);
      });
  }, []);


  const pieData = [
    { name: "Total Accounts", value: totalAccounts },
    { name: "Active Today", value: activeUsers },
    { name: "Pending Verification", value: pendingVerification },
    { name: "Total Transactions", value: totalTransactions }
  ];


  const COLORS = ["#6366f1", "#22c55e", "#eab308", "#f97316"];


  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#fff"
          strokeWidth={3}
          filter="url(#shadow)"
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontWeight="bold">{`${payload.name}: ${value}`}</text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#222" fontWeight="bold">{`${(percent * 100).toFixed(0)}%`}</text>
      </g>
    );
  };


  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <h3 className="font-semibold text-blue-800 mb-2">Total Accounts</h3>
          <p className="text-3xl font-bold text-blue-600">{totalAccounts}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <h3 className="font-semibold text-green-800 mb-2">Active Today</h3>
          <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <h3 className="font-semibold text-yellow-800 mb-2">Pending Verification</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingVerification}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <h3 className="font-semibold text-orange-700 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-orange-600">{totalTransactions}</p>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h4 className="font-semibold text-gray-700 mb-4">Accounts & Transactions Overview</h4>
        <div className="h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
                isAnimationActive
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <RechartsTooltip contentStyle={{ borderRadius: 8, boxShadow: '0 2px 8px #0001' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    fetch("http://localhost:8085/api/users/count")
      .then(res => res.json())
      .then(data => setUserCount(data.userCount || 0))
      .catch(() => setUserCount(0));
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-3xl font-bold">{userCount}</p>
              <p className="text-xs text-blue-200 mt-1">Live user count</p>
            </div>
            <Users className="w-10 h-10 text-blue-200" />
          </div>
        </div>
      </div>
      <UserAnalyticsGraph />
    </div>
  );
};


const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');


  const renderContent = () => {
    switch (activeSection) {
      case 'showUsers':
        return <ShowUsersData />;
      case 'manageAccounts':
        return <ManageAccounts />;
      case 'systemSettings':
        return <SystemSettings />;
      case 'reports':
        return <Reports />;
      case 'createAccount':
        return <AccountCreationPage />;
      case 'checkUsersFD':
        return <GetFDByIdPage />;
      case 'searchFDStatement':
        return <SearchFDStatement />;
      default:
        return <Dashboard />;
    }
  };


  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Overview and statistics',
      icon: Home,
      color: 'green'
    },
    {
      id: 'showUsers',
      label: 'User Management',
      description: 'Manage user information',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'manageAccounts',
      label: 'Account Management',
      description: 'Account administration',
      icon: UserCheck,
      color: 'purple'
    },
    {
      id: 'systemSettings',
      label: 'System Settings',
      description: 'Configure system options',
      icon: Settings,
      color: 'orange'
    },
    {
      id: 'reports',
      label: 'Reports',
      description: 'Analytics and insights',
      icon: BarChart2,
      color: 'indigo'
    },
    {
      id: 'createAccount',
      label: 'Create Account',
      description: 'Create new user accounts',
      icon: Users,
      color: 'teal'
    },
    {
      id: 'checkUsersFD',
      label: 'Check Users FD',
      description: "Check any user's FD details",
      icon: FileText,
      color: 'orange'
    },
    {
      id: 'searchFDStatement',
      label: 'Search FD Statement',
      description: 'Search FD statements',
      icon: Search,
      color: 'pink'
    }
  ];


  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200',
      purple: isActive ? 'bg-purple-100 text-purple-700 border-purple-200' : 'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200',
      green: isActive ? 'bg-green-100 text-green-700 border-green-200' : 'hover:bg-green-50 hover:text-green-700 hover:border-green-200',
      orange: isActive ? 'bg-orange-100 text-orange-700 border-orange-200' : 'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200',
      indigo: isActive ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200',
      teal: isActive ? 'bg-teal-100 text-teal-700 border-teal-200' : 'hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200',
      pink: isActive ? 'bg-pink-100 text-pink-700 border-pink-200' : 'hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200',
    };
    return colors[color] || colors.blue;
  };


  const getIconColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-200 text-blue-600' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
      purple: isActive ? 'bg-purple-200 text-purple-600' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
      green: isActive ? 'bg-green-200 text-green-600' : 'bg-green-100 text-green-600 group-hover:bg-green-200',
      orange: isActive ? 'bg-orange-200 text-orange-600' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200',
      indigo: isActive ? 'bg-indigo-200 text-indigo-600' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
      teal: isActive ? 'bg-teal-200 text-teal-600' : 'bg-teal-100 text-teal-600 group-hover:bg-teal-200',
      pink: isActive ? 'bg-pink-200 text-pink-600' : 'bg-pink-100 text-pink-600 group-hover:bg-pink-200',
    };
    return colors[color] || colors.blue;
  };


  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg border-b border-slate-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CB</span>
              </div>
              <h1 className="text-xl font-bold tracking-wide">CoreBank Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-medium">Welcome, Admin</span>
                  <p className="text-xs text-slate-300">System Administrator</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = "/api/login";
                }}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white shadow-xl border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Menu size={20} className="text-blue-600" />
              <span>Dashboard</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Administrative Panel</p>
          </div>
          <nav className="p-4 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`group w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-xl transition-all duration-200 border border-transparent ${
                        getColorClasses(item.color, isActive)
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        getIconColorClasses(item.color, isActive)
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div className="text-left">
                        <span className="font-medium">{item.label}</span>
                        <p className={`text-xs transition-colors ${
                          isActive
                            ? `text-${item.color}-600`
                            : `text-gray-500 group-hover:text-${item.color}-600`
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              <p>CoreBank Admin v2.1.0</p>
              <p className="mt-1">© 2025 CoreBank Systems</p>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-96">
              <div className="p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminPage;