import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface FilterPillsProps {
  filters: string[];
  selectedFilters: string[];
  onChange: (selected: string[]) => void;
  label?: string;
}

export default function FilterPills({ filters, selectedFilters, onChange, label }: FilterPillsProps) {
  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      onChange(selectedFilters.filter(f => f !== filter));
    } else {
      onChange([...selectedFilters, filter]);
    }
  };

  return (
    <div className="space-y-3">
      {label && <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => {
          const isSelected = selectedFilters.includes(filter);
          return (
            <Badge
              key={filter}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-1.5 rounded-full text-[12px] font-medium select-none transition-all duration-200 border",
                isSelected 
                  ? "bg-[#6366F1] text-white border-[#6366F1] shadow-md shadow-indigo-100" 
                  : "bg-white hover:bg-gray-50 border-[#E2E8F0] text-[#64748B]"
              )}
              onClick={() => toggleFilter(filter)}
            >
              {filter}
              {isSelected && <X className="w-3 h-3 ml-1.5 opacity-60" />}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
