import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Briefcase, Key, Wallet, Dog, Plus, MapPin, Award } from 'lucide-react';
import { toast } from 'sonner';

// Interface Definition
interface LostItemForm {
  step: 1 | 2 | 3;
  category: string;
  details: {
    brand?: string;
    model?: string;
    color?: string;
    photos: (File | null)[];
    uniqueFeatures: string;
  };
  location: {
    coordinates?: { lat: number; lng: number };
    name: string;
  };
  lostDate: string;
  lostTime: string;
  context: string;
  contact: {
    appMessages: boolean;
    phone?: string;
    email?: string;
  };
  reward?: number;
  alerts: {
    notifyNearby: boolean;
    emailMatches: boolean;
    weeklyReminders: boolean;
  };
}

const LostAndFound = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LostItemForm>({
    step: 1,
    category: '',
    details: { photos: [null, null, null], uniqueFeatures: '' },
    location: { name: '' },
    lostDate: new Date().toISOString().split('T')[0],
    lostTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    context: '',
    contact: { appMessages: true },
    alerts: { notifyNearby: true, emailMatches: true, weeklyReminders: false },
  });

  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const categories = [
    { id: 'phone', label: 'Phone', icon: <Phone /> },
    { id: 'bag', label: 'Bag', icon: <Briefcase /> },
    { id: 'keys', label: 'Keys', icon: <Key /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet /> },
    { id: 'accessories', label: 'Accessories', icon: <Award /> },
    { id: 'pet', label: 'Pet', icon: <Dog /> },
  ];

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({ ...prev, category, step: 2 }));
  };

  const handleDetailChange = (field: keyof LostItemForm['details'], value: any) => {
    setFormData(prev => ({ ...prev, details: { ...prev.details, [field]: value } }));
  };

  const handlePhotoUpload = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const newPhotos = [...formData.details.photos];
      newPhotos[index] = e.target.files[0];
      handleDetailChange('photos', newPhotos);
    }
  };

  const nextStep = () => {
    setFormData(prev => ({ ...prev, step: prev.step < 3 ? (prev.step + 1) as 2 | 3 : 3 }));
  };

  const prevStep = () => {
    setFormData(prev => ({ ...prev, step: prev.step > 1 ? (prev.step - 1) as 1 | 2 : 1 }));
  };

  const renderStep = () => {
    switch (formData.step) {
      case 1: return Step1();
      case 2: return Step2();
      case 3: return Step3();
      default: return Step1();
    }
  };

  // --- Step Components ---
  const Step1 = () => (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">What did you lose?</h1>
      <p className="text-muted-foreground mb-6">Select a category to help us narrow down the search.</p>
      <div className="grid grid-cols-2 gap-4">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 bg-card border-border text-foreground hover:bg-accent/10 h-32 transition-colors">
            <div className="mb-2">{cat.icon}</div>
            <span className="font-semibold">{cat.label}</span>
          </button>
        ))}
        <button onClick={() => handleCategorySelect('other')} className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 bg-card border-border text-foreground hover:bg-accent/10 h-32 transition-colors">
          <span className="text-2xl mb-2">⚡</span>
          <span className="font-semibold">Other</span>
        </button>
      </div>
    </div>
  );

  const Step2 = () => (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Tell us about the item</h1>
      <p className="text-muted-foreground mb-6">The more details, the better the chances of recovery.</p>

      {formData.category === 'phone' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Brand</label>
            <select
              className="w-full p-3 rounded-xl border-2 border-border bg-card"
              value={formData.details.brand || ''}
              onChange={e => handleDetailChange('brand', e.target.value)}
            >
              <option value="">Select brand</option>
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="OnePlus">OnePlus</option>
              <option value="Google">Google</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Model</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border-2 border-border bg-card"
              placeholder="e.g., iPhone 14 Pro"
              value={formData.details.model || ''}
              onChange={e => handleDetailChange('model', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Upload Photos (up to 3)</label>
            <div className="grid grid-cols-3 gap-4">
              {formData.details.photos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => handlePhotoUpload(i)}
                  className="w-full h-24 bg-card border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer"
                >
                  {photo ? <img src={URL.createObjectURL(photo)} alt="preview" className="w-full h-full object-cover rounded-xl" /> : <Plus />}
                  <input type="file" ref={fileInputRefs[i]} onChange={e => handleFileChange(e, i)} className="hidden" accept="image/*" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Unique Identifiers</label>
            <textarea
              className="w-full p-3 rounded-xl border-2 border-border bg-card"
              placeholder="e.g., a crack on the top-left, a specific sticker..."
              value={formData.details.uniqueFeatures}
              onChange={e => handleDetailChange('uniqueFeatures', e.target.value)}
            />
          </div>
        </div>
      )}

      <button onClick={nextStep} className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Continue →</button>
      {formData.step > 1 && <button onClick={prevStep} className="mt-2 text-sm text-muted-foreground">← Back</button>}
    </div>
  );


  const Step3 = () => {
    const handleSubmit = async () => {
      try {
        const payload = {
          category: formData.category,
          details: {
            brand: formData.details.brand,
            model: formData.details.model,
            uniqueFeatures: formData.details.uniqueFeatures,
            photoUrls: [], // Placeholder for photo URLs
          },
          locationName: formData.location.name,
          lostDate: formData.lostDate,
          lostTime: formData.lostTime,
          context: formData.context,
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/lost-items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to submit report');
        }

        toast.success("Lost item report submitted successfully!");
        navigate('/dashboard');

      } catch (error) {
        console.error('Error submitting lost item report:', error);
        toast.error('Failed to submit report. Please try again.');
      }
    };

    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Where and when was it lost?</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full p-3 pl-10 rounded-xl border-2 border-border bg-card" 
                placeholder="e.g., Central Park, NYC" 
                value={formData.location.name}
                onChange={e => setFormData(prev => ({ ...prev, location: { ...prev.location, name: e.target.value } }))}
              />
<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Date</label>
              <input type="date" className="w-full p-3 rounded-xl border-2 border-border bg-card" value={formData.lostDate} onChange={e => setFormData(prev => ({ ...prev, lostDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Time</label>
              <input type="time" className="w-full p-3 rounded-xl border-2 border-border bg-card" value={formData.lostTime} onChange={e => setFormData(prev => ({ ...prev, lostTime: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Additional Context</label>
            <textarea 
              className="w-full p-3 rounded-xl border-2 border-border bg-card" 
              placeholder="e.g., 'I was sitting on a bench near the pond...'" 
              value={formData.context}
              onChange={e => setFormData(prev => ({ ...prev, context: e.target.value }))}
            />
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Submit →</button>
        {formData.step > 1 && <button onClick={prevStep} className="mt-2 text-sm text-muted-foreground">← Back</button>}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Top Back Button to Dashboard */}
      <button
        onClick={() => navigate('/dashboard')} // change route if needed
        className="flex items-center gap-2 mb-4 text-primary font-semibold"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Dashboard
      </button>

      {renderStep()}
    </div>
  );
};

export default LostAndFound;
