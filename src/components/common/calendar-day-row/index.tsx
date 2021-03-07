import { Fragment } from 'react';
import moment, { Moment } from 'moment';
import { Event } from 'microsoft-graph';

interface CalendarDayRowProps {
  date: Moment | undefined;
  timeFormat: string;
  events: Event[];
}

interface FormatMap {
  [key: string] : string;
}

// moment.js format strings are slightly
// different than the ones returned by Graph
const formatMap: FormatMap = {
  "h:mm tt": "h:mm A",
  "hh:mm tt": "hh:mm A"
};

// Helper function to format Graph date/time in the user's
// preferred format
function formatDateTime(dateTime: string | undefined, format: string) {
  if (dateTime !== undefined) {
    return moment(dateTime).format(formatMap[format] || format);
  }
}

export default function CalendarDayRow (props:CalendarDayRowProps) {
    const today = moment();
    const rowClass = today.day() === props.date?.day() ? 'table-warning' : '';
    const timeFormat = props.timeFormat;

    const dateCell = (
      <td className='calendar-view-date-cell' rowSpan={props.events.length <= 0 ? 1 : props.events.length}>
        <div className='calendar-view-date float-left text-right'>{props.date?.format('DD')}</div>
        <div className='calendar-view-day'>{props.date?.format('dddd')}</div>
        <div className='calendar-view-month text-muted'>{props.date?.format('MMMM, YYYY')}</div>
      </td>
    );

    if (props.events.length <= 0)
    {
      // Render an empty row for the day
      return (
        <tr className={rowClass}>
          {dateCell}
          <td></td>
          <td></td>
        </tr>
      );
    }

    return (
      <Fragment>
        {props.events.map(
          function(event: Event, index: Number) {
            return (
              <tr className={rowClass} key={event.id}>
                { index === 0 && dateCell }
                <td className="calendar-view-timespan">
                  <div>{formatDateTime(event.start?.dateTime, timeFormat)} - {formatDateTime(event.end?.dateTime, timeFormat)}</div>
                </td>
                <td>
                  <div className="calendar-view-subject">{event.subject}</div>
                  <div className="calendar-view-organizer">{event.organizer?.emailAddress?.name}</div>
                </td>
              </tr>
            )
          }
        )}
      </Fragment>
    );
}