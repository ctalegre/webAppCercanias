import axios from 'axios'

function callData ({ o, d }) {
  return new Promise((resolve, reject) => axios.get(`http://localhost:8000/${o}/${d}`)
    .catch(function (error) {
      reject(error)
    }).then(function (response) {
      console.log(response)
      resolve(response && response.data)
    }))
}

export default callData
