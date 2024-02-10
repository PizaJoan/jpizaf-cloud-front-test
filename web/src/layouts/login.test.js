
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

import LayoutLogin from './login';
import { LoginUser } from '../api/auth';

jest.mock('../api/auth');
jest.mock('react-router-dom');

afterEach(() => {
    jest.resetAllMocks();
})

test('renders login', () => {
    const { container } = render(<LayoutLogin />);
    expect(container).toBeInTheDocument();
});


test('correct login', async () => {
    // Arrange
    const useNavigateMock = jest.fn();
    useNavigate.mockReturnValue(useNavigateMock);

    LoginUser.mockResolvedValue({ Token: '123' });

    render(<LayoutLogin />);

    // Act
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    const submit = await screen.getAllByRole('button')[1];

    fireEvent.click(submit);

    // Assert
    await waitFor(() => expect(useNavigateMock).toHaveBeenCalledWith('/buildings'));
});


test('error login', async () => {
    // Arrange
    const ERROR_MESSAGE = 'MOCK_ERROR';
    LoginUser.mockResolvedValue({ message: ERROR_MESSAGE });

    render(<LayoutLogin />);

    // Act
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    const submit = await screen.getAllByRole('button')[1];

    fireEvent.click(submit);

    // Assert
    expect(await screen.findByText('MOCK_ERROR')).toBeInTheDocument();
    expect(emailInput).not.toBeValid()
    expect(passwordInput).not.toBeValid();
});