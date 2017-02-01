import * as fs from 'fs'
import * as path from 'path'
const filePath = path.join(__dirname, 'subtitle.ja.vtt')
let video :HTMLVideoElement



const formatTime = (t:number, f=false)=>{
	let h  = ('0' + Math.floor(t/3600)%60).slice(-2)
	let m  = ('0' + Math.floor(t/60)%60).slice(-2)
	let s  = ('0' + Math.floor(t)%60).slice(-2)
	return (f)? `${h}:${m}:${s}.${Math.floor(t*1000%60000).toString().slice(-3)}`: `${h}:${m}:${s}`
}
let getCurrentTime = (indent=0)=>{
	return video.currentTime + indent
}
let setCurrentTime = ()=>{
	document.getElementById('CurrentTime')!.textContent = formatTime(getCurrentTime())
}
let setTotalTime = ()=>{
	video.addEventListener("loadedmetadata", function() {
		document.getElementById('TotalTime')!.textContent = formatTime(video.duration)
	}, false)
}

let startPause = ()=>{
	if(video.paused || video.ended){
		video.play()
	}else{
		video.pause()
	}
}

let videoSeek = (s:number)=>{
	video.currentTime += s
}

let appendBegin = ()=>{
	let dom = document.getElementsByTagName('textarea')[0]
	dom.value += `${formatTime(getCurrentTime(-0.01), true)} --> `
}
let appendEnd = ()=>{
	let dom = document.getElementsByTagName('textarea')[0]
	dom.value += `${formatTime(getCurrentTime(), true)}
Loem ipsum ${Math.floor(Math.random()*100000)}\n\n`
}

let keyboardEvents = (e:KeyboardEvent)=>{
	if(/textarea/i.test(e.srcElement!.tagName)) return

	switch (e.key.toLowerCase()) {
		case 'q':
			videoSeek(-10)
			break
		case 'e':
			videoSeek(10)
			break
		case ' ':
			startPause()
			break
		case 'i':
			appendBegin()
			break
		case 'o':
			appendEnd()
			break
	}
}



let overwriteFile = ()=>{
	if(confirm('Overwrite, right?\nIf Ok then this Page will Reload.')){
		let data = document.getElementsByTagName('textarea')[0].value
		fs.writeFile(filePath, data, (err:any)=>{
			if(err){ throw err
			}else{ location.reload(true)
			}
		})
	}
}

const textareaResize = ()=>{
	let d = document.getElementById('Textarea')!
	let r = d.getBoundingClientRect()
	const h = window.innerHeight
	d.setAttribute('height', (h - 30 - r.top) + 'px')
}



/**
 * Inits
 */
let preInit = ()=>{
	if(!isExistFile(filePath)){
		const data = fs.readFileSync(path.join(__dirname, 'assets', 'sample.vtt.txt'), 'utf8')
		fs.writeFile(filePath, data, (err:any)=>{
			if(err){ throw err
			}else{
				location.reload(true)
			}

		})
	}
}

let Init = ()=>{
	video = document.getElementsByTagName('video')[0]
	textareaResize()
	setTotalTime()

	document.getElementById('StartPause')!.addEventListener('click',startPause,false)
	document.getElementById('Prev10')!.addEventListener('click',_$=>videoSeek(-10),false)
	document.getElementById('Fwd10')!.addEventListener('click',_$=>videoSeek(10),false)
	document.getElementById('Overwrite')!.addEventListener('click',overwriteFile,false)
	document.getElementById('AppendBegin')!.addEventListener('click',appendBegin,false)
	document.getElementById('AppendEnd')!.addEventListener('click',appendEnd,false)
	document.addEventListener('keydown', keyboardEvents, false)

	document.getElementsByTagName('textarea')[0].value = fs.readFileSync(filePath,'utf8')

	video.addEventListener('timeupdate', setCurrentTime, false)
	window.addEventListener('resize', textareaResize, false)
}





/**
 * Run
 */
preInit()
if(document.readyState!=='loading'){
	Init()
}else{
	document.addEventListener('DOMContentLoaded',Init)
}





/**
 * Utilities
 */
function isExistFile(file:string){
	try {
		fs.statSync(file)
		return true
	} catch(err) {
		if(err.code !== 'ENOENT') console.error(err)
		return false
	}

}
