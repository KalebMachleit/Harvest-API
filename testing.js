const location = '34.02336,-118.328199'
const coords = location.split(",")
const latitude = parseFloat(coords[0])
const longitude = parseFloat(coords[1])

let lat = latitude * Math.PI/180
let long = longitude * Math.PI/180
let R = 3958.8
let d = 5

let latRange = [(lat + (d / R)) * (180/Math.PI), (lat - (d / R)) * (180/Math.PI)]
let longRange = [(2 * (Math.asin((1/Math.cos(lat)) * Math.sin(d / (2 * R)))) + long) * (180/Math.PI), (2 * (Math.asin((-1/Math.cos(lat)) * Math.sin(d / (2 * R)))) + long) * (180/Math.PI)]
// Using Haversine formula to calculate search range
console.log(lat)
console.log(long)
console.log(latRange)
console.log(longRange)
// import axios from "axios"

// const spl = ['3524', '10th', 'Ave', 'Los', 'Angeles', '90018']
//     let thing = ''
//     for (let i = 0; i < spl.length; i++) {
//         thing += spl[i]
//         if (i != spl.length - 1) {
//             thing += '+'
//         }
//     }
//     async function doThing() {
//         try {
//             console.log(`https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=` + thing + '&benchmark=4&format=json')
//             const response = await axios.get(`https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=` + thing + '&benchmark=4&format=json')
//             .then ((response) => {
//                 const coords = response.data.result.addressMatches[0].coordinates
//                 console.log(coords)
//             })
//         } catch (err) {
//             console.log(err)
//             throw err
//         }
//     }

// console.log(doThing())