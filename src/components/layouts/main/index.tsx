import { ComponentProps, useContext } from 'react';
import { Container } from 'reactstrap';
import { AuthContext } from '../../../contexts/auth-context';
import NavBar from '../../common/nav-bar';
import ErrorMessage from '../../common/error-messagae';

export default function MainLayout({children}: ComponentProps<any>) {
  const {error} = useContext(AuthContext);
  return (
    <div>
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
    </div>
  );
};
