export const config = {
  appId: process.env.REACT_APP_APP_ID || '',
  redirectUri: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000',
  scopes: [
    'user.read',
    'mailboxsettings.read',
    'calendars.readwrite'
  ]
};