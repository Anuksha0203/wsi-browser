from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from openslide import OpenSlide
from io import BytesIO
import os

app = FastAPI()

# Tile size used for slicing
TILE_SIZE = 256

# In-memory cache to store generated tiles
tile_cache = {}

@app.get("/tiles/wsi/tif/{image_name}/{z}/{x}/{y}.png")
async def get_tile(image_name: str, z: int, x: int, y: int):
    # Replace f-strings with .format()
    cache_key = "{}_{}_{}_{}".format(image_name, z, x, y)
    
    # Check cache
    if cache_key in tile_cache:
        # Return the cached tile
        return StreamingResponse(BytesIO(tile_cache[cache_key]), media_type="image/png")
    
    try:
        wsi_path = "../public/wsi/tif/{}".format(image_name)
        if not os.path.exists(wsi_path):
            raise HTTPException(status_code=404, detail="WSI file '{}' not found".format(image_name))
        
        slide = OpenSlide(wsi_path)
        max_zoom_level = len(slide.level_dimensions) - 1  # Highest level index available
        # Reverse the zoom level so that higher z means more zoomed in
        reversed_z = max_zoom_level - z

        if reversed_z < 0 or reversed_z > max_zoom_level:
            raise HTTPException(status_code=404, detail="Zoom level out of range")
        
        level_width, level_height = slide.level_dimensions[reversed_z]
        region_x = x * TILE_SIZE
        region_y = y * TILE_SIZE
        region_width = min(TILE_SIZE, level_width - region_x)
        region_height = min(TILE_SIZE, level_height - region_y)

        if region_x >= level_width or region_y >= level_height:
            raise HTTPException(status_code=404, detail="Tile not found")
        
        # Use tuple instead of f-strings for formatting arguments
        region = slide.read_region(
            (
                int(region_x * slide.level_downsamples[reversed_z]),
                int(region_y * slide.level_downsamples[reversed_z])
            ),
            reversed_z,
            (region_width, region_height)
        )
        region_rgb = region.convert("RGB")
        img_io = BytesIO()
        region_rgb.save(img_io, 'PNG')
        img_io.seek(0)
        tile_data = img_io.getvalue()

        # Cache the tile in memory
        tile_cache[cache_key] = tile_data
        
        return StreamingResponse(BytesIO(tile_data), media_type="image/png")

    except Exception as e:
        # Convert f-string to .format()
        print("Error generating tile: {}".format(e))
        raise HTTPException(status_code=500, detail="Internal server error")