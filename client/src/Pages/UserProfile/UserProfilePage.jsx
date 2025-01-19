import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  User,
  Mail, 
  Briefcase,
  Database,
  Key,
  Hash,
  MapPin,
  BellRing,
  Link as LinkIcon,
  QrCode,
  Camera,
  Edit2,
  Bell,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { decodeJWT } from '../../utils/utils';
import { selfidentification } from '../../services/api.config';

function UserProfile() {
  const [data, setData] = useState(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingProximity, setIsEditingProximity] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [proximityValue, setProximityValue] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const decodedToken = await decodeJWT(localStorage.getItem('accessToken'));
      if (!decodedToken) {
        throw new Error('Invalid access token');
      }

      const response = await selfidentification(
        localStorage.getItem('accessToken'),
        decodedToken.workspace_id,
        decodedToken._id
      );

      if (response.success) {
        setData(response.response);
        setEmailValue(response.response.email || '');
        setProximityValue(response.response.proximity?.toString() || '');
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const InfoCard = ({ icon: Icon, label, value, subValue }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className="mt-1 font-medium text-gray-100 break-words">{value}</p>
          {subValue && (
            <p className="mt-1 text-sm text-gray-500">{subValue}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const handleEmailSave = async () => {
    try {
      // Here you would typically make an API call to update the email
      setData(prev => ({ ...prev, email: emailValue }));
      setIsEditingEmail(false);
    } catch (error) {
      console.error('Error updating email:', error);
      // Handle error appropriately
    }
  };

  const handleEmailCancel = () => {
    setEmailValue(data.email);
    setIsEditingEmail(false);
  };

  const handleProximitySave = async () => {
    try {
      const proximityNum = parseFloat(proximityValue);
      if (isNaN(proximityNum)) {
        throw new Error('Invalid proximity value');
      }
      // Here you would typically make an API call to update the proximity
      setData(prev => ({ ...prev, proximity: proximityNum }));
      setIsEditingProximity(false);
    } catch (error) {
      console.error('Error updating proximity:', error);
      // Handle error appropriately
    }
  };

  const handleProximityCancel = () => {
    setProximityValue(data.proximity?.toString() || '');
    setIsEditingProximity(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
          // Here you would typically make an API call to upload the image
          // and update the profile_image URL in the data state
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        // Handle error appropriately
      }
    }
  };

  const handleNotificationToggle = async () => {
    try {
      // Here you would typically make an API call to update the notification status
      setData(prev => ({
        ...prev,
        is_notification_active: !prev.is_notification_active
      }));
    } catch (error) {
      console.error('Error updating notification status:', error);
      // Handle error appropriately
    }
  };

  const handleDurationChange = async (event) => {
    try {
      // Here you would typically make an API call to update the notification duration
      setData(prev => ({
        ...prev,
        notification_duration: event.target.value
      }));
    } catch (error) {
      console.error('Error updating notification duration:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 text-gray-100 scrollbar-hide">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="overflow-hidden scrollbar-hide">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl scrollbar-hide">
            <div className="absolute -bottom-16 left-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="w-32 h-32 rounded-2xl bg-gray-800 p-1">
                  {previewImage || data.profile_image ? (
                    <img 
                      src={previewImage || data.profile_image}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gray-700 flex items-center justify-center">
                      <User className="w-12 h-12 text-blue-400" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="pt-20 px-8 pb-8 bg-gray-800 rounded-b-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {data.workspace_owner_name}
                </h1>
                <p className="mt-1 text-gray-400">{data.user_id}</p>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 bg-opacity-20 text-blue-400">
                    {data.member_type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500 bg-opacity-20 text-purple-400">
                    {data.data_type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {data.is_active ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-500 bg-opacity-20 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500 bg-opacity-20 text-red-400">
                    <XCircle className="w-4 h-4" />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Email Section */}
            <div className="mt-8">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-3 bg-gray-700 p-4 rounded-xl"
              >
                <Mail className="w-5 h-5 text-blue-400" />
                <div className="flex-1 min-w-0">
                  {isEditingEmail ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                        placeholder="Enter email"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEmailSave}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
                      >
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEmailCancel}
                        className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100">{data.email}</span>
                      <button
                        onClick={() => setIsEditingEmail(true)}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Proximity Section */}
            <div className="mt-4">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-3 bg-gray-700 p-4 rounded-xl"
              >
                <MapPin className="w-5 h-5 text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-400">Proximity Range</p>
                  {isEditingProximity ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={proximityValue}
                        onChange={(e) => setProximityValue(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                        placeholder="Enter proximity (km)"
                        min="0"
                        step="0.1"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleProximitySave}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
                      >
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleProximityCancel}
                        className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100">{data.proximity} km</span>
                      <button
                        onClick={() => setIsEditingProximity(true)}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Notification Settings */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="mt-8 bg-gray-700 p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Notification Settings</h3>
              <div className="space-y-6">
                {/* Notification Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
                      <BellRing className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-100">Notifications</p>
                      <p className="text-sm text-gray-400">Receive notifications about updates</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNotificationToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      data.is_notification_active ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        data.is_notification_active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Notification Duration */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
                    <Bell className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-100 mb-2">Notification Duration</p>
                    <select
                      value={data.notification_duration}
                      onChange={handleDurationChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    >
                      <option value="one_day">One Day</option>
                      <option value="seven_days">Seven Days</option>
                      <option value="one_month">One Month</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard
                icon={Briefcase}
                label="Workspace"
                value={data.workspace_name}
              />
              <InfoCard
                icon={Hash}
                label="Workspace ID"
                value={data.workspace_id}
              />
              <InfoCard
                icon={Database}
                label="Customer ID"
                value={data.customer_id}
              />
              <InfoCard
                icon={MapPin}
                label="Location"
                value={`${data.latitude}, ${data.longitude}`}
              />
              <InfoCard
                icon={Key}
                label="Password Status"
                value="••••••••"
              />
            </div>

            {/* Links Section */}
            <div className="mt-8 flex flex-wrap gap-4">
              {data.product_url && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={data.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Product URL</span>
                </motion.a>
              )}
              {data.qrcode_image_url && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={data.qrcode_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code</span>
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default UserProfile;