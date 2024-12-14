import React from "react";
import Profile from "../../components/Profile";
import { updateUserPro, updateUserProfile } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const ModeratorProfile = () => {
  const dispatch = useDispatch();
  const handleProfileUpdate = ({ data, id }) => {
    console.log(data);
    dispatch(updateUserProfile({ data, id })).then((res) =>
      updateUserPro(res.payload.data)
    );
  };
  return (
    <>
      <Profile onUpdateProfile={handleProfileUpdate} />
    </>
  );
};

export default ModeratorProfile;
