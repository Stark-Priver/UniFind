import { Metadata } from "next";
import dynamic from "next/dynamic";
import { ItemForm } from "./item-form";

export const metadata: Metadata = {
  title: "Report Item | Lost & Found",
  description: "Report a lost or found item",
};

const Map = dynamic(() => import("./map"), { ssr: false });

export default function ReportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Report an Item</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <ItemForm />
        <div className="h-[600px] rounded-lg overflow-hidden">
          <Map />
        </div>
      </div>
    </div>
  );
}