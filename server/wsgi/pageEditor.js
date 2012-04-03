var pageEditor = {
    event: 0 , //Use this var to store the event object, which will be passed for editor.
    m4pageedittype: '',
    savedHtml: '',
    startEdit: function(event)
    {
	//console.log(event.target);
	event.stopPropagation();
	event.preventDefault();
	pageEditor.event = event;
	pageEditor.m4pageedittype = $(event.target).attr('m4pageedittype');
	if($(event.target).attr('m4pageedittype') == 'text')
	{
	    $('#edit-text').show();	    
	    $('#add-audio').show();
	    $('#add-link').show();
	    $('#replace-image').hide();
	    $('#delete-image').hide();

	    $('#pub_overlay').slideDown();
	    $('#element_edit_overlay').slideDown();
	    
	    // At this point 'displayEditor' function will be performed on click of 'Edit Text' button
	    // displayEditor function is in ui.js file
	}
	else if($(event.target).attr('m4pageedittype') == 'image')
	{
	    $('#replace-image').show();
	    $('#delete-image').show();
	    $('#add-audio').hide();
	    $('#add-link').hide();;
	    $('#edit-text').hide();

	    $('#element_edit_overlay').slideDown();
	    $('#pub_overlay').slideDown();
	    // At this point 'imageReplacer' function will be performed on click of 'Replace Image' button
	    // imageReplacer function is in ui.js
	} else {
	    $('#element_edit_overlay').slideUp();

	    $('#edit-text').hide();
	    $('#add-audio').hide();
	    $('#add-link').hide();
	    $('#replace-image').hide();
	    $('#delete-image').hide();
	}
    },
    addLink: function(){
	$(pageEditor.event.target).mouseup(pageEditor.handler);
    },
	handler: function()
	{
	    var sel = window.getSelection();
	    y = sel.anchorOffset;
	    z = sel.focusOffset;
	    if(y != z)
	    {
		pageEditor.savedHtml = $(pageEditor.event.target).html();
		var url = prompt("Enter url");
//		var regex = new RegExp(^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?)))
		sel.anchorNode.textContent = sel.anchorNode.textContent.substr(0,y)+'<a href="'+url+'">'+sel.anchorNode.textContent.substr(y,z-y)+"</a>"+sel.anchorNode.textContent.substr(z);
		abc = $(pageEditor.event.target).html();
		abc = abc.replace(/(&lt;)/g,'<');
		abc = abc.replace(/(&gt;)/g,'>');
		$(pageEditor.event.target).html(abc);
		manager.updateText(pageEditor.event.target);
		$(pageEditor.event.target).unbind('mouseup', pageEditor.handler);
	    }
	    else{
		//
	    }
	},
    deleteImage: function(){
	manager.deleteImage(pageEditor.event.target);
    },
    
    cleanUp: function(element)
    {
	$(element).attr('m4pageedittype', pageEditor.m4pageedittype);
	$(element).children().attr('m4pageedittype', pageEditor.m4pageedittype);

	$(document).mouseover(a11ypi.highlightOnHover);
	$(document).mouseout(a11ypi.unhighlightOnMouseOut);

    },
};

var DOM = {
    getXpath : function (element)
    {
	var str = '';
	var currentNode = element;
	var path = '';
	var index = -1;

	if (currentNode.nodeName != "#text")
	{
	    path = DOM.makePath(currentNode);
	}
	else
	{
	    path = DOM.makePath(currentNode.parentNode);
	}

    	
	return path;
    },
    getElementIdx : function getElementIdx(elt)
    {
	var count = 1;
	for (var sib = elt.previousSibling; sib ; sib = sib.previousSibling)
	{
	    if(sib.nodeType == 1 && sib.tagName == elt.tagName)count++
	}
	
	return count;
    },
    
    makePath : function makePath(elt){
	if(elt.tagName != 'IMG')
	    elt = elt.parentNode;
    	var path = '';
	for (; elt && elt.nodeType == 1; elt = elt.parentNode)
	{
	    if(elt.id == "")
	    {
		idx = DOM.getElementIdx(elt);
		xname = elt.tagName;
		if (idx > 1) 
		    xname += "[" + idx + "]";
		path = "/" + xname + path;
	    }
	    else
	    {
		path = "//*[@id='"+elt.id+"']"+path;
		break;
	    }
	}
	return path;
    },
    settextContent : function(element, content){
	$(element).html(content);
    },
    gettextContent:function(element)
    {
	return $(element).html();
    },

    // (function() {  Re-wrote this portion in simpler terms.  TO BE CLEANED.
    // 	if (document.all) {
    // 	    // IE specific
    // 	    return function textContent(element, content) {
    // 		if (content) {
    // 		    element.innerText = content;
    // 		}
    // 		return element.innerText;
    // 	    }
    // 	} else {
    // 	    return function textContent(element, content) {
    // 		if (element == undefined) {
    // 		    element = document.getElementById("alipiSelectedElement");
    // 		    content = document.getElementById("alipiSelectedElement").innerHTML;
    // 		    element.innerHTML = content;
    // 		} else if (content) {
    // 		    element.innerHTML = content;
    // 		}
    // 		return element.innerHTML;
    // 	    }
    // 	}
    //     })(),
};

var util = {
    // historyObj : function (pageEditor) {
    // 	var self = this, history = [], imageSrc, imageMatcher, imageHeight, imageWidth, buildDataString, anchorElement, anchorElementId, ajaxResultProcessor = new AjaxResultProcessor();
    history: [],
    command: [],

    forEach : function(array, callback) {
	var i = 0, length = array.length, value;

	if (length) {
	    for (value = array[0]; i < length && callback.call(value, i, value) !== false; value = array[++i]) {
	    }
	}
    },
    hasChangesPending : function(){
	return util.history.length > 0;
    },
    formUncomplete : function formUnomplete(){
	return (locName == '' &&  langName=='' && styleName == '' );
    },
    
    recordHistory: function (command, selectedElement) {
	var poofPosition, poofDiv;
	util.command = command;
	switch (util.command.command) {
        case 'TEXT_UPDATE':
	    util.command.element = selectedElement;
	    if($('#reference').html() !=null)
	    {
		abc = $('#reference').html();
		abc = abc.replace(/(&lt;)/g,'<');
		abc = abc.replace(/(&gt;)/g,'>');
		util.command.previousData = abc;
	    }
	    else
		util.command.previousData = pageEditor.savedHtml;
	    if($("#editor").html() != null)
		util.command.data = $("#editor").html();
	    else
		util.command.data = $(selectedElement).html();
	    DOM.settextContent(util.command.element, util.command.data);
//	    pageEditor.showMessage('Text changed');
	    break;
        case 'AUDIO_SRC_UPDATE':
	    textElementPopup.hasAudio = true;	
	    util.command.previousData = "";
	    //pageEditor.showMessage('Audio updated');
	    break;

        case 'IMAGE_DELETE':
	    $(selectedElement).hide();
	    break;
// case 'DELETE':
	    // 	poofPosition = DOM.findPosition(command.element);

	    // 	poofDiv = DOM.BUILDER.DIV({'style' : 'width:32px;height:32px;background: transparent url(http://y.a11y.in/alipi/images/poof.png) no-repeat;position:absolute;top:' + poofPosition.y + 'px;left:' + poofPosition.x + 'px;'});
	    // 	document.body.appendChild(poofDiv);

	    // 	UTIL.animate(function(index, last) {
	    // 		if (last) {
	    // 		    document.body.removeChild(poofDiv);
	    // 		} else {
	    // 		    poofDiv.style.backgroundPosition = '0 -' + (index * 32) + 'px';
	    // 		}
	    // 	    }, 5, 100);

	    // 	DOM.overrideStyleProperty(command.element, 'display', 'none');
	    // 	pageEditor.showMessage('Section deleted');
	    // 	break;

        case 'IMAGE_SRC_UPDATE':
	    console.log(command.data);
	    imageMatcher = new RegExp("(\\d+)x(\\d+),(.+)").exec(util.command.data);
	    imageWidth = imageMatcher[1];
	    imageHeight = imageMatcher[2];
	    imageSrc = imageMatcher[3];

	    if (imageSrc && util.command.element.src != imageSrc) {
		util.command.element.src = imageSrc;
		//pageEditor.showMessage('Image changed');
	    }
	    if (imageWidth == 0) {
		util.command.element.removeAttribute('width');
	    } else {
		util.command.element.width = imageWidth;
	    }

	    if (imageHeight == 0) {
		util.command.element.removeAttribute('height');
	    } else {
		util.command.element.height = imageHeight;
	    }
	    break;

        case 'ANCHOR_UPDATE':
	    util.command.element.setAttribute('href', util.command.data);
	    pageEditor.showMessage('Link changed');
	    break;

        case 'ANCHOR_CREATE':
	    anchorElement = DOM.BUILDER.A({ 'href' : util.command.data });
	    console.log(util.command.element);
	    util.command.element.parentNode.replaceChild(anchorElement, util.command.element);
	    anchorElement.appendChild(util.command.element);
	    util.command.previousData = anchorElement;
	    pageEditor.showMessage('Link added');
	    break;

	case 'AUDIO_UPDATE':
	    util.command.element.setAttribute('src', util.command.data);
	    pageEditor.showMessage('Audio changed');
	    break;
	    
        case 'AUDIO_CREATE':
	    audioElement = document.createElement('audio');
	    audioElement.setAttribute("id", "audiotag");
	    audioElement.setAttribute('src',util.command.data);
	    audioElement.setAttribute('controls','controls');
	    audioElement.setAttribute('style', 'display:table;');
	    $(audioElement).insertBefore($(selectedElement));		
	    pageEditor.showMessage('Audio added');
	    break;

        default:
	    console.error('Unknown util.command:', util.command);
	}

	util.history.push(util.command);
    },

    undoChanges:function () {
	var imageElement, command=util.command;

	if (util.hasChangesPending()) {
	    command = util.history.pop();
	    switch (command.command) {
	    case 'TEXT_UPDATE':
		console.log(command.previousData);
		command.element.innerHTML = command.previousData;
		//		pageEditor.showMessage('Text change undone');
		break;

	    case 'DELETE':
		DOM.restoreStyleProperty(command.element, 'display', '');
		//		pageEditor.showMessage('Delete undone');
		break;

	    case 'IMAGE_SRC_UPDATE':
		//		imageElement = new M4ImageElement(command.element);

		command.element.src = command.previousData.src;
		if (command.previousData.size.width) {
		    command.element.width = command.previousData.size.width;
		} else {
		    command.element.removeAttribute('width');
		}
		if (command.previousData.size.height) {
		    command.element.height = command.previousData.size.height;
		} else {
		    command.element.removeAttribute('height');
		}
		//		imageElement.setRawImageSize(command.previousData.rawImageSize)

		//		pageEditor.showMessage('Image change undone');
		break;
		
	    case 'AUDIO_SRC_UPDATE':
		command.element.remove();
		//		pageEditor.showMessage('Link removed');
		break;
	    case 'ANCHOR_UPDATE':
		command.element.setAttribute('href', command.previousData);
		//		pageEditor.showMessage('Link change undone');
		break;

	    case 'ANCHOR_CREATE':
		command.previousData.parentNode.replaceChild(command.element, command.previousData);
		//		pageEditor.showMessage('Link removed');
		break;
	    case 'IMAGE_DELETE':
		$(command.element).show();
		break;
	    default:
		console.error('Unknown command:', command);
	    }
	} else {
	    //	    pageEditor.showMessage('Nothing to undo');
	}
    },
    checkHistoryChanges: function()
    {
	if(util.hasChangesPending())
	{
	    $('#undo-button').attr('disabled',false);
	    $('#publish-button').attr('disabled',false);
	}
	else{
	    $('#undo-button').attr('disabled',true);
	    $('#publish-button').attr('disabled',true);
	}
    },

    publish:function (){
	var result;
	if(document.getElementById('your-check').checked)
	{
	    localStorage.myContent = buildDataString();
	    window.location.href = "http://dev.a11y.in/test.html";
	    window.reload();
	}
	else{
	    
	    AJAX.post('http://dev.a11y.in/test',  buildDataString(), function(result) {
	    	ajaxResultProcessor.processPublishedResponse(result);
	    });
	}
    },
    
    buildDataString : function (){
	var check_xpath = [], temp_history = [], index = [];
	for(x=0; x<util.history.length; x++) {
	    check_xpath.push(util.history[x].xpath);
	}
	for(i=0; i<check_xpath.length-1; i++) {
	    for(j=i+1; j<check_xpath.length; j++) {
		if ((check_xpath[i] == check_xpath[j]) && (util.history[i].elementType == util.history[j].elementType)) {
		    index.push(i);
		} 
	    }
	}
	if (index.length > 0) {
	    for (var z=0; z<index.length; z++) {
		delete util.history[index[z]];
	    }
	}
	
	for (var x=0; x<util.history.length; x++) {
	    if (util.history[x] != undefined) {
		temp_history.push(util.history[x]);
	    }
	}

	util.history = temp_history;
	console.log("hello" + styleSelect.innerHTML);
	var command, buffer;
	buffer = new UTIL.StringBuffer();
	util.forEach(util.history, function(index, command) {
	    buffer.append('###'); //separates the commands
	    buffer.append('about=');  //url=about    //removed '&' on purpose
	    buffer.append(window.location.search.split('=')[1]);
	    buffer.append('&lang=');//lang
	    buffer.append(encodeURIComponent(langName.innerHTML));
	    buffer.append('&location=');//location
	    buffer.append(encodeURIComponent(locName.innerHTML));
	    buffer.append('&style=');//style
	    buffer.append(encodeURIComponent(styleSelect.innerHTML));
	    buffer.append('&blog=');  //blog where to post
	    buffer.append(encodeURIComponent("blog"));
	    buffer.append('&elementtype='); // text, audio, img
	    buffer.append(encodeURIComponent(command.elementType));
	    buffer.append('&xpath=');//xpath
	    buffer.append(encodeURIComponent(command.xpath));
	    buffer.append('&data=');  //data
	    buffer.append(encodeURIComponent(command.data));
	    buffer.append('&author='); //author
	    if (author.value == '') {
		buffer.append(encodeURIComponent('Anonymous'));
	    } else {
		buffer.append(encodeURIComponent(author.value));
	    }
	});  	    console.log(buffer.toString());	    
	return buffer.toString().substring(3);
    },
};

var manager = {
    updateText:function (selectedElement) {
	var prevData;
	if($("#editor").html() != null)
	    prevData = $('#editor').html();
	else
	    prevData = pageEditor.savedHtml;
	var command = {
	    command : 'TEXT_UPDATE',
	    element : selectedElement,
	    url : window.location.href,
	    xpath : DOM.getXpath(selectedElement),
	    elementType : 'text',
	    data : DOM.gettextContent(selectedElement),
	    previousData : prevData
        }; 
	// (DOM.gettextContent(selectedElement).length == 0) {
	//   manager.deleteElement(selectedElement);
	util.recordHistory(command, selectedElement); 
    },
    deleteElement : function(selectedElement) {
	var command = {
	    command : 'DELETE',
	    element : selectedElement,
	    url : '',
	    elementType : 'text',
	    data : '',
	    xpath : '',
	    data : '',
	    previousData : ''
	};
	util.recordHistory(command, selectedElement); 
    },
    updateImage: function(selectedElement, url)
    {
	console.log(url);
	var command = {
	    command : 'IMAGE_SRC_UPDATE',
	    element : selectedElement,
	    elementType : 'image',
	    xpath : DOM.getXpath(selectedElement),
	    url : window.location.href,
	    data : new StringUtil.StringBuffer().append(selectedElement.width).append('x').append(selectedElement.height).append(',').append(url).toString(),
	    previousData : {
		'src' : selectedElement.src,
		'size' : { width: selectedElement.width, height: selectedElement.height }
		//'rawImageSize' : image.getRawImageSize()
	    }
	};
	util.recordHistory(command, selectedElement);
    },
    deleteImage : function(selectedElement) {
	var command = {
	    command : 'IMAGE_DELETE',
	    element : selectedElement,
	    url : window.location.href,
	    elementType : 'image',
	    data : '',
	    xpath : '',
	    data : '',
	    previousData : {
		'src' : selectedElement.src,
		'size' : { width: selectedElement.width, height: selectedElement.height }
	    }
	};
	util.recordHistory(command, selectedElement); 
    },

};
//Implementing the class for doing StringBuffer.
var StringUtil = StringUtil || {};
(function(StringUtil){
    StringUtil.StringBuffer = function StringBuffer() {
	var buffer = [];
	this.append = function append(string) {
	    buffer.push(string);
	    return this;
	};

	this.toString = function toString() {
	    return buffer.join('');
	};
    };
})(StringUtil);
