import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { FileUp, FileText, X, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';

interface ResumeUploadProps {
  onParsed: (data: { skills: string[]; title?: string; summary?: string }) => void;
}

export default function ResumeUpload({ onParsed }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<{ skills: string[]; title?: string } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      handleParse(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const handleParse = async (file: File) => {
    setIsParsing(true);
    setParseError(null);
    try {
      const data = await aiService.parseResume(file);
      setParsedData(data);
      onParsed(data);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Resume parsing failed. Check your API keys.';
      setParseError(msg);
      onParsed({ skills: [] });
    } finally {
      setIsParsing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setParsedData(null);
    setParseError(null);
  };

  return (
    <Card className="p-6 border-dashed border-2 border-[#C4B5FD] relative overflow-hidden bg-[#F5F3FF]">
      <AnimatePresence mode="wait">
        {!file ? (
          <div
            key="upload"
            {...getRootProps()}
            className="flex flex-col items-center justify-center py-4 cursor-pointer group"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
                <FileUp className="w-8 h-8 text-[#6D28D9]" />
              </div>
              <h3 className="text-sm font-bold text-[#6D28D9] mb-1">Upload your resume</h3>
              <p className="text-xs text-violet-400">PDF, DOCX up to 10MB</p>
              <div className="mt-4 flex gap-2">
                <Badge variant="outline" className="bg-white/50 border-none font-semibold text-[#6D28D9] text-[10px]">AI-Powered extraction</Badge>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={removeFile}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {parseError && (
              <p className="text-xs text-red-600 font-medium leading-snug">{parseError}</p>
            )}

            {isParsing ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-900">Magically extracting skills...</p>
                  <p className="text-[10px] text-muted-foreground animate-pulse">Running CareerCompass AI model</p>
                </div>
              </div>
            ) : parsedData ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Analysis Complete</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Extracted Title</p>
                  <p className="text-xs font-medium text-gray-900">{parsedData.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Detected Core Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {parsedData.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="w-full h-8 text-[10px] gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Adjust Preferences
                </Button>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
