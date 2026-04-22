/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Job } from './types';
import { jobService } from './services/jobService';
import JobCard from '@/components/JobCard';
import JobTable from '@/components/JobTable';
import FilterPills from '@/components/FilterPills';
import ResumeUpload from '@/components/ResumeUpload';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  LayoutGrid, 
  List, 
  MapPin, 
  FilterX, 
  Briefcase, 
  Compass,
  Sparkles,
  Github,
  Bell,
  UserCircle
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [userResumeText, setUserResumeText] = useState('');

  const locations = ['Remote', 'San Francisco, CA', 'London, UK', 'New York, NY', 'Bangalore, IND', 'Berlin, GER'];
  const roles = ['Frontend', 'Backend', 'Fullstack', 'Design', 'Product', 'DevOps'];

  useEffect(() => {
    const hasTavilyKey = !!process.env.TAVILY_API_KEY;
    if (!hasTavilyKey) {
      toast.warning('Job search is disabled. Add TAVILY_API_KEY to your .env file to enable it.', {
        duration: 8000,
      });
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const results = await jobService.searchJobs(searchQuery, locationQuery);
      setJobs(results);
    } catch (error) {
      toast.error('Failed to fetch jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    toast.success(bookmarkedIds.includes(id) ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleResumeParsed = (data: { skills: string[]; title?: string; summary?: string }) => {
    setUserSkills(data.skills);
    setUserResumeText(data.summary || data.skills.join(', ') || '');
    // Auto-select filters based on skills (example logic)
    if (data.skills.some(s => s.toLowerCase().includes('frontend'))) {
      setSelectedRoles(prev => Array.from(new Set([...prev, 'Frontend'])));
    }
    toast.success('Resume analyzed! Filters updated.', {
      icon: <Sparkles className="w-4 h-4 text-amber-500" />
    });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLocation = selectedLocations.length === 0 || selectedLocations.includes(job.location);
      const matchRole = selectedRoles.length === 0 || selectedRoles.some(r => job.title.includes(r));
      return matchSearch && matchLocation && matchRole;
    });
  }, [jobs, searchQuery, selectedLocations, selectedRoles]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary/20">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              C
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[18px] font-extrabold tracking-tight text-slate-800">CareerCompass <span className="text-[#6366F1]">AI</span></h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">Guest User</p>
                <p className="text-[10px] text-muted-foreground">Sign in to sync</p>
              </div>
              <UserCircle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <ResumeUpload onParsed={handleResumeParsed} />
            
            <div className="space-y-6 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-slate-400">Filters</h3>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-[#6366F1] hover:bg-indigo-50" onClick={() => { setSelectedLocations([]); setSelectedRoles([]); }}>
                  <FilterX className="w-3.5 h-3.5 mr-1" /> Reset
                </Button>
              </div>

              <FilterPills 
                label="Location"
                filters={locations}
                selectedFilters={selectedLocations}
                onChange={setSelectedLocations}
              />

              <FilterPills 
                label="Job Function"
                filters={roles}
                selectedFilters={selectedRoles}
                onChange={setSelectedRoles}
              />
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-gray-900 uppercase">AI Preferences</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Preferences are currently being refined based on your uploaded resume ({userSkills.length} skills detected).
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-40" />
                <input 
                  type="text"
                  placeholder="Search roles, companies, or keywords..."
                  className="w-full h-12 pl-12 pr-4 rounded-lg bg-[#F1F5F9] border-none focus:ring-2 focus:ring-[#6366F1]/20 transition-all outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                />
              </div>
              <div className="relative w-full sm:w-64">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-40" />
                <input 
                  type="text"
                  placeholder="Location..."
                  className="w-full h-12 pl-12 pr-4 rounded-lg bg-[#F1F5F9] border-none focus:ring-2 focus:ring-[#6366F1]/20 transition-all outline-none text-sm"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                />
              </div>
              <Button className="h-12 px-8 rounded-lg font-semibold bg-[#6366F1] hover:bg-[#6366F1]/90 shadow-none border-none" onClick={fetchJobs}>
                Search
              </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-slate-500">
                  Showing <span className="font-bold text-slate-900">{filteredJobs.length}</span> jobs
                </p>
                <div className="hidden sm:flex flex-wrap gap-2">
                  {selectedLocations.map(l => <Badge key={l} variant="secondary" className="bg-[#6366F1]/5 text-[#6366F1] border-[#6366F1]/10 text-[10px] rounded-full px-3">{l}</Badge>)}
                </div>
              </div>
              
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'table')} className="bg-[#F1F5F9] p-1 rounded-lg">
                <TabsList className="bg-transparent h-8">
                  <TabsTrigger value="grid" className="h-7 px-3 data-[state=active]:bg-white data-[state=active]:text-[#6366F1] data-[state=active]:shadow-sm rounded-md transition-all">
                    <LayoutGrid className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="table" className="h-7 px-3 data-[state=active]:bg-white data-[state=active]:text-[#6366F1] data-[state=active]:shadow-sm rounded-md transition-all">
                    <List className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Job Listings Area */}
            <div className="relative min-h-[400px]">
              {isLoading ? (
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" : "grid-cols-1"
                )}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse border" />
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {viewMode === 'grid' ? (
                    <motion.div 
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                    >
                      {filteredJobs.map(job => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isBookmarked={bookmarkedIds.includes(job.id)}
                          onBookmark={handleBookmark}
                          userResume={userResumeText}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="table"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <JobTable 
                        jobs={filteredJobs} 
                        bookmarkedIds={bookmarkedIds}
                        onBookmark={handleBookmark}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No jobs found matching your criteria</h3>
                  <p className="text-slate-500 mt-2 max-w-sm">
                    Try adjusting your filters, keywords, or search location to see more results.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => { setSearchQuery(''); setLocationQuery(''); setSelectedLocations([]); setSelectedRoles([]); }}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-black tracking-tighter">Hermes.ai</h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                The world's most advanced AI-powered career aggregation platform. 
                Built to help developers and designers find their next big leap using high-precision matching models.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="bg-slate-50"><Github className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="bg-slate-50"><MapPin className="w-4 h-4" /></Button>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-600 font-medium">
                <li className="hover:text-primary cursor-pointer">Job Board</li>
                <li className="hover:text-primary cursor-pointer">Company Search</li>
                <li className="hover:text-primary cursor-pointer">Resume Analyzer</li>
                <li className="hover:text-primary cursor-pointer">Extension</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-slate-600 font-medium">
                <li className="hover:text-primary cursor-pointer">Bookmarks</li>
                <li className="hover:text-primary cursor-pointer">Applications</li>
                <li className="hover:text-primary cursor-pointer">Profile</li>
                <li className="hover:text-primary cursor-pointer">Log Out</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <p>© 2026 Hermes.ai All rights reserved.</p>
            <div className="flex gap-6">
              <span className="cursor-pointer hover:text-slate-900">Privacy Policy</span>
              <span className="cursor-pointer hover:text-slate-900">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
