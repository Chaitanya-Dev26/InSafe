// server/routes/emergency.ts
import { Router } from 'express';
import Emergency from '../models/Emergency';

const router = Router();

// Priority mapping for emergency types
const PRIORITY_MAP: Record<string, number> = {
  'injury': 1,
  'breathing': 2,
  'chest-pain': 3,
  'unconscious': 4,
  'allergic': 5,
  'other': 10
};

// Helper function to calculate priority
const calculatePriority = (emergencyTypes: string[]): number => {
  if (!emergencyTypes || emergencyTypes.length === 0) return PRIORITY_MAP.other;
  
  // Find the highest priority (lowest number) among all emergency types
  return emergencyTypes.reduce((minPriority, type) => {
    const priority = PRIORITY_MAP[type] || PRIORITY_MAP.other;
    return Math.min(minPriority, priority);
  }, PRIORITY_MAP.other);
};

// Create a new emergency
router.post('/', async (req, res) => {
  try {
    const { emergencyTypes, hasRecording, recordingTime, hasPhoto, photoUrl, additionalDetails, location, locationName } = req.body;
    
    // Validate and sanitize emergencyTypes
    const allowedTypes = Object.keys(PRIORITY_MAP);
    const validatedTypes = Array.isArray(emergencyTypes) 
      ? emergencyTypes.filter((type: string) => allowedTypes.includes(type))
      : [];

    if (validatedTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one valid emergency type is required'
      });
    }

    // Calculate priority based on the most critical emergency type
    const priority = calculatePriority(validatedTypes);

    const emergency = new Emergency({
      emergencyTypes: validatedTypes,
      hasRecording: Boolean(hasRecording),
      recordingTime: hasRecording ? recordingTime : undefined,
      hasPhoto: Boolean(hasPhoto),
      photoUrl: hasPhoto ? photoUrl : undefined,
      additionalDetails,
      location: location ? {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      } : undefined,
      locationName,
      status: 'pending',
      priority // Make sure this is being set
    });

    await emergency.save();
    
    res.status(201).json({
      success: true,
      data: emergency,
      message: 'Emergency reported successfully'
    });
  } catch (error) {
    console.error('Error creating emergency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report emergency',
      error: error.message
    });
  }
});

// server/routes/emergency.ts
// ... (keep the existing imports and PRIORITY_MAP)

// Update the GET /api/emergencies route
router.get('/', async (req, res) => {
  try {
    const emergencies = await Emergency.find()
      .sort({ 
        priority: 1, // Sort by priority (ascending - lower numbers first)
        createdAt: -1 // Then by newest first
      });
      // Remove the populate call since we're not using reportedBy
      
    res.status(200).json({ 
      success: true, 
      data: emergencies 
    });
  } catch (error) {
    console.error('Error fetching emergencies:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch emergencies',
      error: error.message 
    });
  }
});

// Update the PATCH /api/emergencies/:id/status route
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, in-progress, resolved'
      });
    }

    const emergency = await Emergency.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ); // Remove populate call

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    res.status(200).json({
      success: true,
      data: emergency,
      message: `Emergency marked as ${status}`
    });
  } catch (error) {
    console.error('Error updating emergency status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update emergency status',
      error: error.message
    });
  }
});

// ... (keep the rest of the routes)
export default router;