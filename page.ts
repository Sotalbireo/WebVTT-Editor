const fs = require('fs')
const path = require('path')
const { ipcRenderer } = require('electron')
const subtitlePath = path.resolve(path.join(__dirname, './data/subtitle.vtt'))
// const notePath = path.join(__dirname, 'note.txt')

let emmy :Emmy



class VideoController {
	private video :HTMLVideoElement
	// private duration :number
	constructor(_arg:{path:string,el:string}) {
		this.video = document.getElementById('Video')! as HTMLVideoElement
		this.video.addEventListener('timeupdate', _=>this.updateCurrentTime())
		this.video.addEventListener('loadedmetadata', _=>this.init())
	}
	formatTime(t:number, f=false) {
		let h   = ('0'  + Math.floor(t/3600)%60).slice(-2)
		let m   = ('0'  + Math.floor(t/60  )%60).slice(-2)
		let s   = ('0'  + Math.floor(t     )%60).slice(-2)
		let sss = ('00' + Math.floor(t%10*1000)).slice(-3)
		return (f)? `${h}:${m}:${s}.${sss}`: `${h}:${m}:${s}`
	}
	getCurrentTime(indent=0) {
		return this.video.currentTime + indent
	}
	pp() {
		if(this.video.paused || this.video.ended){
			this.video.play()
		}else{
			this.video.pause()
		}
	}
	reloadResource() {
		this.video.load()
	}
	seek(s:number) {
		this.video.currentTime += s
	}
	seek_f(f:number) {
		this.video.pause()
		this.video.currentTime += f*0.166 // ~1/60
	}
	init() {
		const el1 = 'CurrentTime'
		const el2 = 'TotalTime'
		document.getElementById(el1)!.textContent = this.formatTime(this.video.currentTime)
		document.getElementById(el2)!.textContent = this.formatTime(this.video.duration)
	}
	updateCurrentTime() {
		document.getElementById('CurrentTime')!.textContent = this.formatTime(this.getCurrentTime())
	}
}



class Consoles {
	private dom :HTMLTextAreaElement
	private latestNote :string = ''

	constructor(_arg:{path:string,el:string}) {
		this.dom = document.getElementById('Textarea') as HTMLTextAreaElement

		fs.readFile(subtitlePath,'utf8',(e:Event,data:any)=>{
			if(e) {
				throw e
			}else{
				this.dom.value = data
			}
		})

		document.querySelector('#CheckNow button')!.addEventListener('click',_=>this.wtiin())
		document.getElementById('Prev10')!.addEventListener('click',_=>emmy.video.seek(-10))
		document.getElementById('PlayPause')!.addEventListener('click',_=>emmy.video.pp())
		document.getElementById('Fwd10')!.addEventListener('click',_=>emmy.video.seek(10))
		document.getElementById('PutBegin')!.addEventListener('click',_=>this.putBegin())
		document.getElementById('PutEnd')!.addEventListener('click',_=>this.putEnd())

	}
	putBegin(indent = -0.05) {
		this.latestNote = `${emmy.video.formatTime(emmy.video.getCurrentTime(indent), true)} --> `
		this.dom.value += this.latestNote
	}
	putDiv() {
		this.latestNote = `${emmy.video.formatTime(emmy.video.getCurrentTime(), true)}\n${Math.floor(Math.random()*100000)}\n\n${emmy.video.formatTime(emmy.video.getCurrentTime(), true)} --> `
		this.dom.value += this.latestNote
	}
	putEnd() {
		this.latestNote = `${emmy.video.formatTime(emmy.video.getCurrentTime(), true)}\n${Math.floor(Math.random()*100000)}\n\n`
		this.dom.value += this.latestNote
	}
	resize() {
		let d = document.getElementById('TextareaFrame')!
		let r = d.getBoundingClientRect()
		d.setAttribute('height', (window.innerHeight - 12 - r.top) + 'px')
	}
	/**
	 * What time is it now?
	 */
	wtiin() {
		(document.querySelector('#CheckNow input') as HTMLInputElement)!.value = emmy.video.formatTime(emmy.video.getCurrentTime(), true)
	}
	deleteLatestNote() {
		if (this.latestNote.length === 0) return;
		this.dom.value = this.dom.value.slice(0, (-1 * this.latestNote.length))
		this.latestNote = ''
	}

}



class Emmy {
	private videoPath   :string
	private subtlPath   :string
	private videoElem   :string = 'Video'
	private consoleElem :string = 'Textarea'
	public video   :VideoController
	public console :Consoles

	constructor(_arg:any) {
		this.video = new VideoController({path:this.videoPath, el:this.videoElem})
		this.console = new Consoles({path:this.subtlPath, el:this.consoleElem})
		document.addEventListener('keydown', e=>this.keyEvents(e))
		window.addEventListener('resize', _=>this.console.resize())
		document.getElementById('Write')!.addEventListener('click',_=>this.writeFile())
		document.getElementById('WriteReload')!.addEventListener('click',_=>this.writeFile(true))
		this.console.resize()

		this.setIPC()
	}

	private keyEvents(e:KeyboardEvent) {
		if(/(textarea|input)/i.test(e.srcElement!.tagName)) return
		switch (e.key.toLowerCase()) {
			case 'v':
			case 'arrowleft':
				this.video.seek(-10)
				break
			case 'n':
			case 'arrowright':
				this.video.seek(10)
				break
			case 'c':
				if(e.shiftKey) {
					this.video.seek(-600)
				} else {
					this.video.seek(-60)
				}
				break
			case 'm':
				if(e.shiftKey) {
					this.video.seek(600)
				} else {
					this.video.seek(60)
				}
				break
			case ' ':
				this.video.pp()
				break
			case 'b':
				if(e.shiftKey) {
					this.video.seek_f(-1)
				} else {
					this.video.seek_f(1)
				}
				break
			case 'i':
				this.console.putBegin()
				break
			case 'o':
				this.console.putDiv()
				break
			case 'p':
				this.console.putEnd()
				break
			case 'c':
				this.console.wtiin()
				break
			case 's':
				if(e.ctrlKey) this.writeFile()
				break
			case '\\':
				this.console.deleteLatestNote()
				break
		}
	}

	private writeFile(flag=false) {
		let data = (document.getElementById('Textarea')! as HTMLTextAreaElement).value
		fs.writeFile(subtitlePath, data, (err:any)=>{
			if(err) throw err
			if(flag) window.location.reload()
		})
	}

	private setIPC() {
		ipcRenderer.on('Open-subtitle-file', (_:Event, res:string)=>{
			console.log(res)
		})
		ipcRenderer.on('Verify-for-Now-used-file', ()=>{

		})
		ipcRenderer.on('Verify-for-Open-file', (_:Event, res:string)=>{
			console.log(res)
		})


	}
}



/**
 * Run
 */
const Init = ()=>{
	emmy = new Emmy({})
}
if(document.readyState!=='loading'){
	Init()
}else{
	document.addEventListener('DOMContentLoaded',Init)
}
