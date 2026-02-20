import { BRANCHES } from '../data/branches';
import { BranchCard } from '../components/branches/BranchCard';
import { GraduationCap, BookOpen, FileText, Brain } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 py-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Polytechnic Learning Platform
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Access study materials, previous year papers, practice MCQs, and syllabus for all diploma engineering branches
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: BookOpen, label: 'Study Notes', color: 'text-blue-600' },
          { icon: FileText, label: 'Question Papers', color: 'text-green-600' },
          { icon: Brain, label: 'MCQ Practice', color: 'text-purple-600' },
          { icon: GraduationCap, label: 'Syllabus', color: 'text-orange-600' }
        ].map((feature) => (
          <div key={feature.label} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
            <feature.icon className={`w-8 h-8 ${feature.color}`} />
            <span className="text-sm font-medium text-center">{feature.label}</span>
          </div>
        ))}
      </div>

      {/* Branches Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Select Your Branch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BRANCHES.map((branch) => (
            <BranchCard
              key={branch.id}
              branchId={branch.id}
              name={branch.name}
              icon={branch.icon}
              description={branch.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
