import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface BranchCardProps {
  branchId: string;
  name: string;
  icon: string;
  description: string;
}

export function BranchCard({ branchId, name, icon, description }: BranchCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="group hover:shadow-soft transition-all duration-200 hover:border-primary/50 cursor-pointer h-full"
      onClick={() => navigate({ to: '/branch/$branchId', params: { branchId } })}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <img
              src={icon}
              alt={`${name} icon`}
              className="w-16 h-16 object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
