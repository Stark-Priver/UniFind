import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

export const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    fetchClaims();
    fetchMessages();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/claims');
      setClaims(response.data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const updateClaimStatus = async (claimId, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/claims/${claimId}`, { status });
      fetchClaims();
    } catch (error) {
      console.error('Error updating claim status:', error);
    }
  };

  const sendMessage = async (receiverId, itemId) => {
    try {
      await axios.post('http://localhost:5000/api/messages', {
        receiverId,
        itemId,
        content: messageContent,
      });
      setMessageContent('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="claims">
        <TabsList>
          <TabsTrigger value="claims">Claims Management</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="claims">
          <div className="grid gap-4">
            {claims.map((claim) => (
              <Card key={claim._id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{claim.title}</h3>
                      <p className="text-sm text-gray-600">Found by: {claim.finder.name}</p>
                      <p className="text-sm text-gray-600">Status: {claim.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Message</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <textarea
                              value={messageContent}
                              onChange={(e) => setMessageContent(e.target.value)}
                              className="w-full p-2 border rounded"
                              rows={4}
                            />
                            <Button
                              onClick={() => sendMessage(claim.finder._id, claim._id)}
                              className="w-full"
                            >
                              Send
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        onClick={() => updateClaimStatus(claim._id, 'verified')}
                        variant="outline"
                        size="sm"
                      >
                        Verify
                      </Button>
                      <Button
                        onClick={() => updateClaimStatus(claim._id, 'rejected')}
                        variant="destructive"
                        size="sm"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="grid gap-4">
            {messages.map((message) => (
              <Card key={message._id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">
                        From: {message.sender.name} To: {message.receiver.name}
                      </p>
                      <p className="mt-2">{message.content}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};