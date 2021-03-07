import { useContext } from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  Button
} from 'reactstrap';
import { AuthContext } from '../../../contexts/auth-context';
import UserAvatar from '../user-avatar';

export default function AuthNavItem() {
  const {logout, login, user, isAuthenticated} = useContext(AuthContext);
  // If authenticated, return a dropdown with the user's info and a
  // sign out button
  if (isAuthenticated) {
    return (
      <UncontrolledDropdown>
        <DropdownToggle nav caret>
          <UserAvatar />
        </DropdownToggle>
        <DropdownMenu right>
          <h5 className="dropdown-item-text mb-0">{user.displayName}</h5>
          <p className="dropdown-item-text text-muted mb-0">{user.email}</p>
          <DropdownItem divider />
          <DropdownItem onClick={logout}>Sign Out</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }

  // Not authenticated, return a sign in link
  return (
    <NavItem>
      <Button
        onClick={login}
        className="btn-link nav-link border-0"
        color="link">Sign In</Button>
    </NavItem>
  );
}
