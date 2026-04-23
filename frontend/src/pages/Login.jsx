import { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/games");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 420 }}>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h3 className="fw-bold mb-1">Welcome back</h3>
          <p className="text-muted mb-4">Log in to your APEX TIPS account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="warning"
              className="w-100 fw-bold"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Log In"}
            </Button>
            <p className="text-center text-muted mt-2 mb-0">
              <Link to="/forgot-password" className="text-warning">
                Forgot password?
              </Link>
            </p>
            </Form>

          <p className="text-center text-muted mt-3 mb-0">
            No account?{" "}
            <Link to="/signup" className="text-warning fw-bold">
              Sign up
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
