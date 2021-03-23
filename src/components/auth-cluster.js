import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import Balance from './balance'
import IsInitialized from "./isInitialized"
import InitializeAccount from "./initializeAccount"
import GetNFTsByAddress from "./getNFTsByAddress"
import GetMarketByAddress from "./getMarketByAddress"

export function AuthCluster() {
  const [user, setUser] = useState({loggedIn: null})
  useEffect(() => fcl.currentUser().subscribe(setUser), [])

  if (user.loggedIn) {
    return (
      <div>
        <span>{user?.addr ?? "No Address"}</span>
        <button onClick={fcl.unauthenticate}>Log Out</button>
        <Balance user={user.addr}/>
        <IsInitialized user={user.addr}/>
        <InitializeAccount />
        <h2>My Collection</h2>
        <GetNFTsByAddress user={user.addr}/>
        <h2>My Market</h2>
        <GetMarketByAddress user={user.addr} />
      </div>
    )
  } else {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }
}
