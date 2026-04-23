import { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { apiFetch } from "../lib/api";

const PRODUCTS = [
  { id: "token_one_time", label: "One-Time Access", price: "$2.00" },
  { id: "token_daily", label: "Daily Access", price: "$3.00" },
  { id: "token_weekly", label: "Weekly Token", price: "$8.00" },
  { id: "subscription_weekly", label: "Weekly Subscription", price: "$5.00" },
  { id: "subscription_monthly", label: "Monthly Subscription", price: "$15.00" },
  { id: "subscription_vip", label: "VIP (3 months)", price: "$40.00" },
];

const CURRENCIES = ["BTC", "ETH", "USDT", "LTC"];

export default function PaymentModal({ show, onHide }) {
  const [productId, setProductId] = useState("subscription_monthly");
  const [currency, setCurrency] = useState("USDT");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/payments/create/", {
        method: "POST",
        body: JSON.stringify({ product_id: productId, currency }),
      });
      setInvoice(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInvoice(null);
    setError(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Get Access</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {!invoice ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Select Plan</Form.Label>
              <Form.Select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} — {p.price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pay with</Form.Label>
              <Form.Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button
              variant="success"
              className="w-100"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Generate Payment Address"}
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-muted mb-1">Send exactly:</p>
            <h4 className="text-success">
              {invoice.pay_amount} {invoice.pay_currency?.toUpperCase()}
            </h4>
            <p className="text-muted mb-1 mt-3">To this address:</p>
            <code
              className="d-block p-2 bg-light rounded"
              style={{ wordBreak: "break-all", fontSize: "0.85rem" }}
            >
              {invoice.pay_address}
            </code>
            <Alert variant="info" className="mt-3 text-start small">
              ⏳ Send the exact amount. Your access will unlock automatically
              once payment is confirmed on-chain.
            </Alert>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
