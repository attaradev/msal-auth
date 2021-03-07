import { PublicClientApplication } from '@azure/msal-browser';
import { ComponentType, useCallback, useEffect, useMemo, useState } from 'react';
import { config, getUserDetails } from '../../../services/graph-service';

export interface AuthComponentProps {
  error: any;
  isAuthenticated: boolean;
  user: any;
  login: Function;
  logout: Function;
  getAccessToken: Function;
  setError: Function;
}

interface AuthProviderState {
  error: any;
  isAuthenticated: boolean;
  user: any;
}

export default function withAuthProvider<T extends AuthComponentProps = AuthComponentProps>(WrappedComponent: ComponentType<T>){
  const WithAuthProvider = (props: any) => {
    const [state, setState] = useState<AuthProviderState>({error: null, isAuthenticated: false, user: {}})
    
    // Initialize the MSAL application object
    const publicClientApplication = useMemo(()=>{
      return new PublicClientApplication({
        auth: {
          clientId: config.appId,
          redirectUri: config.redirectUri
        },
        cache: {
          cacheLocation: "sessionStorage",
          storeAuthStateInCookie: true
        }
      })
    },[]);

    const login = async () => {
      try {
        // Login via popup
        await publicClientApplication.loginPopup(
          {
            scopes: config.scopes,
            prompt: "select_account"
          });

        // After login, get the user's profile
        await getUserProfile();
      }
      catch (err) {
        setState({
          isAuthenticated: false,
          user: {},
          error: normalizeError(err)
        });
      }
    }

    const logout = () => {
      publicClientApplication.logout();
    }

    const getAccessToken = useCallback(async(scopes: string[]) => {
      try {
        const accounts = publicClientApplication
          .getAllAccounts();

        if (accounts.length <= 0) throw new Error('login_required');
        // Get the access token silently
        // If the cache contains a non-expired token, this function
        // will just return the cached token. Otherwise, it will
        // make a request to the Azure OAuth endpoint to get a token
        var silentResult = await publicClientApplication
          .acquireTokenSilent({
            scopes: scopes,
            account: accounts[0]
          });

        return silentResult.accessToken;
      } catch (err) {
        // If a silent request fails, it may be because the user needs
        // to login or grant consent to one or more of the requested scopes
        if (isInteractionRequired(err)) {
          var interactiveResult = await publicClientApplication
            .acquireTokenPopup({
              scopes: scopes
            });

          return interactiveResult.accessToken;
        } else {
          throw err;
        }
      }
    },[publicClientApplication])

    const getUserProfile = useCallback(async () => {
      try {
        var accessToken = await getAccessToken(config.scopes);

        if (accessToken) {
          // Get the user's profile from Graph
        const user = await getUserDetails(accessToken);
        setState({
          isAuthenticated: true,
          user: {
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName,
            timeZone: user.mailboxSettings.timeZone || 'UTC',
            timeFormat: user.mailboxSettings.timeFormat
          },
          error: null
        });
        }
      }
      catch(err) {
        setState({
          isAuthenticated: false,
          user: {},
          error: normalizeError(err)
        });
      }
    },[getAccessToken])

    const setErrorMessage = (message: string, debug: string) => {
      setState(state => ({
        ...state,
        error: { message: message, debug: debug }
      }));
    }

    const normalizeError = (error: string | Error) => {
      var normalizedError = {};
      if (typeof (error) === 'string') {
        var errParts = error.split('|');
        normalizedError = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: error };
      } else {
        normalizedError = {
          message: error.message,
          debug: JSON.stringify(error)
        };
      }
      return normalizedError;
    }

    const isInteractionRequired = (error: Error) => {
      if (!error.message || error.message.length <= 0) {
        return false;
      }

      return (
        error.message.indexOf('consent_required') > -1 ||
        error.message.indexOf('interaction_required') > -1 ||
        error.message.indexOf('login_required') > -1 ||
        error.message.indexOf('no_account_in_silent_request') > -1
      );
    }

    useEffect(()=>{
      // If MSAL already has an account, the user
      // is already logged in
      const accounts = publicClientApplication.getAllAccounts();

      if (accounts && accounts.length > 0) {
        // Enhance user object with data from Graph
        getUserProfile();
      }
    },[getUserProfile, publicClientApplication]);

    return <WrappedComponent
      error={ state.error }
      isAuthenticated={ state.isAuthenticated }
      user={ state.user }
      login={ login}
      logout={ logout }
      getAccessToken={ (scopes: string[]) => getAccessToken(scopes) }
      setError={ (message: string, debug: string) => setErrorMessage(message, debug) }
      { ...props } />;
  }
  return WithAuthProvider;
}