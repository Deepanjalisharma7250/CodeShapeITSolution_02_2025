
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ResumeUploaderProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

const ResumeUploader = ({ onFilesUploaded }: ResumeUploaderProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const simulateResumeExtraction = (fileName: string) => {
    // Simulate AI extraction - in real app this would call AI service
    const mockData = {
      name: `John Doe ${Math.floor(Math.random() * 1000)}`,
      email: `john.doe${Math.floor(Math.random() * 1000)}@email.com`,
      phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].slice(0, Math.floor(Math.random() * 5) + 1),
      experience: `${Math.floor(Math.random() * 10) + 1} years in software development`,
      education: 'Bachelor of Computer Science'
    };
    return mockData;
  };

  const processFile = useCallback((file: File) => {
    const fileId = Math.random().toString(36).substr(2, 9);
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          const newProgress = Math.min(f.progress + Math.random() * 20, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              ...f,
              progress: 100,
              status: 'success',
              extractedData: simulateResumeExtraction(f.name)
            };
          }
          return { ...f, progress: newProgress };
        }
        return f;
      }));
    }, 300);

    return fileId;
  }, []);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Only PDF and DOCX files under 10MB are allowed",
        variant: "destructive"
      });
    }

    validFiles.forEach(processFile);
  }, [processFile, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const successfulFiles = uploadedFiles.filter(f => f.status === 'success');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Resumes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Drag & drop resume files here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse (PDF, DOCX - max 10MB each)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild variant="outline">
                <span className="cursor-pointer">Choose Files</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="mb-2" />
                  )}
                  
                  {file.extractedData && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <h4 className="font-medium mb-2">Extracted Information:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Name:</strong> {file.extractedData.name}</div>
                        <div><strong>Email:</strong> {file.extractedData.email}</div>
                        <div><strong>Phone:</strong> {file.extractedData.phone}</div>
                        <div><strong>Experience:</strong> {file.extractedData.experience}</div>
                        <div className="col-span-2">
                          <strong>Skills:</strong> {file.extractedData.skills.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {successfulFiles.length > 0 && (
              <div className="mt-6">
                <Button 
                  onClick={() => onFilesUploaded(successfulFiles)}
                  className="w-full"
                >
                  Continue with {successfulFiles.length} Resume{successfulFiles.length !== 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeUploader;
