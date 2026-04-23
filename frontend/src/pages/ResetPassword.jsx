import { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

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
          <h3 className="fw-bold mb-1">New Password</h3>
          <p className="text-muted mb-4">Choose a strong password.</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-4">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min 6 characters"
              />
            </Form.Group>

            <Button type="submit" variant="warning" className="w-100 fw-bold" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Update Password"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}