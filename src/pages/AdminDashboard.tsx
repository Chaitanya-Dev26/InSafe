// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { AlertCircle, HeartPulse, Activity, AlertTriangle, MapPin, User, Phone, Mail, Clock, Users, TrendingUp, Filter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PRIORITY_MAP = {
  'injury': 1,
  'breathing': 2,
  'chest-pain': 3,
  'unconscious': 4,
  'allergic': 5,
  'other': 10
};

const getPriorityLabel = (priority: number): string => {
  if (priority <= 1) return 'CRITICAL';
  if (priority <= 3) return 'HIGH';
  if (priority <= 5) return 'MEDIUM';
  return 'LOW';
};

const getPriorityColor = (priority: number): string => {
  if (priority <= 1) return 'bg-red-600 text-white border-red-700';
  if (priority <= 3) return 'bg-orange-500 text-white border-orange-600';
  if (priority <= 5) return 'bg-yellow-500 text-white border-yellow-600';
  return 'bg-blue-500 text-white border-blue-600';
};

const getPriorityCardBg = (priority: number): string => {
  if (priority <= 1) return 'bg-red-50 border-red-200 border-l-4 border-l-red-600';
  if (priority <= 3) return 'bg-orange-50 border-orange-200 border-l-4 border-l-orange-500';
  if (priority <= 5) return 'bg-yellow-50 border-yellow-200 border-l-4 border-l-yellow-500';
  return 'bg-blue-50 border-blue-200 border-l-4 border-l-blue-500';
};

interface Emergency {
  _id: string;
  emergencyTypes: string[];
  additionalDetails?: string;
  location?: any;
  locationName?: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: number;
  createdAt: string;
  reportedBy?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

const EmergencyItem = ({ 
  emergency, 
  onStatusUpdate 
}: { 
  emergency: Emergency;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const created = new Date(emergency.createdAt);
      const diffMs = now.getTime() - created.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    };

    setTimeAgo(updateTime());
    const interval = setInterval(() => setTimeAgo(updateTime()), 30000);
    return () => clearInterval(interval);
  }, [emergency.createdAt]);

  const getIcon = () => {
    if (emergency.emergencyTypes?.includes('injury')) 
      return <AlertCircle className="h-6 w-6" />;
    if (emergency.emergencyTypes?.includes('breathing')) 
      return <Activity className="h-6 w-6" />;
    if (emergency.emergencyTypes?.includes('chest-pain')) 
      return <HeartPulse className="h-6 w-6" />;
    return <AlertTriangle className="h-6 w-6" />;
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      setIsUpdating(true);
      await onStatusUpdate(emergency._id, status);
      toast({
        title: 'Success',
        description: `Emergency marked as ${status.replace('-', ' ')}`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isCritical = emergency.priority <= 1;
  const isPending = emergency.status === 'pending';

  return (
    <div className={`
      rounded-lg p-5 mb-3 shadow-md hover:shadow-xl transition-all duration-300
      ${emergency.status === 'resolved' ? 'bg-white border border-gray-200' : getPriorityCardBg(emergency.priority)}
      ${isCritical && isPending ? 'animate-pulse' : ''}
    `}>
      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-lg flex-shrink-0
          ${emergency.status === 'resolved' ? 'bg-green-100 text-green-600' : 
            emergency.priority <= 1 ? 'bg-red-600 text-white' :
            emergency.priority <= 3 ? 'bg-orange-500 text-white' :
            'bg-blue-500 text-white'}
        `}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`
                  px-3 py-1 rounded-md text-xs font-bold tracking-wide border-2
                  ${getPriorityColor(emergency.priority)}
                `}>
                  {getPriorityLabel(emergency.priority)}
                </span>
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeAgo}
                </span>
              </div>
              <h3 className="font-bold text-xl text-gray-900 capitalize leading-tight">
                {emergency.emergencyTypes?.join(', ').replace(/-/g, ' ') || 'Medical Emergency'}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-400 font-medium">
                {new Date(emergency.createdAt).toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {new Date(emergency.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          {emergency.additionalDetails && (
            <div className="bg-white/70 rounded-md p-3 mb-3">
              <p className="text-gray-700 font-medium text-base leading-relaxed">
                {emergency.additionalDetails}
              </p>
            </div>
          )}
          
          <div className="space-y-2 mb-3">
            {emergency.locationName && (
              <div className="flex items-start gap-2 text-sm text-gray-700 bg-white/50 rounded p-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
                <span className="font-medium">{emergency.locationName}</span>
              </div>
            )}
            
            {emergency.reportedBy && (
              <div className="bg-white/70 rounded-md p-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Reported by</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="font-semibold text-gray-800">{emergency.reportedBy.name || 'Anonymous'}</span>
                  </div>
                  {emergency.reportedBy.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <a href={`tel:${emergency.reportedBy.phone}`} className="text-blue-600 hover:underline font-medium">
                        {emergency.reportedBy.phone}
                      </a>
                    </div>
                  )}
                  {emergency.reportedBy.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <a href={`mailto:${emergency.reportedBy.email}`} className="text-blue-600 hover:underline font-medium">
                        {emergency.reportedBy.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {emergency.status !== 'resolved' && (
            <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-white/50">
              {emergency.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('in-progress')}
                  disabled={isUpdating}
                  className="flex-1 min-w-[140px] px-4 py-2.5 text-sm font-bold rounded-lg
                    bg-blue-600 hover:bg-blue-700 text-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transform hover:scale-105 transition-all duration-200 shadow-md"
                >
                  {isUpdating ? 'Processing...' : '⚡ Respond Now'}
                </button>
              )}
              {emergency.status === 'in-progress' && (
                <button
                  onClick={() => handleStatusUpdate('in-progress')}
                  disabled={true}
                  className="flex-1 min-w-[140px] px-4 py-2.5 text-sm font-bold rounded-lg
                    bg-blue-100 text-blue-700 border-2 border-blue-300
                    cursor-default"
                >
                  🔄 In Progress
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate('resolved')}
                disabled={isUpdating}
                className="flex-1 min-w-[140px] px-4 py-2.5 text-sm font-bold rounded-lg
                  bg-green-600 hover:bg-green-700 text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                {isUpdating ? 'Processing...' : '✓ Mark Resolved'}
              </button>
            </div>
          )}
          
          {emergency.status === 'resolved' && (
            <div className="pt-3 border-t border-gray-200">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-bold text-sm">
                ✓ Resolved
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical'>('all');

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/emergencies`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch emergencies');
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const sortedEmergencies = [...data.data].sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setEmergencies(sortedEmergencies);
      } else {
        setEmergencies([]);
      }
    } catch (err: any) {
      console.error('Error fetching emergencies:', err);
      setError(err.message || 'Failed to load emergencies. Please try again later.');
      setEmergencies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/emergencies/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchEmergencies();
    } catch (err: any) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 30000);
    return () => clearInterval(interval);
  }, []);

  const pendingEmergencies = emergencies.filter(e => e.status === 'pending');
  const inProgressEmergencies = emergencies.filter(e => e.status === 'in-progress');
  const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved');
  const criticalCount = emergencies.filter(e => e.priority <= 1 && e.status !== 'resolved').length;

  const activeEmergencies = filter === 'critical' 
    ? [...pendingEmergencies, ...inProgressEmergencies].filter(e => e.priority <= 1)
    : [...pendingEmergencies, ...inProgressEmergencies];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
          Medical Emergency Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Real-time emergency monitoring and response system</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Critical</p>
              <p className="text-4xl font-black text-red-600 mt-1">{criticalCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Pending</p>
              <p className="text-4xl font-black text-orange-600 mt-1">{pendingEmergencies.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">In Progress</p>
              <p className="text-4xl font-black text-blue-600 mt-1">{inProgressEmergencies.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Resolved</p>
              <p className="text-4xl font-black text-green-600 mt-1">{resolvedEmergencies.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-5 mb-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <HeartPulse className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                Active Emergencies
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-lg font-bold">
                  {activeEmergencies.length}
                </span>
              </h2>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('critical')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                    filter === 'critical' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Critical Only
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {activeEmergencies.length > 0 ? (
                activeEmergencies.map(emergency => (
                  <EmergencyItem 
                    key={emergency._id} 
                    emergency={emergency}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-gray-500 font-semibold text-lg">
                    {filter === 'critical' ? 'No critical emergencies' : 'No active emergencies'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">All clear! 🎉</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-5 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-green-600" />
              </div>
              Resolved
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-lg font-bold">
                {resolvedEmergencies.length}
              </span>
            </h2>
            
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              {resolvedEmergencies.length > 0 ? (
                resolvedEmergencies.slice(0, 10).map(emergency => (
                  <EmergencyItem 
                    key={emergency._id} 
                    emergency={emergency}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-semibold">No resolved emergencies yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;