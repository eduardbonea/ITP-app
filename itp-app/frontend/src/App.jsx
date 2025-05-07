import { useState, useEffect } from 'react';
import './app.css';

// API base URL - change if your Express server runs on a different port
const API_URL = 'http://localhost:3001/api';

// Main App Component
export default function App() {
  const [view, setView] = useState('form'); // 'form' or 'data'
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    date: '',
    service: '1' // Default value
  });
  const [submissions, setSubmissions] = useState([]);
  const [serviceFilter, setServiceFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bookings when component mounts or when view changes to 'data'
  useEffect(() => {
    if (view === 'data') {
      fetchBookings();
    }
  }, [view]);

  // Fetch all bookings from the backend
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/bookings`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit booking');
      }
      
      // Reset form
      setFormData({
        name: '',
        surname: '',
        phone: '',
        email: '',
        date: '',
        service: '1'
      });
      
      // Switch to data view after submission
      setView('data');
      
    } catch (err) {
      console.error('Error submitting booking:', err);
      setError(err.message || 'Failed to submit booking. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = serviceFilter === 'all' 
    ? submissions 
    : submissions.filter(item => item.service === serviceFilter);
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking System</h1>
          <div className="flex space-x-4">
            <button 
              className={`px-4 py-2 rounded-md ${view === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setView('form')}
            >
              Booking Form
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${view === 'data' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setView('data')}
            >
              View Bookings
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        {view === 'form' ? (
          <BookingForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleSubmit} 
            loading={loading}
          />
        ) : (
          <DataView 
            submissions={filteredSubmissions} 
            serviceFilter={serviceFilter}
            setServiceFilter={setServiceFilter}
            loading={loading}
            refresh={fetchBookings}
          />
        )}
      </div>
    </div>
  );
}

// Booking Form Component
function BookingForm({ formData, handleInputChange, handleSubmit, loading }) {
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">New Booking</h2>
      
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
              Surname
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Service 1</option>
              <option value="2">Service 2</option>
            </select>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {loading ? 'Submitting...' : 'Submit Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Data View Component
function DataView({ submissions, serviceFilter, setServiceFilter, loading, refresh }) {
  // Function to delete a booking
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`${API_URL}/bookings/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Refresh the list after deletion
          refresh();
        } else {
          alert('Failed to delete booking');
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('An error occurred while deleting the booking');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={refresh}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Refresh
          </button>
          
          <div>
            <label htmlFor="filterService" className="mr-2 text-sm font-medium text-gray-700">
              Filter by Service:
            </label>
            <select
              id="filterService"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Services</option>
              <option value="1">Service 1</option>
              <option value="2">Service 2</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading bookings...
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No bookings found. Please submit a booking form.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surname</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.surname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Service {submission.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleDelete(submission.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}