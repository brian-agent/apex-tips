import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home({ onPayClick }) {
  return (
    <div>
      {/* Hero */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center py-4">
            <Col md={7}>
              <h1 className="display-4 fw-bold">
                Win More with <span className="text-warning">APEX TIPS</span>
              </h1>
              <p className="lead text-secondary mt-3">
                Expert football predictions powered by deep analysis.
                Pay with crypto. No accounts needed for instant access.
              </p>
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <Button
                  variant="warning"
                  size="lg"
                  onClick={onPayClick}
                >
                  Get Access Now
                </Button>
                <Button
                  as={Link}
                  to="/games"
                  variant="outline-light"
                  size="lg"
                >
                  View Free Tips
                </Button>
              </div>
            </Col>
            <Col md={5} className="text-center mt-4 mt-md-0">
              <div style={{ fontSize: "8rem" }}>⚽</div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features */}
      <Container className="py-5">
        <Row className="g-4 text-center">
          {[
            { icon: "🎯", title: "Expert Analysis", desc: "Every tip backed by in-depth match analysis and stats." },
            { icon: "₿", title: "Crypto Payments", desc: "Pay with BTC, ETH, USDT. Instant access on confirmation." },
            { icon: "🔓", title: "No Login Needed", desc: "Buy a one-time token and access tips without an account." },
          ].map(({ icon, title, desc }) => (
            <Col md={4} key={title}>
              <div className="p-4 border rounded h-100">
                <div style={{ fontSize: "2.5rem" }}>{icon}</div>
                <h5 className="mt-3">{title}</h5>
                <p className="text-muted mb-0">{desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Pricing teaser */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-4">Simple Pricing</h2>
          <Row className="g-3 justify-content-center">
            {[
              { label: "One-Time", price: "$2", desc: "24h access" },
              { label: "Weekly", price: "$8", desc: "7-day token" },
              { label: "Monthly", price: "$15", desc: "30-day subscription", highlight: true },
              { label: "VIP", price: "$40", desc: "90-day subscription" },
            ].map(({ label, price, desc, highlight }) => (
              <Col xs={6} md={3} key={label}>
                <div
                  className={`p-3 rounded text-center border h-100 ${highlight ? "border-warning bg-warning bg-opacity-10" : ""}`}
                >
                  <div className="fw-bold">{label}</div>
                  <div className="display-6 fw-bold my-1">{price}</div>
                  <div className="text-muted small">{desc}</div>
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button variant="dark" size="lg" onClick={onPayClick}>
              Pay with Crypto
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}
