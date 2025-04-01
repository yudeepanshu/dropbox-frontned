"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Container, Typography, Button, Box } from "@mui/material";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [user, router]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>Welcome to the App</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please log in or sign up to continue.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" color="primary" component={Link} href="/login">
          Login
        </Button>
        <Button variant="outlined" color="primary" component={Link} href="/signup">
          Sign Up
        </Button>
      </Box>
    </Container>
  );
}
