import { useState } from "react";
import { Card, CardContent, Typography, IconButton, Box, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Download, Delete, Visibility } from "@mui/icons-material";
import { useAuth } from "@/components/context/AuthContext";

interface FileListProps {
  files: any[];
  onRefresh: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FileList({ files, onRefresh }: FileListProps) {
  const { user } = useAuth();
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const res = await fetch(`${API_URL}/files/download/${fileId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (!res.ok) throw new Error("Failed to download file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const res = await fetch(`${API_URL}/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (!res.ok) throw new Error("Failed to delete file");

      alert("File deleted successfully!");
      onRefresh();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  const handlePreview = async (fileId: string, fileType: string) => {
    try {
      const res = await fetch(`${API_URL}/files/download/${fileId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (!res.ok) throw new Error("Failed to load preview");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setPreviewFile(url);
      setPreviewType(fileType);
    } catch (error) {
      console.error("Error previewing file:", error);
      alert("Error previewing file");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {files.length === 0 ? (
        <Typography>No files found.</Typography>
      ) : (
        files.map((file) => {
          const fileExtension = file.name.split(".").pop()?.toLowerCase();
          const isImage = ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExtension || "");
          const isPDF = fileExtension === "pdf";
          const isText = ["txt", "json", "csv"].includes(fileExtension || "");

          return (
            <Card key={file.id} sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6">{file.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`${(file.size / 1024).toFixed(2)} KB`}
                  </Typography>
                </Box>
                <Box>
                  {isImage || isPDF || isText ? (
                    <IconButton
                      color="primary"
                      onClick={() => handlePreview(file.id, fileExtension || "")}
                      sx={{ mr: 1, "&:hover": { color: "blue" } }}
                    >
                      <Visibility />
                    </IconButton>
                  ) : null}
                  <IconButton
                    color="primary"
                    onClick={() => handleDownload(file.id, file.name)}
                    sx={{ mr: 1, "&:hover": { color: "blue" } }}
                  >
                    <Download />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(file.id)}
                    sx={{ "&:hover": { color: "red" } }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Preview Modal */}
      <Dialog open={!!previewFile} onClose={() => setPreviewFile(null)} maxWidth="md" fullWidth>
        <DialogTitle>File Preview</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          {previewType === "pdf" ? (
            <iframe src={previewFile || ""} width="100%" height="500px" />
          ) : previewType && ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(previewType) ? (
            <img src={previewFile || ""} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
          ) : previewType && ["txt", "json", "csv"].includes(previewType) ? (
            <iframe src={previewFile || ""} width="100%" height="300px" />
          ) : (
            <Typography>Preview not available for this file type.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
