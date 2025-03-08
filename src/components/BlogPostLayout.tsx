
import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BlogPostLayout: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const currentPost = blogPosts.find(post => post.slug === slug);
  
  // Get 3 related posts, excluding the current one
  const relatedPosts = blogPosts
    .filter(post => post.slug !== slug)
    .slice(0, 3);
  
  if (!currentPost) {
    return <Navigate to="/blog" replace />;
  }
  
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to all articles
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">{currentPost.title}</h1>
        
        <div className="flex items-center text-muted-foreground mb-8">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{currentPost.date}</span>
        </div>
        
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
          <img 
            src={currentPost.imageUrl} 
            alt={currentPost.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: currentPost.content }} />
        
        {/* Related Posts Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(post => (
              <Card key={post.id} className="overflow-hidden">
                <div className="aspect-video">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="group p-0">
                    <Link to={`/blog/${post.slug}`}>
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostLayout;
