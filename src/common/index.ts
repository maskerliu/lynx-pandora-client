import userImg from '../asserts/user.png'

export function generateUid(): string {
  let len = 8
  let res = []
  for (let i = 0; i !== len; ++i) {
    res.push(
      String.fromCharCode(
        Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97)
      )
    )
  }
  res.push(new Date().getTime() + 'o')
  return res.join('')
}

export function throttle(fn: Function, delay: number) {
  let timer = null
  return (...args: any) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

export function map2json(map: Map<any, any>): JSON {
  let json = Object.create(null)
  for (let [key, value] of map) {
    json[key] = value
  }
  return json
}

export function json2map(obj: JSON): Map<any, any> {
  let map = new Map()
  for (let key of Object.keys(obj)) {
    map.set(key, obj[key])
  }
  return map
}

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function dateformat(format: string) {
  var o = {
    "M+": this.getMonth() + 1, //month  
    "d+": this.getDate(), //day  
    "h+": this.getHours(), //hour  
    "m+": this.getMinutes(), //minute  
    "s+": this.getSeconds(), //second  
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter  
    "S": this.getMilliseconds() //millisecond  
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substring(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
          ("00" + o[k]).substring(("" + o[k]).length))
  return format
}

export function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.src = url == null ? userImg : url
    img.crossOrigin = 'Anonymous'
    img.addEventListener('load', () => {
      resolve(img)
    })
    img.addEventListener('error', (err) => reject(err))
  })
}
