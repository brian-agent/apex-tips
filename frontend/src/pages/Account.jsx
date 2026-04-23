import { useEffect, useState } from "react";
import { Container, Card, Badge, Button, Spinner, Alert } from "react-bootstrap";
import { apiFetch } from "../lib/api";

export default function Account({ user, onPayClick }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await apiFetch("/subscriptions/me/");
        setSubscription(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSubscription();
  }, [user]);

  return (
    <Container className="py-4" style={{ maxWidth: 600 }}>
      <h3 className="fw-bold mb-4">My Account</h3>

      {/* User info */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h6 className="text-muted mb-1">Email</h6>
          <p className="mb-0 fw-bold">{user?.email}</p>
        </Card.Body>
      </Card>

      {/* Subscription status */}
      <Card className="shadow-sm">
        <Card.Body>
          <h6 className="text-muted mb-3">Subscription</h6>

          {loading && <Spinner size="sm" />}
          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <>
              {subscription?.active ? (
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Badge bg="success">Active</Badge>
                    <span className="fw-bold text-capitalize">
                      {subscription.subscription.plan} Plan
                    </span>
                  </div>
                  <p className="text-muted small mb-0">
                    Expires:{" "}
                    {new Date(subscription.subscription.end_date).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-muted mb-3">No active subscription.</p>
                  <Button variant="warning" onClick={onPayClick}>
                    Get Access
                  </Button>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
