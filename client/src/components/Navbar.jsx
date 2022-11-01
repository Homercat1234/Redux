import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navb from "react-bootstrap/Navbar";

export default function Navbar() {
  return (
    <Navb className="px-3 sticky-top" bg="dark" variant="dark" expand="lg">
      <Navb.Brand as={Link} to="/">
        Custom
      </Navb.Brand>
      <Navb.Toggle />
      <Navb.Collapse>
        <Nav>
          <Nav.Item>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/blog">
              Blog
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Item>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navb.Collapse>
    </Navb>
  );
}
