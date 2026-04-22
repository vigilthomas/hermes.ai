import React from 'react';
import { Job } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, ExternalLink, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface JobTableProps {
  jobs: Job[];
  onBookmark?: (id: string) => void;
  bookmarkedIds?: string[];
}

export default function JobTable({ jobs, onBookmark, bookmarkedIds = [] }: JobTableProps) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow className="border-b-[#E2E8F0] hover:bg-transparent">
            <TableHead className="w-[300px] text-[11px] font-extrabold uppercase tracking-widest text-[#94A3B8]">Role & Company</TableHead>
            <TableHead className="text-[11px] font-extrabold uppercase tracking-widest text-[#94A3B8]">Location</TableHead>
            <TableHead className="text-[11px] font-extrabold uppercase tracking-widest text-[#94A3B8]">Salary Range</TableHead>
            <TableHead className="text-[11px] font-extrabold uppercase tracking-widest text-[#94A3B8]">Match</TableHead>
            <TableHead className="text-[11px] font-extrabold uppercase tracking-widest text-[#94A3B8]">Posted</TableHead>
            <TableHead className="text-right text-[11px] font-extrabold uppercase tracking-widest text-[#94A3B8]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="group hover:bg-[#F8FAFC] border-b-[#F1F5F9] transition-colors">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={job.company.logo ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company.name)}&size=40&background=6366f1&color=fff`}
                    alt={job.company.name}
                    className="w-9 h-9 rounded-lg bg-gray-100 border border-[#F1F5F9]"
                  />
                  <div>
                    <p className="font-bold text-[14px] leading-tight text-[#1E293B] group-hover:text-[#6366F1] transition-colors">{job.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-semibold text-[#64748B]">{job.company.name}</span>
                      <div className="flex items-center gap-0.5 text-amber-500 scale-75 origin-left">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold">{job.glassdoorRating || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs font-semibold text-gray-700">
                  {job.salary
                    ? `${job.salary.currency}${job.salary.min.toLocaleString()} – ${job.salary.max.toLocaleString()}`
                    : 'Not disclosed'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {job.skills.slice(0, 2).map((s, i) => (
                    <Badge key={i} variant="outline" className={cn("text-[9px] h-4", s.isMatched ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-400 border-gray-100")}>
                      {s.name}
                    </Badge>
                  ))}
                  {job.skills.length > 2 && <span className="text-[9px] text-muted-foreground">+{job.skills.length - 2}</span>}
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(job.postedAt))} ago
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100 rounded-lg transition-all" onClick={() => onBookmark?.(job.id)}>
                    <Bookmark className={cn("w-4 h-4", bookmarkedIds.includes(job.id) && "fill-[#6366F1] text-[#6366F1]")} />
                  </Button>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center h-9 px-5 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Apply <ExternalLink className="w-3 h-3 ml-1.5" />
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
