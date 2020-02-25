import Web3 from "web3";
import { NearProvider } from 'near-web3-provider';
import * as nearlib from 'nearlib';

const config = {
  nodeUrl: 'https://rpc.nearprotocol.com',
  deps: {
    keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore()
  },
  networkId: 'default',
  walletUrl: 'https://wallet.nearprotocol.com',
};

async function initNear() {

  // Connect to NEAR RPC
  const near = await nearlib.connect(config);
  const walletAccount = new nearlib.WalletAccount(near);

  // Login via NEAR web wallet
  const account = await walletAccount.requestSignIn(
    // Contract name (EVM in this case).
    'denver-evm',
    // Title to be displayed to the user
    'EVM Deployment',
    // We can also provide URLs to redirect on success and failure.
    // The current URL is used by default.
  );
  const accountId = walletAccount.getAccountId();

  // Instantiate the near web3 provider
  const nearProvider = new NearProvider(config.nodeUrl, config.deps.keyStore, accountId, config.networkId, 'denver-evm');
  return nearProvider;
}

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      const nearProvider = await initNear()
      const web3 = new Web3(
        nearProvider
      );
      resolve(web3);
    });
  });

export default getWeb3;
