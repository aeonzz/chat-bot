import { FileText } from "lucide-react";

interface Source {
  name?: string;
  url?: string | null;
  source?: string;
  content?: string;
  metadata?: Record<string, any>;
}

interface SourceCardProps {
  source: Source | string;
}

export default function SourceCard({ source }: SourceCardProps) {
  // Debug logging
  console.log("SourceCard received:", source);
  console.log("SourceCard type:", typeof source);
  console.log("SourceCard stringified:", JSON.stringify(source));
  
  // Handle both string and object sources
  const sourceString = typeof source === 'string' 
    ? source 
    : (source?.name || source?.source || source?.metadata?.source || 'Unknown Source');
  const displaySource = sourceString.replace(/^docs\//, "");
  
  // Get URL or default to google.com
  const sourceUrl = typeof source === 'object' && source?.url 
    ? source.url 
    : 'https://google.com';
  
  console.log("SourceCard displaying:", displaySource);
  console.log("SourceCard URL:", sourceUrl);
  
  return (
    <a 
      href={sourceUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-secondary text-secondary-foreground flex w-full items-center gap-1.5 rounded-xl border px-2 py-1 hover:bg-secondary/80 transition-colors cursor-pointer"
    >
      <FileText className="size-3.5 shrink-0" />
      <p className="w-full truncate text-xs text-nowrap">{displaySource}</p>
    </a>
  );
}
