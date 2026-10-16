import { Box, Button, Stack, Typography } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useObjectUrl } from "./useObjectUrl";

interface ImageInputProps {
  label: string;
  value: Blob | null;
  onChange: (image: Blob | null) => void;
}

export function ImageInput({ label, value, onChange }: ImageInputProps) {
  const url = useObjectUrl(value);

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          aspectRatio: "4 / 3",
          border: 1,
          borderStyle: url ? "solid" : "dashed",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "grey.50",
          overflow: "hidden",
        }}
      >
        {url ? (
          <Box
            component="img"
            src={url}
            alt={label}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No image
          </Typography>
        )}
      </Box>
      <Stack direction="row" spacing={1}>
        <Button
          component="label"
          size="small"
          variant="outlined"
          startIcon={<AddPhotoAlternateIcon />}
        >
          {value ? "Replace image" : "Add image"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(file);
              e.target.value = "";
            }}
          />
        </Button>
        {value && (
          <Button size="small" color="error" onClick={() => onChange(null)}>
            Remove
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
