import sqlite3
import csv
import os
from datetime import datetime
import shutil

DB_SRC = './waitlist.db'

# Create timestamped folder at root
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
output_dir = f'./db_export_{timestamp}'
os.makedirs(output_dir, exist_ok=True)

# Copy waitlist.db into the folder
shutil.copy(DB_SRC, f'{output_dir}/waitlist.db')

def export_table(table_name, output_file):
    conn = sqlite3.connect(f'{output_dir}/waitlist.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    headers = [description[0] for description in cursor.description]
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    conn.close()

export_table('waitlist_number', f'{output_dir}/waitlist_number.csv')
export_table('visit_details', f'{output_dir}/visit_details.csv')
export_table('submission_details', f'{output_dir}/submission_details.csv')

print(f'Export complete. Files saved in {output_dir}/')
