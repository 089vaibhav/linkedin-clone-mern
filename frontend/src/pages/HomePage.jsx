// src/pages/HomePage.jsx
import { useGetFeedPostsQuery } from '../redux/slices/postsApiSlice';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

// --- MUI Imports ---
// Add 'Box' to this import line
import { Container, Grid, Typography, CircularProgress, Alert, Box } from '@mui/material';

const HomePage = () => {
  const { data: posts, isLoading, error } = useGetFeedPostsQuery();

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} justifyContent="center">
        <Grid size={{ xs: 12, md: 10 }}>
          <CreatePost />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">Error fetching feed. Please try again later.</Alert>
          ) : (
            <>
              {posts && posts.length > 0 ? (
                posts.map((post) => <Post key={post._id} post={post} />)
              ) : (
                <Typography>Your feed is empty. Connect with others to see their posts!</Typography>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;