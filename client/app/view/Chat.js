Ext.define("SenchaTalk.view.Chat", {
	extend: 'Ext.Panel',
	xtype: 'chatpanel',
	
	config: {
		title: '대화',
		iconCls: 'reply',
		scrollable: true,
		styleHtmlContent: true,
		html: [
			' <ul id="chat">                                               ' +
			' <div id="nickname">                                          ' +
			' 	<form id="set-nickname" class="wrap">                      ' +
			' 		<p>Please type in your nickname and press enter.</p>   ' +
			' 		<input id="nick">                                      ' +
			' 		<p id="nickname-err">Nickname already in use</p>       ' +
			' 	</form>                                                    ' +
			' </div>                                                       ' +
			' <div id="connecting">                                        ' +
			' 	<div class="wrap">Connecting to socket.io server</div>     ' +
			' </div>                                                       ' +
			' <div id="messages">                                          ' +
			' 	<div id="nicknames"></div>                                 ' +
			' <div id="lines"></div>                                       ' +
			' </div>                                                       ' +
			' <form id="send-message">                                     ' +
			' 	<input id="message">                                       ' +
			' 	<button>Send</button>                                      ' +
			' </form>                                                      ' +
			' </ul>                                                        ' 
		].join("")
	}
});