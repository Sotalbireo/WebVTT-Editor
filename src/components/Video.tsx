import * as React from 'react'

class Video extends React.Component<any, any> {
	constructor(props:any) {
		super(props)
	}
	render(){
		return (
			<video
				controls
				poster={require('file-loader?name=[name].[ext]!placehold.png')}
				preload="auto"
				width="100%"
				height="auto"
			>
				<source src={this.props.url} type="video/mp4" />
				<track label="Japanese" kind="subtitles" src="./subtitle.ja.vtt" default></track>
			</video>
		)
	}
}

export default Video
