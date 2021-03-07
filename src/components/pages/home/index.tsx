import { useContext } from 'react';
import {
  Button,
  Jumbotron
} from 'reactstrap';
import { AuthContext } from '../../../contexts/auth-context';
import MainLayout from '../../layouts/main';

function HomeContent() {
  const {user, login, isAuthenticated} = useContext(AuthContext);
  // If authenticated, greet the user
  if (isAuthenticated) {
    return (
      <div>
        <h4>Welcomeome {user?.displayName}!</h4>
        <p>Use the navigation bar at the top of the page to get started.</p>
      </div>
    );
  }

  // Not authenticated, present a sign in button
  return <Button color="primary" onClick={login}>Click here to sign in</Button>;
}

export default function Home() {
    return (
      <MainLayout>
        <Jumbotron>
          <h1>React Graph Tutorial</h1>
          <p className="lead">
            This sample app shows how to use the Microsoft Graph API to access Outlook and OneDrive data from React
          </p>
          <HomeContent />
        </Jumbotron>
      </MainLayout>
    );
}