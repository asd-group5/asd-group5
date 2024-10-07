import React, { useState, useEffect } from 'react';
import { getValidToken } from '../../utils/auth';

const BASE_URL = 'http://localhost:8000';

const AddressComponent = () => {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        name: '', street_address: '', city: '', state: '', postal_code: '', country: '', is_default: false
    });
    const [editingAddressId, setEditingAddressId] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const token = await getValidToken();
            const response = await fetch(`${BASE_URL}/api/address/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) throw new Error('Failed to fetch addresses');
            const data = await response.json();
            setAddresses(data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getValidToken();
            const url = editingAddressId 
                ? `${BASE_URL}/api/address/${editingAddressId}/`
                : `${BASE_URL}/api/address/`;
            const method = editingAddressId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAddress)
            });
            if (!response.ok) throw new Error('Failed to save address');
            await fetchAddresses();
            setNewAddress({ name: '', street_address: '', city: '', state: '', postal_code: '', country: '', is_default: false });
            setEditingAddressId(null);
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    const handleEdit = (address) => {
        setNewAddress(address);
        setEditingAddressId(address.id);
    };

    const handleDelete = async (id) => {
        try {
            const token = await getValidToken();
            const response = await fetch(`${BASE_URL}/api/address/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete address');
            await fetchAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    return (
        <div>
            <h2>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Address Name:</label>
                    <input type="text" id="name" name="name" value={newAddress.name} onChange={handleInputChange} required />
                </div>
                <div>
                    <label htmlFor="street_address">Street Address:</label>
                    <input type="text" id="street_address" name="street_address" value={newAddress.street_address} onChange={handleInputChange} required />
                </div>
                <div>
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" name="city" value={newAddress.city} onChange={handleInputChange} required />
                </div>
                <div>
                    <label htmlFor="state">State:</label>
                    <input type="text" id="state" name="state" value={newAddress.state} onChange={handleInputChange} required />
                </div>
                <div>
                    <label htmlFor="postal_code">Postal Code:</label>
                    <input type="text" id="postal_code" name="postal_code" value={newAddress.postal_code} onChange={handleInputChange} required />
                </div>
                <div>
                    <label htmlFor="country">Country:</label>
                    <input type="text" id="country" name="country" value={newAddress.country} onChange={handleInputChange} required />
                </div>
                <div>
                    <input type="checkbox" id="is_default" name="is_default" checked={newAddress.is_default} onChange={handleInputChange} />
                    <label htmlFor="is_default">Set as default address</label>
                </div>
                <button type="submit">{editingAddressId ? 'Update' : 'Save'} Address</button>
            </form>

            <h2>Your Addresses</h2>
            <ul>
                {addresses.map(address => (
                    <li key={address.id}>
                        {address.name} - {address.street_address}, {address.city}, {address.state} {address.postal_code}, {address.country}
                        {address.is_default && ' (Default)'}
                        <button onClick={() => handleEdit(address)}>Edit</button>
                        <button onClick={() => handleDelete(address.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddressComponent;