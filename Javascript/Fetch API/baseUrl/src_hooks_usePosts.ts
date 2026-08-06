import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

interface Post {
  id: number;
  title: string;
  body: string;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiRequest<Post[]>('get', '/posts');
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

