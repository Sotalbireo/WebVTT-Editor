/// <reference path="../interface.d.ts" />

export default class Ai {
	public static popinAlert(attr?: PopinAlertCue) {
		attr = attr || {};
		attr.type = attr.type || 'danger';
		attr.head = attr.head || 'Oops!';
		attr.str  = attr.str  || 'General error.';
		const alert = `
<div class="alert alert-${attr.type}" role="alert">
	<h4 class="alert-heading">${attr.head}
		<button type="button" class="close" data-dismiss="alert"
		aria-label="Close" 	onClick="javascript:this.parentNode.parentNode.outerHTML='';"><span aria-hidden="true">&times;</span>
		</button>
	</h4>
  <p class="mb-0">${attr.str}</p>
</div>`;
		document.getElementById('Body')!.insertAdjacentHTML('beforebegin', alert);
	}
}
