import {
  Button,
  Jumbotron
} from 'reactstrap';

interface HomeProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

function HomeContent(props: HomeProps) {
  // If authenticated, greet the user
  if (props.isAuthenticated) {
    return (
      <div>
        <h4>Welcomeome {props.user.displayName}!</h4>
        <p>Use the navigation bar at the top of the page to get started.</p>
      </div>
    );
  }

  // Not authenticated, present a sign in button
  return <Button color="primary" onClick={props.authButtonMethod}>Click here to sign in</Button>;
}

export default function Home(props: HomeProps) {
    return (
      <Jumbotron>
        <h1>React Graph Tutorial</h1>
        <p className="lead">
          This sample app shows how to use the Microsoft Graph API to access Outlook and OneDrive data from React
        </p>
        <HomeContent
          isAuthenticated={props.isAuthenticated}
          user={props.user}
          authButtonMethod={props.authButtonMethod} />
      </Jumbotron>
    );
}