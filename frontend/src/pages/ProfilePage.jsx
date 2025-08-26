// src/pages/ProfilePage.jsx
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserQuery } from '../redux/slices/usersApiSlice';

const ProfilePage = () => {
  // Get the user ID from the URL
  const { id: userId } = useParams();
  
  // Get the logged-in user's info from the Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Fetch the profile data using the RTK Query hook
  const { data: user, isLoading, error } = useGetUserQuery(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.data?.message || error.error}</div>;

  return (
    <div>
      {/* Banner and Profile Picture */}
      <div style={{ position: 'relative', height: '200px', background: '#ccc' }}>
        <img src={user.bannerPic} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <img src={user.profilePic} alt={user.name} style={{ position: 'absolute', top: '125px', left: '20px', width: '150px', height: '150px', borderRadius: '50%', border: '4px solid white' }} />
      </div>

      <div style={{ paddingTop: '80px', paddingLeft: '20px' }}>
        {/* Profile Header */}
        <h2>{user.name}</h2>
        {/* Conditionally render "Edit Profile" button */}
        {userInfo._id === user._id && <button>Edit Profile</button>}
        
        <p>{user.bio}</p>

        {/* Skills Section */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Skills</h3>
          {user.skills?.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '8px' }}>
              {user.skills.map((skill, index) => (
                <li key={index} style={{ background: '#e0e0e0', padding: '5px 10px', borderRadius: '15px' }}>
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p>No skills listed.</p>
          )}
        </div>

        {/* Experience Section */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Experience</h3>
          {user.experience?.length > 0 ? (
            user.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <h4>{exp.role}</h4>
                <p>{exp.company} &middot; {exp.duration}</p>
              </div>
            ))
          ) : (
            <p>No experience listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;