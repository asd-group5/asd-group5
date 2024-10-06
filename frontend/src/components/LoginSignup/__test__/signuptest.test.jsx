import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginSignup from '../../../pages/LoginSignup.jsx';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock axios
jest.mock('axios');

describe('LoginSignup Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Router>
        <LoginSignup />
      </Router>
    );
  };

    test('renders the sign-up form by default', () => {
        render(
            <Router>
                <LoginSignup />
            </Router>
        );

        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    });

    test('renders the login form', () => {
        render(
            <Router>
                <LoginSignup />
            </Router>
        );
    fireEvent.click(screen.getByText('Login'));

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    test('displays error message when login fails', async () => {
        renderComponent();

        // Switch to login mode
        fireEvent.click(screen.getByText('Login'));

        // Mock login API failure response
        axios.post.mockRejectedValue({
            response: {
            data: {
                email: ['Invalid email'],
            },
            },
        });

        // Fill in login form
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });

        // Click on the submit button
        fireEvent.click(screen.getByText('Submit'));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Invalid email')).toBeInTheDocument();
        });
    });

});
