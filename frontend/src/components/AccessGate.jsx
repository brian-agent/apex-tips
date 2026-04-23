import { Button } from "react-bootstrap";

export default function AccessGate({ onPayClick }) {
  return (
    <div className="text-center py-5">
      <div className="mb-3" style={{ fontSize: "3rem" }}>🔒</div>
      <h4>Premium Content</h4>
      <p className="text-muted">
        Subscribe or purchase access to unlock all predictions and analysis.
      </p>
      <Button variant="warning" size="lg" onClick={onPayClick}>
        Unlock Now
      </Button>
    </div>
  );
}
