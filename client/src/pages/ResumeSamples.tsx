import { useState } from "react";
import { useLocation } from "wouter";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Resume {
  id: string;
  name: string;
  title: string;
  experience: string;
  specialization: string;
  content: string;
}

const resumes: Resume[] = [
  {
    id: "r1",
    name: "Junior DevOps Engineer",
    title: "DevOps Engineer - Entry Level",
    experience: "1-2 years",
    specialization: "Docker & Kubernetes Basics",
    content: `JOHN SMITH
john.smith@email.com | +1 (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Motivated Junior DevOps Engineer with 1+ year of experience in containerization and cloud infrastructure. Proficient in Docker, basic Kubernetes, and CI/CD pipelines. Strong foundation in Linux and shell scripting.

TECHNICAL SKILLS
• Containerization: Docker, Docker Compose
• Orchestration: Kubernetes (basic), Minikube
• CI/CD: GitHub Actions, basic Jenkins
• Cloud: AWS EC2, S3, RDS (basic)
• Languages: Bash, Python (basic), YAML
• Tools: Git, Linux, Docker Hub, kubectl

PROFESSIONAL EXPERIENCE
DevOps Engineer Intern | Tech Startup Inc. | Jan 2024 - Present
• Containerized 3 microservices using Docker, reducing deployment time by 40%
• Set up basic CI/CD pipelines using GitHub Actions for automated testing
• Managed Docker images and containers in development environment

Junior Systems Administrator | Cloud Services Ltd. | Jun 2023 - Dec 2023
• Managed Linux servers and user access controls
• Automated routine tasks using bash scripts
• Supported deployment of applications to AWS EC2 instances

EDUCATION
Bachelor of Science in Computer Science | State University | 2023

CERTIFICATIONS
• AWS Certified Cloud Practitioner (2024)
• Docker Certified Associate (in progress)

PROJECTS
Container Migration Project
• Migrated 2 legacy applications to Docker containers
• Created Dockerfiles with multi-stage builds
• Reduced infrastructure costs by 25%`,
  },
  {
    id: "r2",
    name: "Mid-Level DevOps Engineer",
    title: "Senior DevOps Engineer - Mid Level",
    experience: "3-5 years",
    specialization: "Kubernetes & AWS",
    content: `SARAH JOHNSON
sarah.johnson@email.com | +1 (555) 234-5678 | LinkedIn: linkedin.com/in/sarahjohnson

PROFESSIONAL SUMMARY
Results-driven DevOps Engineer with 4+ years of experience designing, implementing, and maintaining scalable cloud infrastructure. Expertise in Kubernetes orchestration, AWS cloud services, and CI/CD automation.

TECHNICAL SKILLS
• Container Orchestration: Kubernetes (EKS, GKE), Helm, Docker
• Cloud Platforms: AWS (EC2, ECS, EKS, RDS, S3, Lambda), GCP
• Infrastructure as Code: Terraform, CloudFormation, Ansible
• CI/CD: GitHub Actions, Jenkins, GitLab CI, CircleCI
• Monitoring: Prometheus, Grafana, ELK Stack, CloudWatch
• Languages: Python, Bash, Go (basic), YAML

PROFESSIONAL EXPERIENCE
Senior DevOps Engineer | Enterprise Solutions Corp. | Jan 2022 - Present
• Architected Kubernetes clusters on AWS EKS for 15+ microservices
• Implemented IaC using Terraform, managing 200+ AWS resources
• Reduced deployment time from 2 hours to 15 minutes
• Achieved 99.9% uptime with comprehensive monitoring

DevOps Engineer | Cloud Innovations Inc. | Jun 2020 - Dec 2021
• Migrated legacy applications to Kubernetes, reducing costs by 35%
• Implemented Helm charts for standardized deployments
• Set up multi-region AWS infrastructure with auto-scaling

EDUCATION
Bachelor of Science in Information Technology | Tech University | 2020

CERTIFICATIONS
• AWS Certified Solutions Architect - Professional (2023)
• Certified Kubernetes Administrator (CKA) (2022)
• HashiCorp Certified: Terraform Associate (2022)`,
  },
  {
    id: "r3",
    name: "Principal DevOps Architect",
    title: "Principal DevOps Engineer - Lead",
    experience: "7+ years",
    specialization: "Enterprise Architecture & Cloud Strategy",
    content: `MICHAEL CHEN
michael.chen@email.com | +1 (555) 345-6789 | LinkedIn: linkedin.com/in/michaelchen

PROFESSIONAL SUMMARY
Strategic DevOps Leader with 8+ years of experience architecting enterprise-scale cloud infrastructure and leading high-performing teams. Expertise in multi-cloud strategies, DevOps best practices, and digital transformation.

TECHNICAL SKILLS
• Cloud Architecture: AWS (expert), Azure, GCP, Multi-cloud strategies
• Container Orchestration: Kubernetes (production-scale), Docker, ECS
• Infrastructure as Code: Terraform, CloudFormation, Ansible, Pulumi
• CI/CD: Jenkins, GitHub Actions, GitLab CI, ArgoCD
• Monitoring: Prometheus, Grafana, DataDog, New Relic, ELK
• Security: Vault, Consul, RBAC, Network Security
• Languages: Python, Go, Bash, Rust (basic)

PROFESSIONAL EXPERIENCE
Principal DevOps Engineer | Global Tech Enterprise | Jan 2021 - Present
• Led DevOps transformation for 500+ engineers across 10 teams
• Architected multi-cloud strategy reducing costs by $5M annually
• Designed enterprise-scale Kubernetes infrastructure for 100+ services
• Built and mentored team of 8 DevOps engineers
• Achieved 99.99% uptime across all production systems

Director of DevOps | Innovation Labs Inc. | Jun 2018 - Dec 2020
• Led complete infrastructure modernization from on-premise to cloud
• Designed multi-region AWS infrastructure serving 50M+ daily users
• Implemented GitOps with ArgoCD for 200+ microservices
• Reduced infrastructure costs by 40%

EDUCATION
Master of Science in Computer Science | Stanford University | 2016

CERTIFICATIONS
• AWS Certified Solutions Architect - Professional (2023)
• Certified Kubernetes Administrator (CKA) (2022)
• HashiCorp Certified: Terraform Associate (2022)

SPEAKING
• Speaker at KubeCon North America 2023
• Contributor to CNCF projects`,
  },
];

export default function ResumeSamples() {
  const [, navigate] = useLocation();
  const [expandedResume, setExpandedResume] = useState<string | null>(null);

  const handleDownload = (resume: Resume) => {
    const element = document.createElement("a");
    const file = new Blob([resume.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${resume.name.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
              <FileText className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white tracking-wider">RESUME SAMPLES</h1>
            </div>
            <p className="text-white/70">DevOps resume examples for different experience levels</p>
          </div>
        </div>
      </div>

      {/* Resumes */}
      <div className="relative z-5 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {resumes.map((resume) => {
            const isExpanded = expandedResume === resume.id;
            return (
              <div key={resume.id} className="border border-blue-400/30 rounded-lg bg-gradient-to-br from-blue-900/40 to-blue-800/20 overflow-hidden">
                <div className="px-6 py-4 flex items-start justify-between hover:bg-blue-900/20 transition-colors">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white tracking-wider mb-2">{resume.name}</h2>
                    <div className="space-y-1">
                      <p className="text-blue-300 font-bold">{resume.title}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-white/70">
                        <span>Experience: {resume.experience}</span>
                        <span>Specialization: {resume.specialization}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button onClick={() => setExpandedResume(isExpanded ? null : resume.id)}
                      className="bg-white text-blue-900 hover:bg-blue-50 font-bold">
                      {isExpanded ? "Hide" : "View"}
                    </Button>
                    <Button onClick={() => handleDownload(resume)}
                      className="bg-blue-600 text-white hover:bg-blue-500 font-bold flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download
                    </Button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-blue-400/30 px-6 py-4 bg-blue-950/30 max-h-96 overflow-y-auto">
                    <pre className="text-white/80 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed">{resume.content}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
