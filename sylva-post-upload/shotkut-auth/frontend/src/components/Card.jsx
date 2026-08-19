const Card = ({ children, className = "" }) => (
  <div
    className={`glass rounded-xl ${className}`}
  >
    {children}
  </div>
);

export default Card;
