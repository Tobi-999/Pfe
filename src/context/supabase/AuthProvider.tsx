import { AuthResponse } from "@supabase/supabase-js";
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { supabase } from "../../supabase/SupaBase";

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
};

export type JWTContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    email: string,
    password: string,
    firstName: string
  ) => Promise<AuthResponse>;
  logout: () => void;
};

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: action.payload.isInitialized,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function SupaBaseConnectionProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      // await supabase.auth.signOut();

      dispatch({
        type: Types.INITIAL,
        payload: {
          isInitialized: true,
          isAuthenticated: false,
          user: null,
        },
      });

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      console.log("here");

      if (sessionError) {
        throw sessionError;
      }

      const user = sessionData?.session?.user;

      if (!user) {
        throw "User session data is missing or invalid";
      }
      const { data: userData, error: errorGetProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log({ userData });

      if (errorGetProfile) throw errorGetProfile;

      dispatch({
        type: Types.INITIAL,
        payload: {
          isInitialized: false,
          isAuthenticated: true,
          user: userData,
        },
      });

      // } else {
      // dispatch({
      //   type: Types.INITIAL,
      //   payload: {
      //     isAuthenticated: false,
      //     user: null,
      //   },
      // });
      // }
    } catch (error) {
      console.error({ error });
      dispatch({
        type: Types.INITIAL,
        payload: {
          isInitialized: false,
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      const user = data.session.user;

      const { data: userData, error: errorGetProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log({ userData });
      if (error) throw errorGetProfile;

      dispatch({
        type: Types.INITIAL,
        payload: {
          isInitialized: false,
          isAuthenticated: true,
          user: userData,
        },
      });
      return (window.location.href = "/login");
    }

    dispatch({
      type: Types.LOGIN,
      payload: {
        isAuthenticated: true,
        user: null,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
          },
          emailRedirectTo: "hiiiiiii",
        },
      });

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: data,
        },
      });
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();

    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: "jwt",
      login,
      register,
      logout,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      login,
      logout,
      register,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
