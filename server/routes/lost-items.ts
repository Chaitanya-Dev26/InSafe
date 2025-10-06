// server/routes/lost-items.ts
import { Router } from 'express';
import LostItem from '../models/LostItem';

const router = Router();

// Get all lost items
router.get('/', async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch lost items',
      error: error.message 
    });
  }
});

// Create a new lost item
router.post('/', async (req, res) => {
  try {
    const { itemName, description, location, locationName, contactInfo, images } = req.body;
    
    const lostItem = new LostItem({
      itemName,
      description,
      location: location ? {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      } : undefined,
      locationName,
      contactInfo,
      images,
      status: 'pending'
    });

    await lostItem.save();
    
    res.status(201).json({
      success: true,
      data: lostItem,
      message: 'Lost item reported successfully'
    });
  } catch (error) {
    console.error('Error creating lost item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report lost item',
      error: error.message
    });
  }
});

export default router;