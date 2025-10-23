import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

import { useChat } from '@/hooks/use-chat';

import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AVAILABLE_COMMANDS = [
  '@create-task',
  '@create-appointment',
  '@create-sale',
  '@update-task',
  '@update-appointment',
  '@update-employee',
  '@update-sale',
  '@delete-task',
  '@delete-appointment',
  '@delete-employee',
  '@delete-sale',
  '@read-tasks',
  '@read-appointments',
  '@read-employees',
  '@read-sales',
];

const COMMAND_DESCRIPTIONS: Record<string, string> = {
  '@create-task': 'Create a new task with title and department',
  '@create-appointment': 'Create a new appointment with title and time',
  '@create-sale': 'Create a new sale with title and value',
  '@update-task': 'Update an existing task',
  '@update-appointment': 'Update an existing appointment',
  '@update-employee': 'Update an existing employee',
  '@update-sale': 'Update an existing sale',
  '@delete-task': 'Delete an existing task',
  '@delete-appointment': 'Delete an existing appointment',
  '@delete-employee': 'Delete an existing employee',
  '@delete-sale': 'Delete an existing sale',
  '@read-tasks': 'Read/list tasks',
  '@read-appointments': 'Read/list appointments',
  '@read-employees': 'Read/list employees',
  '@read-sales': 'Read/list sales',
};

export default function ChatPage() {
  const { currentUser } = useAuth();
  const { messages, addMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('googleAiApiKey');
    if (storedApiKey && storedApiKey.trim().length >= 20) {
      setApiKey(storedApiKey);
    } else {
      setShowModal(true);
    }
  }, []);

  const hasPermission = (command: string, userRole: string) => {
    const action = command.split('-')[0].slice(1);
    if (
      userRole === 'Employee' &&
      ['create', 'update', 'delete'].includes(action)
    ) {
      return false;
    }
    return true;
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.startsWith('@')) {
      const filtered = AVAILABLE_COMMANDS.filter(
        (cmd) =>
          cmd.startsWith(value) && hasPermission(cmd, currentUser?.role || '')
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion + ' ');
    setShowSuggestions(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !apiKey) {
      return;
    }

    await addMessage({ role: 'user', text: input.trim() });
    setInput('');
    setShowSuggestions(false);
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0].substring(0, 2);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          AI Chat
        </h2>
        <p className="text-muted-foreground">
          Interact with the AI assistant to perform actions.
        </p>
      </div>
      <Card className="flex-grow flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                Try things like: "add a new client called 'Innovate LLC' with
                email 'contact@innovate.com' and phone '555-1234'". Or "create a
                task to 'prepare Q3 report' for the engineering team, assigned
                to John Doe due next Friday".
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={messages.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col min-h-0">
          <ScrollArea className="flex-grow">
            <div className="space-y-4 pr-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role !== 'user' && (
                    <Avatar>
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                    title={(() => {
                      const command =
                        AVAILABLE_COMMANDS.find((cmd) =>
                          message.text.startsWith(cmd + ' ')
                        ) ||
                        (message.text.startsWith('@')
                          ? message.text.split(' ')[0]
                          : null);
                      return command && AVAILABLE_COMMANDS.includes(command)
                        ? COMMAND_DESCRIPTIONS[command]
                        : undefined;
                    })()}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {(() => {
                        const command =
                          AVAILABLE_COMMANDS.find((cmd) =>
                            message.text.startsWith(cmd + ' ')
                          ) ||
                          (message.text.startsWith('@')
                            ? message.text.split(' ')[0]
                            : null);
                        if (command && AVAILABLE_COMMANDS.includes(command)) {
                          const rest = message.text.slice(command.length);
                          return (
                            <>
                              <span
                                className="text-blue-500 font-bold"
                                title={
                                  COMMAND_DESCRIPTIONS[command] || 'Command'
                                }
                              >
                                {command}
                              </span>
                              {rest}
                            </>
                          );
                        }
                        return message.text;
                      })()}
                    </p>
                  </div>
                  {message.role === 'user' && currentUser && (
                    <Avatar>
                      <AvatarImage
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                      />
                      <AvatarFallback>
                        {getInitials(currentUser.name || '')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 pt-4 border-t flex-shrink-0"
          >
            <div className="flex-grow relative">
              <Input
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e as any);
                  }
                }}
                placeholder="Type your message here... Use @ for commands"
                className="flex-grow"
                disabled={!currentUser}
              />
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-md z-10 max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" disabled={!currentUser}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Google AI API Key</DialogTitle>
            <DialogDescription>
              Please enter your Google AI API key to use the chat feature. You
              can get a key from Google AI Studio.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Enter your API key"
            type="password"
          />
          <Button
            onClick={() => {
              const trimmedKey = apiKeyInput.trim();
              if (trimmedKey && trimmedKey.length >= 20) {
                localStorage.setItem('googleAiApiKey', trimmedKey);
                setApiKey(trimmedKey);
                setShowModal(false);
                setApiKeyInput('');
                toast.success('API key saved successfully');
              } else {
                toast.error('API key must be at least 20 characters long');
              }
            }}
          >
            Save API Key
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
