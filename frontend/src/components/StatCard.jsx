export default function StatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <article className="stat-card">
      <div className="stat-icon"><Icon size={22} /></div>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{subtitle}</span>
      </div>
    </article>
  );
}
