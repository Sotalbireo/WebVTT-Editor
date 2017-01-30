import * as fs from 'fs'
import * as path from 'path'
const arrow = ' --> '
const filePath = path.join(__dirname, 'subtitle.ja.vtt')
let hogefuga = 1

const formatTime = (t:number, f=false)=>{
	let h  = ('0' + Math.floor(t/3600)%60).slice(-2)
	let m  = ('0' + Math.floor(t/60)%60).slice(-2)
	let hm = ('00' + Math.floor(t/60)).slice(-3)
	let s  = ('0' + Math.floor(t*1000%60000)/1000).slice(-6)
	return (f)? `${hm}:${s}`: `${h}:${m}:${s.slice(0,2)}`
}
let getCurrentTime = (indent=0)=>{
	return document.querySelectorAll('video')[0].currentTime + indent
}
let setCurrentTime = ()=>{
	setTimeout((document.querySelectorAll('#CurrentTime')[0].textContent = formatTime(getCurrentTime(), false)), 200)
}
let setTotalTime = ()=>{
	let v = document.querySelectorAll('video')[0]
	v.addEventListener("loadedmetadata", function() {
		let d = formatTime(v.duration)
		document.querySelectorAll('#TotalTime')[0].textContent = d.substr(0, d.length-2);
	}, false);
}

let startPause = ()=>{
	let v = document.querySelectorAll('video')[0]
	if(v.paused || v.ended){
		v.play()
	}else{
		v.pause()
	}
}
let prev10s = ()=>{
	let v = document.querySelectorAll('video')[0]
	v.currentTime -= 10
}

let appendTime = ()=>{
	let dom = document.querySelectorAll('textarea')[0]
	dom.textContent += `${formatTime(getCurrentTime(-0.5), true)}
Loem ipsum: ${hogefuga++}

${formatTime(getCurrentTime(), true)}${arrow}`
}

let overwriteFile = ()=>{
	if(confirm('Overwrite, right?\nIf Ok then this Page will Reload.')){
		let data = document.querySelectorAll('textarea')[0].value
		fs.writeFile(filePath, data, (err:any)=>{
			if(err) throw err
		})
	}
}

const textareaResize = ()=>{
	let d = document.querySelectorAll('#Textarea')[0]
	const h = window.innerHeight
	const rect = d.getBoundingClientRect()
	d.setAttribute('height', (h - 15 - rect.top) + 'px')
}



/**
 * INITS
 */
let preInit = ()=>{
	if(!isExistFile(filePath)){
		const data = `WEBVTT

000:00.000${arrow}000:05.999
This is "subtitle.ja.vtt"
`
		fs.writeFile(filePath, data, (err:any)=>{
			if(err){ throw err
			}else{
				location.reload(true)
			}

		})
	}
}

let Init = ()=>{

	textareaResize()
	setTotalTime()

	document.querySelectorAll('#StartPause')[0].addEventListener('click',startPause,false)
	document.querySelectorAll('#Prev10')[0].addEventListener('click',prev10s,false)
	document.querySelectorAll('#Overwrite')[0].addEventListener('click',overwriteFile,false)
	document.querySelectorAll('#Append')[0].addEventListener('click',appendTime,false)

	document.querySelectorAll('textarea')[0].innerText = fs.readFileSync(filePath,'utf8')

	document.querySelectorAll('video')[0].addEventListener('timeupdate', setCurrentTime, false)
	window.addEventListener('resize', textareaResize, false)
}





/**
 * Run
 */
let ready = (fn:any)=>{
	if(document.readyState!=='loading'){
		fn()
	}else{
		document.addEventListener('DOMContentLoaded',fn)
	}
}
preInit()
ready(Init)




/**
 * Utilities
 */
function isExistFile(file:string){
	try {
		fs.statSync(file)
		return true
	} catch(err) {
		if(err.code === 'ENOENT'){
			return false
		}else{
			console.error(err)
		}
	}
	return false
}
