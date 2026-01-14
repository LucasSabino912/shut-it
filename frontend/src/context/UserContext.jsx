/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback } from 'react';

const UserContext = createContext();

const userInitialState = {
  id: null,
  username: '',
  email: '',
  avatar_url: '',
  isAuthenticated: false
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true
      };
    case 'UPDATE_AVATAR':
      return {
        ...state,
        avatar_url: action.payload
      };
    case 'LOGOUT':
      return userInitialState;
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, userInitialState);

  const login = useCallback((userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateAvatar = useCallback((newUrl) => {
    dispatch({ type: 'UPDATE_AVATAR', payload: newUrl });
  }, []);

  return (
    <UserContext.Provider value={{ 
      user: userState, 
      login, 
      logout, 
      updateAvatar 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};