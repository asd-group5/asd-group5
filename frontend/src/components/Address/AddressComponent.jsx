import React from 'react';

const AddressComponent = () => {
    return (
        <div>
            <h2>Add/Edit Address</h2>
            <form>
                <div>
                    <label htmlFor="name">Address Name:</label>
                    <input type="text" id="name" name="name" required />
                </div>
                <div>
                    <label htmlFor="streetAddress">Street Address:</label>
                    <input type="text" id="streetAddress" name="streetAddress" required />
                </div>
                <div>
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" name="city" required />
                </div>
                <div>
                    <label htmlFor="state">State:</label>
                    <input type="text" id="state" name="state" required />
                </div>
                <div>
                    <label htmlFor="postalCode">Postal Code:</label>
                    <input type="text" id="postalCode" name="postalCode" required />
                </div>
                <div>
                    <label htmlFor="country">Country:</label>
                    <input type="text" id="country" name="country" required />
                </div>
                <div>
                    <input type="checkbox" id="isDefault" name="isDefault" />
                    <label htmlFor="isDefault">Set as default address</label>
                </div>
                <button type="submit">Save Address</button>
            </form>
        </div>
    );
};

export default AddressComponent;