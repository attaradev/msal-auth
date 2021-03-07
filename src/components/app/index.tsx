import { BrowserRouter as Router, Route, Redirect, RouteProps } from 'react-router-dom';
import { Container } from 'reactstrap';
import NavBar from '../common/nav-bar';
import ErrorMessage from '../common/error-messagae';
import withAuthProvider, {AuthComponentProps} from '../common/with-auth-provider';
import Home from '../pages/home';
import Calendar from '../pages/calendar';
import NewEvent from '../pages/new-event';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

export default withAuthProvider((props: AuthComponentProps) => {
  return (
    <Router>
      <div>
        <NavBar
          isAuthenticated={props.isAuthenticated}
          authButtonMethod={props.isAuthenticated ? props.logout : props.login}
          user={props.user} />
        <Container>
          {
            props.error && <ErrorMessage
            message={props.error.message}
            debug={props.error.debug} />
          }
          <Route exact path="/"
            render={(routeProps: RouteProps) =>
              <Home {...routeProps}
                isAuthenticated={props.isAuthenticated}
                user={props.user}
                authButtonMethod={props.login} />
            } />
            <Route exact path="/calendar"
              render={(routeProps: RouteProps) =>
                props.isAuthenticated ?
                  <Calendar {...routeProps} /> :
                  <Redirect to="/" />
              } 
            />
            <Route exact path="/newevent"
              render={(routeProps: RouteProps) =>
                props.isAuthenticated ?
                  <NewEvent {...routeProps} /> :
                  <Redirect to="/" />
              } />
        </Container>
      </div>
    </Router>
  );
});
