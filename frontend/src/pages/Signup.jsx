import { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="py-5" style={{ maxWidth: 420 }}>
        <Alert variant="success">
          <Alert.Heading>Check your email ✅</Alert.Heading>
          <p className="mb-0">
            We sent a confirmation link to <strong>{email}</strong>.
            Verify your email then{" "}
            <Link to="/login">log in</Link>.
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: 420 }}>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h3 className="fw-bold mb-1">Create account</h3>
          <p className="text-muted mb-4">Start winning with APEX TIPS</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSignup}>
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
                placeholder="Min 6 characters"
                minLength={6}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="warning"
              className="w-100 fw-bold"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Create Account"}
            </Button>
          </Form>

          <p className="text-center text-muted mt-3 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-warning fw-bold">
              Log in
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
