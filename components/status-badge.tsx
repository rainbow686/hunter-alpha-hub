interface StatusBadgeProps {
  online: boolean;
}

export function StatusBadge({ online }: StatusBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700">
      <span className="relative flex h-2.5 w-2.5">
        {online && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            online ? "bg-green-500" : "bg-gray-500"
          }`}
        />
      </span>
      <span className={`text-sm font-medium ${online ? "text-green-400" : "text-gray-400"}`}>
        {online ? "Online" : "Offline"}
      </span>
    </div>
  );
}
