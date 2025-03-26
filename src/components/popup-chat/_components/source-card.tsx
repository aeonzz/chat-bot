import { ExternalLink } from "lucide-react";
import { Link } from "react-router";

interface SourceCardProps {
  source: string;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <Link
      to={source}
      className="bg-secondary text-secondary-foreground flex w-full cursor-pointer items-center gap-1.5 rounded-xl border px-2 py-1"
    >
      <p className="w-full truncate text-xs text-nowrap">{source}</p>
      <ExternalLink className="size-3.5" />
    </Link>
  );
}
