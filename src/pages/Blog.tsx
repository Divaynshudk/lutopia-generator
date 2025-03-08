
import React from "react";
import { BlogCard, BlogPost } from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";

const Blog: React.FC = () => {
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Vision Grade Blog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover insights, tips, and tutorials on using AI-powered LUTs to transform your video and photo editing workflow.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
