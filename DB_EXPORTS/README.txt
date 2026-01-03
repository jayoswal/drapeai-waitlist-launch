To copy the waitlist.db file from your EC2 instance to local, run this command from your local machine:

scp ubuntu@13.201.67.35:/home/ubuntu/drapeai-waitlist-launch/server/waitlist.db ./waitlist.db

Then run the export script:

python3 DB_EXPORTS/export_db_and_csv.py

This will create a timestamped folder inside DB_EXPORTS containing the copied waitlist.db and three CSV files.
