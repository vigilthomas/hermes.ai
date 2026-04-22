import React, { useState } from 'react';
import { Job, MatchAnalysis } from '../types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  MapPin, 
  Globe, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  Share2, 
  Bookmark, 
  ExternalLink,
  ChevronRight,
  Calculator,
  Briefcase,
  Star,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
  userResume?: string;
}

export default function JobCard({ job, isBookmarked, onBookmark, userResume }: JobCardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiOutput, setAiOutput] = useState<Record<string, string>>({});
  const [isGeneratingAction, setIsGeneratingAction] = useState<string | null>(null);

  const getSourceColor = (source: Job['source']) => {
    switch (source) {
      case 'LinkedIn': return 'bg-blue-600';
      case 'Indeed': return 'bg-indigo-600';
      case 'Glassdoor': return 'bg-green-600';
      case 'Naukri': return 'bg-orange-500';
      default: return 'bg-gray-600';
    }
  };

  const handleAiAction = async (action: string) => {
    setIsGeneratingAction(action);
    const prompts: Record<string, string> = {
      tailor: `Tailor my resume for the ${job.title} role at ${job.company.name}. The job description is: ${job.description}`,
      cover: `Write a compelling cover letter for the ${job.title} role at ${job.company.name}.`,
      similar: `Identify 5 similar companies to ${job.company.name} in the ${job.company.industry} industry.`,
      copy: `Generate a short sharing snippet for this job: ${job.title} at ${job.company.name}`
    };
    
    const output = await aiService.generateContent(prompts[action]);
    setAiOutput(prev => ({ ...prev, [action]: output || 'No response' }));
    setIsGeneratingAction(null);
  };

  const getMatchAnalysis = async () => {
    const resumeText = userResume || '';
    if (!resumeText) {
      return;
    }
    setIsAnalyzing(true);
    try {
      const analysis = await aiService.analyzeJobMatch(job.description, resumeText);
      setMatchAnalysis(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group h-full"
    >
      <Card className="flex flex-col h-full border border-[#E2E8F0] hover:border-[#6366F1]/30 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden bg-white rounded-2xl">
        <CardHeader className="p-6 pb-2">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-4">
              <img 
                src={job.company.logo || `https://ui-avatars.com/api/?name=${job.company.name}`} 
                alt={job.company.name}
                className="w-12 h-12 rounded-xl object-cover border border-[#F1F5F9]"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-bold text-[16px] text-[#1E293B] group-hover:text-[#6366F1] transition-colors">{job.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">{job.company.name}</span>
                  <span>•</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold text-xs">{job.glassdoorRating || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={cn("text-[10px] font-bold py-0.5 px-2 rounded uppercase border-none text-white", getSourceColor(job.source))}>
              {job.source}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="bg-slate-50 text-slate-600 border-[#E2E8F0] font-medium rounded-full px-3 py-0.5">
              <MapPin className="w-3 h-3 mr-1 opacity-60" /> {job.location}
            </Badge>
            <Badge variant="secondary" className="bg-violet-50 text-violet-700 border-violet-100 font-medium rounded-full px-3 py-0.5">
              <Briefcase className="w-3 h-3 mr-1 opacity-60" /> {job.seniority}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-grow p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full bg-[#F8FAFC] rounded-none h-12 p-0">
              <TabsTrigger value="overview" className="text-xs font-semibold h-12 rounded-none data-[state=active]:bg-white data-[state=active]:text-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:border-[#6366F1] border-b-2 border-transparent text-slate-500">Overview</TabsTrigger>
              <TabsTrigger value="company" className="text-xs font-semibold h-12 rounded-none data-[state=active]:bg-white data-[state=active]:text-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:border-[#6366F1] border-b-2 border-transparent text-slate-500">🏛️ Co.</TabsTrigger>
              <TabsTrigger value="pay" className="text-xs font-semibold h-12 rounded-none data-[state=active]:bg-white data-[state=active]:text-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:border-[#6366F1] border-b-2 border-transparent text-slate-500">💰 Pay</TabsTrigger>
              <TabsTrigger value="match" className="text-xs font-semibold h-12 rounded-none data-[state=active]:bg-white data-[state=active]:text-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:border-[#6366F1] border-b-2 border-transparent text-slate-500" onClick={() => !matchAnalysis && userResume && getMatchAnalysis()}>🎯 Match</TabsTrigger>
              <TabsTrigger value="actions" className="text-xs font-semibold h-12 rounded-none data-[state=active]:bg-white data-[state=active]:text-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:border-[#6366F1] border-b-2 border-transparent text-slate-500">⚡ Act</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-64 px-4 py-3">
              <AnimatePresence mode="wait">
                <TabsContent value="overview" className="m-0 mt-0 focus-visible:ring-0">
                  <div className="space-y-4">
                    <section>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Responsibilities</h4>
                      <ul className="space-y-1.5">
                        {job.responsibilities.slice(0, 3).map((resp, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-gray-700">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#94A3B8] mb-3">Skills Matched</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className={cn(
                              "text-[11px] px-2.5 py-0.5 font-semibold rounded-md border",
                              skill.isMatched 
                                ? "bg-[#DCFCE7] text-[#166534] border-[#DCFCE7]" 
                                : "bg-[#FEF3C7] text-[#92400E] border-[#FEF3C7]"
                            )}
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </section>
                  </div>
                </TabsContent>

                <TabsContent value="company" className="m-0 mt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">HQ</p>
                      <p className="font-medium">{job.company.hq || 'Global'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Size</p>
                      <p className="font-medium">{job.company.headcount || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Flexibility Bar</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(dot => (
                          <div 
                            key={dot} 
                            className={cn(
                              "w-3 h-3 rounded-full border", 
                              dot <= (job.company.flexibilityScore || 0) ? "bg-primary border-primary" : "bg-gray-200 border-gray-200"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">About</p>
                      <p className="text-xs text-gray-600 line-clamp-3">{job.company.about || 'Innovative company working on cutting edge technology.'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pay" className="m-0 mt-0">
                  <div className="space-y-4">
                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-primary uppercase">Est. Salary</span>
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-2xl font-black text-gray-900 tracking-tight">
                        {job.salary?.currency}{job.salary?.min.toLocaleString()} - {job.salary?.max.toLocaleString()}
                        <span className="text-xs font-normal text-muted-foreground ml-1">/{job.salary?.period === 'yearly' ? 'yr' : 'mo'}</span>
                      </p>
                    </div>
                    
                    <section>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Benefits & Perks</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {job.perks.map((perk, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {perk}
                          </div>
                        ))}
                      </div>
                    </section>

                    {job.compensationInsight && (
                      <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex gap-2">
                        <Calculator className="w-4 h-4 text-amber-600 shrink-0" />
                        <p className="text-[10px] text-amber-800 leading-tight">{job.compensationInsight}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="match" className="m-0 mt-0">
                  {!userResume ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                      <Target className="w-10 h-10 text-muted-foreground opacity-20" />
                      <p className="text-xs text-muted-foreground">Upload your resume to see your match score</p>
                    </div>
                  ) : isAnalyzing ? (
                    <div className="space-y-4 py-8 text-center">
                      <div className="w-12 h-12 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-semibold text-[#64748B] animate-pulse">Running AI Gap Analysis...</p>
                    </div>
                  ) : matchAnalysis ? (
                    <div className="space-y-6 pb-4">
                      <div className="grid grid-cols-[auto_1fr] gap-6 items-center">
                        <div className="relative w-[100px] h-[100px]">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50" cy="50" r="44" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
                            <circle 
                              cx="50" cy="50" r="44" fill="transparent" stroke="#10B981" strokeWidth="8" 
                              strokeDasharray={276.4} strokeDashoffset={276.4 - (276.4 * matchAnalysis.score / 100)} 
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold text-[#10B981] leading-none">{matchAnalysis.score}%</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Match</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#1E293B] mb-1">AI Gap Analysis</p>
                          <p className="text-[12px] text-[#475569] leading-relaxed line-clamp-3">{matchAnalysis.verdict}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {matchAnalysis.greenFlags.map((f, i) => (
                           <Badge key={i} className="bg-[#DCFCE7] text-[#166534] border-none text-[10px] font-bold px-2 py-0.5">
                             {f}
                           </Badge>
                        ))}
                      </div>

                      <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                        <h5 className="text-[12px] font-bold text-[#0369A1] mb-1 flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5" /> Quick Recommendation
                        </h5>
                        <p className="text-[11px] text-[#075985] leading-normal">Mention your specialized skills to close the gap identified by AI.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                      <Target className="w-10 h-10 text-muted-foreground opacity-20" />
                      <p className="text-xs text-muted-foreground">Unlock detailed AI match insights by analyzing this role.</p>
                      <Button variant="outline" size="sm" onClick={getMatchAnalysis}>Analyze Match</Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="m-0 mt-0">
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'tailor', label: '✨ Tailor My Resume', desc: 'Optimize keywords for this JD', icon: Briefcase },
                      { id: 'cover', label: '✉️ Cover Letter', desc: 'Generate company-specific intro', icon: Share2 },
                      { id: 'similar', label: '🔍 Similar Companies', desc: 'Find more roles like this', icon: Users },
                      { id: 'copy', label: '🔗 Copy Apply Link', desc: 'Save to clipboard', icon: ExternalLink }
                    ].map(action => (
                      <div key={action.id} className="space-y-2">
                        <button 
                          className="w-full p-4 border border-[#E2E8F0] rounded-xl text-left hover:bg-[#F8FAFC] transition-all group/action disabled:opacity-50"
                          onClick={() => handleAiAction(action.id)}
                          disabled={isGeneratingAction === action.id}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[14px] font-bold text-[#1E293B] group-hover/action:text-[#6366F1]">{action.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover/action:translate-x-1 group-hover/action:text-[#6366F1] transition-all" />
                          </div>
                          <p className="text-[11px] text-[#64748B]">{action.desc}</p>
                          {isGeneratingAction === action.id && <span className="text-[10px] text-blue-500 font-bold block mt-2 animate-pulse">Model Thinking...</span>}
                        </button>
                        {aiOutput[action.id] && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 bg-[#F8FAFC] rounded-xl text-[11px] text-[#475569] font-medium border border-[#E2E8F0] overflow-hidden"
                          >
                            <pre className="whitespace-pre-wrap font-sans">{aiOutput[action.id]}</pre>
                            <Button variant="outline" size="sm" className="h-8 mt-3 text-[11px] font-bold text-[#6366F1] hover:bg-white border-[#6366F1]/20" onClick={() => navigator.clipboard.writeText(aiOutput[action.id])}>Copy Snippet</Button>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </AnimatePresence>
            </ScrollArea>
          </Tabs>
        </CardContent>

        <CardFooter className="p-6 pt-2 border-t bg-[#F8FAFC] flex justify-between items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Posted</span>
            <span className="text-[12px] font-semibold text-slate-600">{formatDistanceToNow(new Date(job.postedAt))} ago</span>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className={cn("h-11 w-11 shrink-0 border-[#E2E8F0] hover:bg-white", isBookmarked && "text-[#6366F1] border-[#6366F1]/30 bg-[#6366F1]/5")}
              onClick={() => onBookmark?.(job.id)}
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </Button>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-11 px-8 rounded-lg font-bold bg-[#6366F1] hover:bg-[#6366F1]/90 text-white text-sm transition-colors"
            >
              Apply Now <ChevronRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
