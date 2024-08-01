import React from "react";
import { Button, Tooltip } from "@mui/material";
import metamask from "../img/metamask.png";

interface AddToMetaMaskButtonProps {
  token:
    | {
        address: string;
        chainId: number;
        icon: string;
        name: string;
        paired: string[];
        symbol: string;
        decimals: number;
        image?: string;
        isNative?: boolean;
      }
    | undefined;
}

const AddToMetaMaskButton: React.FC<AddToMetaMaskButtonProps> = ({ token }) => {
  const addTokenToMetaMask = async () => {
    if (!window.ethereum || !token) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.image,
          },
        },
      });
    } catch (error) {
      console.error("Failed to add token to MetaMask", error);
    }
  };

  if (!token || token.isNative) {
    return null;
  }

  return (
    <Tooltip title={`Add ${token.symbol} to MetaMask`}>
      <Button
        onClick={addTokenToMetaMask}
        variant="outlined"
        style={{
          color: "white",
          marginRight: 7,
          border: 0,
        }}
      >
        <img
          src={metamask}
          alt="metamask"
          style={{ width: "25px", height: "25px" }}
        />
      </Button>
    </Tooltip>
  );
};

export default AddToMetaMaskButton;