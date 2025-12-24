
# Copyright (c) 2025 Bivex
#
# Author: Bivex
# Available for contact via email: support@b-b.top
# For up-to-date contact information:
# https://github.com/bivex
#
# Created: 2025-12-24T02:41:21
# Last Updated: 2025-12-24T03:55:16
#
# Licensed under the MIT License.
# Commercial licensing available upon request.
"""
Bundle Analyzer Hot Modules Script

Analyzes Next.js bundle analyzer data to identify hot modules (largest modules)
and provides insights about bundle composition.

This script helps identify performance bottlenecks by analyzing webpack bundle
analyzer output, showing which modules and dependencies are consuming the most
space in your application bundles.

Usage Examples:
    # Basic analysis
    python analyze_hot_modules.py

    # Analyze with custom parameters
    python analyze_hot_modules.py --top 10 --min-size 20

    # Filter by module type
    python analyze_hot_modules.py --filter node_modules  # Only dependencies
    python analyze_hot_modules.py --filter local         # Only project files

    # Tree visualizations
    python analyze_hot_modules.py --tree                # Full hierarchical tree
    python analyze_hot_modules.py --compact-tree        # Categorized compact tree

    # Export results to JSON
    python analyze_hot_modules.py --export analysis.json

Arguments:
    --input FILE       Path to bundle analyzer HTML file (default: .next/analyze/client.html)
    --top N            Show top N modules (default: 20)
    --min-size SIZE    Minimum size in KB to consider (default: 50)
    --filter TYPE      Filter modules: 'all', 'node_modules', or 'local' (default: all)
    --tree             Show hierarchical tree view of modules
    --compact-tree     Show compact tree view grouped by category
    --export FILE      Export results to JSON file
"""

import json
import re
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional
import sys


class BundleAnalyzer:
    """Analyzes bundle analyzer data from Next.js webpack-bundle-analyzer."""

    def __init__(self, html_file: str):
        self.html_file = Path(html_file)
        self.chart_data: List[Dict[str, Any]] = []
        self.modules: List[Dict[str, Any]] = []

    def extract_chart_data(self) -> bool:
        """Extract chartData from the HTML file."""
        try:
            with open(self.html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find the chartData assignment
            chart_data_match = re.search(r'window\.chartData\s*=\s*(\[.*?\]);', content, re.DOTALL)

            if not chart_data_match:
                print("Error: Could not find chartData in HTML file")
                return False

            chart_data_json = chart_data_match.group(1)

            # Parse the JSON data
            self.chart_data = json.loads(chart_data_json)
            return True

        except FileNotFoundError:
            print(f"Error: File {self.html_file} not found")
            return False
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON data: {e}")
            return False
        except Exception as e:
            print(f"Error extracting chart data: {e}")
            return False

    def flatten_modules(self, data: List[Dict[str, Any]], path: str = "") -> None:
        """Recursively flatten the nested module structure."""
        for item in data:
            # Use path if available, otherwise use label
            item_path = item.get('path') or item.get('label', 'unknown')
            current_path = f"{path}/{item_path}" if path else item_path

            # If it has groups, it's a directory/folder
            if 'groups' in item and item['groups']:
                self.flatten_modules(item['groups'], current_path)
            else:
                # This is a leaf module
                module_info = {
                    'path': current_path,
                    'statSize': item.get('statSize', 0),
                    'parsedSize': item.get('parsedSize', 0),
                    'gzipSize': item.get('gzipSize', 0),
                    'id': item.get('id'),
                    'label': item.get('label', ''),
                    'isAsset': item.get('isAsset', False),
                    'isInitialByEntrypoint': item.get('isInitialByEntrypoint', {})
                }
                self.modules.append(module_info)

    def analyze_modules(self) -> None:
        """Analyze all modules and extract key information."""
        self.modules = []
        self.flatten_modules(self.chart_data)

        # Sort by parsed size (most relevant for runtime performance)
        self.modules.sort(key=lambda x: x['parsedSize'], reverse=True)

    def get_top_modules(self, top_n: int = 20, min_size_kb: int = 50,
                        filter_type: str = 'all') -> List[Dict[str, Any]]:
        """Get top N modules above minimum size with optional filtering."""
        min_size_bytes = min_size_kb * 1024
        filtered_modules = [
            module for module in self.modules
            if module['parsedSize'] >= min_size_bytes
        ]

        # Apply filtering
        if filter_type == 'node_modules':
            filtered_modules = [m for m in filtered_modules if 'node_modules' in m['path']]
        elif filter_type == 'local':
            filtered_modules = [m for m in filtered_modules if 'node_modules' not in m['path']]

        return filtered_modules[:top_n]

    def format_size(self, size_bytes: int) -> str:
        """Format bytes to human readable format."""
        if size_bytes >= 1024 * 1024:
            return ".1f"
        elif size_bytes >= 1024:
            return ".1f"
        else:
            return f"{size_bytes} B"

    def print_summary(self) -> None:
        """Print bundle summary."""
        if not self.modules:
            return

        total_stat_size = sum(m['statSize'] for m in self.modules)
        total_parsed_size = sum(m['parsedSize'] for m in self.modules)
        total_gzip_size = sum(m['gzipSize'] for m in self.modules)

        print("📊 Bundle Analysis Summary")
        print("=" * 50)
        print(f"Total modules: {len(self.modules)}")
        print(f"Total stat size: {self.format_size(total_stat_size)}")
        print(f"Total parsed size: {self.format_size(total_parsed_size)}")
        print(f"Total gzip size: {self.format_size(total_gzip_size)}")
        print()

    def print_hot_modules(self, top_n: int = 20, min_size_kb: int = 50, filter_type: str = 'all') -> None:
        """Print the hottest modules (largest ones)."""
        top_modules = self.get_top_modules(top_n, min_size_kb, filter_type)

        if not top_modules:
            print(f"No modules found above {min_size_kb}KB")
            return

        print(f"🔥 Top {len(top_modules)} Hot Modules (> {min_size_kb}KB)")
        print("=" * 80)
        print(f"{'#':<3} {'Module':<50} {'Parsed':<10} {'Gzip':<10}")
        print("-" * 80)

        for i, module in enumerate(top_modules, 1):
            path = module['path']
            # Truncate very long paths
            if len(path) > 50:
                path = "..." + path[-47:]

            parsed_size = self.format_size(module['parsedSize'])
            gzip_size = self.format_size(module['gzipSize'])

            print(f"{i:<3} {path:<50} {parsed_size:<10} {gzip_size:<10}")

    def print_chunk_analysis(self) -> None:
        """Analyze and print chunk-level information."""
        chunks = [item for item in self.chart_data if item.get('isAsset')]

        if not chunks:
            return

        print("\n📦 Chunk Analysis")
        print("=" * 50)

        # Sort chunks by parsed size
        chunks.sort(key=lambda x: x['parsedSize'], reverse=True)

        for i, chunk in enumerate(chunks[:10], 1):  # Top 10 chunks
            entrypoints = [k for k, v in chunk.get('isInitialByEntrypoint', {}).items() if v]
            entrypoint_str = f" ({', '.join(entrypoints)})" if entrypoints else ""

            label = chunk.get('label', 'unknown')
            if len(label) > 40:
                label = label[:37] + "..."

            parsed_size = self.format_size(chunk['parsedSize'])
            gzip_size = self.format_size(chunk['gzipSize'])

            print(f"{i:2d}. {label:<40} {parsed_size:<10} {gzip_size:<10}{entrypoint_str}")

    def print_optimization_suggestions(self) -> None:
        """Print optimization suggestions based on analysis."""
        if not self.modules:
            return

        print("\n💡 Optimization Suggestions")
        print("=" * 50)

        # Find large node_modules
        node_modules = [m for m in self.modules if 'node_modules' in m['path'] and m['parsedSize'] > 100 * 1024]

        if node_modules:
            print(f"• Found {len(node_modules)} large node_modules modules")
            total_nm_size = sum(m['parsedSize'] for m in node_modules)
            print(f"  Total node_modules size: {self.format_size(total_nm_size)}")

            # Check for common heavy packages
            heavy_packages = []
            for module in node_modules[:5]:
                if 'react' in module['path'].lower() and 'dom' in module['path'].lower():
                    heavy_packages.append("React DOM")
                elif 'lodash' in module['path'].lower():
                    heavy_packages.append("Lodash")
                elif 'moment' in module['path'].lower():
                    heavy_packages.append("Moment.js")

            if heavy_packages:
                print(f"  Consider tree-shaking: {', '.join(set(heavy_packages))}")

        # Check for large assets
        large_assets = [m for m in self.modules if any(ext in m['path'].lower() for ext in ['.png', '.jpg', '.svg', '.woff', '.woff2']) and m['statSize'] > 50 * 1024]

        if large_assets:
            print(f"• Found {len(large_assets)} large asset files")
            total_asset_size = sum(m['statSize'] for m in large_assets)
            print(f"  Total asset size: {self.format_size(total_asset_size)}")
            print("  Consider optimizing/compressing large assets")

    def print_module_tree(self, top_n: int = 20, min_size_kb: int = 50,
                          filter_type: str = 'all') -> None:
        """Print a hierarchical tree view of large modules."""
        top_modules = self.get_top_modules(top_n, min_size_kb, filter_type)

        if not top_modules:
            print(f"No modules found above {min_size_kb}KB for tree view")
            return

        print(f"\n🌳 Module Hierarchy Tree (> {min_size_kb}KB, filtered: {filter_type})")
        print("=" * 80)

        # Build tree structure
        tree = self._build_module_tree(top_modules)

        # Print the tree
        self._print_tree_node(tree, "", True)

    def _build_module_tree(self, modules: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Build a hierarchical tree structure from module paths."""
        tree = {}

        for module in modules:
            # Clean and simplify the path
            path = self._simplify_module_path(module['path'])
            path_parts = path.split('/')

            # Skip empty parts
            path_parts = [p for p in path_parts if p]

            current = tree

            # Navigate/create the path in the tree
            for i, part in enumerate(path_parts):
                if part not in current:
                    if i == len(path_parts) - 1:
                        # This is a leaf node (the actual module)
                        current[part] = {
                            'type': 'module',
                            'data': module
                        }
                    else:
                        # This is an intermediate directory
                        current[part] = {
                            'type': 'directory',
                            'children': {}
                        }

                if current[part]['type'] == 'directory':
                    current = current[part]['children']
                else:
                    # If we encounter a module where we expected a directory, stop
                    break

        return tree

    def _simplify_module_path(self, path: str) -> str:
        """Simplify complex webpack paths for better readability."""
        # Remove repetitive concatenated paths
        if ' (concatenated)' in path:
            # Extract the main file path from concatenated modules
            parts = path.split(' (concatenated)')
            if len(parts) > 1:
                # Use the first meaningful part
                path = parts[0]

        # Clean up webpack chunk references
        path = path.replace('static/chunks/', 'chunks/')

        # Simplify deep node_modules nesting
        import re
        # Replace multiple node_modules with single one
        path = re.sub(r'node_modules/[^/]+/node_modules/', 'node_modules/', path)
        path = re.sub(r'node_modules/[^/]+/node_modules/', 'node_modules/', path)  # Run twice for nested cases

        # Simplify src directory repetition
        path = re.sub(r'src/\./src/', 'src/', path)
        path = re.sub(r'src/\./src/', 'src/', path)

        return path

    def _print_tree_node(self, node: Dict[str, Any], prefix: str = "",
                        is_last: bool = True, is_root: bool = False) -> None:
        """Recursively print tree nodes with proper indentation."""
        if is_root:
            # Start with root level
            for i, (name, data) in enumerate(node.items()):
                is_last_item = i == len(node) - 1
                self._print_tree_item(name, data, "", is_last_item)
        else:
            # Print a single item
            for name, data in node.items():
                self._print_tree_item(name, data, prefix, is_last)

    def _print_tree_item(self, name: str, data: Dict[str, Any], prefix: str,
                        is_last: bool) -> None:
        """Print a single tree item with its data."""
        # Create the branch symbol
        if is_last:
            branch = "└── "
            next_prefix = prefix + "    "
        else:
            branch = "├── "
            next_prefix = prefix + "│   "

        if data['type'] == 'module':
            # Print module with size info
            module = data['data']
            parsed_size = self.format_size(module['parsedSize'])
            gzip_size = self.format_size(module['gzipSize'])

            # Truncate long names
            display_name = name
            if len(display_name) > 40:
                display_name = display_name[:37] + "..."

            print(f"{prefix}{branch}{display_name} ({parsed_size}, gz: {gzip_size})")
        else:
            # Print directory
            print(f"{prefix}{branch}{name}/")

            # Sort children for consistent display
            children = list(data['children'].items())
            children.sort(key=lambda x: x[1]['type'] == 'directory')  # Directories first

            for i, (child_name, child_data) in enumerate(children):
                is_last_child = i == len(children) - 1
                self._print_tree_item(child_name, child_data, next_prefix, is_last_child)

    def print_compact_tree(self, top_n: int = 20, min_size_kb: int = 50,
                          filter_type: str = 'all') -> None:
        """Print a compact tree view grouped by logical categories."""
        top_modules = self.get_top_modules(top_n, min_size_kb, filter_type)

        if not top_modules:
            print(f"No modules found above {min_size_kb}KB for compact tree view")
            return

        print(f"\n🌲 Compact Module Tree (> {min_size_kb}KB, filtered: {filter_type})")
        print("=" * 80)

        # Group modules by categories
        categories = self._categorize_modules(top_modules)

        for i, (category, modules) in enumerate(categories.items()):
            is_last_category = i == len(categories) - 1
            self._print_category_tree(category, modules, is_last_category)

    def _categorize_modules(self, modules: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Categorize modules into logical groups."""
        categories = {
            'React Ecosystem': [],
            'UI Components': [],
            'Forms & Validation': [],
            'State Management': [],
            'Utilities': [],
            'Styling': [],
            'Other Dependencies': [],
            'Local Components': []
        }

        for module in modules:
            path = module['path'].lower()
            category = 'Other Dependencies'  # Default

            # Categorize based on path patterns
            if any(lib in path for lib in ['react', 'next', 'react-dom']):
                category = 'React Ecosystem'
            elif any(lib in path for lib in ['@radix-ui', 'lucide', 'heroicons', 'ui']):
                category = 'UI Components'
            elif any(lib in path for lib in ['react-hook-form', 'zod', 'yup', 'formik']):
                category = 'Forms & Validation'
            elif any(lib in path for lib in ['zustand', 'redux', 'jotai', 'recoil']):
                category = 'State Management'
            elif any(lib in path for lib in ['lodash', 'ramda', 'date-fns', 'clsx']):
                category = 'Utilities'
            elif any(lib in path for lib in ['tailwind', 'styled-components', 'emotion']):
                category = 'Styling'
            elif 'src/' in path and not any(lib in path for lib in ['node_modules']):
                category = 'Local Components'

            categories[category].append(module)

        # Remove empty categories
        return {k: v for k, v in categories.items() if v}

    def _print_category_tree(self, category: str, modules: List[Dict[str, Any]],
                           is_last_category: bool) -> None:
        """Print a category and its modules in tree format."""
        if not modules:
            return

        # Category header
        branch = "└── " if is_last_category else "├── "
        print(f"{branch}{category}/")

        # Calculate total size for category
        total_parsed = sum(m['parsedSize'] for m in modules)
        total_gzip = sum(m['gzipSize'] for m in modules)

        # Sort modules by size within category
        modules.sort(key=lambda x: x['parsedSize'], reverse=True)

        next_prefix = "    " if is_last_category else "│   "

        for i, module in enumerate(modules):
            is_last_module = i == len(modules) - 1

            # Module branch
            mod_branch = "└── " if is_last_module else "├── "
            mod_prefix = next_prefix + ("    " if is_last_module else "│   ")

            # Format module name
            path = module['path']
            # Extract just the filename/library name for cleaner display
            if 'node_modules/' in path:
                # For npm packages, show package name
                parts = path.split('node_modules/')
                if len(parts) > 1:
                    package_path = parts[-1].split('/')[0]
                    if '@' in package_path:
                        # Scoped package
                        scoped_parts = parts[-1].split('/')
                        if len(scoped_parts) >= 2:
                            package_path = f"{scoped_parts[0]}/{scoped_parts[1]}"
                    name = package_path
                else:
                    name = path.split('/')[-1]
            else:
                # For local files, show relative path
                name = path.split('/')[-1]
                if len(name) > 30:
                    name = name[:27] + "..."

            parsed_size = self.format_size(module['parsedSize'])
            gzip_size = self.format_size(module['gzipSize'])

            print(f"{next_prefix}{mod_branch}{name} ({parsed_size}, gz: {gzip_size})")

        # Show category total
        total_parsed_fmt = self.format_size(total_parsed)
        total_gzip_fmt = self.format_size(total_gzip)
        print(f"{next_prefix}💾 Total: {total_parsed_fmt} parsed, {total_gzip_fmt} gzipped")
        print()

    def export_results(self, filename: str, top_n: int = 20, min_size_kb: int = 50,
                      filter_type: str = 'all') -> None:
        """Export analysis results to JSON file."""
        top_modules = self.get_top_modules(top_n, min_size_kb, filter_type)
        chunks = [item for item in self.chart_data if item.get('isAsset')][:10]
        chunks.sort(key=lambda x: x['parsedSize'], reverse=True)

        results = {
            'summary': {
                'total_modules': len(self.modules),
                'total_stat_size': sum(m['statSize'] for m in self.modules),
                'total_parsed_size': sum(m['parsedSize'] for m in self.modules),
                'total_gzip_size': sum(m['gzipSize'] for m in self.modules),
                'analysis_timestamp': '2025-01-24T00:00:00Z'  # Current date
            },
            'top_modules': top_modules,
            'top_chunks': chunks,
            'filter_applied': filter_type,
            'min_size_kb': min_size_kb
        }

        import json
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)


def main():
    parser = argparse.ArgumentParser(description="Analyze Next.js bundle analyzer data")
    parser.add_argument('--input', '-i', default='.next/analyze/client.html',
                        help='Path to bundle analyzer HTML file')
    parser.add_argument('--top', '-t', type=int, default=20,
                        help='Show top N modules')
    parser.add_argument('--min-size', '-m', type=int, default=50,
                        help='Minimum size in KB to consider')
    parser.add_argument('--filter', '-f', choices=['all', 'node_modules', 'local'],
                        default='all', help='Filter modules by type')
    parser.add_argument('--export', '-e', help='Export results to JSON file')
    parser.add_argument('--tree', action='store_true', help='Show hierarchical tree view of modules')
    parser.add_argument('--compact-tree', action='store_true', help='Show compact tree view grouped by category')

    args = parser.parse_args()

    analyzer = BundleAnalyzer(args.input)

    print(f"🔍 Analyzing bundle from: {args.input}")
    if args.filter != 'all':
        print(f"   Filtering by: {args.filter}")
    print()

    if not analyzer.extract_chart_data():
        sys.exit(1)

    analyzer.analyze_modules()
    analyzer.print_summary()
    analyzer.print_hot_modules(args.top, args.min_size, args.filter)
    analyzer.print_chunk_analysis()
    analyzer.print_optimization_suggestions()

    # Export to JSON if requested
    if args.export:
        analyzer.export_results(args.export, args.top, args.min_size, args.filter)
        print(f"\n📄 Results exported to: {args.export}")

    # Show tree view if requested
    if args.tree or args.compact_tree:
        if args.compact_tree:
            analyzer.print_compact_tree(args.top, args.min_size, args.filter)
        else:
            analyzer.print_module_tree(args.top, args.min_size, args.filter)


if __name__ == "__main__":
    main()
