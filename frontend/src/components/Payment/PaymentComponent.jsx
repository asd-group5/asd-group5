import React from 'react';

const PaymentFormComponent = () => {
    return (
        <div>
            <h2>Add Payment Method</h2>
            <form>
                <div>
                    <label htmlFor="cardName">Name on Card:</label>
                    <input type="text" id="cardName" name="cardName" required />
                </div>
                <div>
                    <label htmlFor="cardNumber">Card Number:</label>
                    <input type="text" id="cardNumber" name="cardNumber" required />
                </div>
                <div>
                    <label htmlFor="expiryDate">Expiry Date:</label>
                    <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required />
                </div>
                <div>
                    <label htmlFor="cvv">CVV:</label>
                    <input type="text" id="cvv" name="cvv" required />
                </div>
                <button type="submit">Add Payment Method</button>
            </form>

            <h2>Make Payment</h2>
            <form>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input type="number" id="amount" name="amount" min="0" step="0.01" required />
                </div>
                <div>
                    <label htmlFor="paymentMethod">Select Payment Method:</label>
                    <select id="paymentMethod" name="paymentMethod" required>
                        <option value="">Select a payment method</option>
                        {/* Payment methods will be populated here */}
                    </select>
                </div>
                <button type="submit">Process Payment</button>
            </form>
        </div>
    );
};

export default PaymentFormComponent;