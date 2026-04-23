import { Container, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useGames } from "../hooks/useGames";
import { useAccess } from "../hooks/useAccess";
import GameCard from "../components/GameCard";
import AccessGate from "../components/AccessGate";

export default function Games({ onPayClick }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { games, loading: gamesLoading, error } = useGames(token);
  const { hasAccess, loading: accessLoading } = useAccess(token);

  const loading = gamesLoading || accessLoading;

  const freeGames = games.filter((g) => !g.is_premium);
  const premiumGames = games.filter((g) => g.is_premium);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Today's Tips</h2>
        {hasAccess && (
          <Badge bg="success" className="px-3 py-2">
            ✓ Full Access
          </Badge>
        )}
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && (
        <>
          {/* Free tips always visible */}
          {freeGames.length > 0 && (
            <>
              <h5 className="text-muted mb-3">Free Tips</h5>
              <Row>
                {freeGames.map((game) => (
                  <Col md={6} key={game.id}>
                    <GameCard game={game} hasAccess={true} />
                  </Col>
                ))}
              </Row>
            </>
          )}

          {/* Premium tips */}
          <h5 className="text-muted mt-4 mb-3">Premium Tips</h5>
          {hasAccess ? (
            <Row>
              {premiumGames.map((game) => (
                <Col md={6} key={game.id}>
                  <GameCard game={game} hasAccess={true} />
                </Col>
              ))}
            </Row>
          ) : (
            <AccessGate onPayClick={onPayClick} />
          )}
        </>
      )}
    </Container>
  );
}
