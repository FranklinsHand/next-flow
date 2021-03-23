import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import GetInitialized from './../scripts/isInitialized'

//component returns the loggin in users current Flow Balance
//requires that the users account id be passed in
export function IsInitialized(user) {
  const [isInitialized, setIsInitialized] = useState(null)


  useEffect(() => {
    const isInit = async (user) => {
      console.log("isInitialized", user.user)
      const getInit = await GetInitialized(user.user)
      setIsInitialized(getInit)
    }
    isInit(user)
  }, [])

  if(isInitialized) {
    return(
      <div>
        <p>Hyptokens: {isInitialized.Hyptokens.toString()}</p>
        <p>HyptokensMarket: {isInitialized.HyptokensMarket.toString()}</p>
      </div>
    )
  }
  else {
      return(
      <div>
        <p>Initialized: loading...</p>
      </div>
    )
}
}

export default IsInitialized
