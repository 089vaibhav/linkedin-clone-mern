// src/pages/HomePage.jsx
import { useGetFeedPostsQuery } from '../redux/slices/postsApiSlice';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

const HomePage = () => {
  const { data: posts, isLoading, error } = useGetFeedPostsQuery();

  if (isLoading) return <div>Loading feed...</div>;
  if (error) return <div>Error fetching feed. Please try again later.</div>;

  return (
    <div>
      <CreatePost />
      <h2>Home Feed</h2>
      <div className="feed-container">
        {posts && posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>Your feed is empty. Connect with others to see their posts!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;