import os
from dotenv import load_dotenv
from eth_account import Account
from giza_actions import task, Action

load_dotenv()

@task
def import_account(mnemonic):
    account = Account.from_mnemonic(mnemonic)
    return account

# Read CSV files from the flipper zero. Forms the results into a numpy tensor
def read_geiger():
    print("Reading Geiger Counter data...")
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)