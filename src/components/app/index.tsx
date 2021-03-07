import { BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Home from '../pages/home';
import Calendar from '../pages/calendar';
import NewEvent from '../pages/new-event';
import { AuthProvider } from '../../contexts/auth-context';
import 'bootstrap/dist/css/bootstrap.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/calendar' component={Calendar} />
          <Route path='/newevent' component={NewEvent} />
          <Route render={() => <Redirect to='/' />} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};