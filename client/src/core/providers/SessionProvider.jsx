/**
 * Session Provider
 * 
 * Manages authentication state across the application.
 * Different approach: uses reducer pattern instead of simple useState.
 */
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { staffAPI } from '../services/staff.service';

// Session state shape
const initialState = {
  currentUser: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null
};

// Action types for reducer
const SESSION_ACTIONS = {
  INITIALIZE_START: 'INITIALIZE_START',
  INITIALIZE_SUCCESS: 'INITIALIZE_SUCCESS',
  INITIALIZE_FAILURE: 'INITIALIZE_FAILURE',
  SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
  SIGN_OUT: 'SIGN_OUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer for predictable state transitions
const sessionReducer = (state, action) => {
  switch (action.type) {
    case SESSION_ACTIONS.INITIALIZE_START:
      return { ...state, isInitializing: true };
    
    case SESSION_ACTIONS.INITIALIZE_SUCCESS:
      return {
        ...state,
        isInitializing: false,
        currentUser: action.payload,
        isAuthenticated: !!action.payload
      };
    
    case SESSION_ACTIONS.INITIALIZE_FAILURE:
      return {
        ...state,
        isInitializing: false,
        currentUser: null,
        isAuthenticated: false
      };
    
    case SESSION_ACTIONS.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        error: null
      };
    
    case SESSION_ACTIONS.SIGN_OUT:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false
      };
    
    case SESSION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    
    case SESSION_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Context creation
const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const initializeSession = async () => {
      dispatch({ type: SESSION_ACTIONS.INITIALIZE_START });
      
      try {
        const response = await staffAPI.fetchProfile();
        dispatch({ 
          type: SESSION_ACTIONS.INITIALIZE_SUCCESS, 
          payload: response.data.data.staffMember 
        });
      } catch {
        // No valid session - this is expected for logged out users
        dispatch({ type: SESSION_ACTIONS.INITIALIZE_FAILURE });
      }
    };

    initializeSession();
  }, []);

  // Sign in handler
  const signIn = useCallback(async (credentials) => {
    dispatch({ type: SESSION_ACTIONS.CLEAR_ERROR });
    
    try {
      const response = await staffAPI.signIn(credentials);
      dispatch({ 
        type: SESSION_ACTIONS.SIGN_IN_SUCCESS, 
        payload: response.data.data.staffMember 
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Authentication failed';
      dispatch({ type: SESSION_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  }, []);

  // Sign out handler
  const signOut = useCallback(async () => {
    try {
      await staffAPI.signOut();
    } finally {
      dispatch({ type: SESSION_ACTIONS.SIGN_OUT });
    }
  }, []);

  // Expose state and actions
  const contextValue = {
    ...state,
    signIn,
    signOut,
    clearError: () => dispatch({ type: SESSION_ACTIONS.CLEAR_ERROR })
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook for consuming session context
export const useSession = () => {
  const context = useContext(SessionContext);
  
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
};
