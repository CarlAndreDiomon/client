const HomePage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to the Learning Portal
        </h1>
        <p className="text-md sm:text-lg text-gray-600 mb-8">
          Your gateway to knowledge and resources. Explore, learn, and grow.
        </p>
        {/* You can add more content here, like links to other pages or featured content */}
        {/* Example:
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/download" className="btn btn-primary">Browse Modules</Link>
          <Link to="/profile" className="btn btn-secondary">Your Profile</Link>
        </div>
        */}
      </div>
    </main>
  )
}

export default HomePage