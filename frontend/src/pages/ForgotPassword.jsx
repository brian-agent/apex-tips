import { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://apex-tips-rho.vercel.app/reset-password",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <Container className="py-5" style={{ maxWidth: 420 }}>
        <Alert variant="success">
          <Alert.Heading>Check your email ✅</Alert.Heading>
          <p className="mb-0">We sent a reset link to <strong>{email}</strong>.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: 420 }}>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h3 className="fw-bold mb-1">Reset Password</h3>
          <p className="text-muted mb-4">We'll send a reset link to your email.</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleReset}>
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </Form.Group>

            <Button type="submit" variant="warning" className="w-100 fw-bold" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Send Reset Link"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}