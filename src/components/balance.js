import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import GetBalance from './../scripts/getBalance'

//component returns the loggin in users current Flow Balance
//requires that the users account id be passed in
export function Balance(user) {
  const [balance, setBalance] = useState(null)


  useEffect(() => {
    const loadBalance = async (user) => {
      console.log(user)
      const getbalance = await GetBalance(user.user)
      setBalance(getbalance)
    }
    loadBalance(user)
  })

  if(balance) {
    return(
      <div>
        <p>Balance: {balance}</p>
      </div>
    )
  }
  else {
      return(
      <div>
        <p>Balance: loading...</p>
      </div>
    )
}
}

export default Balance
