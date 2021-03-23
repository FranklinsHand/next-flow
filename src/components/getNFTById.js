import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import GetNFTById from './../scripts/getNFTById'

//component returns the loggin in users current Flow Balance
//requires that the users account id be passed in
export function LoadNFTById(address, itemID) {
  const [hyptoken, setHyptoken] = useState(null)


  useEffect(() => {
    const loadHyptoken = async (address, itemID) => {
      console.log("GetNFTById", address.itemID)
      const getHyptoken = await GetNFTById(address.account, address.itemID)
      setHyptoken(getHyptoken)
      console.log(hyptoken)
    }
    loadHyptoken(address, itemID)
  }, [])

  if(hyptoken) {
    return(
      <div>
        <p>NFT Name: {hyptoken.name}</p>
      </div>
    )
  }
  else {
      return(
      <div>
        <p>NFT Name: loading...</p>
      </div>
    )
}
}

export default LoadNFTById
