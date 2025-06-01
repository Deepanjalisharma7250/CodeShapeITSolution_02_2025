
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Target, BarChart3, FileText, Users, Star } from "lucide-react";

interface WelcomePageProps {
  onGetStarted: () => void;
}

const WelcomePage = ({ onGetStarted }: WelcomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ResumeAI Screener</h1>
            </div>
            <div className="text-sm text-gray-600">
              by Deepanjali Sharma
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Automated Resume Screening System
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Streamline your hiring process with AI-powered resume analysis. 
              Upload resumes, define job requirements, and get intelligent candidate rankings instantly.
            </p>

            <p className="text-lg text-gray-700 mb-8 font-medium">
              Project Done by Deepanjali Sharma
            </p>

            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Upload</h3>
                <p className="text-gray-600">
                  Upload multiple PDF and DOCX resumes with drag-and-drop functionality
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Matching</h3>
                <p className="text-gray-600">
                  Advanced AI algorithms match candidates to job requirements with precision
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">
                  Comprehensive analytics with charts, rankings, and detailed insights
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our System?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Save Time</h3>
                    <p className="text-gray-600">Reduce screening time from hours to minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Reduce Bias</h3>
                    <p className="text-gray-600">Objective, data-driven candidate evaluation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Better Matches</h3>
                    <p className="text-gray-600">Find the best candidates faster and more accurately</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time Saved</span>
                  <span className="text-2xl font-bold text-green-600">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="text-2xl font-bold text-blue-600">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">User Satisfaction</span>
                  <span className="text-2xl font-bold text-purple-600">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">ResumeAI Screener</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Developed by Deepanjali Sharma - Transforming Recruitment with AI
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2024 Deepanjali Sharma</span>
            <span>•</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
