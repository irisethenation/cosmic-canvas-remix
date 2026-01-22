import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Phone, 
  User, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Send
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface SupportCase {
  id: string;
  telegram_chat_id: number | null;
  telegram_username: string | null;
  channel: string;
  case_type: string;
  priority: string;
  status: string;
  current_agent: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

interface CaseMessage {
  id: string;
  sender: string;
  content: string;
  message_type: string;
  created_at: string;
}

interface TelemetryEvent {
  id: string;
  source: string;
  level: string;
  event_key: string;
  payload: any;
  created_at: string;
}

const priorityColors: Record<string, string> = {
  LOW: 'bg-slate-500',
  NORMAL: 'bg-blue-500',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-500',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  escalated: 'bg-orange-500',
  closed: 'bg-slate-500',
  waiting_user: 'bg-yellow-500',
};

const AdminSupport = () => {
  const { toast } = useToast();
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);
  const [messages, setMessages] = useState<CaseMessage[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('cases');

  useEffect(() => {
    fetchCases();
    fetchTelemetry();
    
    // Set up realtime subscription for cases
    const casesChannel = supabase
      .channel('support-cases-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_cases' }, () => {
        fetchCases();
      })
      .subscribe();
    
    const messagesChannel = supabase
      .channel('case-messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'case_messages' }, () => {
        if (selectedCase) {
          fetchMessages(selectedCase.id);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(casesChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [selectedCase?.id]);

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from('support_cases')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch cases', variant: 'destructive' });
    } else {
      setCases(data || []);
    }
    setLoading(false);
  };

  const fetchMessages = async (caseId: string) => {
    const { data } = await supabase
      .from('case_messages')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true });
    
    setMessages(data || []);
  };

  const fetchTelemetry = async () => {
    const { data } = await supabase
      .from('telemetry')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    setTelemetry(data || []);
  };

  const selectCase = (caseItem: SupportCase) => {
    setSelectedCase(caseItem);
    fetchMessages(caseItem.id);
  };

  const updateCaseAgent = async (caseId: string, agent: string) => {
    await supabase
      .from('support_cases')
      .update({ current_agent: agent })
      .eq('id', caseId);
    
    toast({ title: 'Success', description: `Case assigned to ${agent}` });
    fetchCases();
  };

  const updateCaseStatus = async (caseId: string, status: string) => {
    await supabase
      .from('support_cases')
      .update({ status })
      .eq('id', caseId);
    
    toast({ title: 'Success', description: `Status updated to ${status}` });
    fetchCases();
  };

  const sendAdminReply = async () => {
    if (!selectedCase || !replyText.trim()) return;
    
    setSending(true);
    try {
      // Log message to database
      await supabase.from('case_messages').insert({
        case_id: selectedCase.id,
        sender: 'HUMAN',
        content: replyText,
        message_type: 'text',
      });
      
      // If Telegram case, send via Telegram
      if (selectedCase.telegram_chat_id) {
        await supabase.functions.invoke('telegram-send-message', {
          body: {
            chatId: selectedCase.telegram_chat_id,
            message: `👤 <b>Admin Response:</b>\n\n${replyText}`,
          },
        });
      }
      
      setReplyText('');
      toast({ title: 'Sent', description: 'Reply sent successfully' });
      fetchMessages(selectedCase.id);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send reply', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'TELEGRAM': return <MessageSquare className="h-4 w-4" />;
      case 'VAPI_VOICE': return <Phone className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
      case 'CRITICAL': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'WARN': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
            <p className="text-muted-foreground">Manage support cases and system telemetry</p>
          </div>
          <Button onClick={() => { fetchCases(); fetchTelemetry(); }} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="cases">
              <MessageSquare className="h-4 w-4 mr-2" />
              Cases ({cases.filter(c => c.status !== 'closed').length})
            </TabsTrigger>
            <TabsTrigger value="telemetry">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Telemetry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Cases List */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Support Queue</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    {loading ? (
                      <div className="p-8 text-center text-muted-foreground">Loading...</div>
                    ) : cases.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">No cases</div>
                    ) : (
                      <div className="divide-y divide-border">
                        {cases.map((caseItem) => (
                          <div
                            key={caseItem.id}
                            onClick={() => selectCase(caseItem)}
                            className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedCase?.id === caseItem.id ? 'bg-muted' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getChannelIcon(caseItem.channel)}
                                <span className="font-medium">
                                  {caseItem.telegram_username || `Chat ${caseItem.telegram_chat_id}`}
                                </span>
                              </div>
                              <Badge className={`${priorityColors[caseItem.priority]} text-white`}>
                                {caseItem.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Badge variant="outline">{caseItem.case_type}</Badge>
                              <Badge className={`${statusColors[caseItem.status]} text-white`}>
                                {caseItem.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(caseItem.updated_at).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Case Detail */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedCase ? 'Case Detail' : 'Select a Case'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCase ? (
                    <div className="space-y-4">
                      {/* Case Controls */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-sm text-muted-foreground">Agent</label>
                          <Select
                            value={selectedCase.current_agent}
                            onValueChange={(v) => updateCaseAgent(selectedCase.id, v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morpheus">Morpheus</SelectItem>
                              <SelectItem value="trinity">Trinity</SelectItem>
                              <SelectItem value="human">Human</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <label className="text-sm text-muted-foreground">Status</label>
                          <Select
                            value={selectedCase.status}
                            onValueChange={(v) => updateCaseStatus(selectedCase.id, v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="escalated">Escalated</SelectItem>
                              <SelectItem value="waiting_user">Waiting User</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Messages */}
                      <ScrollArea className="h-[350px] border rounded-lg p-4">
                        {messages.length === 0 ? (
                          <p className="text-center text-muted-foreground">No messages</p>
                        ) : (
                          <div className="space-y-3">
                            {messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg ${
                                  msg.sender === 'user'
                                    ? 'bg-muted ml-8'
                                    : msg.sender === 'HUMAN'
                                    ? 'bg-blue-500/10 mr-8 border border-blue-500/30'
                                    : 'bg-amber-500/10 mr-8 border border-amber-500/30'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium capitalize">{msg.sender}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(msg.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>

                      {/* Reply Box */}
                      <div className="flex gap-2">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type admin reply..."
                          className="flex-1"
                          rows={2}
                        />
                        <Button
                          onClick={sendAdminReply}
                          disabled={sending || !replyText.trim()}
                          className="bg-gradient-primary"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Select a case from the queue to view details
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="telemetry" className="mt-6">
            <Card className="border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {telemetry.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getLevelIcon(event.level)}
                            <span className={event.level === 'ERROR' || event.level === 'CRITICAL' ? 'text-red-500' : ''}>
                              {event.level}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.source}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{event.event_key}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(event.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;
