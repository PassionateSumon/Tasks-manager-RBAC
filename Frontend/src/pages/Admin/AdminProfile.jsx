import React from "react";
import Profile from "../../components/Profile";
import { useDispatch } from "react-redux";
import { updateUserPro, updateUserProfile } from "../../redux/slices/authSlice";

const AdminProfile = () => {
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

export default AdminProfile;
