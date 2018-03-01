import axios from 'axios'

const uri = {
  getData: {
    method: 'get',
    mock: '/src/mock/data.json'
  }
}

let apis = {}
Object.keys(uri).forEach(item => {
  apis[item] = function (data) {
    let obj = uri[item]
    let promise
    let config = {
      method: obj.method || 'get',
      url: process.env.NODE_ENV === 'development' ? obj.mock : obj.url,
      headers: obj.headers || { 'Content-Type': 'application/json' }
    }
    if (obj.dataType !== 'postjson') {
      config.transformRequest = [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret && ret.substring(0, ret.length - 1)
      }]
    }
    promise = axios(config).then(response => {
      return response.data || {}
    })
    promise.catch(error => {
      console.log(error)
    })
    return promise
  }
})

export default apis
