from dotenv import load_dotenv
from eth_account import Account

load_dotenv()

def import_account(mnemonic):
    account = Account.from_mnemonic(mnemonic)
    return account