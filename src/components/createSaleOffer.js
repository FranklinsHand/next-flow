import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import CreateSaleOffer from './../scripts/createSaleOffer.js'

//component returns the loggin in users current Flow Balance
//requires that the users account id be passed in
export function SetSaleOffer(user) {

  const [id, setId] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("handle submit ", event)
    console.log("search", price.indexOf("."))
    if(price.indexOf(".") == -1) {
      CreateSaleOffer(parseInt(id), price + ".0")
    } else {
      CreateSaleOffer(parseInt(id), price)
    }
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
      <h2>Put it on the market</h2>
      <form onSubmit={handleSubmit}>
          {generateInput("Hyptoken ID", id, setId)}
          {generateInput("Hyptoken Price", price, setPrice)}
          <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default SetSaleOffer
