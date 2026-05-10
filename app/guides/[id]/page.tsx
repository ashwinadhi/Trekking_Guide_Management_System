"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, MessageCircle, Languages, Calendar, Users, Award, Shield, Loader2, ArrowLeft, DollarSign, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Guide {
  _id: string;
  name: string;
  profileImage: string;
  description: string;
  about: string;
  services: string[];
  yearsExperience: number;
  languages: string[];
  availability: string;
  price: number;
  gallery: string[];
  reviews: { user: string; comment: string; rating: number }[];
  createdAt: string;
}

export default function GuideProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGuide() {
      try {
        const res = await fetch(`/api/guides/${id}`);
        if (!res.ok) { setError(res.status === 404 ? "Guide not found" : "Failed to load"); return; }
        setGuide(await res.json());
      } catch { setError("Failed to load guide"); }
      finally { setLoading(false); }
    }
    if (id) fetchGuide();
  }, [id]);

  const avgRating = (reviews: Guide["reviews"]) => {
    if (!reviews.length) return "0";
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  };

  if (loading) return (
    <div className="min-h-screen"><Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4"><Loader2 className="h-10 w-10 animate-spin text-emerald-600" /><p className="text-gray-500 text-lg">Loading guide profile...</p></div>
      </div><Footer />
    </div>
  );

  if (error || !guide) return (
    <div className="min-h-screen"><Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">{error || "Guide not found"}</h2>
          <Link href="/guides"><Button className="bg-emerald-700 hover:bg-emerald-800"><ArrowLeft className="mr-2 h-4 w-4" />Back to Guides</Button></Link>
        </div>
      </div><Footer />
    </div>
  );

  const availColor = guide.availability === "Available" ? "bg-green-600" : guide.availability === "On Trek" ? "bg-amber-600" : "bg-red-600";

  return (
    <div className="min-h-screen">
      <Header />

      {/* Guide Header */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative">
                  {guide.profileImage ? (
                    <img src={guide.profileImage} alt={guide.name} className="w-48 h-48 rounded-lg shadow-lg object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                  ) : (
                    <div className="w-48 h-48 rounded-lg shadow-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <Users className="h-16 w-16 text-emerald-300" />
                    </div>
                  )}
                  <Badge className={`absolute -top-2 -right-2 ${availColor} text-white`}>
                    {guide.availability}
                  </Badge>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{guide.name}</h1>

                  <div className="flex items-center gap-4 mb-4">
                    {guide.reviews.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-bold">{avgRating(guide.reviews)}</span>
                        <span className="text-gray-600">({guide.reviews.length} reviews)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{guide.yearsExperience} years experience</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{guide.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.services.map((s, i) => (
                      <Badge key={i} variant="secondary">{s}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-gray-400" />
                    <div className="flex flex-wrap gap-1.5">
                      {guide.languages.map((lang, i) => (
                        <span key={i} className="px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-700 mb-1">${guide.price}</div>
                    <div className="text-gray-600">per day</div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-600" /><span className="text-sm">Verified & Licensed</span></div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-green-600" /><span className="text-sm">Flexible Scheduling</span></div>
                    <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-green-600" /><span className="text-sm">Direct Communication</span></div>
                  </div>
                  <div className="space-y-3">
                    <Link href={`/booking?guide=${guide._id}`}>
                      <Button className="w-full bg-green-700 hover:bg-green-800">Book This Guide</Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full bg-transparent mt-2">
                        <MessageCircle className="h-4 w-4 mr-2" /> Send Message
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-8">
              <Card>
                <CardHeader><CardTitle>About {guide.name}</CardTitle></CardHeader>
                <CardContent>
                  {guide.about ? (
                    <div className="space-y-4">
                      {guide.about.split(/\n\n|\n/).filter(p => p.trim()).map((p, i) => (
                        <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No detailed about section yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-8">
              <Card>
                <CardHeader><CardTitle>Services Offered</CardTitle></CardHeader>
                <CardContent>
                  {guide.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {guide.services.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No services listed yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              {guide.reviews.length > 0 ? (
                <div className="space-y-6">
                  {guide.reviews.map((review, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-700 font-bold text-sm">{review.user.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.user}</h4>
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className={`h-4 w-4 ${j < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card><CardContent className="p-6 text-center text-gray-500">No reviews yet.</CardContent></Card>
              )}
            </TabsContent>

            <TabsContent value="gallery" className="mt-8">
              {guide.gallery.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guide.gallery.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt={`Gallery ${i + 1}`}
                        className="w-full h-56 object-cover rounded-lg shadow-md hover:shadow-lg transition-all group-hover:scale-[1.02] duration-300"
                        onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <Card><CardContent className="p-6 text-center text-gray-500">No gallery images yet.</CardContent></Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
