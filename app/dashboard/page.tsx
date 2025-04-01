"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Button, CircularProgress, Box, Paper } from "@mui/material";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  interface File {
    id: string;
    name: string;
    size: number;
    type: string;
  }

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user === null) {
      return;
    }
    if (!user) {
      router.push("/login");
      return;
    }
    fetchFiles();
  }, [user, router]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/files`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>Welcome, {user?.email}</Typography>
        <Button variant="contained" color="secondary" onClick={logout} sx={{ mb: 3 }}>
          Logout
        </Button>

        {/* File Upload */}
        <FileUpload onUploadSuccess={fetchFiles} />

        {/* File List */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Your Files</Typography>
          {loading ? <CircularProgress sx={{ mt: 2 }} /> : <FileList files={files} onRefresh={fetchFiles} />}
        </Box>
      </Paper>
    </Container>
  );
}
