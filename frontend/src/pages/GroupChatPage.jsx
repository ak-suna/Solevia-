
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrivateChatModal from "../components/PrivateChatModal";
import { getMyPeerConnections } from "../services/communityService";
import { jwtDecode } from "jwt-decode";

const GroupChatPage = () => {
  const { groupId, connectionId } = useParams();
  const navigate = useNavigate();
  const [connection, setConnection] = useState(null);

  // Get current user ID
  const token = localStorage.getItem("token");
  const currentUserId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    getMyPeerConnections(groupId).then(data => {
      const found = data.connections?.find(c => c._id === connectionId);
      setConnection(found);
    });
  }, [groupId, connectionId]);

  if (!connection) {
    return <div className="min-h-screen flex items-center justify-center">Loading chat...</div>;
  }

  return (
    <PrivateChatModal
      connection={connection}
      currentUserId={currentUserId}
      onClose={() => navigate(-1)}
      isPage
    />
  );
};

export default GroupChatPage;
