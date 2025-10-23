import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import type { User } from '@/api/users/types';
import type { Company } from '@/api/company/types';
import { getUserService, getCompanyService } from '@/lib/services';
import { toast } from 'sonner';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

interface AuthContextType {
  user: AuthUser | null;
  userData: User | null;
  currentUser: User | null;
  company: Company | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (
    companyName: string,
    ownerName: string,
    ownerEmail: string,
    ownerPassword: string
  ) => boolean;
  joinCompany: (
    companyId: string,
    name: string,
    email: string,
    password: string,
    role: string,
    department: string
  ) => boolean;
  updateUser: (userData: any) => void;
  updateUserData: (updates: Partial<Omit<User, 'id'>>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const userService = getUserService();
const companyService = getCompanyService();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user: auth0User,
    isAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  const cleanName = useCallback((name: string) => {
    let cleanedName = name;
    if (name.includes('@') && name.endsWith('.com')) {
      cleanedName = name.split('@')[0];
    }
    return cleanedName.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }, []);

  const user = useMemo(() => {
    if (!isAuthenticated || !auth0User) return null;

    return {
      id: auth0User.sub || '',
      name: cleanName(auth0User.name || ''),
      email: auth0User.email || '',
      avatarUrl: auth0User.picture || '',
    } as AuthUser;
  }, [isAuthenticated, auth0User, cleanName]);

  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      return;
    }
    let data = userService.getById(user.id);
    if (!data) {
      data = userService.create(user.id, {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    }
    setUserData(data);
  }, [user]);

  const company = useMemo(() => {
    if (!userData || !userData.companyId) return null;
    return companyService.get(userData.companyId);
  }, [userData]);

  const login = useCallback(
    (_email: string, _password: string): boolean => {
      loginWithRedirect();
      return true;
    },
    [loginWithRedirect]
  );

  const logout = useCallback(() => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    toast.success('Logged out successfully.');
  }, [auth0Logout]);

  const register = useCallback(
    (
      _companyName: string,
      _ownerName: string,
      _ownerEmail: string,
      _ownerPassword: string
    ): boolean => {
      loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        },
      });
      return true;
    },
    [loginWithRedirect]
  );

  const joinCompany = useCallback(
    (
      _companyId: string,
      _name: string,
      _email: string,
      _password: string,
      _role: string,
      _department: string
    ): boolean => {
      loginWithRedirect();
      return true;
    },
    [loginWithRedirect]
  );

  const updateUser = useCallback(
    (_userData: any) => {
      if (user) {
        toast.success('Profile updated successfully.');
      }
    },
    [user]
  );

  const updateUserData = useCallback(
    (updates: Partial<Omit<User, 'id'>>) => {
      if (userData) {
        const updated = userService.update(userData.id, updates);
        if (!updated) {
          throw new Error('Failed to update user data');
        }
        setUserData(updated);
        toast.success('User data updated successfully.');
      }
    },
    [userData]
  );

  const value = useMemo(
    () => ({
      user,
      userData,
      currentUser: userData,
      company,
      login,
      logout,
      register,
      joinCompany,
      updateUser,
      updateUserData,
    }),
    [
      user,
      userData,
      company,
      login,
      logout,
      register,
      joinCompany,
      updateUser,
      updateUserData,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userData, company } = useAuth();
  const {
    isAuthenticated,
    isLoading,
    user: auth0User,
    loginWithRedirect,
  } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const isPublic = location.pathname === '/';
    const isOnboarding = location.pathname === '/onboarding';
    const isAuth0Authenticated = isAuthenticated && auth0User;

    if (!isAuth0Authenticated) {
      loginWithRedirect();
      return;
    }

    if (!userData) return;

    const hasCompany = userData && company;

    if (hasCompany && isPublic) {
      navigate('/dashboard');
    } else if (!hasCompany && !isOnboarding) {
      navigate('/onboarding');
    }
  }, [
    isAuthenticated,
    isLoading,
    userData,
    company,
    location.pathname,
    navigate,
    auth0User,
    loginWithRedirect,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
