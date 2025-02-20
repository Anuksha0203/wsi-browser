from openslide import OpenSlide
from PIL import Image
import os

def generate_thumbnail(input_path, output_path, thumbnail_size=(500, 500)):
    # Open the slide image
    slide = OpenSlide(input_path)
    
    # Use a lower resolution level 
    level = 8  
    level_dimensions = slide.level_dimensions[level]

    # Read the region at chosen resolution level
    region = slide.read_region((0, 0), level, level_dimensions)

    # Convert to an RGB image
    region = region.convert("RGB")
    
    # Resize image to create the thumbnail
    region.thumbnail(thumbnail_size)
    
    # Save thumbnail as PNG
    region.save(output_path, 'PNG')

input_folder = './public/wsi/tif'  # Folder where original TIFF images are stored
output_folder = './public/wsi/png'  # Folder where thumbnails will be saved

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Process all TIFF files in the input folder
for file_name in os.listdir(input_folder):
    if file_name.lower().endswith('.tif'):
        input_path = os.path.join(input_folder, file_name)
        output_path = os.path.join(output_folder, f"{os.path.splitext(file_name)[0]}.png")
        generate_thumbnail(input_path, output_path)
        print(f"Thumbnail saved to: {output_path}")
