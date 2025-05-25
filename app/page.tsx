import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Search, School } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#1E40AF]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image
              src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg"
              alt="MUST Logo"
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">MUST Lost & Found Community</h1>
          <p className="text-blue-200 text-lg mb-8">
            Connect, report, and recover lost items within Mbeya University of Science and Technology
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/items/report">
                <MapPin className="mr-2 h-5 w-5" />
                Report Item
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-blue-700">
              <Link href="/items/search">
                <Search className="mr-2 h-5 w-5" />
                Search Items
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 bg-white/10 backdrop-blur-lg text-white">
            <School className="h-8 w-8 mb-3 text-blue-300" />
            <h3 className="text-xl font-semibold mb-3">Campus Community</h3>
            <p className="text-blue-200">
              A dedicated platform for MUST students and staff to help each other recover lost belongings.
            </p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg text-white">
            <h3 className="text-xl font-semibold mb-3">Quick Recovery</h3>
            <p className="text-blue-200">
              Efficient system to report and track lost items across campus locations.
            </p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg text-white">
            <h3 className="text-xl font-semibold mb-3">Real-time Alerts</h3>
            <p className="text-blue-200">
              Get instant notifications when items matching your description are found.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}