import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Sparkles, PlayCircle, ArrowRight, Star, Users, FileText } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full bg-gradient-to-b from-white to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="w-full flex flex-col gap-12 pt-8">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Welcome to ElevateCV</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight">
                  Elevate Your
                  <span className="block mt-2 bg-gradient-to-r from-primary via-violet-500 to-blue-600 bg-clip-text text-transparent">
                    Career Journey
                  </span>
                  With AI
                </h1>

                <p className="text-lg text-gray-600 md:w-[70%]">
                  ElevateCV combines the power of AI with professional design to help you create 
                  stunning resumes that catch employers' attention.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="h-12 px-6 text-base font-medium gap-2 group" asChild>
                  <RegisterLink>
                    Create Your Resume
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </RegisterLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}