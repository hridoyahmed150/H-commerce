export default function ProductSkeleton() {
  return (
    <div className="card" style={{ boxShadow: "none", transform: "none" }}>
      <div className="card-media skeleton" />
      <div className="card-body stack-md">
        <div className="skeleton" style={{ height: 16, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 14, borderRadius: 8, width: "60%" }} />
        <div className="skeleton" style={{ height: 36, borderRadius: 10 }} />
      </div>
    </div>
  );
}
