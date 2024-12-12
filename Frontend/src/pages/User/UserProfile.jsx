import React from "react";
import Profile from "../../components/Profile";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPro, updateUserProfile } from "../../redux/slices/userSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const handleProfileUpdate = ({ name, email, id }) => {
    console.log(name, email);
    dispatch(updateUserProfile({ name, email, id })).then((res) =>
      updateUserPro(res.payload.data)
    );
  };
  return (
    <>
      <Profile onUpdateProfile={handleProfileUpdate} />
    </>
  );
};

export default UserProfile;
