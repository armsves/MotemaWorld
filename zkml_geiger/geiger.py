import os
import pandas as pd
import numpy as np
import time
import sys
import asyncio
from dotenv import load_dotenv
from web3 import Web3
from eth_account import Account
from giza_actions import task, Action, GizaAgent
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
   
@task     
def process_geiger_data():
    print("Processing Geiger Counter data...")
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    csv_files =  [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    if not csv_files:
        print("No CSV files found")
        return
    
    latest_csv = max(csv_files, key=lambda x: os.path.getmtime(os.path.join(data_dir, x)))
    csv_path = os.path.join(data_dir, latest_csv)
    df = pd.read_csv(csv_path)
    df['cps'] = df['cps'].astype(float)
    cps_values = df['cps'].values
    
    top_30_values = np.sort(cps_values)[-30:][::-1]
    
    return_tensor = np.array(top_30_values, dtype=np.float64)
    
    return return_tensor

@Action
async def payment(address):
    try:
        address = Web3.to_checksum_address(address)
    except Exception as e:
        print(f"Invalid address: {address}")
        return
    
    print("Starting Geiger Counter data collection for address:", address)
    time.sleep(20)
    
    read_geiger()
    tensor = process_geiger_data()
    print(f"Tensor: {tensor}")
    
    Account.enable_unaudited_hdwallet_features()
    mnemonic = os.getenv('MNEMONIC')
    account = import_account(mnemonic)
    print("Account address: ", account.address)
    
    # Create GizaAgent instance
    model_id = 1
    version_id = 1
    agent = GizaAgent(model_id, version_id, account)
    
    agent.infer(input_feed={"tensor_input": tensor}, job_size="S")
    
    proof, proof_path = agent.get_model_data()
    verified = await agent.verify(proof_path)
    
    inference_check = False
    
    if verified:
        print("Verified!")
        print("Inference: ", agent.inference)
        
        if any(x >= 0 for x in agent.inference):
            inference_check = True
            print("Inference check passed")
        else:
            pass
        if inference_check:
            print("This scan seems to come from a miner. Signing proof...")
            signed_proof, is_none, proof_message, signable_proof_message = agent.sign_proof(account, proof, proof_path)
            rpc = os.getenv("ALCHEMY_URL")
            
            contract_address = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))
            print("Contract address: ", contract_address)
            receipt = await agent.transmit(account=account, contract_address=contract_address, chain_id=11155111, abi_path="contracts/abi/MotemaPoolAbi.json",
            function_name="claim",
            params=[address, signed_proof],
            value=None,
            signed_proof=signed_proof,
            is_none=is_none,
            proofMessage=proof_message,
            signedProofMessage=signable_proof_message,
            rpc_url=rpc,
            unsafe=False
        )
            print("Receipt: ", receipt)
            return receipt
        else:
            print("It doesn't seem like this person has been mining. No action taken.")
            return None
    else:
        print("Verification failed")
        return None
    
async def main(address):
    await payment(address)
    
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide an address as a command-line argument.")
        sys.exit(1)

    address = sys.argv[1]
    asyncio.run(main(address))