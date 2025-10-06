import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trash2, UserPlus, Phone, X } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  phone: string;
}

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>(() => {
    // Load contacts from localStorage on initial render
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Ahnaf', phone: '+919823217372' },
      { id: 2, name: 'Sahmad', phone: '+919823217372' }
    ];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ name: '', phone: '' });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  const deleteContact = (id: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {};
    let isValid = true;

    if (!newContact.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!newContact.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\+?[0-9\s-()]{10,}$/.test(newContact.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setContacts(prevContacts => [
      ...prevContacts, 
      { 
        id: Date.now(), 
        name: newContact.name.trim(), 
        phone: newContact.phone.trim() 
      }
    ]);
    
    // Reset form and close modal
    setNewContact({ name: '', phone: '' });
    setErrors({});
    setIsModalOpen(false);
  };
  
  const openAddContactModal = () => {
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

      {/* Contacts List */}
      <div className="px-4 py-6 space-y-4">
        {contacts.map((contact) => (
          <div 
            key={contact.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-gray-600" />
            </div>

            {/* Contact Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {contact.name}
              </h3>
              <a 
                href={`tel:${contact.phone}`}
                className="text-base text-gray-600 hover:text-blue-600 transition-colors"
              >
                {contact.phone}
              </a>
            </div>

            {/* Delete Button */}
            <button 
              onClick={() => deleteContact(contact.id)}
              className="p-3 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
            >
              <Trash2 className="w-6 h-6 text-red-500" />
            </button>
          </div>
        ))}

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

      {/* Add Contact Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <button 
          onClick={openAddContactModal}
          className="w-full bg-yellow-500 text-white rounded-2xl py-4 flex items-center justify-center gap-3 hover:bg-yellow-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] font-semibold text-lg"
        >
          <UserPlus className="w-6 h-6" />
          Add Emergency Contact
        </button>
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Emergency Contact</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newContact.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone ? (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +1, +91)</p>
                )}
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-colors"
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

