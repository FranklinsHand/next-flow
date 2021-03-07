// File: ./src/config.js

import {config} from "@onflow/fcl"

config()
  .put("accessNode.api", process.env.NEXT_PUBLIC_ACCESS_NODE) // Configure FCLs Access Node
  .put("challenge.handshake", process.env.NEXT_PUBLIC_WALLET_DISCOVERY) // Configure FCLs Wallet Discovery mechanism
  .put("0xProfile", process.env.NEXT_PUBLIC_CONTRACT_PROFILE) // Will let us use `0xProfile` in our cadence
