import { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AppNavbar({ user, onPayClick }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-warning">
          ⚽ APEX TIPS
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/games" onClick={() => setExpanded(false)}>
              Tips
            </Nav.Link>
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            {user ? (
              <>
                <Nav.Link as={Link} to="/account" onClick={() => setExpanded(false)}>
                  Account
                </Nav.Link>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => { setExpanded(false); onPayClick(); }}
                >
                  Get Access
                </Button>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)}>
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/signup"
                  variant="warning"
                  size="sm"
                  onClick={() => setExpanded(false)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
