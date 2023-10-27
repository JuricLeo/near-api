"use client";

import { WalletConnection, connect, keyStores } from "near-api-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const login = async () => {
    const config = {
      networkId: "testnet",
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://testnet.mynearwallet.com/",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    const nearConnection = await connect(config);
    const wallet = new WalletConnection(nearConnection, "my-app");

    try {
      await wallet.requestSignIn({
        methodNames: [],
      });
      setLoggedIn(true);
      setAccountId(wallet.getAccountId());
    } catch (error) {
      console.error(error);
    }
  };

  async function logout() {
    const config = {
      networkId: "testnet",
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://testnet.mynearwallet.com/",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    const nearConnection = await connect(config);
    const wallet = new WalletConnection(nearConnection, "my-app");
    try {
      wallet.signOut();
      setLoggedIn(false);
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const isSigned = async () => {
      const config = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };

      if (config) {
        const nearConnection = await connect(config);
        const wallet = new WalletConnection(nearConnection, "my-app");
        const nearSignedIn = await wallet.isSignedInAsync();

        if (nearSignedIn) {
          setAccountId(wallet.getAccountId());
          const account = await nearConnection.account(wallet.getAccountId());
          const balance = await account.getAccountBalance();
          const wtfBalance = Number(balance.total) / 1000000000000000000000000;
          setAccountBalance(wtfBalance.toFixed(4).toString());
          setLoggedIn(true);
          localStorage.setItem("nearAccountId", wallet.getAccountId());
        }
      }
    };
    isSigned();
  }, []);

  return (
    <div>
      <nav className="flex px-12 py-6 items-center bg-[#000] text-white">
        <p className="flex-1">NEAR AUTHENTICATION</p>
        <button
          onClick={loggedIn ? logout : login}
          className="bg-white text-black px-6 py-3 rounded-md hover:opacity-75"
        >
          {loggedIn ? "Logout" : "Login"}
        </button>
      </nav>
      {loggedIn ? (
        <div className="flex px-12 mt-6">
          <div className="border-2 rounded-md p-8 flex flex-col gap-y-4">
            <h1 className="text-3xl">Wallet name: {accountId}</h1>
            <p>
              Available balance:{" "}
              <span className="text-black text-xl">{accountBalance} NEAR</span>
            </p>
          </div>
          <div className="ml-4 flex flex-col flex-1 border-2 rounded-md p-8">
            <h3 className="text-3xl">Recent Activity:</h3>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center my-60">
          You are not signed in
        </div>
      )}
    </div>
  );
}
