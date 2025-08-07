import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const AiKnowledgeBase = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Knowledge Base</h1>
          <p className="text-muted-foreground">Manage AI training data and knowledge</p>
        </div>
        <Button>
          <Brain className="h-4 w-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Management</CardTitle>
          <CardDescription>Train and manage AI knowledge base</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">AI knowledge base management will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiKnowledgeBase;