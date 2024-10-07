import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginSignup from '../../../pages/LoginSignup.jsx';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('LoginSignup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Router>
        <LoginSignup />
      </Router>
    );
  };
////////////////////////
    test('renders sign-up form', () => {
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
////////////////////////
    test('renders login form', () => {
        render(
            <Router>
                <LoginSignup />
            </Router>
        );
    fireEvent.click(screen.getByText('Login'));

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });
///////////////////////
    test('error message displayed when login fails', async () => {
        renderComponent();

        // Switch to login mode
        fireEvent.click(screen.getByText('Login'));

        // Error
        axios.post.mockRejectedValue({
            response: {
            data: {
                email: ['Invalid Credentials'],
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
            expect(screen.getByText('Invalid Credentials')).toBeInTheDocument();
        });
    });
});
