
import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { blogContents } from "@/data/blogContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ArrowUpRight } from "lucide-react";

const BlogPostLayout: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Find the blog post in our data
  const post = blogPosts.find(post => post.slug === slug);
  const content = slug ? blogContents[slug] : null;
  
  useEffect(() => {
    // If post doesn't exist, redirect to blog listing
    if (!post || !content) {
      navigate("/blog");
    }
    
    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [post, content, navigate]);
  
  if (!post || !content) {
    return null;
  }
  
  // Get related posts data
  const relatedPosts = content.relatedPosts
    .map(id => blogPosts.find(post => post.slug === id))
    .filter(Boolean);
  
  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <Link to="/blog">
          <Button variant="ghost" className="mb-6 -ml-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{post.date}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{post.title}</h1>
        
        <div className="w-full rounded-xl overflow-hidden aspect-video mb-8">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="prose prose-lg max-w-none dark:prose-invert mb-12" 
        dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content.content) }}>
      </div>
      
      {relatedPosts.length > 0 && (
        <div className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              relatedPost && (
                <div key={relatedPost.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="overflow-hidden aspect-video">
                    <img 
                      src={relatedPost.imageUrl} 
                      alt={relatedPost.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <Link 
                      to={`/blog/${relatedPost.slug}`} 
                      className="text-primary flex items-center text-sm font-medium hover:underline"
                    >
                      Read Article
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
      
      <div className="my-20 p-8 bg-secondary/30 rounded-xl shadow-sm text-center">
        <h3 className="text-2xl font-bold mb-4">Transform Your Videos with Vision Grade</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Ready to try AI-powered LUTs for yourself? Create custom color grades for your videos 
          with just a text description.
        </p>
        <Button asChild size="lg">
          <Link to="/generator">Try Vision Grade Free</Link>
        </Button>
      </div>
    </div>
  );
};

// Simple function to convert markdown to HTML
// In a real app, you would use a proper markdown library
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold my-6">$1</h2>');
  html = html.replace(/### (.*?)$/gm, '<h3 class="text-xl font-bold my-4">$1</h3>');
  
  // Convert paragraphs
  html = html.replace(/(?:^|\n)(?!<h2|<h3|<p|<blockquote|<div|<img|\s*$)(.*?)(?=\n\n|\n<h2|\n<h3|$)/gs, '<p class="mb-4">$1</p>');
  
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italics
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert blockquotes
  html = html.replace(/> (.*?)(\n|$)/g, '<blockquote class="border-l-4 border-primary/20 pl-4 italic my-6">$1</blockquote>');
  
  // Convert images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="my-8"><img src="$2" alt="$1" class="rounded-lg w-full" /></div>');
  
  // Convert links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
  
  return html;
}

export default BlogPostLayout;
