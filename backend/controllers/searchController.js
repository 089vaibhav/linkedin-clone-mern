// backend/controllers/searchController.js
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

// @desc    Search for users and posts
// @route   GET /api/search?q=query
// @access  Private
const search = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  // Use the $text operator to perform the search on our indexed fields
  const users = await User.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } } // Sort by relevance
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(10)
  .select('name profilePic bio');

  const posts = await Post.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(10)
  .populate('user', 'name profilePic');
  
  res.status(200).json({ users, posts });
};

export { search };