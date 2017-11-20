import * as React from 'react'
import * as fs from 'fs'
import { Form, TextArea } from 'semantic-ui-react'

class Subtitle extends React.Component<any, any> {
	note:any
	constructor(props:any) {
		super(props)
		this.note = fs.readFile(this.props.url,'utf8', (e,data)=>{
			return !e ? data : 'ERR';
		})
	}
	render(){
		return (
			<Form>
				<TextArea
					rows=''
					style={{minHeight:'100%',maxHeight:'100%'}}
					value={this.note}
				/>
			</Form>
		)
	}
}

export default Subtitle
