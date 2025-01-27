/**
 * CreateProfile Component
 *
 * A React component that handles business profile creation and updates.
 * Allows businesses to set their name, description, and upload a logo.
 * Integrates with Supabase for data storage and authentication.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../hooks/useAuth.ts";
import { supabase } from "../../Account/supabase";
import { Business } from "./businessInterface";
import { Database } from "../Interfaces-types/database.types";
import NavBar from "../../NavBar";

// Constants
const MAX_DESCRIPTION_LENGTH = 65;
const BUSINESS_NAME_MAX_LENGTH = 20;

// Types
type BusinessProfile = Database["public"]["Tables"]["businesses"]["Row"];

export default function CreateProfile() {
  // State management
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  // Hooks
  const { user } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles file upload to Supabase storage
   * @param file - The file to upload
   * @returns The public URL of the uploaded file
   * @throws Error if upload fails
   */
  const uploadLogoToStorage = async (file: File): Promise<string> => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Please upload an image file (JPEG, PNG, WEBP, or GIF)");
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size must be less than 2MB");
    }

    try {
      // Create a clean filename with proper extension
      const fileExt = file.name.split(".").pop();
      const cleanFileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${cleanFileName}`; // no leading slash

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(filePath, file);

      // Check for errors
      if (uploadError) {
        throw new Error(`Failed to upload: ${uploadError.message}`);
      }

      // Get URL
      const { data } = supabase.storage.from("logos").getPublicUrl(filePath);
      if (!data?.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      return data.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred during file upload");
    }
  };

  /**
   * Handles the form submission for creating/updating business profile
   * @param event - Form submission event
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!logo) {
      alert("Please upload a logo.");
      return;
    }

    try {
      const logoUrl = await uploadLogoToStorage(logo);
      const businessData: Business = {
        business_name: name,
        description: description,
        logo: logoUrl,
        user_id: user?.id || "",
      };

      await onSubmit(businessData);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  /**
   * Handles the business profile data submission to Supabase
   * @param data - Business profile data to be submitted
   */
  const onSubmit = async (data: Business) => {
    try {
      if (!user) throw new Error("User is not logged in");

      const payload = { ...data, user_id: user.id };
      const response = profile
        ? await supabase
            .from("businesses")
            .update(payload)
            .eq("user_id", profile.user_id)
        : await supabase.from("businesses").insert(payload);

      if (response.error) throw new Error(response.error.message);

      await updateUserRole();
      navigate("/business/resumes");
    } catch (error) {
      handleError("Error creating business:", error);
    }
  };

  /**
   * Updates the user's role in Supabase auth
   */
  const updateUserRole = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { chosen_role: "business" },
    });

    if (error) throw new Error(error.message);
  };

  /**
   * Handles error logging and user notification
   */
  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    alert(`An error occurred: ${(error as Error).message || "Unknown error"}`);
  };

  /**
   * Handles logo file selection
   */
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload an image file (JPEG, PNG, WEBP, or GIF)");
      event.target.value = ""; // Reset input
      return;
    }

    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      event.target.value = ""; // Reset input
      return;
    }

    setLogo(file);
  };

  /**
   * Fetches existing business profile on component mount
   */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        return;
      }

      if (user.user_metadata.chosen_role === undefined) {
        return;
      }

      if (user.user_metadata.chosen_role === "business") {
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw new Error("Error fetching profile");
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div style={{ background: "#fff", padding: "20px" }}>
      <NavBar />
      <div
        className="container"
        style={{ position: "relative", marginTop: "50px" }}
      >
        <div
          className="d-flex justify-content-center align-items-start"
          style={{
            minHeight: "80vh",
            display: "flex",
            gap: "40px",
            marginTop: "100px",
          }}
        >
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "600px", width: "100%" }}
          >
            <h2 className="text-center mb-4">Create Profile</h2>

            {/* Name Field */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label mb-6">
                Business Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                required
                value={profile?.business_name || name}
                onChange={(e) => setName(e.target.value)}
                maxLength={BUSINESS_NAME_MAX_LENGTH}
              />
              <div id="nameSub" className="form-text text-muted">
                Max: {BUSINESS_NAME_MAX_LENGTH} characters
              </div>
            </div>

            {/* Logo Upload */}
            <div className="mb-3">
              <label htmlFor="logo" className="form-label">
                Upload Logo
              </label>
              <Box
                sx={{
                  width: "100%",
                  height: 160,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "background.paper",
                }}
              >
                {logo ? (
                  <>
                    <Box
                      component="img"
                      src={URL.createObjectURL(logo)}
                      alt="Company Logo"
                      sx={{
                        maxWidth: "80%",
                        maxHeight: "80%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        padding: 2,
                      }}
                    />
                    <IconButton
                      onClick={() => setLogo(null)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "background.paper",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                        boxShadow: 1,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                      p: 2,
                      textAlign: "center",
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 32 }} />
                    <Typography variant="body2">
                      Drag and drop or click to upload logo
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Recommended: Square image, 160x160px
                    </Typography>
                  </Box>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </Box>
            </div>

            {/* Description Field */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                placeholder="Enter a description"
                required
                value={profile?.description || description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <div id="descriptionSub" className="form-text text-muted">
                Max: {MAX_DESCRIPTION_LENGTH} characters
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-dark w-100">
              Submit
            </button>
          </form>

          {/* Profile Preview Section */}
          <div className="container">
            <h2>Profile Preview</h2>
            <div
              style={{
                maxWidth: "600px",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "8px",
                paddingRight: "1px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                height: "100px",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {logo && (
                  <img
                    src={URL.createObjectURL(logo)}
                    alt="Logo Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Ensures the image fills the container without stretching
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>
              <div>
                <h3>{name}</h3>
                <p
                  style={{
                    fontSize: "12px",
                    maxWidth: "200px", // adjust as needed
                    wordWrap: "break-word", // ensures long words break
                    overflowWrap: "break-word", // modern name for the same rule
                    whiteSpace: "normal", // ensure text can break across lines
                  }}
                >
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
