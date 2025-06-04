import { Smartphone, Zap, Users, ExternalLink } from "lucide-react";

const LandingPage = () =>  {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-6">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Farcaster Cast Manager
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Manage your Farcaster casts with ease. View, organize, and delete
              your posts in a beautiful, intuitive interface.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              Mini App Experience Required
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Profile
              </h3>
              <p className="text-gray-600 text-sm">
                View your Farcaster profile information including username,
                display name, and profile picture.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <ExternalLink className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cast Management
              </h3>
              <p className="text-gray-600 text-sm">
                Browse through all your casts with pagination, timestamps, and
                easy selection for bulk operations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bulk Actions
              </h3>
              <p className="text-gray-600 text-sm">
                Select multiple casts and perform bulk operations like deletion
                with a clean, intuitive interface.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to Access
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              This application is designed to work as a Farcaster Mini App. To
              access all features, please open this app through a supported
              Farcaster client.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium">
              <Smartphone className="w-5 h-5" />
              Open in Farcaster Client
            </div>
          </div>
        </div>
      </div>
    );
}
export default LandingPage