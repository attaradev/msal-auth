import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Table } from 'reactstrap';
import moment, { Moment } from 'moment-timezone';
import { findOneIana } from "windows-iana";
import { Event } from 'microsoft-graph';
import { config, getUserWeekCalendar } from '../../../services/graph-service';
import withAuthProvider, { AuthComponentProps } from '../../common/with-auth-provider';
import CalendarDayRow from '../../common/calendar-day-row';
import './style.css';

interface CalendarState {
  eventsLoaded: boolean;
  events: Event[];
  startOfWeek: Moment | undefined;
}

function Calendar(props: AuthComponentProps) {
  const [state, setState] = useState<CalendarState>({
    eventsLoaded: false,
    events: [],
    startOfWeek: undefined
  });

  useEffect(()=>{
    const req = async () => {
      if (props.user && !state.eventsLoaded)
    {
      try {
        // Get the user's access token
        var accessToken = await props.getAccessToken(config.scopes);

        // Convert user's Windows time zone ("Pacific Standard Time")
        // to IANA format ("America/Los_Angeles")
        // Moment needs IANA format
        var ianaTimeZone = findOneIana(props.user.timeZone);

        // Get midnight on the start of the current week in the user's timezone,
        // but in UTC. For example, for Pacific Standard Time, the time value would be
        // 07:00:00Z
        var startOfWeek = moment.tz(ianaTimeZone!.valueOf()).startOf('week').utc();

        // Get the user's events
        var events = await getUserWeekCalendar(accessToken, props.user.timeZone, startOfWeek);

        // Update the array of events in state
        setState({
          eventsLoaded: true,
          events: events,
          startOfWeek: startOfWeek
        });
      }
      catch (err) {
        props.setError('ERROR', JSON.stringify(err));
      }
    }
    }
    req();
  },[props, state.eventsLoaded])

  const sunday = moment(state.startOfWeek);
  const monday = moment(sunday).add(1, 'day');
  const tuesday = moment(monday).add(1, 'day');
  const wednesday = moment(tuesday).add(1, 'day');
  const thursday = moment(wednesday).add(1, 'day');
  const friday = moment(thursday).add(1, 'day');
  const saturday = moment(friday).add(1, 'day');

  return (
    <div>
      <div className="mb-3">
        <h1 className="mb-3">{sunday.format('MMMM D, YYYY')} - {saturday.format('MMMM D, YYYY')}</h1>
        <RouterNavLink to="/newevent" className="btn btn-light btn-sm" exact>New event</RouterNavLink>
      </div>
      <div className="calendar-week">
        <div className="table-responsive">
          <Table size="sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              <CalendarDayRow
                date={sunday}
                timeFormat={props.user.timeFormat || "h:mm tt"}
                events={state.events.filter(event => moment(event.start?.dateTime).day() === sunday.day()) } />
              <CalendarDayRow
                date={monday}
                timeFormat={props.user.timeFormat}
                events={state.events.filter(event => moment(event.start?.dateTime).day() === monday.day()) } />
              <CalendarDayRow
                date={tuesday}
                timeFormat={props.user.timeFormat}
                events={state.events.filter(event => moment(event.start?.dateTime).day() === tuesday.day()) } />
              <CalendarDayRow
                date={wednesday}
                timeFormat={props.user.timeFormat}
                events={state.events.filter(event => moment(event.start?.dateTime).day() === wednesday.day()) } />
              <CalendarDayRow
                date={thursday}
                timeFormat={props.user.timeFormat}
                events={state.events.filter(event => moment(event.start?.dateTime).day() === thursday.day()) } />
              <CalendarDayRow
                date={friday}
                timeFormat={props.user.timeFormat}
                events={state.events.filter(event => moment(event.start?.dateTime).day() === friday.day()) } />
              <CalendarDayRow
                date={saturday}
                timeFormat={props.user.timeFormat}
                events={state.events.filter(event => moment(event.start?.dateTime).day() === saturday.day()) } />
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default withAuthProvider(Calendar);