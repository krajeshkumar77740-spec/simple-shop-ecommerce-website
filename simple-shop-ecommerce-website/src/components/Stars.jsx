export default function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars" title={`${rating} out of 5`}>
      {"★".repeat(full)}{"☆".repeat(5 - full)}
      <span className="muted"> {rating.toFixed(1)}</span>
    </span>
  );
}
