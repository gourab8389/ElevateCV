"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResumeContext } from "@/context/resume-info-provider";
import useUpdateDocument from "@/features/document/use-update-document";
import { toast } from "@/hooks/use-toast";
import { AIChatSession } from "@/lib/google-ai-model";
import { generateThumbnail } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import { AlertCircle, Loader, Sparkles } from "lucide-react";
import React, { useCallback, useState } from "react";

interface SummaryType {
  experienceLevel: string;
  summary: string;
}

// Fallback templates based on experience level and job title
const getFallbackTemplates = (jobTitle: string): SummaryType[] => {
  const titleLower = jobTitle.toLowerCase();
  const role = titleLower.includes('developer') ? 'developer' :
               titleLower.includes('engineer') ? 'engineer' :
               titleLower.includes('designer') ? 'designer' :
               'professional';

  return [
    {
      experienceLevel: "Entry Level",
      summary: `Recent graduate with a strong foundation in ${role} fundamentals and hands-on project experience. Passionate about learning new technologies and contributing to innovative solutions. Demonstrated ability to quickly adapt to new environments and work collaboratively in team settings. Seeking an opportunity to grow and make meaningful contributions while developing expertise in ${jobTitle}.`
    },
    {
      experienceLevel: "Mid Level",
      summary: `Experienced ${role} with 3-5 years of proven expertise in delivering high-quality solutions. Strong track record of collaborating with cross-functional teams to implement robust solutions. Proficient in industry-standard tools and methodologies, with a focus on code quality and best practices. Demonstrated ability to mentor junior team members while contributing to complex projects.`
    },
    {
      experienceLevel: "Senior Level",
      summary: `Seasoned ${role} with 5+ years of extensive experience in architecting and delivering enterprise-scale solutions. Proven leadership in driving technical initiatives, mentoring teams, and implementing best practices. Strong focus on innovation and system optimization. Demonstrated success in collaborating with stakeholders to align technical solutions with business objectives.`
    }
  ];
};

const prompt = `Job Title: {jobTitle}. Based on the job title, please generate concise 
and complete summaries for my resume in JSON format with an array of objects containing 
'experienceLevel' and 'summary' fields for: fresher, mid, and experienced levels...`;

const SummaryForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [loading, setLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [aiGeneratedSummaries, setAiGeneratedSummaries] = useState<SummaryType[]>([]);

  const handleChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    const resumeDataInfo = resumeInfo as ResumeDataType;
    const updatedInfo = {
      ...resumeDataInfo,
      summary: value,
    };
    onUpdate(updatedInfo);
  };

  const GenerateSummaryFromAI = async () => {
    const jobTitle = resumeInfo?.personalInfo?.jobTitle;
    
    if (!jobTitle) {
      toast({
        title: "Error",
        description: "Please enter a job title first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setUsedFallback(false);

    try {
      // Try AI generation first
      const PROMPT = prompt.replace("{jobTitle}", jobTitle);
      const result = await AIChatSession.sendMessage(PROMPT);
      const responseText = await result.response.text();
      const parsedResponse = JSON.parse(responseText);
      
      const summaries: SummaryType[] = Array.isArray(parsedResponse) 
        ? parsedResponse 
        : Object.entries(parsedResponse).map(([level, summary]) => ({
            experienceLevel: level,
            summary: summary as string
          }));

      setAiGeneratedSummaries(summaries);
      
    } catch (error) {
      console.error('Error generating summary:', error);
      
      // If AI fails, use fallback templates
      const fallbackTemplates = getFallbackTemplates(jobTitle);
      setAiGeneratedSummaries(fallbackTemplates);
      setUsedFallback(true);
      
      toast({
        title: "Using Template Suggestions",
        description: "AI service is currently unavailable. Showing template suggestions instead.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (!resumeInfo) return;
      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo?.currentPosition
        ? resumeInfo?.currentPosition + 1
        : 1;

      await mutateAsync(
        {
          currentPosition: currentNo,
          thumbnail: thumbnail,
          summary: resumeInfo?.summary,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Summary updated successfully",
            });
            handleNext();
          },
          onError() {
            toast({
              title: "Error",
              description: "Failed to update summary",
              variant: "destructive",
            });
          },
        }
      );
    },
    [resumeInfo, mutateAsync, handleNext]
  );

  const handleSelect = useCallback(
    (summary: string) => {
      if (!resumeInfo) return;
      const resumeDataInfo = resumeInfo as ResumeDataType;
      const updatedInfo = {
        ...resumeDataInfo,
        summary: summary,
      };
      onUpdate(updatedInfo);
      setAiGeneratedSummaries([]);
    },
    [onUpdate, resumeInfo]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Summary</h2>
        <p className="text-sm">Add summary for your resume</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-end justify-between">
            <Label>Add Summary</Label>
            <Button
              variant="outline"
              type="button"
              className="gap-1"
              disabled={loading || isPending}
              onClick={GenerateSummaryFromAI}
            >
              {loading ? (
                <Loader size="15px" className="animate-spin mr-2" />
              ) : (
                <Sparkles size="15px" className="text-purple-500" />
              )}
              Generate with AI
            </Button>
          </div>
          <Textarea
            className="mt-5 min-h-36"
            required
            value={resumeInfo?.summary || ""}
            onChange={handleChange}
          />

          {aiGeneratedSummaries.length > 0 && (
            <div>
              <h5 className="font-semibold text-[15px] my-4 flex items-center gap-2">
                {usedFallback && (
                  <AlertCircle size="15px" className="text-yellow-500" />
                )}
                {usedFallback ? "Template Suggestions" : "AI Suggestions"}
              </h5>
              <div className="space-y-4">
                {aiGeneratedSummaries.map((item, index) => (
                  <Card
                    key={index}
                    className="bg-primary/5 shadow-none border-primary/30 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => handleSelect(item.summary)}
                  >
                    <CardHeader className="py-2">
                      <CardTitle className="font-semibold text-md capitalize">
                        {item.experienceLevel}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      {item.summary}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Button
            className="mt-4"
            type="submit"
            disabled={isPending || loading || resumeInfo?.status === "archived"}
          >
            {isPending && <Loader size="15px" className="animate-spin mr-2" />}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SummaryForm;