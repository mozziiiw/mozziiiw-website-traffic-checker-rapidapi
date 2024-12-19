import TrafficDashboard from "@/components/traffic-dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
         WEB TRAFFIC CHECKER
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
         paste the url and check the traffic
        </p>
        <TrafficDashboard/>
      </div>
    </main>
  )
}

