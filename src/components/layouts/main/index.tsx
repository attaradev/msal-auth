import { ComponentProps, useContext } from 'react';
import { Container } from 'reactstrap';
import { AuthContext, AuthProvider } from '../../../contexts/auth-context';
import NavBar from '../../common/nav-bar';
import ErrorMessage from '../../common/error-messagae';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

export default function MainLayout({children}: ComponentProps<any>) {
  const {error} = useContext(AuthContext);
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <Container>
          {
            error && <ErrorMessage
            message={error.message}
            debug={error.debug} />
          }
          {
            children
          }
        </Container>
      </AuthProvider>
    </div>
  );
};
