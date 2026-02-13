"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, Globe, Map } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600 tracking-tighter select-none">
          <div className="relative">
            <Globe className="h-8 w-8 text-blue-600" />
            <Map className="h-4 w-4 text-rose-500 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            PlanIt
          </span>
        </div>
        <button
          onClick={() => signIn("keycloak")}
          className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-medium hover:bg-black transition-colors"
        >
          Sign In
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-8">
          <Map size={16} />
          <span>The smarter way to travel</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8">
          Plan your next <span className="text-blue-600">adventure</span> with ease.
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
          Manage itineraries, track expenses, and coordinate with friends.
          All your travel plans in one beautiful place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => signIn("keycloak")}
            className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-1"
          >
            Start Planning Now
            <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 rounded-xl bg-gray-100 text-gray-900 font-bold text-lg hover:bg-gray-200 transition-all">
            Learn More
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          {[
            {
              title: "Itinerary Builder",
              desc: "Drag and drop activities to create the perfect schedule for every day of your trip."
            },
            {
              title: "Expense Tracker",
              desc: "Keep track of who paid for what and simplify settling up at the end."
            },
            {
              title: "Real-time Sync",
              desc: "Collaborate with your travel buddies and see updates instantly."
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-xl mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-100">
        © {new Date().getFullYear()} PlanIt. All rights reserved.
      </footer>
    </div>
  );
}
