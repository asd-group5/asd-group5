// import React from 'react';
// import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import PaymentComponent from '../PaymentComponent';
// import { getValidToken } from '../../../utils/auth';
// import { useNavigate } from 'react-router-dom';

// jest.mock('../../../utils/auth', () => ({
//   getValidToken: jest.fn(),
// }));

// jest.mock('react-router-dom', () => ({
//   useNavigate: jest.fn(),
// }));

// const mockNavigate = jest.fn();

// global.fetch = jest.fn();

// describe('PaymentComponent', () => {
//   beforeEach(() => {
//     global.fetch.mockClear();
//     getValidToken.mockResolvedValue('fake-token');
//     useNavigate.mockReturnValue(mockNavigate);

//     global.fetch.mockImplementation(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve([]),
//       })
//     );
//   });

//   it('renders the component', async () => {
//     await act(async () => {
//       render(<PaymentComponent />);
//     });
//     expect(screen.getByRole('heading', { name: 'Add Payment Method' })).toBeInTheDocument();
//     expect(screen.getByRole('heading', { name: 'Make Payment' })).toBeInTheDocument();
//   });

//   it('fetches and displays payment methods', async () => {
//     const mockPaymentMethods = [
//       { id: 1, name: 'Visa', cardNumber: '4111111111111111' },
//       { id: 2, name: 'MasterCard', cardNumber: '5555555555554444' },
//     ];

//     global.fetch.mockResolvedValueOnce({
//       ok: true,
//       json: async () => mockPaymentMethods,
//     });

//     await act(async () => {
//       render(<PaymentComponent />);
//     });

//     await waitFor(() => {
//       expect(screen.getByText('Visa - 1111')).toBeInTheDocument();
//       expect(screen.getByText('MasterCard - 4444')).toBeInTheDocument();
//     });
//   });

//   it('adds a new payment method', async () => {
//     await act(async () => {
//       render(<PaymentComponent />);
//     });

//     fireEvent.change(screen.getByLabelText('Name on Card:'), { target: { value: 'John Doe' } });
//     fireEvent.change(screen.getByLabelText('Card Number:'), { target: { value: '4111111111111111' } });
//     fireEvent.change(screen.getByLabelText('Expiry Date:'), { target: { value: '12/25' } });
//     fireEvent.change(screen.getByLabelText('CVV:'), { target: { value: '123' } });

//     global.fetch.mockImplementationOnce(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ id: 3, name: 'John Doe', cardNumber: '4111111111111111' }),
//       })
//     );

//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: 'Add Payment Method' }));
//     });

//     await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalledWith(
//         'http://localhost:8000/api/payment/methods/add/',
//         expect.objectContaining({
//           method: 'POST',
//           body: JSON.stringify({
//             name: 'John Doe',
//             cardNumber: '4111111111111111',
//             expiryDate: '12/25',
//             cvv: '123',
//           }),
//         })
//       );
//     });
//   });

//   it('processes a payment', async () => {
//     const mockPaymentMethods = [
//       { id: 1, name: 'Visa', cardNumber: '4111111111111111' },
//     ];

//     global.fetch.mockImplementation((url) => {
//       if (url.includes('/api/payment/methods/')) {
//         return Promise.resolve({
//           ok: true,
//           json: () => Promise.resolve(mockPaymentMethods),
//         });
//       }
//       if (url.includes('/api/payment/process/')) {
//         return Promise.resolve({
//           ok: true,
//           json: () => Promise.resolve({ status: 'success' }),
//         });
//       }
//       return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
//     });

//     await act(async () => {
//       render(<PaymentComponent />);
//     });

//     await act(async () => {
//       fireEvent.change(screen.getByLabelText('Amount:'), { target: { value: '100' } });
//       fireEvent.change(screen.getByLabelText('Select Payment Method:'), { target: { value: '1' } });
//     });

//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: 'Process Payment' }));
//     });

//     await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalledWith(
//         'http://localhost:8000/api/payment/process/',
//         expect.objectContaining({
//           method: 'POST',
//           body: JSON.stringify({
//             amount: '100',
//             paymentMethodId: '1',
//           }),
//         })
//       );
//       expect(mockNavigate).toHaveBeenCalledWith('/payment-confirmation', expect.any(Object));
//     });
//   });

//   it('handles payment method fetch error', async () => {
//     console.error = jest.fn();

//     global.fetch.mockRejectedValueOnce(new Error('API is down'));

//     await act(async () => {
//       render(<PaymentComponent />);
//     });

//     await waitFor(() => {
//       expect(console.error).toHaveBeenCalledWith('Error fetching payment methods:', expect.any(Error));
//       expect(screen.getByText('Visa - 1111')).toBeInTheDocument();
//       expect(screen.getByText('MasterCard - 4444')).toBeInTheDocument();
//     });
//   });

//   it('handles payment process error', async () => {
//     console.error = jest.fn();
//     window.alert = jest.fn();

//     global.fetch.mockImplementation((url) => {
//       if (url.includes('/api/payment/methods/')) {
//         return Promise.resolve({
//           ok: true,
//           json: () => Promise.resolve([{ id: 1, name: 'Visa', cardNumber: '4111111111111111' }]),
//         });
//       }
//       if (url.includes('/api/payment/process/')) {
//         return Promise.reject(new Error('Payment failed'));
//       }
//       return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
//     });

//     await act(async () => {
//       render(<PaymentComponent />);
//     });

//     await act(async () => {
//       fireEvent.change(screen.getByLabelText('Amount:'), { target: { value: '100' } });
//       fireEvent.change(screen.getByLabelText('Select Payment Method:'), { target: { value: '1' } });
//     });

//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: 'Process Payment' }));
//     });

//     await waitFor(() => {
//       expect(console.error).toHaveBeenCalledWith('Error processing payment:', expect.any(Error));
//       expect(window.alert).toHaveBeenCalledWith('Error processing payment. Please try again.');
//     });
//   });
// });

