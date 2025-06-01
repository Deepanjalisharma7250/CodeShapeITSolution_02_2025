import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import WelcomePage from "@/components/WelcomePage";
import ResumeUploader from "@/components/ResumeUploader";
import JobDescription from "@/components/JobDescription";
import ResultsDashboard from "@/components/ResultsDashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  extractedData?: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string;
    education: string;
  };
}

interface JobDescriptionData {
  title: string;
  description: string;
  requiredSkills: string[];
  minExperience: number;
  education: string;
  matchThreshold: number;
}

interface CandidateMatch {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  education: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  fileName: string;
}

type AppStep = 'splash' | 'welcome' | 'upload' | 'job-description' | 'results';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('splash');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [jobData, setJobData] = useState<JobDescriptionData | null>(null);
  const [matchResults, setMatchResults] = useState<CandidateMatch[]>([]);

  const calculateMatchScore = (candidate: UploadedFile['extractedData'], job: JobDescriptionData): CandidateMatch => {
    if (!candidate) {
      return {
        id: Math.random().toString(),
        name: 'Unknown',
        email: '',
        phone: '',
        skills: [],
        experience: '',
        education: '',
        matchScore: 0,
        matchedSkills: [],
        missingSkills: job.requiredSkills,
        fileName: ''
      };
    }

    // Calculate skill matches
    const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase());
    const requiredSkillsLower = job.requiredSkills.map(s => s.toLowerCase());
    
    const matchedSkills = job.requiredSkills.filter(skill => 
      candidateSkillsLower.includes(skill.toLowerCase())
    );
    
    const missingSkills = job.requiredSkills.filter(skill => 
      !candidateSkillsLower.includes(skill.toLowerCase())
    );

    // Calculate base score from skill matching
    const skillMatchRatio = matchedSkills.length / job.requiredSkills.length;
    let score = skillMatchRatio * 60; // Skills account for 60% of score

    // Experience bonus (20% of score)
    const experienceYears = parseInt(candidate.experience.match(/\d+/)?.[0] || '0');
    const experienceScore = Math.min(experienceYears / job.minExperience, 1) * 20;
    score += experienceScore;

    // Education bonus (10% of score)
    const educationBonus = candidate.education.toLowerCase().includes('bachelor') ? 5 :
                          candidate.education.toLowerCase().includes('master') ? 8 :
                          candidate.education.toLowerCase().includes('phd') ? 10 : 3;
    score += educationBonus;

    // Keywords in description bonus (10% of score)
    const descriptionWords = job.description.toLowerCase().split(/\s+/);
    const candidateWords = [...candidate.skills, candidate.experience, candidate.education]
      .join(' ').toLowerCase().split(/\s+/);
    
    const keywordMatches = descriptionWords.filter(word => 
      candidateWords.some(cWord => cWord.includes(word) || word.includes(cWord))
    ).length;
    
    const keywordScore = Math.min(keywordMatches / 20, 1) * 10;
    score += keywordScore;

    return {
      id: Math.random().toString(),
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      skills: candidate.skills,
      experience: candidate.experience,
      education: candidate.education,
      matchScore: Math.min(Math.round(score), 100),
      matchedSkills,
      missingSkills,
      fileName: ''
    };
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setCurrentStep('job-description');
  };

  const handleJobSubmit = (job: JobDescriptionData) => {
    setJobData(job);
    
    // Calculate match scores for all candidates
    const results = uploadedFiles.map(file => calculateMatchScore(file.extractedData, job));
    setMatchResults(results);
    setCurrentStep('results');
  };

  const handleSplashComplete = () => {
    setCurrentStep('welcome');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'upload':
        setCurrentStep('welcome');
        break;
      case 'job-description':
        setCurrentStep('upload');
        break;
      case 'results':
        setCurrentStep('job-description');
        break;
    }
  };

  const renderHeader = () => {
    if (currentStep === 'splash' || currentStep === 'welcome') return null;

    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">ResumeAI Screener</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Step {currentStep === 'upload' ? '1' : currentStep === 'job-description' ? '2' : '3'} of 3
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
        
      case 'welcome':
        return <WelcomePage onGetStarted={() => setCurrentStep('upload')} />;
      
      case 'upload':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Resumes</h2>
                <p className="text-lg text-gray-600">
                  Upload PDF or DOCX resume files to get started with AI-powered screening
                </p>
              </div>
              <ResumeUploader onFilesUploaded={handleFilesUploaded} />
            </div>
          </div>
        );
      
      case 'job-description':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Define Job Requirements</h2>
                <p className="text-lg text-gray-600">
                  Describe the position and requirements to match against {uploadedFiles.length} uploaded resume{uploadedFiles.length !== 1 ? 's' : ''}
                </p>
              </div>
              <JobDescription onJobSubmit={handleJobSubmit} />
            </div>
          </div>
        );
      
      case 'results':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Screening Results</h2>
                <p className="text-lg text-gray-600">
                  AI analysis complete for {jobData?.title || 'the position'}
                </p>
              </div>
              {jobData && (
                <ResultsDashboard 
                  candidates={matchResults} 
                  jobTitle={jobData.title}
                  threshold={jobData.matchThreshold}
                />
              )}
            </div>
          </div>
        );
      
      default:
        return <WelcomePage onGetStarted={() => setCurrentStep('upload')} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default Index;
