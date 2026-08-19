const FilmCard = ({ children, className = "" }) => (
  <div
    className={`relative bg-charcoal border border-hairline rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ${className}`}
  >
    <div className="film-perf" />
    <div className="grading-bar" />
    <div className="p-8">{children}</div>
  </div>
);

export default FilmCard;
