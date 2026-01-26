#!/usr/bin/env python3
"""
Generate animated GIF/WebP of NZ meshblock background animation.

This script recreates the visual effect from the MeshblockBg.tsx component:
- Points sampled from NZ meshblock centroids
- Lines projecting toward a common center point
- Points randomly appearing/disappearing with a "sparkling" effect
- Gradient colors from red (#e83150) to white
- Transparent background for CSS layering

Usage:
    python generate_meshblock_gif.py [--resolutions 1920x1080,1280x720,640x360]
"""

import json
import random
import math
import argparse
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Tuple
import colorsys

# Try to import required libraries
try:
    import numpy as np
    from PIL import Image, ImageDraw
except ImportError as e:
    print(f"Missing required library: {e}")
    print("Install with: pip install numpy pillow")
    exit(1)


@dataclass
class Point:
    """A data point with position, color, opacity, radius, and animation state."""
    x: float
    y: float
    color: Tuple[int, int, int]
    base_opacity: float
    radius: float
    # Animation state
    phase: float = 0.0  # 0-1, where in the sparkle cycle this point is
    cycle_length: int = 60  # frames for a full appear/disappear cycle
    is_appearing: bool = True  # Whether currently appearing or disappearing

    @property
    def current_opacity(self) -> float:
        """Calculate current opacity based on animation phase."""
        # Smooth sine-based fade
        if self.is_appearing:
            # Fade in: 0 -> base_opacity
            return self.base_opacity * math.sin(self.phase * math.pi / 2)
        else:
            # Fade out: base_opacity -> 0
            return self.base_opacity * math.cos(self.phase * math.pi / 2)


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def interpolate_color(color1: Tuple[int, int, int], color2: Tuple[int, int, int], t: float) -> Tuple[int, int, int]:
    """Interpolate between two colors."""
    return tuple(int(c1 + (c2 - c1) * t) for c1, c2 in zip(color1, color2))


def load_mesh_data(json_path: Path) -> List[Tuple[float, float]]:
    """Load meshblock centroids from JSON file."""
    with open(json_path, 'r') as f:
        data = json.load(f)

    points = []
    for geom in data['objects']['foo']['geometries']:
        if geom['type'] == 'Point':
            points.append(tuple(geom['coordinates']))

    return points


def get_bbox(points: List[Tuple[float, float]]) -> Tuple[float, float, float, float]:
    """Get bounding box of points."""
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    return min(xs), min(ys), max(xs), max(ys)


class MeshblockAnimator:
    """Generates frames for the meshblock background animation with sparkling effect."""

    # Colors
    RED = hex_to_rgb("#e83150")
    WHITE = (255, 255, 255)

    def __init__(
        self,
        all_points: List[Tuple[float, float]],
        height: int,
        num_map_points: int = 800,
        sparkle_rate: float = 0.02,  # Percentage of points changing state per frame
        padding: int = 20,
        seed: int = 42
    ):
        self.num_map_points = num_map_points
        self.sparkle_rate = sparkle_rate
        self.padding = padding

        random.seed(seed)
        np.random.seed(seed)

        # Store all available points
        self.all_points = all_points

        # Calculate map dimensions (maintain aspect ratio of NZ)
        bbox = get_bbox(all_points)
        self.min_x, self.min_y, self.max_x, self.max_y = bbox

        data_width = self.max_x - self.min_x
        data_height = self.max_y - self.min_y
        data_aspect_ratio = data_width / data_height

        # Size based on the map content only
        self.map_height = height
        self.map_width = int(self.map_height * data_aspect_ratio)

        # Total canvas size = map + padding
        self.width = self.map_width + padding * 2
        self.height = self.map_height + padding * 2

        # Map offset (just padding)
        self.map_x = padding
        self.map_y = padding

        # Center point for lines (bottom-right of map area)
        self.center_x = self.map_width * 0.75
        self.center_y = self.map_height * 0.75

        # Initialize points
        self._init_points()

        # Track used coordinates for point replacement
        self.used_coords = set((p.x, p.y) for p in self.map_points)

    def _scale_x(self, x: float) -> float:
        """Scale x coordinate from data space to map space."""
        return ((x - self.min_x) / (self.max_x - self.min_x)) * self.map_width

    def _scale_y(self, y: float) -> float:
        """Scale y coordinate from data space to map space (inverted)."""
        return self.map_height - ((y - self.min_y) / (self.max_y - self.min_y)) * self.map_height

    def _create_point(self, coords: Tuple[float, float], phase: float = 0.0, is_appearing: bool = True) -> Point:
        """Create a point with random color, opacity, and radius."""
        # Color interpolation with squared random (more red than white)
        t = random.random() ** 2
        color = interpolate_color(self.RED, self.WHITE, t)

        # Random cycle length for variety (40-80 frames)
        cycle_length = random.randint(40, 80)

        return Point(
            x=coords[0],
            y=coords[1],
            color=color,
            base_opacity=0.5 + random.random() * 0.5,
            radius=2 + random.random() * 10,
            phase=phase,
            cycle_length=cycle_length,
            is_appearing=is_appearing
        )

    def _init_points(self):
        """Initialize map points with staggered animation phases."""
        # Sample coordinates
        sampled_coords = random.sample(self.all_points, min(self.num_map_points, len(self.all_points)))

        self.map_points = []
        for i, coords in enumerate(sampled_coords):
            # Stagger initial phases so points sparkle at different times
            # Most points start fully visible (phase=1, is_appearing=True means they're at full opacity)
            # Some start mid-animation for variety
            if random.random() < 0.8:
                # 80% start fully visible
                phase = 1.0
                is_appearing = True
            else:
                # 20% start at random phase
                phase = random.random()
                is_appearing = random.choice([True, False])

            self.map_points.append(self._create_point(coords, phase, is_appearing))

    def _get_new_coords(self) -> Tuple[float, float]:
        """Get coordinates for a new point (not currently in use)."""
        available = [p for p in self.all_points if p not in self.used_coords]
        if not available:
            available = self.all_points
        return random.choice(available)

    def advance_frame(self):
        """Advance animation by one frame - update point phases and handle sparkles."""
        # Count current states for balancing
        appearing_count = sum(1 for p in self.map_points if p.is_appearing)
        disappearing_count = len(self.map_points) - appearing_count

        points_to_replace = []

        for i, point in enumerate(self.map_points):
            if point.is_appearing:
                # Point is fading in
                point.phase += 1.0 / point.cycle_length
                if point.phase >= 1.0:
                    point.phase = 1.0
            else:
                # Point is fading out
                point.phase += 1.0 / point.cycle_length
                if point.phase >= 1.0:
                    # Point has fully faded out - replace with new point
                    points_to_replace.append(i)

        # Replace fully faded points with new ones
        for idx in points_to_replace:
            old_point = self.map_points[idx]
            self.used_coords.discard((old_point.x, old_point.y))

            new_coords = self._get_new_coords()
            self.used_coords.add(new_coords)

            # New point starts fading in
            self.map_points[idx] = self._create_point(new_coords, phase=0.0, is_appearing=True)

        # Randomly trigger some fully visible points to start fading
        # Only if we don't have too many already disappearing
        max_disappearing = int(len(self.map_points) * 0.15)  # Max 15% disappearing at once

        for point in self.map_points:
            if point.is_appearing and point.phase >= 1.0:
                if disappearing_count < max_disappearing and random.random() < self.sparkle_rate:
                    point.is_appearing = False
                    point.phase = 0.0
                    disappearing_count += 1

    def draw_frame(self) -> Image.Image:
        """
        Draw a single frame of the animation with transparent background.

        Returns:
            PIL Image of the frame (RGBA with transparency)
        """
        # Create image with transparent background
        img = Image.new('RGBA', (self.width, self.height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img, 'RGBA')

        # Radius scale for line opacity adjustment
        def radius_opacity_scale(radius):
            # Scale from [2, 12] to [0.3, 1.0]
            return 0.3 + (radius - 2) / 10 * 0.7

        line_stop_ratio = 0.8  # Lines stop at 80% of the way to center

        # Draw lines first (so they appear behind circles)
        for point in self.map_points:
            opacity = point.current_opacity
            if opacity < 0.01:
                continue  # Skip nearly invisible points

            x1 = self.map_x + self._scale_x(point.x)
            y1 = self.map_y + self._scale_y(point.y)

            x2 = self.map_x + self.center_x
            y2 = self.map_y + self.center_y

            # Calculate midpoint (where line ends)
            mid_x = x1 + (x2 - x1) * line_stop_ratio
            mid_y = y1 + (y2 - y1) * line_stop_ratio

            # Draw gradient line (multiple segments to simulate gradient)
            scaled_opacity = opacity * radius_opacity_scale(point.radius)
            num_segments = 20

            for i in range(num_segments):
                t1 = i / num_segments
                t2 = (i + 1) / num_segments

                seg_x1 = x1 + (mid_x - x1) * t1
                seg_y1 = y1 + (mid_y - y1) * t1
                seg_x2 = x1 + (mid_x - x1) * t2
                seg_y2 = y1 + (mid_y - y1) * t2

                # Opacity decreases along the line
                seg_opacity = scaled_opacity * (1 - t1)
                opacity_byte = int(seg_opacity * 255)

                if opacity_byte > 0:
                    draw.line(
                        [(seg_x1, seg_y1), (seg_x2, seg_y2)],
                        fill=point.color + (opacity_byte,),
                        width=1
                    )

        # Draw circles
        for point in self.map_points:
            opacity = point.current_opacity
            if opacity < 0.01:
                continue  # Skip nearly invisible points

            x = self.map_x + self._scale_x(point.x)
            y = self.map_y + self._scale_y(point.y)
            r = point.radius

            opacity_byte = int(opacity * 255)
            fill_color = point.color + (opacity_byte,)
            stroke_color = self.RED + (opacity_byte,)

            # Draw filled circle with stroke
            draw.ellipse(
                [x - r, y - r, x + r, y + r],
                fill=fill_color,
                outline=stroke_color,
                width=1
            )

        return img

    def generate_animation_frames(
        self,
        total_frames: int = 120,
        ping_pong: bool = True
    ) -> List[Image.Image]:
        """
        Generate all frames for the animation.

        Args:
            total_frames: Number of frames for forward animation
            ping_pong: If True, append reversed frames for seamless loop

        Returns:
            List of PIL Images
        """
        frames = []

        for frame_num in range(total_frames):
            frame = self.draw_frame()
            frames.append(frame)
            self.advance_frame()

        if ping_pong:
            # Add reversed frames (excluding first and last to avoid duplicates)
            reversed_frames = frames[-2:0:-1]
            frames.extend(reversed_frames)

        return frames


def create_gif(
    frames: List[Image.Image],
    output_path: Path,
    duration: int = 100,
    transparent: bool = True
):
    """Save frames as animated GIF with transparency support."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if transparent:
        # For transparent GIF, we need to handle alpha properly
        processed_frames = []
        for frame in frames:
            # Convert to palette mode with transparency
            # Use a black background for non-transparent areas
            alpha = frame.split()[3]

            # Create a palettized version
            p_frame = frame.convert('P', palette=Image.Palette.ADAPTIVE, colors=255)

            # Set transparency
            mask = Image.eval(alpha, lambda a: 255 if a < 128 else 0)
            p_frame.paste(255, mask)
            p_frame.info['transparency'] = 255

            processed_frames.append(p_frame)

        processed_frames[0].save(
            output_path,
            save_all=True,
            append_images=processed_frames[1:],
            duration=duration,
            loop=0,
            optimize=True,
            transparency=255,
            disposal=2  # Restore to background
        )
    else:
        # Non-transparent version (black background)
        rgb_frames = []
        for frame in frames:
            rgb = Image.new('RGB', frame.size, (0, 0, 0))
            rgb.paste(frame, mask=frame.split()[3] if frame.mode == 'RGBA' else None)
            rgb_frames.append(rgb.quantize(colors=128, method=Image.Quantize.MEDIANCUT).convert('RGB'))

        rgb_frames[0].save(
            output_path,
            save_all=True,
            append_images=rgb_frames[1:],
            duration=duration,
            loop=0,
            optimize=True
        )


def create_webp(
    frames: List[Image.Image],
    output_path: Path,
    duration: int = 100
):
    """Save frames as animated WebP with transparency."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # WebP supports RGBA natively - use lower quality for smaller files
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=duration,
        loop=0,
        quality=60,
        method=6,  # Slowest but best compression
        lossless=False
    )


def main():
    parser = argparse.ArgumentParser(
        description='Generate meshblock background animation with sparkling effect'
    )
    parser.add_argument(
        '--heights',
        type=str,
        default='1080',
        help='Comma-separated list of heights (width auto-calculated from aspect ratio)'
    )
    parser.add_argument(
        '--output-dir',
        type=str,
        default='output',
        help='Output directory for animations'
    )
    parser.add_argument(
        '--num-points',
        type=int,
        default=800,
        help='Number of map points to display'
    )
    parser.add_argument(
        '--duration',
        type=float,
        default=6.0,
        help='Animation duration in seconds (before ping-pong)'
    )
    parser.add_argument(
        '--fps',
        type=int,
        default=12,
        help='Frames per second'
    )
    parser.add_argument(
        '--sparkle-rate',
        type=float,
        default=0.012,
        help='Rate at which points start to fade (0.0-1.0)'
    )
    parser.add_argument(
        '--padding',
        type=int,
        default=20,
        help='Padding around the map content'
    )
    parser.add_argument(
        '--seed',
        type=int,
        default=42,
        help='Random seed for reproducibility'
    )
    parser.add_argument(
        '--no-ping-pong',
        action='store_true',
        help='Disable ping-pong looping'
    )

    args = parser.parse_args()

    # Parse heights
    heights = [int(h.strip()) for h in args.heights.split(',')]

    # Load mesh data
    script_dir = Path(__file__).parent
    json_path = script_dir.parent / 'src' / 'app' / '(website)' / '(home)' / 'components' / 'nz_mesh_centroids.json'

    print(f"Loading mesh data from {json_path}...")
    all_points = load_mesh_data(json_path)
    print(f"Loaded {len(all_points)} points")

    # Create output directory
    output_dir = script_dir / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    total_frames = int(args.duration * args.fps)

    # Generate animation for each height
    for height in heights:
        # Create animator
        animator = MeshblockAnimator(
            all_points=all_points,
            height=height,
            num_map_points=args.num_points,
            sparkle_rate=args.sparkle_rate,
            padding=args.padding,
            seed=args.seed
        )

        actual_width = animator.width
        actual_height = animator.height

        print(f"\nGenerating {actual_width}x{actual_height} animation (height={height})...")

        # Generate frames
        frames = animator.generate_animation_frames(
            total_frames=total_frames,
            ping_pong=not args.no_ping_pong
        )
        print(f"Generated {len(frames)} frames")

        frame_duration = 1000 // args.fps

        # Save WebP (best for transparent animation)
        webp_path = output_dir / f'meshblock-bg-{actual_width}x{actual_height}.webp'
        print(f"Saving WebP to {webp_path}...")
        create_webp(frames, webp_path, duration=frame_duration)

        # Save GIF with transparency
        gif_path = output_dir / f'meshblock-bg-{actual_width}x{actual_height}.gif'
        print(f"Saving GIF to {gif_path}...")
        create_gif(frames, gif_path, duration=frame_duration, transparent=True)

        # Save static first frame as PNG fallback
        static_path = output_dir / f'meshblock-bg-{actual_width}x{actual_height}.png'
        frames[0].save(static_path, optimize=True)
        print(f"Saved static fallback to {static_path}")

    print(f"\n✓ All animations generated in {output_dir}")
    print("\nGenerated files:")
    for f in sorted(output_dir.glob('*')):
        size_kb = f.stat().st_size / 1024
        print(f"  - {f.name} ({size_kb:.1f} KB)")


if __name__ == '__main__':
    main()
