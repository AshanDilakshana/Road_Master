import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPinIcon, ImageIcon, ClockIcon, MailIcon, PhoneIcon, SendIcon, XIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Axios from 'axios';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });
  return position ? <Marker position={position} /> : null;
};

const InformForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { inform } = location.state || {};

  const [position, setPosition] = useState(inform ? [inform.location.lat, inform.location.lng] : [7.8731, 80.7718]);
  const [formData, setFormData] = useState({
    province: inform?.province || '',
    district: inform?.district || '',
    nearbyTown: inform?.nearbyTown || '',
    damageLevel: inform?.damageLevel || 'low',
    contactNumber: inform?.contactNumber || '',
    additionalMessage: inform?.additionalMessage || '',
    images: inform?.image || []
  });
  
  const [images, setImages] = useState(inform?.image || []);
  const [previewUrls, setPreviewUrls] = useState(inform?.image || []);

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (!url.startsWith('data:image')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).slice(0, 5 - images.length);

      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

      const base64Promises = newImages.map(file => convertToBase64(file));
      const base64Results = await Promise.all(base64Promises);

      setImages(prev => [...prev, ...base64Results]);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Results] }));
    }
  };

  const removeImage = (index) => {
    if (previewUrls[index] && !previewUrls[index].startsWith('data:image')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        province: formData.province,
        district: formData.district,
        nearbyTown: formData.nearbyTown,
        damageLevel: formData.DamageLevel,
        contactNumber: formData.contactNumber,
        additionalMessage: formData.additionalMessage,
        userName: user?.name,
        emailAddress: user?.email,
        timeAndDate: new Date().toISOString(),
        location: {
          lat: position[0],
          lng: position[1]
        },
        image: formData.images
      };

      let response;
      if (inform) {
        response = await Axios.put(`http://localhost:8080/api/reportIssues/reportIssues_update/${inform._id}`, requestData);
      } else {
        response = await Axios.post('http://localhost:8080/api/reportIssues/reportIssues_create', requestData);
      }

      if (response.status === 201 || response.status === 200) {
        alert(`Report ${inform ? 'updated' : 'submitted'} successfully!`);
        navigate('/user-dashboard');
      } else {
        alert(`Failed to ${inform ? 'update' : 'submit'} report. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${inform ? 'updating' : 'submitting'} report:`, error);
      alert(`An error occurred while ${inform ? 'updating' : 'submitting'} the report. Please try again later.`);
    }
  };

  return <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-600">
          {inform ? 'Edit Report Issue' : 'Report Road Issue'}
        </h1>
        <button onClick={() => navigate('/user-dashboard')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition-colors">
            Back to Dashboard
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="province">
                Province *
              </label>
              <select id="province" name="province" value={formData.province} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Province</option>
                <option value="Western">Western</option>
                <option value="Central">Central</option>
                <option value="Southern">Southern</option>
                <option value="Northern">Northern</option>
                <option value="Eastern">Eastern</option>
                <option value="North Western">North Western</option>
                <option value="North Central">North Central</option>
                <option value="Uva">Uva</option>
                <option value="Sabaragamuwa">Sabaragamuwa</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="district">
                District *
              </label>
              <select id="district" name="district" value={formData.district} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select District</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Kandy">Kandy</option>
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Badulla">Badulla</option>
                <option value="Monaragala">Monaragala</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Kegalle">Kegalle</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="nearbyTown">
              Nearby Town *
            </label>
            <input type="text" id="nearbyTown" name="nearbyTown" value={formData.nearbyTown} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter the nearest town or landmark" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="damageLevel">
              Damage Level *
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input type="radio" name="damageLevel" value="low" checked={formData.damageLevel === 'low'} onChange={handleChange} className="form-radio text-blue-600" />
                <span className="ml-2">Low</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="damageLevel" value="medium" checked={formData.damageLevel === 'medium'} onChange={handleChange} className="form-radio text-blue-600" />
                <span className="ml-2">Medium</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="damageLevel" value="high" checked={formData.damageLevel === 'high'} onChange={handleChange} className="form-radio text-blue-600" />
                <span className="ml-2">High</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center">
                  <ClockIcon size={18} className="mr-2" />
                  Date & Time
                </div>
              </label>
              <input type="text" value={new Date().toLocaleString()} className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100" disabled />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center">
                  <MailIcon size={18} className="mr-2" />
                  Email Address
                </div>
              </label>
              <input type="email" value={user?.email || ''} className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100" disabled />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="contactNumber">
              <div className="flex items-center">
                <PhoneIcon size={18} className="mr-2" />
                Contact Number *
              </div>
            </label>
            <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your contact number" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              <div className="flex items-center">
                <ImageIcon size={18} className="mr-2" />
                Upload Images (Max 5)
              </div>
            </label>
            {images.length < 5 && <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input type="file" id="images" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                <label htmlFor="images" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <ImageIcon size={36} className="text-gray-400 mb-2" />
                    <p className="text-gray-500">Click to upload images</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {5 - images.length} remaining
                    </p>
                  </div>
                </label>
              </div>}
            {previewUrls.length > 0 && <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {previewUrls.map((url, index) => <div key={index} className="relative">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                      <XIcon size={16} />
                    </button>
                  </div>)}
              </div>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              <div className="flex items-center">
                <MapPinIcon size={18} className="mr-2" />
                Select Location on Map *
              </div>
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: '400px' }}>
              <MapContainer center={position} zoom={8} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <div className="mt-2 text-sm text-gray-600 flex justify-between">
              <span>Latitude: {position[0].toFixed(6)}</span>
              <span>Longitude: {position[1].toFixed(6)}</span>
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="additionalMessage">
              Additional Message
            </label>
            <textarea id="additionalMessage" name="additionalMessage" value={formData.additionalMessage} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Provide any additional details about the issue"></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/user-dashboard')} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center">
              <SendIcon size={18} className="mr-2" />
              {inform ? 'Update Report' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};

export default InformForm;