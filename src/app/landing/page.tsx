// /app/landing/page.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="mx-auto flex max-w-[800px] flex-col items-center space-y-8 text-center">
        
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
          School Payments Management
        </h1>
        
        <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
          A centralized dashboard to securely track, record, and verify student fee clearances.
        </p>
        
        <div className="pt-4">
          <Button 
            asChild 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-medium shadow-md transition-all"
          >
            <Link href="/login">
              Go to Login
            </Link>
          </Button>
        </div>
        
      </div>
    </div>
  );
}