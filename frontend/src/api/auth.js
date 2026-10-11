import { apiRequest } from './client';

// Local mock storage key for offline/demo testing if backend is offline
const DEMO_USERS_KEY = 'findit_demo_users';

function getDemoUsers() {
  const stored = localStorage.getItem(DEMO_USERS_KEY);
  if (!stored) {
    const defaultUsers = [
      {
        id: 'usr-admin-1',
        name: 'Team Admin',
        email: 'admin@findit.com',
        password: 'password123',
        role: 'admin',
      },
      {
        id: 'usr-demo-1',
        name: 'John Doe',
        email: 'user@findit.com',
        password: 'password123',
        role: 'user',
      },
    ];
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
}

export async function loginUser({ email, password }) {
  try {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  } catch (error) {
    if (error.isNetworkError) {
      // Demo offline fallback
      const demoUsers = getDemoUsers();
      const user = demoUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        return {
          token: `demo-jwt-token-${user.id}-${Date.now()}`,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          isDemoMode: true,
        };
      }
      throw new Error('Invalid email or password (offline demo mode: try user@findit.com or admin@findit.com with password123)');
    }
    throw error;
  }
}

export async function registerUser({ name, email, password, role = 'user' }) {
  try {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password, role },
    });
  } catch (error) {
    if (error.isNetworkError) {
      // Demo offline fallback
      const demoUsers = getDemoUsers();
      if (demoUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered (offline demo)');
      }
      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        password,
        role: role === 'admin' ? 'admin' : 'user',
      };
      demoUsers.push(newUser);
      localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(demoUsers));

      return {
        message: 'Registered successfully (Demo mode)',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        isDemoMode: true,
      };
    }
    throw error;
  }
}
