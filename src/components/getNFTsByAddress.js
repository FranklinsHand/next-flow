import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import GetNFTIds from './../scripts/getNFTIds'
import GetNFTById from './../scripts/getNFTById'

export function LoadNFTById(address) {
  const [hyptokens, setHyptokens] = useState([])
  const [hyptokenIds, setHyptokenIds] = useState(null)

//okay this component barely works.
//It's not the flexibility of a 40 year old truck driver and is about as efficient as a ford truck running on canola oil
//Somtimes the data flips its order and I have no idea why, so that probably needs to be fixed
//TODO: make this suck less

  useEffect(() => {
    const loadHyptokens = async (address) => {

      console.log("account address", address.user)
      const getIds = await GetNFTIds(address.user)
      setHyptokenIds(getIds)

      getIds.forEach(async (i) => {
        const getHyptoken = await GetNFTById(address.user, i)
        console.log(i)
        if(hyptokens && hyptokens <= getIds) {
          setHyptokens((hyptokens) => hyptokens.concat(getHyptoken))
        } else if (hyptokens && hyptokens >= getIds) {
          console.log("OVERLOAD")
        } else {
          setHyptokens(getHyptoken)
        }
      });

    }

    loadHyptokens(address)
  }, [])

  if(hyptokens.length > 0) {
    console.log("hyptokens", hyptokens)

    return(
      <div>
        {
          hyptokens.map((hyptokens, i) =>
          <div>
            <p key={hyptokens.id}>ID: {hyptokens.id}</p>
            <p key={hyptokens.name}>Name: {hyptokens.name}</p>
            <p key={hyptokens.creator}>Creator: {hyptokens.creator}</p>
            <img src={hyptokens.file} alt={hyptokens.id} />
            <p key={hyptokens.source}>Source: {hyptokens.source}</p>
            <p key={hyptokens.uuid}>UUID: {hyptokens.uuid}</p>
          </div>
          )
        }
      </div>
    )
  }
  else {
      return(
      <div>
        <p>None</p>
      </div>
    )
  }
}

export default LoadNFTById
