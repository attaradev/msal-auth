import moment, { Moment } from 'moment';
import { Event } from 'microsoft-graph';
import { GraphRequestOptions, PageCollection, PageIterator , Client} from '@microsoft/microsoft-graph-client';

export const config = {
  appId: process.env.REACT_APP_APP_ID || '',
  redirectUri: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000',
  scopes: [
    'user.read',
    'mailboxsettings.read',
    'calendars.readwrite'
  ]
};

function getAuthenticatedClient(accessToken: string) {
  // Initialize Graph client
  const client = Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done: any) => {
      done(null, accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken: string) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client
    .api('/me')
    .select('displayName,mail,mailboxSettings,userPrincipalName')
    .get();

  return user;
}

export async function getUserWeekCalendar(accessToken: string, timeZone: string, startDate: Moment): Promise<Event[]> {
  const client = getAuthenticatedClient(accessToken);

  // Generate startDateTime and endDateTime query params
  // to display a 7-day window
  var startDateTime = startDate.format();
  var endDateTime = moment(startDate).add(7, 'day').format();

  // GET /me/calendarview?startDateTime=''&endDateTime=''
  // &$select=subject,organizer,start,end
  // &$orderby=start/dateTime
  // &$top=50
  var response: PageCollection = await client
    .api('/me/calendarview')
    .header('Prefer', `outlook.timezone="${timeZone}"`)
    .query({ startDateTime: startDateTime, endDateTime: endDateTime })
    .select('subject,organizer,start,end')
    .orderby('start/dateTime')
    .top(25)
    .get();

  if (response["@odata.nextLink"]) {
    // Presence of the nextLink property indicates more results are available
    // Use a page iterator to get all results
    var events: Event[] = [];

    // Must include the time zone header in page
    // requests too
    var options: GraphRequestOptions = {
      headers: { 'Prefer': `outlook.timezone="${timeZone}"` }
    };

    var pageIterator = new PageIterator(client, response, (event) => {
      events.push(event);
      return true;
    }, options);

    await pageIterator.iterate();

    return events;
  } else {

    return response.value;
  }
}

export async function createNewEvent(accessToken: string, newEvent: Event): Promise<Event> {
  const client = getAuthenticatedClient(accessToken);

  // POST /me/events
  // JSON representation of the new event is sent in the
  // request body
  return await client
    .api('/me/events')
    .post(newEvent);
}
