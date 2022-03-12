import axios from 'axios'
import fetch from "node-fetch"
import fs from 'fs'
import CoinGecko from 'coingecko-api'

async function getCharacters(url,apikey,querymessage) {
    let results = await fetch(url, {
      method: 'POST',
      headers: apikey,
      body: querymessage
    })
    let characters = await results.json();
    
    console.log(characters)
    //console.log(characters.data)
    //console.log(characters.data.getRevenue)
   
    // let [first] = Object.keys(characters.data)
    // let string = ": " + characters.data.getRevenue.toString() + ", "
    // console.log(first)

    // fs.appendFile('data.csv', first, function (err) {
    //   if (err) throw err;
    //   console.log('Saved!');
    // })

    // fs.appendFile('data.csv', string, function (err) {
    //   if (err) throw err;
    //   console.log('Saved!');
    // })

}

const CoinGeckoClient = new CoinGecko();

const url2 = 'https://api.coingecko.com/api/v3'
const apikey2 = {}

const url = 'https://api.beta.luxor.tech/graphql'
const apikey = {
  "Content-Type": "application/json",
  'x-lux-api-key': 'lxk.5c61ce16498047b29d7535a128395a5a'
}

//const uid = "WyJwcm9maWxlcyIsNDE3Ml0="
const uid = "technicalchallenge"
const coin = "BTC"
const startdate = {"seconds": 0.0,"minutes": 0,"hours": 0,"days": 0,"months": 0,"years": 0}
const enddate = {"seconds": 0.0,"minutes": 0,"hours": 0,"days": 0,"months": 0,"years": 9}

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

var func = async() => {
  let characters = await CoinGeckoClient.coins.fetchMarketChartRange('bitcoin', {
    from: 1646997058,
    to: 1646957458,
  });
  console.log(characters)
  console.log(characters.data.prices[0])

  // let [first] = Object.keys(characters.data)
  // let string = ": " + characters.data.prices.toString() + ", "
  // console.log(first)
  // fs.appendFile('data.csv', first, function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  // })
  // fs.appendFile('data.csv', string, function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  // })

}

func()

//getCharacters(url,apikey,currentProfile)
//getCharacters(url,apikey,user)
//getCharacters(url,apikey,getRevenuePh)
//getCharacters(url,apikey,getRevenue)
//getCharacters(url,apikey,getWallet)
//getCharacters(url,apikey,getAlltimePayout)
//getCharacters(url,apikey,getProfileHashrate)
//getCharacters(url,apikey,getPoolEfficiency)
//getCharacters(url,apikey,getUserMinersStatusCount)
