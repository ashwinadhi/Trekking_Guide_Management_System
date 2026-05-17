"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Star, Trash2, Loader2, MessageSquare, User, Tag, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Review {
  _id: string;
  userName: string;
  userImage: string;
  description: string;
  rating: number;
  slug: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews?moderation=true");
      if (res.ok) setReviews(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      if (res.ok) {
        toast({ title: "Approved! 🎉", description: "Review has been approved and is now live on the website." });
        fetchReviews();
      } else {
        throw new Error("Failed to approve review");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Success", description: "Review deleted successfully" });
        fetchReviews();
      } else {
        throw new Error("Failed to delete review");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mb-4" />
        <p className="text-gray-400 font-medium">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Reviews</h1>
          <p className="text-gray-400 mt-1">Moderate user feedback and testimonials</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1">
          {reviews.length} Total Reviews
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => (
          <Card key={review._id} className="bg-gray-900 border-gray-800 hover:border-emerald-500/30 transition-all overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* User Info */}
                <div className="md:w-48 flex-shrink-0 flex items-center md:flex-col md:text-center gap-4">
                  <img 
                    src={review.userImage} 
                    alt={review.userName} 
                    className="w-16 h-16 rounded-2xl border-2 border-emerald-500/20"
                  />
                  <div>
                    <h3 className="text-white font-bold text-sm truncate w-full">{review.userName}</h3>
                    <div className="flex items-center md:justify-center gap-1 mt-1 text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                 {/* Content */}
                <div className="flex-grow space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 flex items-center gap-1">
                      <Tag size={12} /> {review.slug}
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(review.createdAt).toLocaleDateString()}
                    </Badge>
                    <Badge variant="secondary" className={`flex items-center gap-1 border-none ${review.isApproved ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-amber-950/60 text-amber-400 border border-amber-900"}`}>
                      {review.isApproved ? "Approved & Live" : "Pending Approval"}
                    </Badge>
                  </div>
                  
                  <div className="relative">
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      "{review.description}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col justify-end gap-2 items-end md:items-stretch">
                  {!review.isApproved && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleApprove(review._id)}
                      className="rounded-xl h-10 px-3 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold text-xs"
                    >
                      <Check size={16} /> Approve
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDelete(review._id)}
                    className="rounded-xl h-10 w-10 hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-20 bg-gray-900/50 border border-dashed border-gray-800 rounded-[2rem]">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-700 mb-4" />
            <p className="text-gray-500">No reviews found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
