// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { AlertCircle, HeartPulse, Activity, AlertTriangle, MapPin, User, Phone, Mail, Clock, ArrowLeft, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

// Simple toast fallback if sonner is not available
const showToast = (type: 'success' | 'error', title: string, description?: string) => {
  if (typeof toast !== 'undefined') {
    if (type === 'error') {
      toast.error(title + (description ? ` - ${description}` : ''));
    } else {
      toast.success(title + (description ? ` - ${description}` : ''));
    }
  } else {
    const message = `[${type.toUpperCase()}] ${title}${description ? ` - ${description}` : ''}`;
    if (type === 'error') {
      console.error(message);
    } else {
      console.log(message);
    }
  }
};

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
      showToast('success', 'Success', `Emergency marked as ${status.replace('-', ' ')}`);
    } catch (error) {
      showToast('error', 'Error', 'Failed to update status');
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
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical'>('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage or auth context
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

  // Filter emergencies based on status
  const pendingEmergencies = emergencies.filter(e => e.status === 'pending');
  const inProgressEmergencies = emergencies.filter(e => e.status === 'in-progress');
  const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved');
  const criticalCount = emergencies.filter(e => e.priority <= 1 && e.status !== 'resolved').length;

  const activeEmergencies = filter === 'critical' 
    ? [...pendingEmergencies, ...inProgressEmergencies].filter(e => e.priority <= 1)
    : [...pendingEmergencies, ...inProgressEmergencies];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Emergency Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage emergency alerts</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  className="bg-transparent text-sm focus:outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'critical')}
                >
                  <option value="all">All Alerts</option>
                  <option value="critical">Critical Only</option>
                </select>
              </div>
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{user.displayName || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                  <p className="text-3xl font-bold text-destructive mt-1">{criticalCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{pendingEmergencies.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{inProgressEmergencies.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Currently being handled</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{resolvedEmergencies.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Completed cases</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <HeartPulse className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Emergencies List */}
          <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {filter === 'critical' ? 'Critical Emergencies' : 'Active Emergencies'}
              <span className="ml-2 bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                {activeEmergencies.length}
              </span>
            </h2>

            {activeEmergencies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No {filter === 'critical' ? 'critical ' : ''}emergencies to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeEmergencies.map(emergency => (
                  <EmergencyItem
                    key={emergency._id}
                    emergency={emergency}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Resolved Emergencies */}
          {resolvedEmergencies.length > 0 && (
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Resolved Emergencies
                <span className="ml-2 bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                  {resolvedEmergencies.length}
                </span>
              </h2>
              <div className="space-y-4">
                {resolvedEmergencies.map(emergency => (
                  <EmergencyItem
                    key={emergency._id}
                    emergency={emergency}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;