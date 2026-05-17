"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { Star, MapPin, Calendar, Quote, Loader2, Send, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { isReviewDescription } from "@/lib/form-validation";

interface Review {
  _id: string;
  userName: string;
  userImage: string;
  description: string;
  rating: number;
  slug: string;
  createdAt: string;
}

interface Trek {
  _id: string;
  title: string;
  slug: string;
}

export default function ReviewsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    description: "",
    rating: 5,
    slug: "general",
  });

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) setReviews(await res.json());
      
      const trekRes = await fetch("/api/treks");
      if (trekRes.ok) setTreks(await trekRes.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName.trim()) {
      toast({
        title: "Action Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    if (!isReviewDescription(formData.description)) {
      toast({
        title: "Check your review",
        description: "Please write at least 20 characters (up to 4000).",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({ 
          title: "Review Submitted! 🎉", 
          description: "Thank you! Your review has been submitted for moderation and will appear in the UI once approved by our team." 
        });
        setFormData({ userName: "", description: "", rating: 5, slug: "general" });
        setShowForm(false);
        fetchReviews();
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const staticReviews = [
    {
      _id: "static-1",
      userName: "Sarah Johnson",
      userImage: "/images/mountain-sunrise.jpg",
      description: "Our guide was absolutely incredible! His knowledge of the mountains, local culture, and safety protocols made our Everest Base Camp trek unforgettable. He was always checking on our wellbeing, sharing fascinating stories about Sherpa culture, and ensuring we were properly acclimatized. His English is excellent, and he has such a warm, friendly personality. I felt completely safe under his guidance. Highly recommend!",
      rating: 5,
      slug: "everest-base-camp-trek",
      createdAt: "2023-10-01T00:00:00.000Z",
    },
    {
      _id: "static-2",
      userName: "Marco Rossi",
      userImage: "/images/prayer-flags.jpg",
      description: "Best trekking experience of my life! Our guide's passion for the mountains is contagious. He knew every trail, every village, and had connections everywhere we went. The local people clearly respect and trust him. He helped us when one of our group members got altitude sickness, arranging immediate descent and medical care. His care for trekkers goes beyond just guiding - he truly cares about your experience and safety.",
      rating: 5,
      slug: "annapurna-circuit-trek",
      createdAt: "2023-09-15T00:00:00.000Z",
    },
    {
      _id: "static-3",
      userName: "Emma Thompson",
      userImage: "/images/sherpa-village.jpg",
      description: "Our guide made our Langtang Valley trek absolutely perfect. As a solo female traveler, I felt completely safe and comfortable. He's incredibly knowledgeable about flora and fauna, pointing out different plants and birds along the way. His photography tips helped me capture amazing shots! The way he interacts with local communities shows his deep respect for the culture. Already planning my next trek with him!",
      rating: 5,
      slug: "langtang-valley-trek",
      createdAt: "2023-11-20T00:00:00.000Z",
    },
  ];

  const allReviews = [...reviews, ...staticReviews];

  const averageRating = allReviews.length > 0 
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
    : 5;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-700">
                Technie Trek
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  About Me
                </Link>
                <Link href="/treks" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Trek Packages
                </Link>
                <Link href="/reviews" className="text-gray-900 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Reviews
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Contact
                </Link>
                <Link href="/booking">
                  <Button className="bg-green-700 hover:bg-green-800">Book Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Client Reviews</h1>
          <p className="text-xl text-gray-600 mb-8">
            Read what international trekkers say about their experiences with me. These authentic reviews reflect my
            commitment to safety, professionalism, and unforgettable adventures.
          </p>

          {/* Rating Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-6 w-6 ${i < Math.round(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                ))}
              </div>
              <p className="text-gray-600">Based on {allReviews.length} verified reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Review Submission Area */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            {!showForm ? (
              <Button 
                onClick={() => setShowForm(true)}
                className="w-full h-14 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Write Your Review
              </Button>
            ) : (
              <Card className="border-green-200 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <img src={formData.userName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.userName.trim())}&background=random` : "https://ui-avatars.com/api/?name=User&background=random"} alt="" className="w-12 h-12 rounded-full border-2 border-green-500" />
                      <div>
                        <h4 className="text-gray-900 font-bold">{formData.userName || "Your Name"}</h4>
                        <p className="text-xs text-gray-500">Submit your feedback</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-full">
                      <X size={20} />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Your Name *</Label>
                      <input
                        required
                        type="text"
                        value={formData.userName}
                        onChange={(e) => setFormData({...formData, userName: e.target.value})}
                        placeholder="Enter your name..."
                        className="w-full bg-white border border-gray-300 rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-green-500/50 text-gray-900"
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Which adventure are you reviewing?</Label>
                      <select 
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        className="w-full bg-white border border-gray-300 rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-green-500/50 text-gray-900"
                      >
                        <option value="general">General Experience</option>
                        {treks.map(t => <option key={t._id} value={t.slug}>{t.title}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Your Rating</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            className={`p-1 transition-all ${formData.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            <Star className="h-8 w-8 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Your Experience</Label>
                      <Textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Tell us about your journey..."
                        className="rounded-xl min-h-[120px] focus:ring-green-500 text-gray-900"
                        minLength={20}
                        maxLength={4000}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full h-12 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Submit Review <Send size={18} /></span>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-green-700" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {allReviews.map((review) => (
                <Card key={review._id} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={review.userImage}
                          alt={review.userName}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{review.userName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>

                    <Badge variant="outline" className="mb-4 bg-green-50 text-green-700 border-green-200">
                      {review.slug === "general" ? "General Experience" : review.slug.replace(/-/g, " ")}
                    </Badge>

                    <div className="relative mb-4">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-green-100" />
                      <p className="text-gray-700 leading-relaxed pl-6">{review.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Review Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Review Statistics</h2>
            <p className="text-xl text-gray-600">Breakdown of my client feedback across different aspects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-white border-none shadow-sm">
              <div className="text-3xl font-bold text-green-700 mb-2">100%</div>
              <div className="text-gray-600 mb-2">Safety Record</div>
              <div className="text-sm text-gray-500">Zero accidents in 15+ years</div>
            </Card>

            <Card className="text-center p-6 bg-white border-none shadow-sm">
              <div className="text-3xl font-bold text-green-700 mb-2">4.9★</div>
              <div className="text-gray-600 mb-2">Average Rating</div>
              <div className="text-sm text-gray-500">Across all platforms</div>
            </Card>

            <Card className="text-center p-6 bg-white border-none shadow-sm">
              <div className="text-3xl font-bold text-green-700 mb-2">95%</div>
              <div className="text-gray-600 mb-2">Repeat Clients</div>
              <div className="text-sm text-gray-500">Book additional treks</div>
            </Card>

            <Card className="text-center p-6 bg-white border-none shadow-sm">
              <div className="text-3xl font-bold text-green-700 mb-2">30+</div>
              <div className="text-gray-600 mb-2">Countries</div>
              <div className="text-sm text-gray-500">Clients from worldwide</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Own Amazing Experience?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join hundreds of satisfied trekkers who've discovered the magic of Nepal with me as their guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 h-14 px-8 rounded-xl">
                Book Your Trek
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700 bg-transparent h-14 px-8 rounded-xl"
              >
                Ask Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckCircle2({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

