import React from "react";
import "./Profile.css";
import { getUserById } from "../../api/services/userApi";

const Profile = () => {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const fetchUserData = async () => {
        try {
          const parsedUser = JSON.parse(storedUser);
          const res = await getUserById(parsedUser.id);
          setUser(res.data?.data || {});
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page container">
      <h1 id="profile-title">Profile Page</h1>
      <br />
      <br />

      <div className="profile-card">
        <img
          src="https://i.pinimg.com/originals/a8/06/b9/a806b93eeccbc130dd9f65cf5e9df2cc.jpg"
          alt="Profile"
        />

        <h2>{user.name}</h2>
        <p>
          <b>Email: </b>
          {user.email || "-"}
        </p>
        <p>
          <b>Phone: </b>
          {user.phoneNumber || "-"}
        </p>
        <p>
          <b>Gender: </b>
          {user.gender || "-"}
        </p>
        <p>
          <b>Role: </b>
          {user.role?.roleName || "-"}
        </p>
      </div>
    </div>
  );
};

export default Profile;
