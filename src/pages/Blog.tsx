
import React, { useState } from "react";
import { BlogCard } from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter posts based on search query
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Vision Grade Blog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover insights, tips, and tutorials on using AI-powered LUTs to transform your video and photo editing workflow.
        </p>
      </div>
      
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">Try a different search term or browse all our articles below.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
      
      <div className="mt-20 p-8 bg-secondary/30 rounded-xl shadow-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Transform Your Videos with Vision Grade</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Ready to try AI-powered LUTs for yourself? Create custom color grades for your videos 
          with just a text description.
        </p>
        <a href="/generator" className="inline-flex items-center justify-center h-10 px-6 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-colors">
          Try Vision Grade Free
        </a>
      </div>
    </div>
  );
};

export default Blog;
