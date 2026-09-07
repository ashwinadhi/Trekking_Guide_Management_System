"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Clock, DollarSign, Mountain, Calendar, MapPin, Loader2, CheckCircle,
  TrendingUp, Home, Sun, Image as ImageIcon, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Guide {
  _id: string;
  name: string;
  profileImage: string;
  description: string;
}

interface Trek {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  trekInfo: { difficulty: string; maxElevation: string; accommodation: string; bestSeason: string };
  gallery: string[];
  guideId: Guide | null;
  createdAt: string;
}

export default function TrekDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trek, setTrek] = useState<Trek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  useEffect(() => {
    async function fetchTrek() {
      try {
        const res = await fetch(`/api/treks/${id}`);
        if (!res.ok) {
          if (res.status === 404) setError("Trek not found");
          else throw new Error("Failed to fetch trek");
          return;
        }
        const data = await res.json();
        setTrek(data);
      } catch (err) { setError("Failed to load trek details"); }
      finally { setLoading(false); }
    }
    if (id) fetchTrek();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-gold" />
            <p className="text-stone text-lg">Loading trek details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !trek) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Mountain className="h-16 w-16 text-stone mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-ivory mb-2">{error || "Trek not found"}</h2>
            <p className="text-stone mb-6">This trek may have been removed or the link might be incorrect.</p>
            <Link href="/treks">
              <Button className="bg-gold hover:bg-gold/90"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Treks</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const descriptionParagraphs = trek.description.split(/\n\n|\n/).filter((p) => p.trim().length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[28rem] md:h-[32rem]">
        {trek.image ? (
          <img src={trek.image} alt={trek.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ink to-card flex items-center justify-center">
            <Mountain className="h-32 w-32 text-gold/50/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-6 left-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm text-white rounded-xl hover:bg-black/50 transition-all border border-white/10">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/20 backdrop-blur-sm text-stone rounded-full text-sm font-medium border border-gold/30">
                <Clock className="h-3.5 w-3.5" /> {trek.duration}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card/10 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/10">
                <DollarSign className="h-3.5 w-3.5" /> ${trek.price.toLocaleString()} per person
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{trek.title}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Highlights */}
            {trek.highlights && trek.highlights.length > 0 && (
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-card text-white">
                <CardHeader className="px-6 py-5 border-b border-gold/20">
                  <CardTitle className="text-xl flex items-center gap-2 text-ivory">
                    <CheckCircle className="h-5 w-5 text-gold" /> Trek Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trek.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-ivory leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Trek Overview */}
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-card px-6 py-5">
                <CardTitle className="text-xl flex items-center gap-2"><Mountain className="h-5 w-5 text-gold" /> Trek Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose  max-w-none">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-stone leading-relaxed mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Itinerary */}
            {trek.itinerary && trek.itinerary.length > 0 && (
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b bg-card px-6 py-5">
                  <CardTitle className="text-xl flex items-center gap-2"><MapPin className="h-5 w-5 text-gold" /> Detailed Itinerary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gold/10">
                    {trek.itinerary.map((day) => (
                      <div key={day.day} className="group">
                        <button onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)} className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-background transition-colors text-left">
                          <div className="flex items-center gap-4">
                            <span className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">D{day.day}</span>
                            <span className="font-semibold text-ivory">{day.title}</span>
                          </div>
                          <div className={`transform transition-transform ${expandedDay === day.day ? "rotate-180" : ""}`}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-stone">
                              <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </button>
                        {expandedDay === day.day && (
                          <div className="px-6 pb-6 pt-2 bg-card">
                            <div className="pl-16 text-stone leading-relaxed border-l-2 border-gold/20 ml-6 pb-2">
                              {day.description}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {trek.gallery && trek.gallery.length > 0 && (
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b bg-card px-6 py-5">
                  <CardTitle className="text-xl flex items-center gap-2"><ImageIcon className="h-5 w-5 text-gold" /> Photo Gallery</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {trek.gallery.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img src={img} alt={`${trek.title} gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Booking Card */}
            <Card className="sticky top-6 h-fit shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-ink to-card px-6 py-8 text-center">
                <div className="text-4xl font-bold text-white mb-1">${trek.price.toLocaleString()}</div>
                <div className="text-stone text-sm">per person</div>
              </div>
              <CardContent className="p-6">
                
                {/* Quick Info Box */}
                {trek.trekInfo && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-background p-3 rounded-xl border border-gold/15">
                      <TrendingUp className="h-5 w-5 text-gold mb-1" />
                      <div className="text-xs text-stone uppercase tracking-wider font-semibold">Difficulty</div>
                      <div className="font-medium text-ivory">{trek.trekInfo.difficulty || "Moderate"}</div>
                    </div>
                    <div className="bg-background p-3 rounded-xl border border-gold/15">
                      <Mountain className="h-5 w-5 text-gold mb-1" />
                      <div className="text-xs text-stone uppercase tracking-wider font-semibold">Max Elevation</div>
                      <div className="font-medium text-ivory">{trek.trekInfo.maxElevation || "N/A"}</div>
                    </div>
                    <div className="bg-background p-3 rounded-xl border border-gold/15">
                      <Home className="h-5 w-5 text-gold mb-1" />
                      <div className="text-xs text-stone uppercase tracking-wider font-semibold">Accommodation</div>
                      <div className="font-medium text-ivory">{trek.trekInfo.accommodation || "Tea House"}</div>
                    </div>
                    <div className="bg-background p-3 rounded-xl border border-gold/15">
                      <Sun className="h-5 w-5 text-gold mb-1" />
                      <div className="text-xs text-stone uppercase tracking-wider font-semibold">Best Season</div>
                      <div className="font-medium text-ivory">{trek.trekInfo.bestSeason || "Any"}</div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-stone"><Clock className="h-4 w-4" /> Duration</div>
                    <span className="font-medium text-ivory">{trek.duration}</span>
                  </div>
                </div>

                <Link href="/booking" className="block">
                  <Button className="w-full py-6 text-lg">
                    Book This Trek
                  </Button>
                </Link>
                <div className="mt-4 text-center">
                  <Link href="/contact" className="text-gold hover:text-gold text-sm font-medium">Have questions? Contact me →</Link>
                </div>
              </CardContent>
            </Card>

            {/* Guide Section */}
            {trek.guideId && (
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                <CardHeader className="border-b border-gray-700/50 bg-gray-900/50 px-6 py-5">
                  <CardTitle className="text-lg flex items-center gap-2 text-gold">
                    <User className="h-5 w-5" /> Your Assigned Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-gold/30">
                    {trek.guideId.profileImage ? (
                      <img src={trek.guideId.profileImage} alt={trek.guideId.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    ) : (
                      <div className="w-full h-full bg-card flex items-center justify-center"><User className="h-10 w-10 text-ivory0" /></div>
                    )}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{trek.guideId.name}</h3>
                  <p className="text-sm text-stone mb-4 line-clamp-3">{trek.guideId.description}</p>
                  <Link href={`/guides/${trek.guideId._id}`}>
                    <Button variant="outline" className="w-full border-gray-600 text-stone hover:bg-gray-800 hover:text-white bg-transparent">View Full Profile</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
