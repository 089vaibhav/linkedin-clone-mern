// src/pages/NetworkPage.jsx
import {
  useGetPendingRequestsQuery,
  useAcceptRequestMutation,
  useRejectRequestMutation,
} from '../redux/slices/usersApiSlice';

const NetworkPage = () => {
  // Fetch pending requests
  const { data: requests, isLoading, error } = useGetPendingRequestsQuery();
  
  // Get mutation hooks
  const [acceptRequest] = useAcceptRequestMutation();
  const [rejectRequest] = useRejectRequestMutation();

  const handleAccept = async (userId) => {
    try {
      await acceptRequest(userId).unwrap();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectRequest(userId).unwrap();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  if (isLoading) return <div>Loading invitations...</div>;
  if (error) return <div>Error fetching invitations.</div>;

  return (
    <div>
      <h2>My Network</h2>
      <div className='invitations-section'>
        <h3>Invitations</h3>
        {requests?.length > 0 ? (
          requests.map((req) => (
            <div key={req._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <img src={req.profilePic} alt={req.name} width="50" height="50" style={{ borderRadius: '50%', marginRight: '1rem' }} />
                <span>{req.name}</span>
                <p style={{ color: '#555', fontSize: '0.9rem' }}>{req.bio}</p>
              </div>
              <div>
                <button onClick={() => handleReject(req._id)} style={{ marginRight: '0.5rem' }}>Ignore</button>
                <button onClick={() => handleAccept(req._id)}>Accept</button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending invitations.</p>
        )}
      </div>
    </div>
  );
};

export default NetworkPage;