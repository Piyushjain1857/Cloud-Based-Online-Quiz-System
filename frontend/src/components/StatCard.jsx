import '../styles/stat-card.css';

const StatCard = ({ title, value, icon, variant }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon bg-${variant}`}>{icon}</div>
      <div className="stat-details">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
