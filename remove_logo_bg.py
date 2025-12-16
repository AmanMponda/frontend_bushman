from PIL import Image
import os

# Load the logo image
logo_path = 'd:/B-frontend/public/logo.png'
img = Image.open(logo_path)

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Get image data
data = img.getdata()

# Create a new image with transparent background
new_data = []
white_threshold = 240  # Adjust this to catch near-white colors

for item in data:
    # Check if the pixel is white or near-white (R, G, B all > threshold)
    if item[0] > white_threshold and item[1] > white_threshold and item[2] > white_threshold:
        # Make it transparent
        new_data.append((item[0], item[1], item[2], 0))
    else:
        # Keep the pixel as is
        new_data.append(item)

# Update image data
img.putdata(new_data)

# Save the modified logo
img.save(logo_path)
print(f"Logo background removed and saved to {logo_path}")
