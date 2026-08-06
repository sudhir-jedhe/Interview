import React from 'react';
import PostList from '../../components/PostList';

const PostsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PostList />
    </div>
  );
};

export default PostsPage;

