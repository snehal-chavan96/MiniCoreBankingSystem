import React, { useEffect, useState } from 'react';
import { Users, Shield, Settings, LogOut, Menu, Home, FileText, CreditCard, BarChart2, Bell, UserCheck, Lock } from 'lucide-react';
import ShowUsersData from '../ShowUsersData/ShowUsersData';
import UserAnalyticsGraph from '../UserAnalytics/UserAnalyticsPage';
import { PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, Sector, ResponsiveContainer } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer as RechartsResponsiveContainer } from "recharts";

const ManageAccounts = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [pendingVerification, setPendingVerification] = useState(0);
  const [activeToday, setActiveToday] = useState(0);

  useEffect(() => {
    // Fetch all users and calculate counts
    fetch("http://localhost:8085/api/getUsers")
      .then(res => res.json())
      .then(data => {
        // Exclude admin users for account stats
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
        <div className="flex space-x-2">
          
        </div>
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
            onClick={() => setActiveTab('roles')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Roles & Permissions
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

      {activeTab === 'roles' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Roles & Permissions</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Add New Role
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-900">Administrator</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  5 users
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Full access to all system features and settings.</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input id="admin-all" name="admin-all" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked disabled />
                  <label htmlFor="admin-all" className="ml-2 block text-sm text-gray-700">All Permissions</label>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-900">Moderator</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  12 users
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Can manage users and content but not system settings.</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input id="mod-user" name="mod-user" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked disabled />
                  <label htmlFor="mod-user" className="ml-2 block text-sm text-gray-700">User Management</label>
                </div>
                <div className="flex items-center">
                  <input id="mod-content" name="mod-content" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked disabled />
                  <label htmlFor="mod-content" className="ml-2 block text-sm text-gray-700">Content Moderation</label>
                </div>
                <div className="flex items-center">
                  <input id="mod-reports" name="mod-reports" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked disabled />
                  <label htmlFor="mod-reports" className="ml-2 block text-sm text-gray-700">View Reports</label>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-900">User</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  1,217 users
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Basic access with limited permissions.</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input id="user-view" name="user-view" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked disabled />
                  <label htmlFor="user-view" className="ml-2 block text-sm text-gray-700">View Content</label>
                </div>
                <div className="flex items-center">
                  <input id="user-edit" name="user-edit" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" disabled />
                  <label htmlFor="user-edit" className="ml-2 block text-sm text-gray-700">Edit Own Content</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Activity Logs</h3>
            <div className="flex space-x-2">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
                Filter
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
                Export
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">User login</p>
                <p className="text-sm text-gray-500">User "admin_user" logged in from IP 192.168.1.1</p>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span>2023-05-15 09:30:15</span>
                  <span className="mx-1">•</span>
                  <span>Security</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">User updated</p>
                <p className="text-sm text-gray-500">User "john_doe" profile was updated by "admin_user"</p>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span>2023-05-15 08:45:22</span>
                  <span className="mx-1">•</span>
                  <span>User Management</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Failed login attempt</p>
                <p className="text-sm text-gray-500">Failed login for user "jane_smith" from IP 192.168.1.45</p>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span>2023-05-14 22:15:03</span>
                  <span className="mx-1">•</span>
                  <span>Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="maintenance-mode" className="block text-sm font-medium text-gray-700">Maintenance Mode</label>
                <p className="text-sm text-gray-500">When enabled, only administrators can access the system.</p>
              </div>
              <div className="flex items-center h-5">
                <input
                  id="maintenance-mode"
                  name="maintenanceMode"
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Reports Section with 3D Pie Chart Effect and Count on Hover ---
const Reports = () => {
  const [activeReport, setActiveReport] = useState('activity');
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [pendingVerification, setPendingVerification] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [systemData] = useState([
    { time: "09:00", cpu: 32, memory: 45 },
    { time: "08:30", cpu: 28, memory: 42 },
    { time: "08:00", cpu: 45, memory: 52 },
    { time: "07:30", cpu: 38, memory: 48 },
    { time: "07:00", cpu: 30, memory: 40 }
  ]);

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
  }, []);

  const pieData = [
    { name: "Total Accounts", value: totalAccounts },
    { name: "Active Today", value: activeUsers },
    { name: "Pending Verification", value: pendingVerification }
  ];
  const COLORS = ["#6366f1", "#22c55e", "#eab308"];

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
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontWeight="bold">
          {`${payload.name}: ${value}`}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#222" fontWeight="bold">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          
          <button
            onClick={() => setActiveReport('activity')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeReport === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveReport('system')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeReport === 'system'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            System Performance
          </button>
        </nav>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">  
        {activeReport === 'activity' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Total Accounts</h3>
                <p className="text-2xl font-bold text-blue-600">{totalAccounts}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Active Today</h3>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Pending Verification</h3>
                <p className="text-2xl font-bold text-yellow-600">{pendingVerification}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h4 className="font-semibold text-gray-700 mb-4">Accounts Overview</h4>
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
                      isAnimationActive={true}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <RechartsTooltip
                      formatter={(value, name, props) => [`${value}`, `${props.payload.name}`]}
                      contentStyle={{ borderRadius: 8, boxShadow: '0 2px 8px #0001' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-800 mb-3">User Engagement</h4>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>Total Logins: <span className="font-medium text-gray-900">{activeUsers}</span></p>
                    <p>Actions Performed: <span className="font-medium text-gray-900">5,672</span></p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Avg. Session Duration: <span className="font-medium text-gray-900">12m 45s</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeReport === 'user-growth' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">User Growth Report</h3>
              <div className="flex space-x-2">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
                  Last 7 days
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Last 30 days
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
                  Custom Range
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">User growth chart visualization would appear here</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Users</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Users</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">May 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">24</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,234</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">+2.4%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">May 14, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">18</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,210</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">+1.8%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">May 13, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,195</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">+1.5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeReport === 'system' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">System Performance Report</h3>
              <div className="flex space-x-2">
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4">CPU Usage</h3>
                <div className="h-40 flex items-center justify-center bg-gray-50 rounded">
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
                      <Tooltip formatter={v => `${v}%`} />
                      <Line type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </RechartsResponsiveContainer>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Memory Usage</h3>
                <div className="h-40 flex items-center justify-center bg-gray-50 rounded">
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
                      <Tooltip formatter={v => `${v}%`} />
                      <Line type="monotone" dataKey="memory" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </RechartsResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2023-05-15 09:00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">32%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">128ms</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Normal</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2023-05-15 08:30</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">42%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">115ms</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Normal</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2023-05-15 08:00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">52%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">210ms</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Warning</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
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
      {/* Just render your analytics page here */}
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
    }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive 
        ? 'bg-blue-100 text-blue-700 border-blue-200' 
        : 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200',
      purple: isActive 
        ? 'bg-purple-100 text-purple-700 border-purple-200' 
        : 'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200',
      green: isActive 
        ? 'bg-green-100 text-green-700 border-green-200' 
        : 'hover:bg-green-50 hover:text-green-700 hover:border-green-200',
      orange: isActive 
        ? 'bg-orange-100 text-orange-700 border-orange-200' 
        : 'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200',
      indigo: isActive 
        ? 'bg-indigo-100 text-indigo-700 border-indigo-200' 
        : 'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-200 text-blue-600' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
      purple: isActive ? 'bg-purple-200 text-purple-600' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
      green: isActive ? 'bg-green-200 text-green-600' : 'bg-green-100 text-green-600 group-hover:bg-green-200',
      orange: isActive ? 'bg-orange-200 text-orange-600' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200',
      indigo: isActive ? 'bg-indigo-200 text-indigo-600' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-xl border-r border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Menu size={20} className="text-blue-600" />
              <span>Dashboard</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Administrative Panel</p>
          </div>
          
          <nav className="p-4">
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
          
          {/* Footer in sidebar */}
          <div className="absolute bottom-0 left-0 right-0 w-72 p-4 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              <p>CoreBank Admin v2.1.0</p>
              <p className="mt-1">© 2025 CoreBank Systems</p>
            </div>
          </div>
        </aside>

        {/* Main Render Area */}
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