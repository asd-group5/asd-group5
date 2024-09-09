import React from 'react';
import AddressFormComponent from '../components/Address/AddressComponent';

const AddressPage = () => {
    return (
        <div className="address-page">
            <h1>Address Management</h1>
            <AddressFormComponent />
        </div>
    );
};

export default AddressPage;