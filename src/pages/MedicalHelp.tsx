import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Mic, MicOff, Camera, X, Loader2, Pause, Square } from 'lucide-react';
import { toast } from 'sonner';

const MedicalHelp = () => {
  const navigate = useNavigate();

  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const emergencyTypes = [
    { id: 'injury', emoji: '🤕', label: 'Injury' },
    { id: 'breathing', emoji: '🫁', label: 'Breathing' },
    { id: 'unconscious', emoji: '😵', label: 'Unconscious' },
    { id: 'allergic', emoji: '🤧', label: 'Allergic' },
    { id: 'chest-pain', emoji: '💔', label: 'Chest Pain' },
    { id: 'other', emoji: '⚡', label: 'Other' },
  ];

  const toggleChip = (id: string) => {
    setSelectedChips(prev =>
      prev.includes(id)
        ? prev.filter(chip => chip !== id)
        : [...prev, id]
    );
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      // Start new recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioBlob(audioBlob);
          setAudioUrl(audioUrl);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setIsPaused(false);
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast.error('Could not access microphone. Please check permissions.');
      }
    } else {
      // Stop recording
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current?.stop();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const togglePauseResume = () => {
    if (!mediaRecorderRef.current) return;

    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } else if (mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const handlePhotoUpload = () => {
    if (hasPhoto) {
      setHasPhoto(false);
      setPhotoPreview(null);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setHasPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ✅ Updated handleSubmit with toast
  const handleSubmit = async () => {
    if (selectedChips.length === 0) {
      toast.error('Please select at least one emergency type');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmEmergency = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      let location = null;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocationStatus('success');
      } catch (error) {
        console.warn('Could not get location, continuing without it', error);
        setLocationStatus('error');
      }

      const emergencyData = {
        emergencyTypes: selectedChips,
        hasRecording: !!audioUrl,
        recordingTime: audioUrl ? recordingTime : 0,
        hasPhoto: hasPhoto,
        photoUrl: photoPreview || undefined,
        additionalDetails: additionalDetails,
        location: location,
        audioUrl: audioUrl || undefined,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/emergencies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emergencyData),
      });

      if (!response.ok) throw new Error('Failed to submit emergency');

      toast.success('Emergency alert sent! Help is on the way.', { duration: 5000 });

      setSelectedChips([]);
      setIsRecording(false);
      setRecordingTime(0);
      setHasPhoto(false);
      setPhotoPreview(null);
      setAdditionalDetails('');
      setAudioUrl(null);
      setAudioBlob(null);

    } catch (error: any) {
      console.error('Error submitting emergency:', error);
      toast.error(error.message || 'Failed to send emergency alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pt-16 px-5">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-2xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-2">What's happening?</h1>

        <div className="grid grid-cols-2 gap-4 my-6">
          {emergencyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => toggleChip(type.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 h-32 ${
                selectedChips.includes(type.id)
                  ? 'bg-[#FF3B30] text-white scale-105 shadow-md'
                  : 'bg-card border-border text-foreground hover:bg-accent/10'
              }`}
            >
              <span className="text-3xl mb-2">{type.emoji}</span>
              <div className="flex items-center">
                <span className="font-semibold">{type.label}</span>
                {selectedChips.includes(type.id) && (
                  <Check className="ml-1 h-4 w-4" strokeWidth={3} />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            OR describe quickly:
          </label>

          <div className="flex gap-3 items-center justify-center">
            <div className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-border bg-card">
              {isRecording ? (
                <>
                  <button onClick={togglePauseResume} className="p-2 rounded-full hover:bg-red-200 transition-colors">
                    {isPaused ? (
                      <Mic className="h-5 w-5 text-red-600" />
                    ) : (
                      <Pause className="h-5 w-5 text-red-600" />
                    )}
                  </button>
                  <span className="font-medium">{formatTime(recordingTime)}</span>
                  <button onClick={toggleRecording} className="p-2 rounded-full hover:bg-red-200 transition-colors">
                    <Square className="h-5 w-5 text-red-600" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={toggleRecording} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Mic className="h-5 w-5" />
                  </button>
                  <span className="font-medium">Tap to record</span>
                </>
              )}
            </div>

            <button
              onClick={handlePhotoUpload}
              className={`w-1/3 flex flex-col items-center justify-center gap-1 py-4 border-2 rounded-2xl ${
                hasPhoto
                  ? 'bg-green-100 border-green-200 text-green-600'
                  : 'bg-card border-border text-foreground'
              }`}
            >
              <Camera className="h-5 w-5" />
              <span className="text-xs font-medium">
                {hasPhoto ? 'Photo Added' : 'Add Photo'}
              </span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {audioUrl && !isRecording && (
            <div className="mt-4 flex items-center gap-2">
              <audio src={audioUrl} controls className="flex-1" />
              <button
                onClick={() => {
                  setAudioUrl(null);
                  setAudioBlob(null);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            ✍️ Additional details (optional)
          </label>
          <textarea
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="e.g., 'fell from stairs', 'ate peanuts 5 mins ago'"
            rows={3}
            maxLength={500}
            className="w-full p-3 rounded-xl border-2 border-border bg-card focus:outline-none focus:border-primary resize-none"
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full border-2 border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">Confirm Emergency</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to send an emergency alert? Emergency services will be notified.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-3 rounded-xl border-2 border-border font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmEmergency}
                className="flex-1 py-3 rounded-xl bg-destructive text-white font-medium hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Yes, Get Help!'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Updated Get Help Now button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t border-border z-40">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedChips.length === 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            selectedChips.length > 0
              ? 'bg-gradient-to-r from-[#FF3B30] to-[#FF6B6B] text-white hover:opacity-90 shadow-lg hover:shadow-red-500/20'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          } flex items-center justify-center gap-2`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending Help...
            </>
          ) : (
            '🚑 GET HELP NOW'
          )}
        </button>
      </div>
    </div>
  );
};

export default MedicalHelp;
