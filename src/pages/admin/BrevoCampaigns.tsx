import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const BrevoCampaigns = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Campaigns</h1>
          <p className="text-muted-foreground">Manage Brevo email campaigns</p>
        </div>
        <Button>
          <Mail className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brevo Integration</CardTitle>
          <CardDescription>Manage email campaigns and automation</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Brevo email campaign management will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrevoCampaigns;