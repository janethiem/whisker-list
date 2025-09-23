const LoadingSkeleton = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 border rounded animate-pulse" style={{backgroundColor: '#ffffff', borderColor: '#d4b8a3', boxShadow: '0 1px 3px rgba(212, 184, 163, 0.1)'}}>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full" style={{backgroundColor: '#e8e3df'}}></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded w-3/4" style={{backgroundColor: '#e8e3df'}}></div>
              <div className="h-3 rounded w-1/2" style={{backgroundColor: '#e8e3df'}}></div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded" style={{backgroundColor: '#e8e3df'}}></div>
              <div className="w-8 h-8 rounded" style={{backgroundColor: '#e8e3df'}}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
