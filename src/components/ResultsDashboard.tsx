
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Medal, Users, TrendingUp, Eye, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ResultsDashboardProps {
  candidates: CandidateMatch[];
  jobTitle: string;
  threshold: number;
}

const ResultsDashboard = ({ candidates, jobTitle, threshold }: ResultsDashboardProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);
  const { toast } = useToast();

  const qualifiedCandidates = candidates.filter(c => c.matchScore >= threshold);
  const rejectedCandidates = candidates.filter(c => c.matchScore < threshold);

  const chartData = candidates.map(c => ({
    name: c.name.split(' ')[0], // First name only for chart
    score: c.matchScore,
    qualified: c.matchScore >= threshold,
    fill: c.matchScore >= threshold ? '#10B981' : '#EF4444'
  }));

  const skillsAnalysis = candidates.reduce((acc, candidate) => {
    candidate.skills.forEach(skill => {
      if (!acc[skill]) {
        acc[skill] = { skill, count: 0, percentage: 0 };
      }
      acc[skill].count++;
    });
    return acc;
  }, {} as Record<string, { skill: string; count: number; percentage: number }>);

  const skillsData = Object.values(skillsAnalysis)
    .map(item => ({
      ...item,
      percentage: Math.round((item.count / candidates.length) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const scoreDistribution = [
    { range: '90-100%', count: candidates.filter(c => c.matchScore >= 90).length, color: '#10B981' },
    { range: '80-89%', count: candidates.filter(c => c.matchScore >= 80 && c.matchScore < 90).length, color: '#3B82F6' },
    { range: '70-79%', count: candidates.filter(c => c.matchScore >= 70 && c.matchScore < 80).length, color: '#F59E0B' },
    { range: '60-69%', count: candidates.filter(c => c.matchScore >= 60 && c.matchScore < 70).length, color: '#EF4444' },
    { range: 'Below 60%', count: candidates.filter(c => c.matchScore < 60).length, color: '#6B7280' }
  ];

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Match Score', 'Status', 'Skills', 'Experience'];
    const csvData = candidates.map(c => [
      c.name,
      c.email,
      c.phone,
      `${c.matchScore}%`,
      c.matchScore >= threshold ? 'Qualified' : 'Rejected',
      c.skills.join('; '),
      c.experience
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jobTitle.replace(/\s+/g, '_')}_screening_results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Results have been exported to CSV file"
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusBadge = (score: number) => {
    if (score >= threshold) {
      return <Badge className="bg-green-100 text-green-800">Qualified</Badge>;
    }
    return <Badge variant="destructive">Rejected</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold">{candidates.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-green-600">{qualifiedCandidates.length}</p>
              </div>
              <Medal className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Button onClick={exportToCSV} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="candidates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="candidates">Candidate Rankings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Rankings - {jobTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates
                  .sort((a, b) => b.matchScore - a.matchScore)
                  .map((candidate, index) => (
                    <div key={candidate.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold">{candidate.name}</h3>
                            <p className="text-sm text-gray-600">{candidate.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.matchScore)}`}>
                            {candidate.matchScore}%
                          </div>
                          {getStatusBadge(candidate.matchScore)}
                        </div>
                      </div>

                      <div className="mb-3">
                        <Progress value={candidate.matchScore} className="h-2" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Experience:</strong> {candidate.experience}</p>
                          <p><strong>Education:</strong> {candidate.education}</p>
                        </div>
                        <div>
                          <p><strong>Matched Skills:</strong> {candidate.matchedSkills.join(', ')}</p>
                          {candidate.missingSkills.length > 0 && (
                            <p><strong>Missing Skills:</strong> <span className="text-red-600">{candidate.missingSkills.join(', ')}</span></p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qualification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Qualified', value: qualifiedCandidates.length, fill: '#10B981' },
                        { name: 'Rejected', value: rejectedCandidates.length, fill: '#EF4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Skills Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skillsData.map((skill) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <span className="font-medium">{skill.skill}</span>
                    <div className="flex items-center space-x-3 flex-1 ml-4">
                      <Progress value={skill.percentage} className="flex-1" />
                      <span className="text-sm text-gray-600 w-12">{skill.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Screening Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Quality of Applications</h4>
                  <p className="text-blue-800">
                    {qualifiedCandidates.length > candidates.length * 0.3 
                      ? "High quality candidate pool with strong matches"
                      : "Consider expanding search criteria or reviewing job requirements"
                    }
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Top Performers</h4>
                  <p className="text-green-800">
                    {candidates.filter(c => c.matchScore >= 90).length} candidates scored 90% or higher
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Skills Gap Analysis</h4>
                  <p className="text-yellow-800">
                    Most common missing skills need to be addressed in training programs
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score Range Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scoreDistribution.map((range) => (
                    <div key={range.range} className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: `${range.color}20`}}>
                      <span className="font-medium">{range.range}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">{range.count} candidates</span>
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: range.color}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Candidate Detail Modal would go here */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedCandidate.name} - Detailed Profile</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedCandidate(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Email:</strong> {selectedCandidate.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedCandidate.phone}
                </div>
                <div>
                  <strong>Experience:</strong> {selectedCandidate.experience}
                </div>
                <div>
                  <strong>Education:</strong> {selectedCandidate.education}
                </div>
              </div>
              
              <div>
                <strong>Match Score:</strong>
                <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(selectedCandidate.matchScore)}`}>
                  {selectedCandidate.matchScore}%
                </div>
              </div>

              <div>
                <strong>Skills:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCandidate.skills.map(skill => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <strong>Matched Skills:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCandidate.matchedSkills.map(skill => (
                    <Badge key={skill} className="bg-green-100 text-green-800">{skill}</Badge>
                  ))}
                </div>
              </div>

              {selectedCandidate.missingSkills.length > 0 && (
                <div>
                  <strong>Missing Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCandidate.missingSkills.map(skill => (
                      <Badge key={skill} variant="destructive">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;
