from flask import Flask, send_file, abort
from openslide import OpenSlide
from io import BytesIO
import os

app = Flask(__name__)

# Tile size used for slicing
TILE_SIZE = 256

# In-memory cache to store generated tiles
tile_cache = {}

@app.route("/tiles/wsi/tif/<image_name>/<int:z>/<int:x>/<int:y>.png")
def get_tile(image_name, z, x, y):
    cache_key = f"{image_name}_{z}_{x}_{y}"
    
    # Check cache
    if cache_key in tile_cache:
        return send_file(BytesIO(tile_cache[cache_key]), mimetype="image/png")
    
    try:
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../public/wsi/tif"))
        wsi_path = os.path.join(base_dir, image_name)
        if not os.path.exists(wsi_path):
            abort(404, description=f"WSI file '{image_name}' not found")
        
        slide = OpenSlide(wsi_path)
        max_zoom_level = len(slide.level_dimensions) - 1  # Highest level index available
        reversed_z = max_zoom_level - z

        if reversed_z < 0 or reversed_z > max_zoom_level:
            abort(404, description="Zoom level out of range")
        
        level_width, level_height = slide.level_dimensions[reversed_z]
        region_x = x * TILE_SIZE
        region_y = y * TILE_SIZE
        region_width = min(TILE_SIZE, level_width - region_x)
        region_height = min(TILE_SIZE, level_height - region_y)

        if region_x >= level_width or region_y >= level_height:
            abort(404, description="Tile not found")
        
        region = slide.read_region(
            (int(region_x * slide.level_downsamples[reversed_z]),
             int(region_y * slide.level_downsamples[reversed_z])),
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
        
        return send_file(BytesIO(tile_data), mimetype="image/png")

    except Exception as e:
        print(f"Error generating tile: {e}")
        abort(500, description="Internal server error")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
