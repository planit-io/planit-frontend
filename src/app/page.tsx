"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowRight, Globe, Map, MapPin, Sparkles } from "lucide-react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const featuresRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const handleSignIn = () => {
    signIn("keycloak", { callbackUrl: "/dashboard" });
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Background glow */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
          <div className="absolute top-32 right-[-80px] h-72 w-72 rounded-full bg-purple-200/25 blur-3xl" />
        </div>

        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="rounded-3xl border bg-white shadow-sm p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-indigo-100 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-28 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background glow (same as AppShell) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute top-32 right-[-80px] h-72 w-72 rounded-full bg-purple-200/25 blur-3xl" />
      </div>

      {/* Top bar (same style as AppShell) */}
      <div className="sticky top-0 z-40 border-b border-gray-100 bg-white/70 backdrop-blur">
        <div className="max-w-5xl mx-auto px-3 md:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-lg tracking-tight select-none">
            <div className="relative">
              <Globe className="h-6 w-6 text-indigo-600" />
              <Map className="h-3 w-3 text-rose-500 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              PlanIt
            </span>
          </div>

          <button
            onClick={handleSignIn}
            className="inline-flex items-center justify-center rounded-2xl bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-black transition"
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Content (same container as AppShell) */}
      <main className="max-w-5xl mx-auto px-3 md:px-4 py-5 md:py-7">
        {/* Hero card wrapper */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-5 md:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm mb-5">
                <Sparkles size={16} />
                <span>The smarter way to travel</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                Plan your next{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  adventure
                </span>{" "}
                with ease.
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mt-4 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Manage itineraries, track expenses, and coordinate with friends — all in one beautiful place.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleSignIn}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                >
                  Start planning
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={scrollToFeatures}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-900 font-bold text-base hover:bg-gray-50 transition"
                >
                  Learn more
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">Sign in with Keycloak to continue.</p>
            </div>

            {/* Right */}
            <div className="lg:pl-2">
              <div className="rounded-3xl border border-gray-100 bg-gray-50/40 p-5 md:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
                    <MapPin className="text-indigo-600" size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Your trip, organized</div>
                    <div className="text-sm text-gray-500">Everything in one place</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "Itinerary Builder", desc: "Build the perfect schedule day by day." },
                    { title: "Expense Tracker", desc: "Track who paid and settle up easily." },
                    { title: "Real-time Sync", desc: "Collaborate and see updates instantly." },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-gray-100 bg-white p-4 hover:bg-gray-50 transition"
                    >
                      <div className="font-semibold text-gray-900">{f.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{f.desc}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSignIn}
                  className="mt-5 w-full px-6 py-3.5 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div ref={featuresRef} className="mt-8 md:mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              What you can do with PlanIt
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Itinerary Builder",
                desc: "Create a clear plan for each day and keep everyone aligned.",
              },
              {
                title: "Expense Tracker",
                desc: "Know who paid what and settle in seconds at the end of the trip.",
              },
              {
                title: "Real-time Sync",
                desc: "Invite friends and see updates instantly—no more messy group chats.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer inside container (coerente) */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} PlanIt. All rights reserved.
        </div>
      </main>
    </div>
  );
}