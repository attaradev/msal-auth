import React, { useContext, useState } from 'react';
import { NavLink as RouterNavLink, Redirect } from 'react-router-dom';
import { Button, Col, Form, FormGroup, Label, Input, Row } from 'reactstrap';
import { Attendee, Event } from 'microsoft-graph';
import { createNewEvent, config  } from '../../../services/graph-service';
import { AuthContext } from '../../../contexts/auth-context';
import MainLayout from '../../layouts/main';

interface NewEventState {
  subject: string;
  attendees: string;
  start: string;
  end: string;
  body: string;
  disableCreate: boolean;
  redirect: boolean;
}

export default function NewEvent() {
  const {user, getAccessToken, setErrorMessage} = useContext(AuthContext);
  const [state, setState] = useState<NewEventState>({
    subject: '',
    attendees: '',
    start: '',
    end: '',
    body: '',
    disableCreate: true,
    redirect: false
  });


  // Called whenever an input is changed
  const handleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the state value that maps to the input
    setState(state => ({
      ...state,
      [event.target.name]: event.target.value
    }));
  }

  // Determines if form is ready to submit
  // Requires a subject, start, and end
  const isFormDisabled = () => {
    return state.subject.length === 0 ||
           state.start.length === 0 ||
           state.end.length === 0;
  }

  // Creates the event when user clicks Create
  const createEvent = async () => {
    // Get the value of attendees and split into an array
    const attendeeEmails = state.attendees.split(';');
    const attendees: Attendee[] = [];

    // Create an Attendee object for each email address
    attendeeEmails.forEach((email) => {
      if (email.length > 0) {
        attendees.push({
          emailAddress: {
            address: email
          }
        });
      }
    });

    // Create the Event object
    const newEvent: Event = {
      subject: state.subject,
      // Only add if there are attendees
      attendees: attendees.length > 0 ? attendees : undefined,
      // Specify the user's time zone so
      // the start and end are set correctly
      start: {
        dateTime: state.start,
        timeZone: user.timeZone
      },
      end: {
        dateTime: state.end,
        timeZone: user.timeZone
      },
      // Only add if a body was given
      body: state.body.length > 0 ? {
        contentType: "text",
        content: state.body
      } : undefined
    }

    try {
      // Get the user's access token
      const accessToken = await getAccessToken(config.scopes);

      // Create the event
      await createNewEvent(accessToken, newEvent);

      // Redirect to the calendar view
      setState(state => ({ ...state, redirect: true }));
    }
    catch (err) {
      setErrorMessage('ERROR', JSON.stringify(err));
    }
  }

  if (state.redirect) {
    return <Redirect to="/calendar" />
  }

  return (
    <MainLayout>
      <Form>
        <FormGroup>
          <Label for="subject">Subject</Label>
          <Input type="text"
            name="subject"
            id="subject"
            value={state.subject}
            onChange={handleUpdate} />
        </FormGroup>
        <FormGroup>
          <Label for="attendees">Attendees</Label>
          <Input type="text"
            name="attendees"
            id="attendees"
            placeholder="Enter a list of email addresses, seperated by a semi-colon"
            value={state.attendees}
            onChange={handleUpdate} />
        </FormGroup>
        <Row form>
          <Col>
            <FormGroup>
              <Label for="start">Start</Label>
              <Input type="datetime-local"
                name="start"
                id="start"
                value={state.start}
                onChange={handleUpdate} />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="end">End</Label>
              <Input type="datetime-local"
                name="end"
                id="end"
                value={state.end}
                onChange={handleUpdate} />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="body">Body</Label>
          <Input type="textarea"
            name="body"
            id="body"
            value={state.body}
            onChange={handleUpdate} />
        </FormGroup>
        <Button color="primary"
          className="mr-2"
          disabled={isFormDisabled()}
          onClick={createEvent}>Create</Button>
        <RouterNavLink to="/calendar" className="btn btn-secondary" exact>Cancel</RouterNavLink>
      </Form>
    </MainLayout>
  );
}
