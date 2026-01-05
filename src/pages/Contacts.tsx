/*
🚨 EMERGENCY CONTACTS SYSTEM 🚨

This component manages emergency contacts that are automatically used by the SOS system.

📋 HOW IT WORKS:
1. 💾 Contacts are stored in browser's localStorage with key 'emergencyContacts'
2. 🔄 Any changes (add/delete) automatically save to localStorage via useEffect
3. 🚨 When SOS button is pressed, the SOS page automatically loads these contacts
4. 📱 SOS system sends simulated alerts to all contacts with user's GPS location
5. 🌍 Each alert includes Google Maps link for precise location sharing

🔗 CONNECTION TO SOS:
- localStorage key: 'emergencyContacts' 
- SOS page reads this same key to get contact list
- No manual linking required - it's automatic!

📱 FEATURES:
- ✅ Add new contacts with validation
- 🗑️ Delete contacts with confirmation
- 📞 Click phone numbers to call
- 💾 Auto-save to localStorage
- 📭 Empty state when no contacts exist
*/

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trash2, UserPlus, Phone, X } from 'lucide-react';

// Define the structure of a contact object
interface Contact {
  id: number;      // Unique identifier for each contact
  name: string;    // Contact's full name
  phone: string;   // Contact's phone number (with country code)
}

export default function EmergencyContacts() {
  const navigate = useNavigate();
  
  // Initialize contacts state with data from localStorage or default contacts
  const [contacts, setContacts] = useState<Contact[]>(() => {
    // Try to load existing contacts from browser's localStorage
    const saved = localStorage.getItem('emergencyContacts');
    
    // If contacts exist in localStorage, parse and use them
    // Otherwise, provide default demo contacts
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Ahnaf', phone: '+919823217372' },
      { id: 2, name: 'Sahmad', phone: '+919823217372' }
    ];
  });
  
  // State for controlling the add contact modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for storing new contact form data (excludes id since it's auto-generated)
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ name: '', phone: '' });
  
  // State for storing form validation errors
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // 🔄 CRITICAL: Auto-save contacts to localStorage whenever contacts array changes
  // This ensures contacts are immediately available to the SOS emergency system
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    console.log('💾 Contacts saved to localStorage:', contacts);
  }, [contacts]); // Dependency array: runs every time 'contacts' changes

  // 🗑️ Delete a contact from the list
  const deleteContact = (id: number) => {
    // Show confirmation dialog to prevent accidental deletion
    if (window.confirm('Are you sure you want to delete this contact?')) {
      // Filter out the contact with matching id and update state
      // This will trigger the useEffect above to save updated list to localStorage
      setContacts(contacts.filter(contact => contact.id !== id));
      console.log('🗑️ Contact deleted, remaining contacts will be auto-saved');
    }
  };

  // ✅ Validate the new contact form before submission
  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {};
    let isValid = true;

    // Check if name field is empty or just whitespace
    if (!newContact.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Check if phone field is empty or just whitespace
    if (!newContact.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } 
    // Validate phone number format (allows +, numbers, spaces, dashes, parentheses)
    // Must be at least 10 characters long
    else if (!/^\+?[0-9\s-()]{10,}$/.test(newContact.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    // Update error state and return validation result
    setErrors(newErrors);
    return isValid;
  };

  // 📝 Handle input field changes in the add contact form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update the newContact state with the new input value
    setNewContact(prev => ({
      ...prev,
      [name]: value  // Dynamically update either 'name' or 'phone' field
    }));
    
    // Clear any existing error for this field when user starts typing
    // This provides immediate feedback and better user experience
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // 💾 Handle form submission to add a new emergency contact
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default form submission behavior
    
    // Validate form data before proceeding
    if (!validateForm()) return;
    
    // 🚨 CRITICAL: Add new contact to the contacts array
    // This will automatically trigger the useEffect above to save to localStorage
    // Making the contact immediately available for SOS emergency alerts
    setContacts(prevContacts => [
      ...prevContacts,  // Keep all existing contacts
      { 
        id: Date.now(),  // Use timestamp as unique ID
        name: newContact.name.trim(),   // Remove extra whitespace
        phone: newContact.phone.trim()  // Remove extra whitespace
      }
    ]);
    
    console.log('➕ New contact added! Will be auto-saved and available for SOS alerts');
    
    // Reset form fields and close modal
    setNewContact({ name: '', phone: '' });
    setErrors({});
    setIsModalOpen(false);
  };
  
  // 🔄 Prepare and open the add contact modal
  const openAddContactModal = () => {
    // Reset form to clean state
    setNewContact({ name: '', phone: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
        </div>
      </div>

      {/* 📋 Contacts List - Display all saved emergency contacts */}
      <div className="px-4 py-6 space-y-4">
        {/* Loop through each contact and render a contact card */}
        {contacts.map((contact) => (
          <div 
            key={contact.id}  // React key for efficient re-rendering
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            {/* 👤 Avatar placeholder */}
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-gray-600" />
            </div>

            {/* 📞 Contact Information Display */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {contact.name}
              </h3>
              {/* Phone number is clickable to initiate a call */}
              <a 
                href={`tel:${contact.phone}`}  // Creates a clickable phone link
                className="text-base text-gray-600 hover:text-blue-600 transition-colors"
              >
                {contact.phone}
              </a>
            </div>

            {/* 🗑️ Delete Contact Button */}
            <button 
              onClick={() => deleteContact(contact.id)}  // Call delete function with contact ID
              className="p-3 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
            >
              <Trash2 className="w-6 h-6 text-red-500" />
            </button>
          </div>
        ))}

        {/* 📭 Empty State - Show when no contacts exist */}
        {contacts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No emergency contacts yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first emergency contact</p>
          </div>
        )}
      </div>

      {/* ➕ Add Contact Button - Fixed at bottom of screen */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <button 
          onClick={openAddContactModal}  // Opens the add contact modal
          className="w-full bg-yellow-500 text-white rounded-2xl py-4 flex items-center justify-center gap-3 hover:bg-yellow-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] font-semibold text-lg"
        >
          <UserPlus className="w-6 h-6" />
          Add Emergency Contact
        </button>
      </div>

      {/* 📝 Add Contact Modal - Only shown when isModalOpen is true */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            {/* ❌ Close Modal Button */}
            <button 
              onClick={() => setIsModalOpen(false)}  // Close modal without saving
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Emergency Contact</h2>
            
            {/* 📋 Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 👤 Name Input Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"  // This matches the key in newContact state
                  value={newContact.name}
                  onChange={handleInputChange}  // Updates state and clears errors
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.name ? 'border-red-500' : 'border-gray-200'  // Red border if error exists
                  } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="Enter name"
                />
                {/* Show error message if name validation fails */}
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              {/* 📞 Phone Input Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"  // Optimizes mobile keyboard for phone numbers
                  id="phone"
                  name="phone"  // This matches the key in newContact state
                  value={newContact.phone}
                  onChange={handleInputChange}  // Updates state and clears errors
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'  // Red border if error exists
                  } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="+1 (555) 123-4567"
                />
                {/* Show error message or helpful hint */}
                {errors.phone ? (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +1, +91)</p>
                )}
              </div>
              
              {/* 💾 Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"  // Triggers handleSubmit function
                  className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-colors"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

