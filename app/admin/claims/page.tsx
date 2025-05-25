"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Item, Claim, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<(Claim & { item: Item; user: User })[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "claims"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const claimsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const claim = { id: doc.id, ...doc.data() } as Claim;
          
          // Get item details
          const itemDoc = await db.collection("items").doc(claim.itemId).get();
          const item = { id: itemDoc.id, ...itemDoc.data() } as Item;
          
          // Get user details
          const userDoc = await db.collection("users").doc(claim.userId).get();
          const user = { id: userDoc.id, ...userDoc.data() } as User;
          
          return { ...claim, item, user };
        })
      );
      
      setClaims(claimsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pending Claims</h1>
      <div className="grid gap-6">
        {claims.map((claim) => (
          <Card key={claim.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{claim.item.title}</h2>
                <p className="text-muted-foreground mb-4">{claim.item.description}</p>
                <div className="flex gap-2 mb-4">
                  <Badge>{claim.item.type}</Badge>
                  <Badge variant="outline">{claim.item.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Claimed by: {claim.user.name}
                </p>
              </div>
              <Button asChild>
                <Link href={`/admin/claims/${claim.id}`}>Review Claim</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}