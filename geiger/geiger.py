import os
import pandas as pd
import numpy as np
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
from pyflipper.pyflipper import PyFlipper

load_dotenv()

def read_geiger_data():
    print("Reading Geiger Counter data...")
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    try:
        flipper = PyFlipper(com="/dev/cu.usbmodemflip_Anen1x1")
    except Exception as e:
        print(f"No Flipper device found: {e}")
        pass

    files_and_dirs = flipper.storage.list(path="/ext")
    print(f"Files and directories found on Flipper: {files_and_dirs}")

    for file_dict in files_and_dirs.get('files', []):
        file_name = file_dict['name']
        file_path = f"/ext/{file_name}"
        print(f"Reading {file_path} from Flipper...")
        try:
            file_data = flipper.storage.read(file=file_path)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            continue

        print(f"Read {file_name} from Flipper. Saving to {data_dir}...")
        filename = os.path.join(data_dir, file_name)
        try:
            with open(filename, 'w') as f:
                f.write(file_data)
                print(f"Saved {file_name} to {filename}")
        except Exception as e:
            print(f"Error saving {file_name} to {filename}: {e}")

    csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    if not csv_files:
        print("No CSV files found")
        return None

    latest_csv = max(csv_files, key=lambda x: os.path.getmtime(os.path.join(data_dir, x)))
    csv_path = os.path.join(data_dir, latest_csv)
    df = pd.read_csv(csv_path)
    df['cps'] = df['cps'].astype(float)
    cps_values = df['cps'].values

    top_30_values = np.sort(cps_values)[-30:][::-1]
    return_tensor = np.array(top_30_values, dtype=np.float64)

    return return_tensor

def process_geiger_data(tensor):
    max_value = np.max(tensor)
    print(f"Maximum value in the tensor: {max_value}")
    return max_value > 7

def claim_payment(address):
    try:
        address = Web3.to_checksum_address(address)
    except Exception as e:
        print(f"Invalid address: {address}")
        return

    print(f"Starting Geiger Counter data collection for address: {address}")

    tensor = read_geiger_data()
    if tensor is None:
        print("No data available")
        return

    is_miner = process_geiger_data(tensor)

    if is_miner:
        print("This scan seems to come from a miner. Initiating payment...")
        Account.enable_unaudited_hdwallet_features()
        mnemonic = os.getenv('MNEMONIC')
        account = Account.from_mnemonic(mnemonic)
        print("Account address: ", account.address)

        rpc = os.getenv("ALCHEMY_URL")
        web3 = Web3(Web3.HTTPProvider(rpc))

        contract_address = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))
        print("Contract address: ", contract_address)

        abi_path = "contracts/abi/MotemaPoolAbi.json"
        with open(abi_path, 'r') as f:
            abi = f.read()

        contract = web3.eth.contract(address=contract_address, abi=abi)

        nonce = web3.eth.get_transaction_count(account.address)
        tx = contract.functions.claim(address).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': 1000000,
            'gasPrice': web3.to_wei('50', 'gwei'),
        })

        signed_tx = account.sign_transaction(tx)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        print(f"Transaction hash: {tx_hash.hex()}")
    else:
        print("It doesn't seem like this person has been mining. No action taken.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Please provide an address as a command-line argument.")
        sys.exit(1)

    address = sys.argv[1]
    claim_payment(address)