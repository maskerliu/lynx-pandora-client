
import { loadImage } from '.'

async function genThumb(avatars: Array<string>) {
  let canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 320
  let context = canvas.getContext('2d')
  context.rect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#eee'
  context.fill()

  let size = 100, margin = 5, cols = 3
  if (avatars.length <= 4) {
    size = 135, margin = 17, cols = 2
  }

  for (let i = 1; i <= avatars.length; ++i) {
    if (i >= 10) break
    let img = await loadImage(avatars[i - 1])

    let marginLeft = margin
    if (avatars.length == 3 && i == 3) marginLeft = 90

    context.drawImage(img,
      (i - 1) % cols * (size + margin) + marginLeft,
      Math.floor((i - 1) / cols) * (size + margin) + margin,
      size, size)
  }

  let resp = await fetch(canvas.toDataURL('img/png'))
  let blob = await resp.blob()
  return new File([blob], 'test.png', { type: blob.type })
}

function getScaleSize(w: number, h: number, maxWidth: number, maxHeight: number) {
  let widthRatio = w / maxWidth
  let heightRatio = h / maxHeight


  if (widthRatio < 1 && heightRatio < 1) {
    return [w, h]
  }

  if (widthRatio > heightRatio) {
    return [Math.floor(maxWidth), Math.floor(h / widthRatio)]
  } else {
    return [Math.floor(w / heightRatio), Math.floor(maxHeight)]
  }
}

export { genThumb, getScaleSize }