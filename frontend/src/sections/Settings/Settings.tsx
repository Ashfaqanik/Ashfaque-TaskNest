import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import styles from "./Settings.module.scss";
import { useAppSelector } from "../../store/redux";
import axios from "axios";
import { Camera } from "lucide-react";
import { useGetProfileQuery, useUpdateUserMutation } from "../../state/api";

const Settings = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    teamId: 0,
    roleName: "",
    profileImage: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        teamId: user.teamId || 0,
        roleName: user.role || "",
        profileImage: user.image || "/default.png",
      });
      setImagePreview(user.image || "/default.png");
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user)
    return <div>An error occurred while fetching user data.</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    let uploadedImageUrl = formData.profileImage;

    // UploadING image to Cloudinary if a new file is selected
    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);
      imageFormData.append("upload_preset", "taskmanagy");

      try {
        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/dpabqdea9/image/upload",
          imageFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        uploadedImageUrl = data.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        return;
      }
    }

    try {
      await updateUser({
        data: {
          username: formData.username,
          email: formData.email,
          teamId: formData.teamId,
          image: uploadedImageUrl,
          role: formData.roleName,
        },
      }).unwrap();

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <Header name="Settings" />
      <div className={styles.formContainer}>
        {/* Image */}
        <div className={styles.imageContainer}>
          <label htmlFor="profileImage" className={styles.imageLabel}>
            <img src={imagePreview} alt="" className={styles.profileImage} />
            <div className={styles.overlay}>
              <div className={styles.editIcon}>
                <Camera size={20} color="#fff" />
              </div>
            </div>
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.imageInput}
          />
        </div>

        {/* Username Field */}
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}
          />
        </div>

        {/* Team ID Field */}
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Team ID
          </label>
          <input
            type="text"
            name="teamId"
            value={formData.teamId}
            onChange={handleInputChange}
            className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}
          />
        </div>

        {/* Role Field */}
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Role
          </label>
          <input
            type="text"
            name="roleName"
            value={formData.roleName}
            onChange={handleInputChange}
            className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className={styles.updateButton}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
