import { useState } from 'react';
import { User, Mail, Lock, MapPin,  Settings, CheckCircle, Activity } from 'lucide-react';
import Dashboard from '../Dashboard/DashboardPage';

const UserProfilePage = () => {
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    isEmailEnabled: true,
    isActive: true,
    latitude: '',
    longitude: '',
    productId: '',
    proxyMetrics: {
      input: ''
    }
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'proxy_input') {
      setFormData(prev => ({
        ...prev,
        proxyMetrics: {
          input: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="fixed left-0 top-0 h-full w-64 bg-white z-10 overflow-y-auto">
        <Dashboard />
      </div>

      <div className="ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <p>Profile updated successfully!</p>
            </div>
          )}

          <div className="bg-white rounded-xl">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                  <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <User className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                      placeholder="Enter user ID"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Product ID</label>
                    <input
                      type="text"
                      name="productId"
                      value={formData.productId}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                      placeholder="Enter product ID"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Authentication</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Location</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                      placeholder="Enter latitude"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                      placeholder="Enter longitude"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Proxy Metrics</h2>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Proxy Input</label>
                  <input
                    type="text"
                    name="proxy_input"
                    value={formData.proxyMetrics.input}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                    placeholder="Enter proxy value"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isEmailEnabled"
                    checked={formData.isEmailEnabled}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-900">Enable Email Notifications</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-900">Activate User Account</label>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;