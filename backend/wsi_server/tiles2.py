from flask import Flask, send_file, abort
from io import BytesIO
from pathlib import Path
import os

from preprocessor.isyntax import Slide, Region

app = Flask(__name__)

# Tile size used
TILE_SIZE = 256

# In-memory cache to store generated tiles
tile_cache = {}

@app.route("/tiles/wsi/tif/<image_name>/<int:z>/<int:x>/<int:y>.png")
def get_tile(image_name, z, x, y):
    # cache_key creation
    cache_key = "{}_{}_{}_{}".format(image_name, z, x, y)

    # Check cache
    if cache_key in tile_cache:
        return send_file(BytesIO(tile_cache[cache_key]), mimetype="image/png")

    try:
        wsi_path = Path("../public/wsi/tif/{}".format(image_name))
        if not wsi_path.exists():
            abort(404, description="WSI file '{}' not found".format(image_name))

        # Initialize and open the slide
        with Slide(wsi_path) as slide:
            max_zoom_level = len(slide.dimensions) - 1  # Highest level index available
            # Reverse the zoom level so that higher z means more zoomed in (Leaflet reverses zoom levels)
            reversed_z = max_zoom_level - z

            if reversed_z < 0 or reversed_z > max_zoom_level:
                abort(404, description="Zoom level out of range")

            # Calculate the region to extract
            level_width, level_height = slide.dimensions[reversed_z].width, slide.dimensions[reversed_z].height
            region_x = x * TILE_SIZE
            region_y = y * TILE_SIZE
            region_width = min(TILE_SIZE, level_width - region_x)
            region_height = min(TILE_SIZE, level_height - region_y)

            if region_x >= level_width or region_y >= level_height:
                abort(404, description="Tile not found")

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

            return send_file(BytesIO(tile_data), mimetype="image/png")

    except Exception as e:
        print("Error generating tile: {}".format(e))
        abort(500, description="Internal server error")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
