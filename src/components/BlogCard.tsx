
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  slug: string;
  content: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 border-gray-200">
      <div className="overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-48 object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardHeader className="pb-1 pt-4">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{post.date}</span>
        </div>
        <CardTitle className="text-xl font-bold tracking-tight mb-1">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <CardDescription className="text-sm text-gray-600 line-clamp-3">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80 hover:bg-transparent group">
          <Link to={`/blog/${post.slug}`} className="flex items-center">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
