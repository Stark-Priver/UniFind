"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Item, Claim, User, ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";

export default function ClaimReviewPage() {
  const { id } = useParams();
  const [claim, setClaim] = useState<Claim & { item: Item; user: User }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, reset } = useForm<{ message: string }>();

  useEffect(() => {
    const fetchClaim = async () => {
      const claimDoc = await getDoc(doc(db, "claims", id as string));
      const claimData = { id: claimDoc.id, ...claimDoc.data() } as Claim;
      
      const itemDoc = await getDoc(doc(db, "items", claimData.itemId));
      const item = { id: itemDoc.id, ...itemDoc.data() } as Item;
      
      const userDoc = await getDoc(doc(db, "users", claimData.userId));
      const user = { id: userDoc.id, ...userDoc.data() } as User;
      
      setClaim({ ...claimData, item, user });
    };

    fetchClaim();

    // Subscribe to messages
    const q = query(
      collection(db, "messages"),
      where("claimId", "==", id),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleApprove = async () => {
    if (!claim) return;
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "claims", claim.id), {
        status: "approved"
      });
      await updateDoc(doc(db, "items", claim.item.id), {
        status: "approved",
        claimedBy: claim.userId
      });
    } catch (error) {
      console.error("Error approving claim:", error);
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    if (!claim) return;
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "claims", claim.id), {
        status: "rejected"
      });
      await updateDoc(doc(db, "items", claim.item.id), {
        status: "pending"
      });
    } catch (error) {
      console.error("Error rejecting claim:", error);
    }
    setIsLoading(false);
  };

  const onSubmitMessage = async (data: { message: string }) => {
    if (!claim) return;
    try {
      await addDoc(collection(db, "messages"), {
        claimId: claim.id,
        content: data.message,
        senderId: "admin", // Replace with actual admin ID
        createdAt: new Date()
      });
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!claim) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Claim Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Item</h3>
                <p>{claim.item.title}</p>
                <div className="flex gap-2 mt-2">
                  <Badge>{claim.item.type}</Badge>
                  <Badge variant="outline">{claim.item.category}</Badge>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Claimed By</h3>
                <p>{claim.user.name}</p>
                <p className="text-sm text-muted-foreground">{claim.user.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Proof Description</h3>
                <p>{claim.proofDescription}</p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Approve
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Chat</h2>
            <ScrollArea className="h-[400px] mb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.senderId === "admin"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSubmit(onSubmitMessage)} className="flex gap-2">
              <Textarea
                {...register("message", { required: true })}
                placeholder="Type your message..."
                className="resize-none"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}