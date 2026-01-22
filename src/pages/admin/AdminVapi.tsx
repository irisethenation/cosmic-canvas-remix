import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  RefreshCw,
  Play
} from 'lucide-react';

interface Call {
  id: string;
  vapi_call_id: string | null;
  provider: string;
  direction: string;
  status: string;
  phone_number: string | null;
  duration_seconds: number | null;
  consent_confirmed: boolean;
  transcript: string | null;
  recording_url: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  RINGING: 'bg-yellow-500',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  FAILED: 'bg-red-500',
};

const AdminVapi = () => {
  const { toast } = useToast();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch calls', variant: 'destructive' });
    } else {
      setCalls(data || []);
    }
    setLoading(false);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openTranscript = (call: Call) => {
    setSelectedCall(call);
    setTranscriptOpen(true);
  };

  const stats = {
    total: calls.length,
    completed: calls.filter(c => c.status === 'COMPLETED').length,
    inProgress: calls.filter(c => c.status === 'IN_PROGRESS').length,
    failed: calls.filter(c => c.status === 'FAILED').length,
    totalDuration: calls.reduce((acc, c) => acc + (c.duration_seconds || 0), 0),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Voice Calls</h1>
            <p className="text-muted-foreground">Monitor Vapi call logs and transcripts</p>
          </div>
          <Button onClick={fetchCalls} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Phone className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Calls</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/10">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.failed}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</p>
                  <p className="text-sm text-muted-foreground">Total Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calls Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Call Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : calls.length === 0 ? (
              <div className="p-8 text-center">
                <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No calls recorded yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Direction</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Consent</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {call.direction === 'INBOUND' ? (
                            <PhoneIncoming className="h-4 w-4 text-green-500" />
                          ) : (
                            <PhoneOutgoing className="h-4 w-4 text-blue-500" />
                          )}
                          <span>{call.direction}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {call.phone_number || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[call.status]} text-white`}>
                          {call.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDuration(call.duration_seconds)}</TableCell>
                      <TableCell>
                        {call.consent_confirmed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(call.started_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {call.transcript && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openTranscript(call)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          {call.recording_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(call.recording_url!, '_blank')}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Menu Configuration Preview */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Voice Menu Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Main Menu</h4>
                <p className="text-muted-foreground italic">
                  "Welcome to iRise Academy and Legacy Trust Foundation. For education and admissions, press 1. 
                  For advocacy, press 2. To update your trust or file compliance documents, press 3. 
                  For general iRise Nation info, press 4."
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">1. Academy Sub-Menu</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>1 → Privacy Policy & Code of Conduct</li>
                    <li>2 → Courses & Programs</li>
                    <li>3 → Speak to Ambassador</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">2. Advocacy</h4>
                  <p className="text-muted-foreground">
                    Captures incident details, safety checks, consent → Routes to Morpheus escalation
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">3. Trust</h4>
                  <p className="text-muted-foreground">
                    Captures trust needs → Routes to Morpheus fulfillment queue
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">4. General</h4>
                  <p className="text-muted-foreground">
                    FAQ + Links + Telegram follow-up option
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transcript Dialog */}
      <Dialog open={transcriptOpen} onOpenChange={setTranscriptOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Call Transcript</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] mt-4">
            <div className="whitespace-pre-wrap text-sm">
              {selectedCall?.transcript || 'No transcript available'}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminVapi;
