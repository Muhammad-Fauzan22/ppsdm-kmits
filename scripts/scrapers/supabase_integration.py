import os
import logging
from supabase import create_client, Client
from datetime import datetime

class SupabaseIntegration:
    def __init__(self):
        self.url = os.environ.get("SUPABASE_URL")
        self.key = os.environ.get("SUPABASE_KEY")
        self.logger = logging.getLogger(__name__)
        
        if not self.url or not self.key:
            self.logger.warning("Supabase credentials not found. Data will not be uploaded.")
            self.supabase = None
        else:
            self.supabase: Client = create_client(self.url, self.key)
    
    def upload_data(self, table_name, data):
        """Upload list of dictionaries to Supabase table"""
        if not self.supabase:
            return
        
        if not data:
            self.logger.info(f"No data to upload for {table_name}")
            return

        self.logger.info(f"Uploading {len(data)} records to {table_name}...")
        
        success_count = 0
        for item in data:
            try:
                # Upsert using 'url' as the unique key if possible
                # Depending on table constraints. Assuming 'url' is unique constraint.
                
                # First check existence to avoid duplicates if upsert not configured
                # But best practice is upsert.
                data_to_upsert = item.copy()
                
                # Execute insert/upsert
                # Note: Supabase-py 'upsert' works if primary key match. 
                # Ideally, we should have a unique constraint on 'url' in the DB.
                # If not, we might create duplicates.
                
                # Query matching URL
                existing = self.supabase.table(table_name).select('id').eq('url', item['url']).execute()
                
                if existing.data:
                    # Update
                    rid = existing.data[0]['id']
                    self.supabase.table(table_name).update(data_to_upsert).eq('id', rid).execute()
                else:
                    # Insert
                    self.supabase.table(table_name).insert(data_to_upsert).execute()
                
                success_count += 1
            except Exception as e:
                self.logger.error(f"Failed to upload item {item.get('url', 'Unknown')}: {e}")
        
        self.logger.info(f"Upload complete. Success: {success_count}/{len(data)}")

