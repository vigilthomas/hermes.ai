import axios from "axios";
import { Job } from "../types";

const FIRECRAWLER_API_KEY = process.env.FIRECRAWLER_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

export const jobService = {
  async searchJobs(query: string, location: string): Promise<Job[]> {
    console.log(`Searching for ${query} in ${location}...`);

    // In a real app, we'd use Firecrawler to crawl LinkedIn/Indeed
    // Or Tavily to search career pages.

    // For the purpose of this build, I'll provide a set of mock results
    // but structure it so it looks like it came from an API.

    // If keys were present, we might do:
    /*
    if (TAVILY_API_KEY) {
      const resp = await axios.post('https://api.tavily.com/search', {
        api_key: TAVILY_API_KEY,
        query: searchQuery,
        search_depth: "advanced",
        max_results: 8,
        include_domains: [
          "linkedin.com", "indeed.com", "glassdoor.com",
          "greenhouse.io", "lever.co", "workday.com", "jobs.ashbyhq.com"
        ]
      });

    return [
      {
        id: "1",
        title: "Senior Frontend Engineer",
        company: {
          name: "TechFlow",
          logo: "https://picsum.photos/seed/techflow/100/100",
          founder: "Sarah Jenkins",
          ceo: "David Chen",
          headcount: "500-1000",
          hq: "San Francisco, CA",
          industry: "FinTech",
          fundingStage: "Series C",
          linkedinFollowers: "50k+",
          techStack: ["React", "TypeScript", "Tailwind", "Node.js"],
          workingDays: "Mon-Fri",
          workingHours: "9:00 AM - 6:00 PM",
          remotePolicy: "Remote-First",
          flexibilityScore: 5,
          about:
            "TechFlow is revolutionizing how people manage their investments through AI-driven insights.",
        },
        location: "Remote",
        source: "LinkedIn",
        type: "Full-time",
        seniority: "Senior",
        postedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        salary: {
          min: 140000,
          max: 190000,
          currency: "USD",
          period: "yearly",
          note: "Includes equity",
        },
        description:
          "We are looking for a Senior Frontend Engineer to join our core product team...",
        responsibilities: [
          "Lead development of high-performance React applications",
          "Collaborate with UX designers to implement polished interfaces",
          "Mentor junior developers through code reviews",
        ],
        requirements: [
          "5+ years of experience with React",
          "Proficiency in TypeScript and modern CSS",
          "Experience with state management libraries",
        ],
        skills: [
          { name: "React", isMatched: true },
          { name: "TypeScript", isMatched: true },
          { name: "Node.js", isMatched: false },
          { name: "Tailwind CSS", isMatched: true },
        ],
        applyUrl: "https://example.com/apply/1",
        perks: [
          "Health Insurance",
          "Unlimited PTO",
          "Home Office Stipend",
          "Learning Budget",
        ],
        compensationInsight:
          "This salary is in the top 10% for this role in San Francisco.",
        glassdoorRating: 4.5,
        reviewCount: 120,
      },
      {
        id: "2",
        title: "Product Designer",
        company: {
          name: "DesignSphere",
          logo: "https://picsum.photos/seed/design/100/100",
          hq: "London, UK",
          industry: "Creative Agencies",
          remotePolicy: "Hybrid",
          flexibilityScore: 3,
        },
        location: "London, UK",
        source: "Indeed",
        type: "Full-time",
        seniority: "Mid",
        postedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        salary: { min: 60000, max: 85000, currency: "GBP", period: "yearly" },
        description: "DesignSphere is looking for a creative UI/UX designer...",
        responsibilities: [
          "Create wireframes and high-fidelity mockups",
          "Conduct user research",
        ],
        requirements: ["3+ years in product design", "Portfolio of work"],
        skills: [
          { name: "Figma", isMatched: true },
          { name: "Adobe XD", isMatched: false },
        ],
        applyUrl: "https://example.com/apply/2",
        perks: ["Gym Membership", "Free Lunch", "Annual Bonus"],
        glassdoorRating: 3.8,
      },
    ];
  },
};
