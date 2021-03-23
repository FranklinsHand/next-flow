import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import MinterScript from './../scripts/minter.js'

//component returns the loggin in users current Flow Balance
//requires that the users account id be passed in
export function Minter(user) {

  const [account, setAccount] = useState('')
  const [name, setName] = useState('')
  const [creator, setCreator] = useState('')
  const [source, setSource] = useState('')
  const [file, setFile] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("handle submit ", event)
    MinterScript(account, name, creator, source, file)
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
      <h2>Minter</h2>
      <form onSubmit={handleSubmit}>
          {generateInput("account", account, setAccount)}
          {generateInput("name", name, setName)}
          {generateInput("creator", creator, setCreator)}
          {generateInput("source", source, setSource)}
          {generateInput("file", file, setFile)}
          <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default Minter
