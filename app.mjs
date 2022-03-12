import axios from 'axios'
import fetch from "node-fetch"
import fs from 'fs'

 const LoadData = async (url, apikey) => {

    const res = await fetch(url, apikey)
    const data = await res.json()
    //console.log(data)

    var workers, workerID, worker

    workers = []

        for (workerID in data.btc.workers) {
            worker = data.btc.workers[workerID]
            workers.push({
                id: workerID,
                state: worker.state,
                lastShare: new Date(worker.last_share * 1000),
                hashRate: {
                    unit: worker.hash_rate_unit,
                    scoring: worker.hash_rate_scoring,
                    last5m: worker.hash_rate_5m,
                    last60m: worker.hash_rate_60m,
                    last24hr: worker.hash_rate_24h
                    }
                }
            )
        }
    console.log(workers[0].hashRate.scoring)
}
 
//const url = 'https://slushpool.com/stats/json/btc/'

const url2 = 'https://slushpool.com/accounts/workers/json/btc/'
const mykey = 'ZdxQC6hllWks2vHV'
const apikey = {
    headers: {
        'SlushPool-Auth-Token': mykey,
    }
}

//LoadData(url, apikey)
LoadData(url2, apikey)