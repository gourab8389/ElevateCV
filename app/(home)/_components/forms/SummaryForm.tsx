"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResumeContext } from "@/context/resume-info-provider";
import useUpdateDocument from "@/features/document/use-update-document";
import { toast } from "@/hooks/use-toast";
import { generateThumbnail } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import { Loader } from "lucide-react";
import React, { useCallback } from "react";

// Template summaries based on experience level and job title
const getTemplateSummaries = (jobTitle: string): { level: string; summary: string }[] => {
  const titleLower = jobTitle.toLowerCase();
  const role = titleLower.includes('developer') ? 'developer' :
               titleLower.includes('engineer') ? 'engineer' :
               titleLower.includes('designer') ? 'designer' :
               'professional';

  return [
    {
      level: "Freshers Level",
      summary: `Recent graduate with a strong foundation in ${role} fundamentals and hands-on project experience. Passionate about learning new technologies and contributing to innovative solutions. Demonstrated ability to quickly adapt to new environments and work collaboratively in team settings. Seeking an opportunity to grow and make meaningful contributions while developing expertise in ${jobTitle}.`
    },
    {
      level: "Mid Level",
      summary: `Experienced ${role} with 3-5 years of proven expertise in delivering high-quality solutions. Strong track record of collaborating with cross-functional teams to implement robust solutions. Proficient in industry-standard tools and methodologies, with a focus on code quality and best practices. Demonstrated ability to mentor junior team members while contributing to complex projects.`
    },
    {
      level: "Senior Level",
      summary: `Seasoned ${role} with 5+ years of extensive experience in architecting and delivering enterprise-scale solutions. Proven leadership in driving technical initiatives, mentoring teams, and implementing best practices. Strong focus on innovation and system optimization. Demonstrated success in collaborating with stakeholders to align technical solutions with business objectives.`
    }
  ];
};

const SummaryForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();

  const handleChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    const resumeDataInfo = resumeInfo as ResumeDataType;
    const updatedInfo = {
      ...resumeDataInfo,
      summary: value,
    };
    onUpdate(updatedInfo);
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

  const applyTemplate = (summary: string) => {
    if (!resumeInfo) return;
    const resumeDataInfo = resumeInfo as ResumeDataType;
    const updatedInfo = {
      ...resumeDataInfo,
      summary: summary,
    };
    onUpdate(updatedInfo);
  };

  const templates = resumeInfo?.personalInfo?.jobTitle 
    ? getTemplateSummaries(resumeInfo.personalInfo.jobTitle)
    : [];

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Summary</h2>
        <p className="text-sm">Add summary for your resume</p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Add Summary</Label>
            <Textarea
              className="mt-2 min-h-36"
              required
              value={resumeInfo?.summary || ""}
              onChange={handleChange}
            />
          </div>

          {templates.length > 0 && (
            <div>
              <h5 className="font-semibold text-[15px] mb-2">Template Suggestions</h5>
              <div className="space-y-2">
                {templates.map((template, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-md cursor-pointer hover:bg-neutral-600 transition-colors"
                    onClick={() => applyTemplate(template.summary)}
                  >
                    <h6 className="font-medium mb-1">{template.level}</h6>
                    <p className="text-sm text-black dark:text-white">{template.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending || resumeInfo?.status === "archived"}
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