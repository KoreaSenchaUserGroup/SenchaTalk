Ext.define("SenchaTalk.view.Chat", {
	extend: 'Ext.Panel',
	xtype: 'chatpanel',
	
	config: {
		title: '대화',
		iconCls: 'reply',
		scrollable: true,
		styleHtmlContent: true,
		html: [
    		"I changed the default <b>HTML Contents</b> to something different!"
		].join("")
	}
});