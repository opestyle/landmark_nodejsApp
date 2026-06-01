import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Lightbulb, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  level: "beginner" | "intermediate" | "advanced";
  question: string;
  answer: string;
}

const questions: Question[] = [
  { id: "q1", level: "beginner", question: "What is DevOps?", answer: "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the development lifecycle and provide continuous delivery with high software quality. DevOps emphasizes collaboration, automation, and integration between developers and operations teams." },
  { id: "q2", level: "beginner", question: "What is Docker?", answer: "Docker is a containerization platform that allows you to package applications and their dependencies into standardized units called containers. Containers are lightweight, portable, and ensure that applications run consistently across different environments. Docker uses images (blueprints) to create containers (running instances)." },
  { id: "q3", level: "beginner", question: "What is the difference between a Docker image and a container?", answer: "A Docker image is a lightweight, standalone, executable package that contains everything needed to run an application (code, runtime, libraries, dependencies). A container is a running instance of a Docker image. Think of an image as a class and a container as an object - you can create multiple containers from a single image." },
  { id: "q4", level: "beginner", question: "What is Kubernetes?", answer: "Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. It handles tasks like load balancing, resource allocation, self-healing, and rolling updates." },
  { id: "q5", level: "intermediate", question: "Explain the difference between Docker Compose and Kubernetes.", answer: "Docker Compose is a tool for defining and running multi-container Docker applications on a single machine. It uses YAML files to configure services and is ideal for development and testing. Kubernetes is a production-grade orchestration platform designed for managing containers across multiple machines (clusters) with advanced features like auto-scaling, self-healing, and rolling updates." },
  { id: "q6", level: "intermediate", question: "What is CI/CD?", answer: "CI/CD stands for Continuous Integration and Continuous Deployment. CI involves automatically testing code changes as they are committed to a repository. CD involves automatically deploying tested code to production. Together, CI/CD enables rapid, reliable software delivery by automating build, test, and deployment processes." },
  { id: "q7", level: "intermediate", question: "What is Infrastructure as Code (IaC)?", answer: "Infrastructure as Code is the practice of managing and provisioning computing infrastructure through machine-readable definition files rather than physical hardware configuration. Tools like Terraform, CloudFormation, and Ansible allow you to define infrastructure in code, making it version-controlled, repeatable, and automated." },
  { id: "q8", level: "intermediate", question: "What is a Kubernetes Pod?", answer: "A Pod is the smallest deployable unit in Kubernetes. It can contain one or more containers, shared storage, network specifications, and options for how containers should run. Pods are ephemeral - they are created and destroyed dynamically. Containers within a Pod share network namespace and can communicate via localhost." },
  { id: "q9", level: "advanced", question: "Explain Kubernetes Deployments and StatefulSets.", answer: "Deployments are used for stateless applications. They manage ReplicaSets and provide declarative updates for Pods. StatefulSets are used for stateful applications that require stable network identity and persistent storage. StatefulSets maintain a sticky identity for each Pod and provide ordered, graceful deployment and scaling." },
  { id: "q10", level: "advanced", question: "What is a Kubernetes Service and why is it needed?", answer: "A Kubernetes Service is an abstract way to expose applications running on Pods. Since Pods are ephemeral, their IP addresses change frequently. Services provide a stable endpoint (IP and DNS) for accessing Pods. Types include ClusterIP (internal), NodePort (external via node port), LoadBalancer (external via cloud LB), and ExternalName." },
  { id: "q11", level: "advanced", question: "How do you handle secrets and configuration in Kubernetes?", answer: "Kubernetes provides ConfigMaps for non-sensitive configuration data and Secrets for sensitive data like passwords and API keys. ConfigMaps store key-value pairs as plain text, while Secrets store data in base64 encoding (encrypted at rest in production). Both can be mounted as volumes or exposed as environment variables in Pods." },
  { id: "q12", level: "advanced", question: "What is a Helm Chart?", answer: "Helm is a package manager for Kubernetes. A Helm Chart is a collection of YAML files that define a Kubernetes application. Charts allow you to package, version, and share Kubernetes applications. They support templating, making it easy to deploy the same application with different configurations across environments." },
];

const levelColors = {
  beginner: "from-green-500 to-green-600",
  intermediate: "from-yellow-500 to-yellow-600",
  advanced: "from-red-500 to-red-600",
};
const levelLabels = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

export default function InterviewPrep() {
  const [, navigate] = useLocation();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuestions = questions
    .filter((q) => (selectedLevel === "all" ? true : q.level === selectedLevel))
    .filter((q) => searchQuery === "" || q.question.toLowerCase().includes(searchQuery.toLowerCase()) || q.answer.toLowerCase().includes(searchQuery.toLowerCase()));

  const levelCounts = {
    all: questions.length,
    beginner: questions.filter((q) => q.level === "beginner").length,
    intermediate: questions.filter((q) => q.level === "intermediate").length,
    advanced: questions.filter((q) => q.level === "advanced").length,
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-blue-400/30 bg-gradient-to-r from-blue-900/30 to-blue-800/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <Button onClick={() => navigate("/")} variant="ghost" className="text-white hover:text-blue-300 gap-2 hover:bg-blue-900/30">
            <ArrowLeft className="w-5 h-5" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Lightbulb className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white tracking-wider">INTERVIEW PREP</h1>
            </div>
            <p className="text-white/70">DevOps interview questions and detailed answers</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative z-5 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
            <Input type="text" placeholder="Search questions and answers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-blue-900/40 border-blue-400/30 text-white placeholder:text-white/50" />
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {(["all", "beginner", "intermediate", "advanced"] as const).map((level) => (
              <button key={level} onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg font-bold tracking-wider transition-all ${
                  selectedLevel === level
                    ? "bg-white text-blue-900"
                    : "bg-blue-900/40 text-white border border-blue-400/30 hover:border-blue-400/50"
                }`}>
                {level === "all" ? "All" : levelLabels[level]} ({levelCounts[level]})
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedQuestion === q.id;
              return (
                <div key={q.id} className="border border-blue-400/30 rounded-lg bg-gradient-to-br from-blue-900/40 to-blue-800/20 overflow-hidden">
                  <button onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    className="w-full px-6 py-4 flex items-start justify-between hover:bg-blue-900/20 transition-colors text-left">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${levelColors[q.level]}`}>
                          {levelLabels[q.level]}
                        </span>
                        <span className="text-white/50 text-sm">Q{idx + 1}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-wide">{q.question}</h3>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-blue-400 transition-transform flex-shrink-0 ml-4 mt-2 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="border-t border-blue-400/30 px-6 py-4 bg-blue-950/30">
                      <p className="text-white/80 leading-relaxed">{q.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">No questions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
