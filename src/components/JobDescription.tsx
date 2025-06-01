
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Briefcase } from "lucide-react";

interface JobDescriptionData {
  title: string;
  description: string;
  requiredSkills: string[];
  minExperience: number;
  education: string;
  matchThreshold: number;
}

interface JobDescriptionProps {
  onJobSubmit: (jobData: JobDescriptionData) => void;
}

const JobDescription = ({ onJobSubmit }: JobDescriptionProps) => {
  const [jobData, setJobData] = useState<JobDescriptionData>({
    title: "",
    description: "",
    requiredSkills: [],
    minExperience: 0,
    education: "",
    matchThreshold: 70
  });

  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !jobData.requiredSkills.includes(skillInput.trim())) {
      setJobData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setJobData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = () => {
    if (jobData.title && jobData.description && jobData.requiredSkills.length > 0) {
      onJobSubmit(jobData);
    }
  };

  const isFormValid = jobData.title && jobData.description && jobData.requiredSkills.length > 0;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5" />
          <span>Job Description & Requirements</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                placeholder="e.g., Senior Software Engineer"
                value={jobData.title}
                onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="min-experience">
                Minimum Experience: {jobData.minExperience} years
              </Label>
              <Slider
                id="min-experience"
                min={0}
                max={15}
                step={1}
                value={[jobData.minExperience]}
                onValueChange={(value) => 
                  setJobData(prev => ({ ...prev, minExperience: value[0] }))
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="education">Education Requirements</Label>
              <Input
                id="education"
                placeholder="e.g., Bachelor's in Computer Science"
                value={jobData.education}
                onChange={(e) => setJobData(prev => ({ ...prev, education: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="match-threshold">
                Match Threshold: {jobData.matchThreshold}%
              </Label>
              <Slider
                id="match-threshold"
                min={50}
                max={95}
                step={5}
                value={[jobData.matchThreshold]}
                onValueChange={(value) => 
                  setJobData(prev => ({ ...prev, matchThreshold: value[0] }))
                }
                className="mt-2"
              />
              <p className="text-sm text-gray-600 mt-1">
                Candidates below this threshold will be filtered out
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                value={jobData.description}
                onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                rows={8}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="skills">Required Skills</Label>
          <div className="flex space-x-2 mb-3">
            <Input
              id="skills"
              placeholder="Add a skill (e.g., React, Python, SQL)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {jobData.requiredSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                <span>{skill}</span>
                <button onClick={() => removeSkill(skill)} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          {jobData.requiredSkills.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Add skills that are important for this role
            </p>
          )}
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Job Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div><strong>Position:</strong> {jobData.title || "Not specified"}</div>
            <div><strong>Min. Experience:</strong> {jobData.minExperience} years</div>
            <div><strong>Required Skills:</strong> {jobData.requiredSkills.join(", ") || "None added"}</div>
            <div><strong>Match Threshold:</strong> {jobData.matchThreshold}%</div>
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full"
          size="lg"
        >
          Analyze Resumes
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobDescription;
