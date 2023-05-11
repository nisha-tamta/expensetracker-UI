import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "../css/NavBar.css";
import "../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const [resetStatus, setResetStatus] = useState(""); // State to store reset status
  const [oldPassword, setOldPassword] = useState(""); // State to store old password
  const [newPassword, setNewPassword] = useState(""); // State to store new password
  const [showResetForm, setShowResetForm] = useState(false); // State to determine if reset form should be shown
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/user/${userId}`
          ); // Use userId in the API endpoint
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            const errorMessage = `Failed to fetch user: ${response.status} - ${response.statusText}`;
            setError(errorMessage);
          }
        } catch (error) {
          setError(`Error during fetching user: ${error.message}`);
        }
      };
      fetchUser();
    }
  }, []);

  const handleResetPassword = async () => {
    const username = JSON.parse(localStorage.getItem("user")).username;
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const response = await fetch("http://localhost:8080/api/user/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });
      setResetStatus("Success");
      setShowResetForm(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleSaveButtonClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/create`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      if (response.ok) {
        setEditable(false);
        const data = await response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        const errorMessage = `Failed to save user: ${response.status} - ${response.statusText}`;
        setError(errorMessage);
      }
    } catch (error) {
      setError(`Error during saving user: ${error.message}`);
    }
  }

  const handleResetButtonClick = () => {
    setShowResetForm(true);
  };

  const handleCancelResetButtonClick = () => {
    setShowResetForm(false);
  };

  return (
    <div className="homescreen-container">
      <NavBar />
      <div className="content-container">
        <div className="content-header">
          <h1>Profile</h1>
        </div>
        <div>
          {!editable && <button
            onClick={() => setEditable(true)}
            className="edit-button">Edit</button>}
        </div>
        <div className="content-body">
          {user ? (
            <div className="consumer-profile-container">
              <div className="consumer-profile-item">
                <h2>First Name:</h2>
                {editable ? (
                  <input type="text" value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  />) : (
                  <p>{user.firstName}</p>
                )}
              </div>
              <div className="consumer-profile-item">
                <h2>Last Name:</h2>
                {editable ? (
                  <input type="text" value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  />
                ) : (
                  <p>{user.lastName}</p>
                )}
              </div>
              <div className="consumer-profile-item">
                <h2>Username:</h2>
                {editable ? (
                  <input type="text" value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                  />
                ) : (
                  <p>{user.username}</p>
                )}
              </div>
              <div className="consumer-profile-item">
                <h2>Phone Number:</h2>
                {editable ? (
                  <input type="text" value={user.phoneNumber}
                    onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                  />
                ) : (
                  <p>{user.phoneNumber}</p>
                )}
              </div>
              <div className="consumer-profile-item">
                <h2>Email Address:</h2>
                {editable ? (
                  <input type="email" value={user.emailAddress}
                    onChange={(e) => setUser({ ...user, emailAddress: e.target.value })}
                  />
                ) : (
                  <p>{user.emailAddress}</p>
                )}
              </div>
              <div className="consumer-profile-item">
                <h2>Default Budget:</h2>
                {editable ? (
                  <input type="number" value={user.defaultBudget}
                    onChange={(e) => setUser({ ...user, defaultBudget: e.target.value })}
                  />
                ) : (
                  <p>{user.defaultBudget}</p>
                )}
              </div>
              <div className="consumer-profile-item">
                {editable ? (
                  <button onClick={handleSaveButtonClick} className="reset-password-form-button" >Save</button>
                ) : (
                  <></>
                )}
              </div>
              <div className="consumer-profile-item">
                <div>
                  {showResetForm ? (
                    // Render the password reset form
                    <div className="password-reset-form">
                      <h2>Password</h2>
                      <div>
                        <label>Old Password:</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>New Password:</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <button onClick={handleResetPassword} className="reset-password-form-button" >Reset Password</button>
                        <button onClick={handleCancelResetButtonClick} className="reset-password-form-button" >Cancel</button>
                      </div>
                      <div>
                        <p>{resetStatus}</p>
                      </div>
                    </div>
                  ) : (
                    <button onClick={handleResetButtonClick} className="reset-password-button" >Reset Password</button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
