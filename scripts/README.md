# Meshblock Background Generator

This script generates animated backgrounds for the IAL website landing page, replacing the computationally expensive SVG/D3.js animation with pre-rendered GIF/WebP images.

## Features

- Generates animations at multiple resolutions for responsive images (`srcset`)
- Outputs both GIF (wider compatibility) and WebP (smaller file size) formats
- Creates static PNG fallbacks
- Configurable number of points, animation cycles, and frame rate
- Uses seeded random generation for reproducible results

## Setup

```bash
# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Usage

Basic usage (generates all default resolutions):

```bash
source venv/bin/activate
python generate_meshblock_gif.py
```

### Command Line Options

| Option | Default | Description |
|--------|---------|-------------|
| `--resolutions` | `1920x1080,1280x720,960x540,640x360` | Comma-separated list of resolutions |
| `--output-dir` | `output` | Output directory for generated files |
| `--num-points` | `800` | Number of data points to display |
| `--num-cycles` | `6` | Number of animation cycles |
| `--fps` | `15` | Frames per second |
| `--seed` | `42` | Random seed for reproducibility |

### Examples

Generate only mobile sizes with fewer points:

```bash
python generate_meshblock_gif.py --resolutions 640x360,960x540 --num-points 400
```

Generate high-quality desktop animation:

```bash
python generate_meshblock_gif.py --resolutions 1920x1080,2560x1440 --num-points 1000 --fps 20
```

## Output Files

For each resolution, the script generates:

- `meshblock-bg-{width}x{height}.gif` - Animated GIF (better compatibility)
- `meshblock-bg-{width}x{height}.webp` - Animated WebP (smaller file size, ~50% of GIF)
- `meshblock-bg-{width}x{height}.png` - Static first frame (fallback)

## Usage in Website

The generated images can be used with the `<picture>` element for responsive loading:

```html
<picture>
  <!-- WebP for modern browsers (smaller file size) -->
  <source
    type="image/webp"
    srcset="
      meshblock-bg-640x360.webp 640w,
      meshblock-bg-960x540.webp 960w,
      meshblock-bg-1280x720.webp 1280w,
      meshblock-bg-1920x1080.webp 1920w
    "
    sizes="100vw"
  />
  <!-- GIF fallback -->
  <source
    type="image/gif"
    srcset="
      meshblock-bg-640x360.gif 640w,
      meshblock-bg-960x540.gif 960w,
      meshblock-bg-1280x720.gif 1280w,
      meshblock-bg-1920x1080.gif 1920w
    "
    sizes="100vw"
  />
  <!-- Static PNG fallback for no-animation preference -->
  <img
    src="meshblock-bg-1280x720.png"
    alt="Background pattern"
    class="w-full h-full object-cover"
  />
</picture>
```

## Animation Details

The animation recreates the visual effect from `MeshblockBg.tsx`:

1. **Data points**: Sampled from NZ meshblock centroids, positioned on the right side
2. **Colors**: Gradient from red (#e83150) to white, with squared random distribution (more red)
3. **Lines**: Project from each point toward a center point, stopping at 80% of the way
4. **Animation**: Every cycle, 5% of points are replaced with new ones
5. **Background**: Additional random "noisy" points scattered across the full canvas
