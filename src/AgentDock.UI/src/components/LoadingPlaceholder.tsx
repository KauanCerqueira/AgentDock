export default function LoadingPlaceholder() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-muted/30 rounded-lg w-1/3 mb-4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-muted/30 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
