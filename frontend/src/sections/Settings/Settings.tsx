import React, { useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Settings.module.scss";
import { useAppSelector } from "../../store/redux";
import axios from "axios";
import { Camera, Eye, EyeClosed } from "lucide-react";

const Settings = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [userSettings, setUserSettings] = useState({
    username: "johndoe",
    email: "john.doe@example.com",
    teamId: 1,
    roleName: "Developer",
    profileImage: "",
  });

  const [formData, setFormData] = useState({
    username: userSettings.username,
    email: userSettings.email,
    teamId: userSettings.teamId,
    roleName: userSettings.roleName,
    password: "123456",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/p1.jpeg");

  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    let uploadedImageUrl = userSettings.profileImage;

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

    // Update user settings
    setUserSettings({
      ...formData,
      profileImage: uploadedImageUrl,
    });

    alert("Profile updated successfully!");
  };

  return (
    <div className={styles.settingsContainer}>
      <Header name="Settings" />
      <div className={styles.formContainer}>
        {/* Profile Image */}
        <div className={styles.imageContainer}>
          <label htmlFor="profileImage" className={styles.imageLabel}>
            <img
              src={imagePreview}
              alt="Profile"
              className={styles.profileImage}
            />
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

        {/* Form Fields */}
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
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Team Id
          </label>
          <input
            type="text"
            name="teamId"
            value={formData.teamId}
            onChange={handleInputChange}
            className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}
          />
        </div>
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

        {/* Password Field */}
        <div>
          <label
            className={`${styles.labelStyle} ${isDarkMode ? styles.dark : ""}`}
          >
            Password
          </label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.input} ${isDarkMode ? styles.dark : ""}`}
            />
            <div
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>

        {/* Update Button */}
        <button onClick={handleUpdate} className={styles.updateButton}>
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Settings;
