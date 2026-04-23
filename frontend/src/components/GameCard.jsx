import { Card, Badge } from "react-bootstrap";

export default function GameCard({ game, hasAccess }) {
  const isPremiumLocked = game.is_premium && !hasAccess;

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">
            {game.home_team} vs {game.away_team}
          </Card.Title>
          <Badge bg={game.is_premium ? "warning" : "success"} text="dark">
            {game.is_premium ? "Premium" : "Free"}
          </Badge>
        </div>

        <Card.Subtitle className="mb-2 text-muted">
          {game.league} · {game.country}
        </Card.Subtitle>

        <p className="text-muted small mb-2">
          {game.match_date
            ? new Date(game.match_date).toLocaleString()
            : "Date TBD"}
        </p>

        {isPremiumLocked ? (
          <div className="p-3 bg-light rounded text-center text-muted">
            🔒 Subscribe to unlock prediction & analysis
          </div>
        ) : (
          <>
            {game.prediction && (
              <p className="mb-1">
                <strong>Prediction:</strong> {game.prediction}
              </p>
            )}
            {game.odds && (
              <p className="mb-1">
                <strong>Odds:</strong> {game.odds}
              </p>
            )}
            {game.confidence && (
              <p className="mb-1">
                <strong>Confidence:</strong> {game.confidence}%
              </p>
            )}
            {game.analysis && (
              <p className="mt-2 text-muted small">{game.analysis}</p>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}
