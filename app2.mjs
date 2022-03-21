// -------------Imports-------------
// ---------------------------------
import axios from 'axios'               // for reading / writing data from a server
import fetch from "node-fetch"          // for reading / writing data from a server
import CoinGecko from 'coingecko-api'   // api wrapper for coingecko
import ps from "prompt-sync"            // for getting user input from console 
//import fs from 'fs'                  // for working with CSV files

// -------------Constants-------------
// -----------------------------------
const CoinGeckoClient = new CoinGecko()
const prompt = ps()

const url_DB = 'http://localhost:3300/sample_table' //base url for local postgress DB
const apikey_DB = { 'Content-Type': 'application/json' }

const url = 'https://api.beta.luxor.tech/graphql' //base url for Luxor's API
const apikey = {
  "Content-Type": "application/json",
  'x-lux-api-key': 'lxk.5c61ce16498047b29d7535a128395a5a' //api key provided by Luxor
}

const uid = "technicalchallenge"
const coin = "BTC"
const org = "luxor"
// const startdate = {"seconds": 0.0,"minutes": 0,"hours": 0,"days": 0,"months": 0,"years": 0}
// const enddate = {"seconds": 0.0,"minutes": 0,"hours": 0,"days": 0,"months": 0,"years": 9}

var values = 5
const maxTableSize = 10
var hashtable = []
var pricetable = []


// ------Postgres DB Functions--------
// -----------------------------------
//function used to GET data from the postgres DB
async function getCharacters_DB(url) {
  let results = await fetch(url)
  let characters = await results.json();
  // console.log(characters)
  // console.log(characters.data)
  return characters
}

//function used to POST data to the postgres DB
async function postCharacters_DB(url, apikey, querymessage) {

  //console.log(querymessage)
  let results = await fetch(url, {
    method: 'POST',
    headers: apikey,
    body: querymessage
  })
  //let characters = await results.json();
  //console.log(characters)
  //console.log(characters.data)
  //console.log(results)
}

//function used to PUT data to the postgres DB
async function putCharacters_DB(url, apikey, querymessage) {

  let results = await fetch('http://localhost:3300/sample_table/1', {
    method: 'PUT',
    headers: apikey,
    body: querymessage
  })
  //let characters = await results.json();
  //console.log(characters)
  // console.log(characters.data)
}


// ----------Helper Functions---------
// -----------------------------------
function float2int(value) {
  return value | 0;
}


// ----------- API Functions----------
// -----------------------------------
//function used to call Luxor's graphQL API
async function getCharacters(url, apikey, querymessage) {
  let results = await fetch(url, {
    method: 'POST',
    headers: apikey,
    body: querymessage
  })
  let characters = await results.json();

  // console.log(characters)
  // console.log(characters.data)
  // console.log(characters.data.getPoolHashrateHistory)

  // console.log(characters.data.getPoolHashrateHistory.nodes[0].hashrate)
  // console.log(characters.data.getPoolHashrateHistory.nodes[0].hashrate / 1000000000000000) // convert to PH
  // console.log(float2int(characters.data.getPoolHashrateHistory.nodes[0].hashrate / 1000000000000000)) // convert to PH
  // console.log(float2int(characters.data.getPoolHashrateHistory.nodes[0].hashrate))
  // console.log(characters.data.getPoolHashrateHistory.nodes[0].time)

  //console.log(characters.data.getRevenue)

  let temptable = []

  for (let i = 0; i < values; i++) {

    let getCharNewrow = {
      id: i,
      hashrate: float2int(characters.data.getPoolHashrateHistory.nodes[i].hashrate / 1000000000000000), // convert to PH
      btcprice: '0',
      date: characters.data.getPoolHashrateHistory.nodes[i].time
    }

    temptable[i] = getCharNewrow
  }
  //console.log(temptable)
  return temptable
}


//function used to call CoinGeckoClient's wrapper for the CoinGecko API
async function coingekofunc() {
  let characters = await CoinGeckoClient.coins.fetchMarketChart('bitcoin', {
    days: 2,
    vs_currency: "usd"
  });

  let temptable = []

  for (let i = 0; i < 49; i++) {

    let getCharNewrow = {
      id: i,
      hashrate: '0',
      btcprice: float2int(characters.data.prices[i][1]),
      date: '0'
    }

    temptable[i] = getCharNewrow
  }
  return temptable
}


// -------------Lurxor API queries----
// -----------------------------------
//https://docs.luxor.tech/docs/schema/queries/current-profile

const currentProfile = JSON.stringify({
  query: `{
    currentProfile {
      id
      rowId
      firstName
      lastName
      email
    }
  }`
})

const user = JSON.stringify({
  query: `{
    users {
      id
      rowId
      username
    }
  }`
})

const getRevenuePh = JSON.stringify({
  query: `
    query GetRevenuePh($dailyrevenueperPH: MiningProfileName!) {
      getRevenuePh(mpn: $dailyrevenueperPH)       
    }`,
  variables: `{ 
    "dailyrevenueperPH": "${coin}"
  }`,
})

const getProfileHashrate = JSON.stringify({
  query: `
    query GetProfileHashrate($profhash: MiningProfileName!) {
      getProfileHashrate(mpn: $profhash)       
    }`,
  variables: `{ 
    "profhash": "${coin}"
  }`,
})

const getPoolHashrate = JSON.stringify({
  query: `
    query GetPoolHashrate($coin: MiningProfileName!, $org: String!) {
      getPoolHashrate(mpn: $coin, orgSlug: $org)       
    }`,
  variables: `{ 
    "coin": "${coin}",
    "org": "${org}"
  }`,
})

const getPoolHashrateHistory = JSON.stringify({
  query: `
    query GetPoolHashrateHistory($coin: MiningProfileName!, $org: String!, $firstnvalues: Int) {
      getPoolHashrateHistory(mpn: $coin, orgSlug: $org, first: $firstnvalues) {
        nodes {
          time
          hashrate
        }
      }   
    }`,
  variables: `{ 
    "coin": "${coin}",
    "org": "${org}",
    "firstnvalues": ${values}
  }`,
})

const getRevenue = JSON.stringify({
  query: `
    query GetRevenue($name: String!, $userrev: CurrencyProfileName!, $start: IntervalInput!, $end: IntervalInput!) {
      getRevenue(uname: $name, cid: $userrev, startInterval: $start, endInterval: $end)       
    }`,
  variables: `{ 
    "name": "${uid}",
    "userrev": "${coin}",
    "start": {"seconds": 0.0,"minutes": 0,"hours": 0,"days": 0,"months": 0,"years": 0},
    "end": {"seconds": 0.0,"minutes": 0,"hours": 0,"days": 0,"months": 0,"years": 9}
  }`,
})

const getAlltimePayout = JSON.stringify({
  query: `
    query GetAlltimePayout($name: String!, $coin: CurrencyProfileName!) {
      getAlltimePayout(uname: $name, cid: $coin)       
    }`,
  variables: `{ 
    "name": "${uid}",
    "coin": "${coin}"
  }`,
})

const getPoolEfficiency = JSON.stringify({
  query: `
    query GetPoolEfficiency($coin: MiningProfileName!, $name: String!) {
      getPoolEfficiency(mpn: $coin, uname: $name)       
    }`,
  variables: `{ 
    "coin": "${coin}",
    "name": "${uid}"
  }`,
})

const getWallet = JSON.stringify({
  query: `
    query GetWallet($name: String!, $coin: CurrencyProfileName!) {
      getWallet(uname: $name, coinId: $coin) {
        address
      }      
    }`,
  variables: `{ 
    "name": "${uid}",
    "coin": "${coin}"
  }`,
})

const getUserMinersStatusCount = JSON.stringify({
  query: `
    query GetUserMinersStatusCount($name: String!, $coin: MiningProfileName!) {
      getUserMinersStatusCount(usrname: $name, mpn: $coin) {
        dead
        warning
        active
      }      
    }`,
  variables: `{ 
      "name": "${uid}",
      "coin": "${coin}"
  }`,
})

// -------------Lurxor API calls------
// -----------------------------------
//getCharacters(url,apikey,currentProfile)
//getCharacters(url,apikey,user)
//getCharacters(url,apikey,getRevenuePh)
//getCharacters(url,apikey,getRevenue)
//getCharacters(url,apikey,getWallet)
//getCharacters(url,apikey,getAlltimePayout)
//getCharacters(url,apikey,getProfileHashrate)
//getCharacters(url,apikey,getPoolHashrate)
//getCharacters(url,apikey,getPoolHashrateHistory)
//getCharacters(url,apikey,getPoolEfficiency)
//getCharacters(url,apikey,getUserMinersStatusCount)


// -------------CoinGeko API calls----
// -----------------------------------
// coingekofunc()


// -------------Ryan's API calls------
// -----------------------------------
// let newrows = JSON.stringify({
//   id: 1,
//   hashrate: '0',
//   btcprice: '0',
//   date: '2022-01-01T00:00:00.000Z'
// })

// getCharacters_DB(url_DB)
// putCharacters_DB(url_DB,apikey_DB,newrows)
// getCharacters_DB(url_DB)


// --------- Test Script -------------
// -----------------------------------
let userinput = prompt("enter history length to initialize: ")  // get historylength from user
values = userinput                                              // assign values to userinput 

hashtable = await getCharacters(url, apikey, getPoolHashrateHistory)  // get hasrate hiostory from Luxor
//console.log(hashtable)

pricetable = await coingekofunc()                 // get price hiostory from CoinGecko
// console.log(pricetable)

let i, x
for (i = 0, x = 48; i < values; i++, x--) {       // merge the hashrate and price tables 
  hashtable[i].btcprice = pricetable[x].btcprice
}
//console.log(hashtable)

for (let i = 0; i < values; i++) {
  let getCharNewrow = JSON.stringify(hashtable[i])
  //console.log(getCharNewrow)
  await postCharacters_DB(url_DB, apikey_DB, getCharNewrow)   // push table into DB
}

// loop for user input, user interacting with DP
while (true) {
  let userinput2 = prompt("how many hours to view? (e to exit): ")  // get historylength from user
  if (userinput2 == "e")
    break

  let userinput3 = prompt("which units for hashrate (PH or EH)? (e to exit): ")  // get historylength from user
  if (userinput3 == "e")
    break

  let results = await getCharacters_DB(url_DB)

  if(userinput2 > maxTableSize)
    userinput2 = maxTableSize
  if(userinput2 < 0)
    userinput2 = 0

  for (let i = 0; i < userinput2; i++) {
    let temphash = 0

    if (userinput3 == "PH")
      temphash = results[i].hashrate
    else if (userinput3 == "EH")
      temphash = results[i].hashrate / 1000
    else{
      temphash = results[i].hashrate
      userinput3 = "PH"
    }
    
    console.log("Hour", i, "hasrate was:", temphash, userinput3)
    console.log("Hour", i, "btc price was:", results[i].btcprice, "USD")
    console.log("Time was:", results[i].date)
  }
  console.log("----------")
}

