import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 60, // Token expires in 60 minutes
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid username or password');
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  // DummyJSON doesn't have a real registration endpoint, so we'll simulate it
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Simulate registration by creating a user object
      // In a real app, this would be a POST to /users endpoint
      
      // For demo purposes, we'll use the login endpoint with test credentials
      // In production, you'd actually create the user first
      const mockUser: AuthResponse = {
        id: Math.floor(Math.random() * 1000),
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: 'male',
        image: 'https://via.placeholder.com/150',
        token: `mock_token_${Date.now()}`,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return mockUser;
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  }

  async getCurrentUser(token: string): Promise<AuthResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user data');
    }
  }

  async refreshToken(token: string): Promise<{ token: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        expiresInMins: 60,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }
}

export default new AuthService();
