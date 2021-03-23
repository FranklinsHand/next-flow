import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import RemoveItem from './../scripts/removeFromMarket.js'

//component returns the loggin in users current Flow Balance
//requires that the users account id be passed in
export function RemoveFromMarket() {

  const [itemID, setItemID] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("handle submit ", event)
    RemoveItem(parseInt(itemID))
    }

  const generateInput = (label, value, setOnChange) => {
    return (
      <div>
        <label htmlFor={label}>{label}</label>
        <input id={label}
          value={value}
          onChange = {(event) => setOnChange(event.target.value)}
        />
      </div>
    )
  }

  return(
    <div>
      <h2>Remove Item from the Market</h2>
      <form onSubmit={handleSubmit}>
          {generateInput("itemID", itemID, setItemID)}
          <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default RemoveFromMarket
