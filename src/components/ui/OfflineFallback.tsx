export const OfflineFallback = () => {
  return (
    <div className="bg-background-dark min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="bg-primary/20 rounded-2xl flex items-center justify-center w-16 h-16">
        <span className="material-symbols-outlined text-primary text-4xl">cloud_off</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-100">You're Offline</h1>
      <p className="text-slate-400 max-w-md">
        WeatherHub needs an internet connection to fetch weather data.
        Please check your connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
      >
        Retry
      </button>
    </div>
  )
}
