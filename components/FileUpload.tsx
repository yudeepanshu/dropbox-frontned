"use client";

import { useState } from "react";
import axios from "axios";
import { Button, CircularProgress, Typography, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth } from "./context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FileUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload.");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully!");
      setFile(null);
      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3, borderRadius: 2, textAlign: "center", boxShadow: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload a File
      </Typography>
      <input 
        type="file" 
        onChange={handleFileChange} 
        style={{ marginBottom: "10px", display: "block", margin: "0 auto" }}
      />
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={handleUpload}
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : "Upload"}
      </Button>
    </Paper>
  );
}
