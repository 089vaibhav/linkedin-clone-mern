// src/components/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLazySearchQuery } from '../redux/slices/searchApiSlice';
import useDebounce from '../hooks/useDebounce';

// --- MUI Imports ---
import { TextField, Menu, MenuItem, ListItemText, ListItemAvatar, Avatar, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const searchRef = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [triggerSearch, { data: searchData, isLoading }] = useLazySearchQuery();

  useEffect(() => {
    if (debouncedSearchTerm) {
      triggerSearch(debouncedSearchTerm);
      setAnchorEl(searchRef.current);
    } else {
      setAnchorEl(null);
    }
  }, [debouncedSearchTerm, triggerSearch]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <div ref={searchRef}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: { backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 1 }
        }}
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {isLoading && <MenuItem>Loading...</MenuItem>}
        {searchData?.users.map((user) => (
          <MenuItem key={user._id} component={Link} to={`/profile/${user._id}`} onClick={handleClose}>
            <ListItemAvatar><Avatar src={user.profilePic} /></ListItemAvatar>
            <ListItemText primary={user.name} secondary="User" />
          </MenuItem>
        ))}
        {searchData?.posts.map((post) => (
          <MenuItem key={post._id} onClick={handleClose}>
            {/* Ideally link to a single post page, which we haven't built yet */}
            <ListItemText primary={`Post: "${post.content.substring(0, 30)}..."`} secondary={`by ${post.user.name}`} />
          </MenuItem>
        ))}
        {debouncedSearchTerm && !isLoading && searchData?.users.length === 0 && searchData?.posts.length === 0 && (
          <MenuItem>No results found.</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default SearchBar;