
export type WaveViewConfig = {
  scale?: number,
  speed?: number,
  phase?: number,
  fps?: number,
  keep?: boolean,
  lineWidth?: number,
  linear1?: Array<any>,
  linear2?: Array<any>,
  linearBG?: Array<any>,
}

export class WaveView {

  private config: WaveViewConfig = {
    scale: 2,
    speed: 9,
    phase: 21.8,
    fps: 20,
    keep: true,
    lineWidth: 3,
    linear1: [0, "rgba(150,96,238,1)", 0.2, "rgba(170,79,249,1)", 1, "rgba(53,199,253,1)"],
    linear2: [0, "rgba(209,130,255,0.6)", 1, "rgba(53,199,255,0.6)"],
    linearBg: [0, "rgba(255,255,255,0.2)", 1, "rgba(54,197,252,0.2)"]
  }

  private sampleRate: number
  private pcmData: Array<number>
  private pcmPos: number
  private inputTime: number
  private timer: any
  private drawTime: number
  private _phase = 0;

  private context: CanvasRenderingContext2D
  private linear1: CanvasGradient
  private linear2: CanvasGradient
  private linearBG: CanvasGradient
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, config: WaveViewConfig) {
    this.canvas = canvas
    this.config = Object.assign(this.config, config)
    this.context = this.canvas.getContext('2d')

    this.linear1 = this.getLinear(canvas.width, this.config.linear1)
    this.linear2 = this.getLinear(canvas.width, this.config.linear2)
    this.linearBG = this.getLinear(canvas.width, this.config.linearBG, true)
  }

  getLinear(size: number, colors: Array<any>, top?: boolean) {
    let rtv = this.context.createLinearGradient(0, 0, top ? 0 : size, top ? size : 0)
    for (let i = 0; i < colors.length;) {
      rtv.addColorStop(colors[i++], colors[i++])
    }
    return rtv
  }

  genPath(frequency: number, amplitude: number, phase: number) {
    //曲线生成算法参考 https://github.com/HaloMartin/MCVoiceWave/blob/f6dc28975fbe0f7fc6cc4dbc2e61b0aa5574e9bc/MCVoiceWave/MCVoiceWaveView.m#L268
    let rtv = []
    let scale = this.config.scale
    let width = this.canvas.width * scale
    let maxAmplitude = this.canvas.height * scale / 2

    for (let x = 0; x < width; x += scale) {
      let scaling = (1 + Math.cos(Math.PI + (x / width) * 2 * Math.PI)) / 2
      let y = scaling * maxAmplitude * amplitude * Math.sin(2 * Math.PI * (x / width) * frequency + phase) + maxAmplitude
      rtv.push(y)
    }
    return rtv
  }

  input(pcmData: Array<any>, powerLevel: number, sampleRate: number) {
    this.sampleRate = sampleRate
    this.pcmData = pcmData
    this.pcmPos = 0

    this.inputTime = Date.now()
    this.schedule()
  }

  schedule() {
    // let set = this.config
    let interval = Math.floor(1000 / this.config.fps)
    if (!this.timer) {
      this.timer = setInterval(function () {
        this.schedule()
      }, interval)
    }

    let now = Date.now()
    let drawTime = this.drawTime || 0
    if (now - drawTime < interval) {
      //没到间隔时间，不绘制
      return
    }
    this.drawTime = now

    //切分当前需要的绘制数据
    let bufferSize = this.sampleRate / this.config.fps
    let pcm = this.pcmData
    let pos = this.pcmPos
    let len = Math.max(0, Math.min(bufferSize, pcm.length - pos))
    let sum = 0
    for (let i = 0; i < len; i++, pos++) {
      sum += Math.abs(pcm[pos])
    }
    this.pcmPos = pos

    //推入绘制
    if (len || !this.config.keep) {
      this.draw(this.powerlevel(sum, len))
    }
    if (!len && now - this.inputTime > 1300) {
      //超时没有输入，干掉定时器
      clearInterval(this.timer)
      this.timer = 0
    }
  }

  draw(powerLevel: number) {
    let scale = this.config.scale
    let width = this.canvas.width * scale
    let height = this.canvas.height * scale

    let speedx = this.config.speed / this.config.fps
    let phase = this._phase -= speedx //位移速度
    let phase2 = phase + speedx * this.config.phase
    let amplitude = powerLevel / 100
    let path1 = this.genPath(2, amplitude, phase)
    let path2 = this.genPath(1.8, amplitude, phase2)

    //开始绘制图形
    this.context.clearRect(0, 0, width, height)

    //绘制包围背景
    this.context.beginPath()
    let i = 0, x = 0;
    for (i = 0, x = 0; x < width; i++, x += scale) {
      if (x == 0) {
        this.context.moveTo(x, path1[i])
      } else {
        this.context.lineTo(x, path1[i])
      }
    }
    i--
    for (x = width - 1; x >= 0; i--, x -= scale) {
      this.context.lineTo(x, path2[i])
    }
    this.context.closePath()
    this.context.fillStyle = this.linearBG
    this.context.fill()

    //绘制线
    this.drawPath(path2, this.linear2)
    this.drawPath(path1, this.linear1)
  }

  drawPath(path: Array<number>, linear: CanvasGradient) {
    let scale = this.config.scale
    let width = this.canvas.width * scale

    this.context.beginPath()
    for (let i = 0, x = 0; x < width; i++, x += scale) {
      if (x == 0) {
        this.context.moveTo(x, path[i])
      } else {
        this.context.lineTo(x, path[i])
      }
    }
    this.context.lineWidth = this.config.lineWidth * scale
    this.context.strokeStyle = linear
    this.context.stroke()
  }

  powerlevel(pcmAbsSum: number, pcmLength: number) {
    /*计算音量 https://blog.csdn.net/jody1989/article/details/73480259
    更高灵敏度算法:
      限定最大感应值10000
        线性曲线：低音量不友好
          power/10000*100 
        对数曲线：低音量友好，但需限定最低感应值
          (1+Math.log10(power/10000))*100
    */
    let power = (pcmAbsSum / pcmLength) || 0;//NaN
    let level;
    if (power < 1251) {//1250的结果10%，更小的音量采用线性取值
      level = Math.round(power / 1250 * 10);
    } else {
      level = Math.round(Math.min(100, Math.max(0, (1 + Math.log(power / 10000) / Math.log(10)) * 100)));
    };
    return level;
  }
}

