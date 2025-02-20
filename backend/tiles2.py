from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from io import BytesIO
from pathlib import Path
import os

from preprocessorMain.preprocessor.slides.isyntax import Slide, Region
# from preprocessorMain.preprocessor.utils.geometry import Point, Size

app = FastAPI()

# Tile size used
TILE_SIZE = 256

# In-memory cache to store generated tiles
tile_cache = {}

@app.get("/tiles/wsi/tif/{image_name}/{z}/{x}/{y}.png")
def get_tile(image_name, z: int, x: int, y: int):
    # cache_key creation
    cache_key = "{}_{}_{}_{}".format(image_name, z, x, y)

    # Check cache
    if cache_key in tile_cache:
        return StreamingResponse(BytesIO(tile_cache[cache_key]), media_type="image/png")

    try:
        wsi_path = Path("../public/wsi/tif/{}".format(image_name))
        if not wsi_path.exists():
            raise HTTPException(status_code=404, detail="WSI file '{}' not found".format(image_name))

        # Initialize and open the slide
        with Slide(wsi_path) as slide:
            max_zoom_level = len(slide.dimensions) - 1  # Highest level index available
            # Reverse the zoom level so that higher z means more zoomed in (Leaflet reverses zoom levels)
            reversed_z = max_zoom_level - z

            if reversed_z < 0 or reversed_z > max_zoom_level:
                raise HTTPException(status_code=404, detail="Zoom level out of range")

            # Calculate the region to extract
            level_width, level_height = slide.dimensions[reversed_z].width, slide.dimensions[reversed_z].height
            region_x = x * TILE_SIZE
            region_y = y * TILE_SIZE
            region_width = min(TILE_SIZE, level_width - region_x)
            region_height = min(TILE_SIZE, level_height - region_y)

            if region_x >= level_width or region_y >= level_height:
                raise HTTPException(status_code=404, detail="Tile not found")

            # Define the region in the custom slide's coordinate system
            region = Region.make(region_x, region_y, region_width, region_height, reversed_z)
            region_image = slide.read_region(region)
            region_rgb = region_image.convert("RGB")

            # Convert the image to PNG
            img_io = BytesIO()
            region_rgb.save(img_io, 'PNG')
            img_io.seek(0)
            tile_data = img_io.getvalue()

            # Cache the tile in memory
            tile_cache[cache_key] = tile_data

            return StreamingResponse(BytesIO(tile_data), media_type="image/png")

    except Exception as e:
        print("Error generating tile: {}".format(e))
        raise HTTPException(status_code=500, detail="Internal server error")
