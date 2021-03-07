import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  Button
} from 'reactstrap';
import UserAvatar from '../user-avatar';

interface NavBarProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

export default function AuthNavItem(props: NavBarProps) {
  // If authenticated, return a dropdown with the user's info and a
  // sign out button
  if (props.isAuthenticated) {
    return (
      <UncontrolledDropdown>
        <DropdownToggle nav caret>
          <UserAvatar user={props.user} />
        </DropdownToggle>
        <DropdownMenu right>
          <h5 className="dropdown-item-text mb-0">{props.user.displayName}</h5>
          <p className="dropdown-item-text text-muted mb-0">{props.user.email}</p>
          <DropdownItem divider />
          <DropdownItem onClick={props.authButtonMethod}>Sign Out</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }

  // Not authenticated, return a sign in link
  return (
    <NavItem>
      <Button
        onClick={props.authButtonMethod}
        className="btn-link nav-link border-0"
        color="link">Sign In</Button>
    </NavItem>
  );
}