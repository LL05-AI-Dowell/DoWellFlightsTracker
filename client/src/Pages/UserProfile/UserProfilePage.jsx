import React, { useEffect, useState, useRef } from 'react';
import { 
  RefreshCcw, 
  XCircle, 
  User, 
  Bell, 
  MapPin, 
  Link as LinkIcon, 
  Mail, 
  Briefcase, 
  Database,
  Key,
  Hash,
  QrCode,
  BellRing,
  Upload,
  Camera,
  Edit2
} from 'lucide-react';
import { selfidentification } from '../../services/userprofileapi.js';

const UserProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const fileInputRef = useRef(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await selfidentification("test-token", "workspace-123", "doc-123");
      setData(response.data);
      setEmailValue(response.data.email || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const maskPassword = (password) => {
    return password ? '•'.repeat(12) : 'Not Set';
  };

  const handleEmailEdit = () => {
    setIsEditingEmail(true);
  };

  const handleEmailSave = async () => {
    // Here you would typically make an API call to save the email
    // For now, we'll just update the local state
    setData(prev => ({ ...prev, email: emailValue }));
    setIsEditingEmail(false);
  };

  const handleEmailCancel = () => {
    setEmailValue(data.email || '');
    setIsEditingEmail(false);
  };

  const handleDurationChange = (e) => {
    // Here you would typically make an API call to save the duration
    // For now, we'll just update the local state
    setData(prev => ({ ...prev, notification_duration: e.target.value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Profile
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <button
                onClick={loadProfile}
                className="mt-3 flex items-center text-sm text-red-800 hover:text-red-600"
              >
                <RefreshCcw className="h-4 w-4 mr-1" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const EmailItem = () => (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 flex-shrink-0 mt-1">
        <Mail className="text-blue-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500">Email</p>
        {isEditingEmail ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleEmailSave}
              className="px-3 py-1.5 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleEmailCancel}
              className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 break-words">
              {data.email || "Not provided"}
            </p>
            <button
              onClick={handleEmailEdit}
              className="p-1 text-gray-400 hover:text-blue-500"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const NotificationDurationItem = () => (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 flex-shrink-0 mt-1">
        <Bell className="text-blue-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500">Notification Duration</p>
        <div className="relative mt-1">
          <select
            value={data.notification_duration}
            onChange={handleDurationChange}
            className="appearance-none w-full bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="1 day">One Day</option>
            <option value="7 days">Seven Days</option>
            <option value="30 days">One Month</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex flex-col items-center p-8">
            {/* Profile Image Section */}
            <div className="relative group mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {previewImage || data.profile_image ? (
                <div className="relative">
                  <img 
                    src={previewImage || data.profile_image} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <button
                    onClick={triggerFileInput}
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={triggerFileInput}
                  className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                >
                  <User className="w-12 h-12 text-blue-500" />
                </button>
              )}
              {data.is_active && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 text-sm text-green-700 bg-green-100 rounded-full whitespace-nowrap">
                  Active
                </span>
              )}
            </div>

            {/* Name and ID Section */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 text-center">
              {data.workspace_owner_name}
            </h1>
            <p className="text-gray-500 mb-4 text-center break-words">
              {data.user_id}
            </p>

            {/* Tags Section */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {data.member_type && (
                <span className="px-4 py-1 text-sm rounded-full border border-gray-200">
                  {data.member_type}
                </span>
              )}
              {data.data_type && (
                <span className="px-4 py-1 text-sm rounded-full border border-gray-200">
                  {data.data_type}
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <InfoItem 
                icon={<Briefcase className="text-blue-500" />}
                label="Workspace" 
                value={data.workspace_name} 
              />
              <InfoItem 
                icon={<Hash className="text-blue-500" />}
                label="Workspace ID" 
                value={data.workspace_id} 
              />
              <InfoItem 
                icon={<Database className="text-blue-500" />}
                label="Customer ID" 
                value={data.customer_id} 
              />
              <EmailItem />
              <NotificationDurationItem />
              <InfoItem 
                icon={<BellRing className="text-blue-500" />}
                label="Notifications" 
                value={data.is_notification_active ? "Active" : "Inactive"}
              />
              {(data.latitude && data.longitude) && (
                <InfoItem 
                  icon={<MapPin className="text-blue-500" />}
                  label="Location" 
                  value={`${data.latitude}, ${data.longitude}`}
                  subValue={`Proximity: ${data.proximity}km`}
                />
              )}
              <InfoItem 
                icon={<Key className="text-blue-500" />}
                label="Password Status" 
                value={maskPassword(data.password)} 
              />
            </div>

            {/* Links Section */}
            <div className="flex flex-wrap gap-4">
              {data.product_url && (
                <a
                  href={data.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Product URL</span>
                </a>
              )}
              {data.qrcode_image_url && (
                <a
                  href={data.qrcode_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, subValue }) => (
  <div className="flex items-start gap-3">
    <div className="w-5 h-5 flex-shrink-0 mt-1">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 break-words">{value}</p>
      {subValue && <p className="text-sm text-gray-500">{subValue}</p>}
    </div>
  </div>
);

export default UserProfile;