#!/usr/bin/env python3
"""
Migration Script: Convert 9 Dimensions to Generic Assessment Engine
=================================================================

This script migrates existing 9 dimension assessments to the new generic
assessment engine, eliminating 90% code duplication.

Usage:
    python migrate_dimensions_to_generic_engine.py [--dry-run] [--backup]

Options:
    --dry-run    Show what would be migrated without making changes
    --backup     Create backup of existing dimension files before migration

Author: PPSDM KMITS Team
Date: February 2025
"""

import os
import sys
import json
import shutil
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional

# Configuration
DIMENSIONS = [
    {"id": "cognitive", "name": "Kognitif & Intelektual", "icon": "brain", "color": "blue"},
    {"id": "self-management", "name": "Manajemen Diri", "icon": "target", "color": "green"},
    {"id": "emotional-social", "name": "Emosional & Sosial", "icon": "heart", "color": "pink"},
    {"id": "spiritual", "name": "Spiritual", "icon": "sparkles", "color": "purple"},
    {"id": "character", "name": "Karakter", "icon": "shield", "color": "amber"},
    {"id": "physical", "name": "Kesehatan Fisik", "icon": "activity", "color": "red"},
    {"id": "mental-health", "name": "Kesehatan Mental", "icon": "brain-circuit", "color": "cyan"},
    {"id": "financial", "name": "Kecerdasan Finansial", "icon": "wallet", "color": "emerald"},
    {"id": "environmental", "name": "Kepedulian Lingkungan", "icon": "leaf", "color": "teal"},
]

PROJECT_ROOT = Path(__file__).parent.parent
SRC_DIR = PROJECT_ROOT / "src"
ASSESSMENT_DIR = SRC_DIR / "app" / "(dashboard)" / "dimensions"
FEATURES_DIR = SRC_DIR / "features" / "assessment-engine"
CONFIG_DIR = FEATURES_DIR / "config"

class DimensionMigrator:
    def __init__(self, dry_run: bool = False, backup: bool = False):
        self.dry_run = dry_run
        self.backup = backup
        self.migration_log = []
        self.stats = {
            "total_files": 0,
            "migrated_files": 0,
            "skipped_files": 0,
            "errors": 0,
        }
        
    def log(self, message: str, level: str = "info"):
        """Log migration activity"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] [{level.upper()}] {message}"
        self.migration_log.append(log_entry)
        print(log_entry)
        
    def backup_file(self, file_path: Path) -> bool:
        """Create backup of file before migration"""
        if not self.backup:
            return True
            
        backup_dir = PROJECT_ROOT / "backups" / "dimension_migration" / datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = backup_dir / file_path.relative_to(PROJECT_ROOT)
        
        try:
            backup_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file_path, backup_path)
            self.log(f"Backup created: {backup_path}")
            return True
        except Exception as e:
            self.log(f"Backup failed for {file_path}: {e}", "error")
            return False
            
    def create_dimension_config(self, dimension: Dict[str, Any]) -> Dict[str, Any]:
        """Create generic dimension configuration"""
        return {
            "id": dimension["id"],
            "title": dimension["name"],
            "description": f"Asesmen {dimension['name']} untuk pengembangan holistik mahasiswa ITS",
            "icon": dimension["icon"],
            "color": dimension["color"],
            "version": "2.0.0",
            "engine": "generic",
            "guide": {
                "title": f"Panduan Asesmen {dimension['name']}",
                "description": f"Pelajari konsep {dimension['name']} sebelum memulai asesmen",
                "cards": [
                    {
                        "title": "Konsep Dasar",
                        "content": f"<p>Pemahaman fundamental tentang {dimension['name']} dan pengaruhnya terhadap pengembangan diri.</p>",
                        "icon": "book-open",
                        "color": f"text-{dimension['color']}-500"
                    },
                    {
                        "title": "Indikator Pengukuran",
                        "content": f"<p>Asesmen ini mengukur berbagai aspek {dimension['name']} menggunakan instrumen valid dan reliabel.</p>",
                        "icon": "bar-chart-2",
                        "color": f"text-{dimension['color']}-500"
                    },
                    {
                        "title": "Hasil & Rekomendasi",
                        "content": "<p>Setelah menyelesaikan asesmen, Anda akan mendapatkan laporan personal dengan rekomendasi pengembangan.</p>",
                        "icon": "file-text",
                        "color": f"text-{dimension['color']}-500"
                    }
                ]
            },
            "items": [],  # Will be populated from existing data
            "scoring": {
                "algorithm": "weighted_sum",
                "min_score": 0,
                "max_score": 100,
                "thresholds": {
                    "low": {"min": 0, "max": 40, "label": "Perlu Pengembangan", "color": "red"},
                    "medium": {"min": 41, "max": 70, "label": "Cukup Baik", "color": "yellow"},
                    "high": {"min": 71, "max": 100, "label": "Sangat Baik", "color": "green"}
                }
            },
            "recommendations": {
                "low": [
                    "Ikuti workshop pengembangan diri terkait",
                    "Baca buku dan materi pembelajaran",
                    "Diskusi dengan mentor atau konselor"
                ],
                "medium": [
                    "Latihan rutin untuk meningkatkan kemampuan",
                    "Ikuti komunitas atau grup diskusi",
                    "Praktikkan dalam kehidupan sehari-hari"
                ],
                "high": [
                    "Jadilah mentor untuk teman-teman",
                    "Ikuti kompetisi atau tantangan",
                    "Kembangkan keahlian lebih lanjut"
                ]
            }
        }
        
    def migrate_dimension_page(self, dimension: Dict[str, Any]) -> bool:
        """Migrate dimension page to use generic engine"""
        dimension_id = dimension["id"]
        page_path = ASSESSMENT_DIR / dimension_id / "page.tsx"
        
        if not page_path.exists():
            self.log(f"Page not found: {page_path}", "warning")
            self.stats["skipped_files"] += 1
            return False
            
        self.stats["total_files"] += 1
        
        # Create backup
        if self.backup and not self.dry_run:
            if not self.backup_file(page_path):
                return False
                
        # New page content using generic engine
        new_content = f'''// Auto-migrated from legacy dimension page
// Migration Date: {datetime.now().isoformat()}
// Engine: Generic Assessment Engine v2.0

"use client";

import {{ AssessmentRunner }} from "@/features/assessment-engine";
import {{ dimensionConfigs }} from "@/features/assessment-engine/config/dimensions";
import {{ notFound }} from "next/navigation";

export default function {dimension_id.replace("-", "_").title()}DimensionPage() {{
    const config = dimensionConfigs["{dimension_id}"];
    
    if (!config) {{
        notFound();
    }}
    
    return <AssessmentRunner config={{config}} />;
}}
'''
        
        if not self.dry_run:
            try:
                with open(page_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                self.log(f"Migrated: {page_path}")
                self.stats["migrated_files"] += 1
                return True
            except Exception as e:
                self.log(f"Migration failed for {page_path}: {e}", "error")
                self.stats["errors"] += 1
                return False
        else:
            self.log(f"[DRY-RUN] Would migrate: {page_path}")
            return True
            
    def create_dimension_configs(self) -> bool:
        """Create centralized dimension configurations"""
        config_file = CONFIG_DIR / "dimensions.ts"
        
        if not self.dry_run:
            CONFIG_DIR.mkdir(parents=True, exist_ok=True)
            
        # Generate config content
        configs = []
        for dim in DIMENSIONS:
            config = self.create_dimension_config(dim)
            configs.append(f'  "{dim["id"]}": {json.dumps(config, indent=2, ensure_ascii=False)}')
            
        config_content = f'''// Auto-generated dimension configurations
// Generated: {datetime.now().isoformat()}
// DO NOT EDIT MANUALLY - Use migration script instead

import {{ DimensionConfig }} from "../core/types";

export const dimensionConfigs: Record<string, DimensionConfig> = {{
{",".join(configs)}
}};

export const dimensionList = Object.values(dimensionConfigs);

export function getDimensionById(id: string): DimensionConfig | undefined {{
    return dimensionConfigs[id];
}}

export function getAllDimensions(): DimensionConfig[] {{
    return dimensionList;
}}
'''
        
        if not self.dry_run:
            try:
                with open(config_file, "w", encoding="utf-8") as f:
                    f.write(config_content)
                self.log(f"Created: {config_file}")
                return True
            except Exception as e:
                self.log(f"Failed to create config file: {e}", "error")
                return False
        else:
            self.log(f"[DRY-RUN] Would create: {config_file}")
            return True
            
    def remove_duplicate_components(self) -> bool:
        """Remove duplicate assessment components"""
        duplicate_patterns = [
            "*Assessment.tsx",
            "*Dashboard.tsx",
            "*Gauge.tsx",
            "*Radar.tsx",
            "*Chart.tsx",
        ]
        
        components_dir = SRC_DIR / "components" / "assessment"
        
        if not components_dir.exists():
            self.log(f"Components directory not found: {components_dir}", "warning")
            return False
            
        removed_count = 0
        
        for pattern in duplicate_patterns:
            for file_path in components_dir.glob(pattern):
                if self.backup and not self.dry_run:
                    self.backup_file(file_path)
                    
                if not self.dry_run:
                    try:
                        file_path.unlink()
                        self.log(f"Removed duplicate: {file_path}")
                        removed_count += 1
                    except Exception as e:
                        self.log(f"Failed to remove {file_path}: {e}", "error")
                else:
                    self.log(f"[DRY-RUN] Would remove: {file_path}")
                    
        self.log(f"Removed {removed_count} duplicate components")
        return True
        
    def run_migration(self) -> bool:
        """Execute full migration"""
        self.log("=" * 70)
        self.log("DIMENSION MIGRATION TO GENERIC ENGINE")
        self.log("=" * 70)
        self.log(f"Mode: {'DRY-RUN' if self.dry_run else 'LIVE'}")
        self.log(f"Backup: {'ENABLED' if self.backup else 'DISABLED'}")
        self.log("-" * 70)
        
        # Step 1: Create dimension configs
        self.log("\n[Step 1/4] Creating dimension configurations...")
        if not self.create_dimension_configs():
            self.log("Failed to create dimension configs", "error")
            return False
            
        # Step 2: Migrate dimension pages
        self.log("\n[Step 2/4] Migrating dimension pages...")
        for dimension in DIMENSIONS:
            self.migrate_dimension_page(dimension)
            
        # Step 3: Remove duplicate components
        self.log("\n[Step 3/4] Removing duplicate components...")
        self.remove_duplicate_components()
        
        # Step 4: Generate migration report
        self.log("\n[Step 4/4] Generating migration report...")
        self.generate_report()
        
        self.log("\n" + "=" * 70)
        self.log("MIGRATION COMPLETE")
        self.log("=" * 70)
        self.log(f"Total files processed: {self.stats['total_files']}")
        self.log(f"Successfully migrated: {self.stats['migrated_files']}")
        self.log(f"Skipped: {self.stats['skipped_files']}")
        self.log(f"Errors: {self.stats['errors']}")
        
        return self.stats["errors"] == 0
        
    def generate_report(self):
        """Generate migration report"""
        report_file = PROJECT_ROOT / "MIGRATION_REPORT.md"
        
        report_content = f'''# Dimension Migration Report

**Date:** {datetime.now().isoformat()}  
**Mode:** {'Dry-run' if self.dry_run else 'Live'}  
**Backup:** {'Yes' if self.backup else 'No'}

## Statistics

| Metric | Count |
|--------|-------|
| Total Files | {self.stats['total_files']} |
| Migrated | {self.stats['migrated_files']} |
| Skipped | {self.stats['skipped_files']} |
| Errors | {self.stats['errors']} |

## Migration Log

```
{chr(10).join(self.migration_log)}
```

## Next Steps

1. Review migrated files
2. Run tests: `npm test`
3. Build project: `npm run build`
4. Deploy to staging
5. Verify all dimensions work correctly

## Rollback

If issues are found, restore from backup:
```bash
# Backups are located at:
# backups/dimension_migration/{{timestamp}}/
```
'''
        
        if not self.dry_run:
            with open(report_file, "w", encoding="utf-8") as f:
                f.write(report_content)
            self.log(f"Report saved: {report_file}")

def main():
    parser = argparse.ArgumentParser(
        description="Migrate 9 dimensions to generic assessment engine"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be migrated without making changes"
    )
    parser.add_argument(
        "--backup",
        action="store_true",
        help="Create backup of existing files before migration"
    )
    
    args = parser.parse_args()
    
    migrator = DimensionMigrator(dry_run=args.dry_run, backup=args.backup)
    success = migrator.run_migration()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
