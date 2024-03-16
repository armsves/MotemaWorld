import os
from dotenv import load_dotenv
from eth_account import Account
from giza_actions import task, Action
from pyflipper.pyflipper import PyFlipper

load_dotenv()

@task
def import_account(mnemonic):
    account = Account.from_mnemonic(mnemonic)
    return account

# Read CSV files from the flipper zero. Forms the results into a numpy tensor
@task
def read_geiger():
    print("Reading Geiger Counter data...")
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    try:
        flipper = PyFlipper(com="/dev/cu.usbmodemflip_Anen1x1")
    except Exception as e:
        print("Didn't find a Flipper here...")
        pass
    
    files_and_dirs = flipper.storage.list(path="/ext")
    print(f"Files and directories: {files_and_dirs}")
    
    for file_dict in files_and_dirs.get('files', []):
        file_name = file_dict['name']
        file_path = f"/ext/{file_name}"
        print(f"Reading file: {file_path}")
        try:
            file_data = flipper.storage.read(file=file_path)
        except Exception as e:
            print(f"Error reading file: {file_path}")
            continue
        
        print(f"Read {file_name} from Flipper. Savign to {data_dir}...")
        
        filename = os.path.join(data_dir,file_name)
        try:
            with open(filename, 'w') as f:
                f.write(file_data)
                print(f"Saved {file_name} to {filename}")
        except Exception as e:
            print(f"Error saving {file_name} to {filename}")
            continue
        
    # Find the most recent CSV file
    csv_files =  [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    if csv_files:
        most_recent_csv = max(csv_files, key=lambda x: os.path.getmtime(os.path.join(data_dir, x)))
        print(f"Most recent CSV file: {most_recent_csv}")
        csv_path = os.path.join(data_dir, most_recent_csv)
        try:
            with open(csv_path, 'r') as f:
                csv_data = f.read()
                print(f"Read {most_recent_csv} from {csv_path}:\n{csv_data}")
        except Exception as e:
            print(f"Error reading {most_recent_csv} from {csv_path}")
    else:
        print("No CSV files found")
        csv_data = None
        
def process_geiger_data():
    print("Processing Geiger Counter data...")
    pass