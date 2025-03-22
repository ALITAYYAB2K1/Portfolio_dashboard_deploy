import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { getAllMessages, deleteMessage } from "../../store/messageSlice";
import {
  Trash2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Calendar,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";

export function Messages() {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const { loading, messages, error, deleteLoading } = useSelector(
    (state) => state.messages
  );
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Fetch messages when component mounts
  useEffect(() => {
    dispatch(getAllMessages());
  }, [dispatch]);

  const handleReturnToDashboard = () => {
    navigateTo("/");
  };

  const handleDeleteClick = (id) => {
    setSelectedMessageId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMessageId) {
      dispatch(deleteMessage(selectedMessageId));
      setConfirmDeleteOpen(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="min-h-[100vh] p-4 md:p-8 bg-gradient-to-b from-background to-background/80">
        <Tabs defaultValue="messages" className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Message Inbox</h1>
            </div>
            <Button
              variant="outline"
              onClick={handleReturnToDashboard}
              className="gap-2"
            >
              Return to Dashboard
            </Button>
          </div>

          <TabsList className="mb-6">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>All Messages</span>
              {messages?.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                  {messages.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Received Messages</h2>
              <Button
                variant="outline"
                onClick={() => dispatch(getAllMessages())}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center p-12">
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading messages...</p>
                </div>
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {messages.map((message) => (
                  <Card
                    key={message._id}
                    className="overflow-hidden transition-all hover:shadow-md group"
                  >
                    <CardHeader className="bg-muted/50 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base font-semibold">
                            {message.senderName}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDeleteClick(message._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                      <CardDescription className="text-sm font-medium text-foreground">
                        {message.subject}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {message.message}
                      </p>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 py-2 flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(message.createdAt)}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-12 text-center">
                <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium">No messages yet</h3>
                  <p className="text-muted-foreground text-sm">
                    When someone sends you a message, it will appear here.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Delete Message
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between mt-6">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 gap-2"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
              Delete Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
