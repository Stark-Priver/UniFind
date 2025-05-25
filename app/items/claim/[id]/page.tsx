"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Item, ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";

export default function ClaimItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Item>();
  const [claim, setClaim] = useState<any>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit } = useForm<{
    proofDescription: string;
    message?: string;
  }>();

  useEffect(() => {
    const fetchItem = async () => {
      const itemDoc = await getDoc(doc(db, "items", id as string));
      setItem({ id: itemDoc.id, ...itemDoc.data() } as Item);
    };

    fetchItem();

    // Check if user has already claimed this item
    const checkClaim = async () => {
      const q = query(
        collection(db, "claims"),
        where("itemId", "==", id),
        where("userId", "==", "currentUserId") // Replace with actual user ID
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setClaim(snapshot.docs[0].data());
          
          // Subscribe to messages if claim exists
          const messagesQuery = query(
            collection(db, "messages"),
            where("claimId", "==", snapshot.docs[0].id),
            orderBy("createdAt", "asc")
          );
          
          onSnapshot(messagesQuery, (messageSnapshot) => {
            const messagesData = messageSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as ChatMessage[];
            setMessages(messagesData);
          });
        }
      });

      return unsubscribe;
    };

    const unsubscribe = checkClaim();
    return () => unsubscribe;
  }, [id]);

  const onSubmit = async (data: { proofDescription: string }) => {
    setIsSubmitting(true);
    try {
      const claimRef = await addDoc(collection(db, "claims"), {
        itemId: id,
        userId: "currentUserId", // Replace with actual user ID
        status: "pending",
        proofDescription: data.proofDescription,
        createdAt: new Date()
      });

      await addDoc(collection(db, "messages"), {
        claimId: claimRef.id,
        content: "I would like to claim this item.",
        senderId: "currentUserId", // Replace with actual user ID
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Error submitting claim:", error);
    }
    setIsSubmitting(false);
  };

  const onSendMessage = async (data: { message: string }) => {
    if (!claim) return;
    try {
      await addDoc(collection(db, "messages"), {
        claimId: claim.id,
        content: data.message,
        senderId: "currentUserId", // Replace with actual user ID
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Claim Item: {item.title}</h1>
        {!claim ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Proof of Ownership
              </label>
              <Textarea
                {...register("proofDescription", { required: true })}
                placeholder="Please provide detailed information to prove your ownership..."
                className="resize-none"
                rows={6}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Claim
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Claim Status</h2>
              <p className="capitalize">{claim.status}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Chat with Admin</h2>
              <ScrollArea className="h-[400px] mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === "currentUserId"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.senderId === "currentUserId"
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
              <form
                onSubmit={handleSubmit(onSendMessage)}
                className="flex gap-2"
              >
                <Textarea
                  {...register("message", { required: true })}
                  placeholder="Type your message..."
                  className="resize-none"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}