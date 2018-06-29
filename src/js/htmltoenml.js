import html2any, {parse, transform} from 'html2any';
import $ from 'jquery';
import cssFilesText from './cssFiles';

const permittedElements = ['a', 'abbr', 'acronym', 'address', 'area', 'b', 'bdo', 'big', 'blockquote', 'br', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins', 'kbd', 'li', 'map', 'ol', 'p', 'pre', 'q', 's', 'samp', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'title', 'tr', 'tt', 'u', 'ul', 'var', 'xmp'];
const prohibitedElements = ['applet', 'base', 'basefont', 'bgsound', 'blink', 'body', 'button', 'dir', 'embed', 'fieldset', 'form', 'frame', 'frameset', 'head', 'html', 'iframe', 'ilayer', 'input', 'isindex', 'label', 'layer', 'legend', 'link', 'marquee', 'menu', 'meta', 'noframes', 'noscript', 'object', 'optgroup', 'option', 'param', 'plaintext', 'script', 'select', 'style', 'textarea', 'xml'];
const disallowedAttributes = ['id', 'class', 'onclick', 'ondblclick', 'onmousedown', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onkeydown', 'onkeypress', 'onkeyup', 'onabort', 'onerror', 'onload', 'onresize', 'onscroll', 'onunload', 'onblur', 'onchange', 'onfocus', 'onreset', 'onselect', 'onsubmit', 'accesskey', 'data', 'dynsrc', 'tabindex', 'data-te-task'];
const selfClosingTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'];

function test(html) {
  const ast = parse(html)[0];

  const vdom = transform(ast, function(node, children) {
  	if(node && node.attributes && node.attributes.class){
  		delete node.attributes.class;
  	}
  	return node;
  });
  console.log(vdom);
}

function filter(html) {
  let regAttribute, regElement;
  for(let attribute of disallowedAttributes){
  	regAttribute = new RegExp(attribute+"\\s*=\\s*[\'\"](.*?)[\'\"]\\s*", 'gi');
  	///class\s*=\s*['"](.*?)['"]\s*/gi
    // regAttribute = new RegExp("\\s*"+attribute+"\\s*=\\s*([\'\"])[^\\1]+?\\1", 'ig');
    html = html.replace(regAttribute, '');
  }
  for(let element of prohibitedElements){
    if(element in selfClosingTags){
      regElement = new RegExp("<"+element+".*?>.*?", 'ig');
    }else{
      regElement = new RegExp("<"+element+".*?>.*?<\\/"+element+">", 'ig');
    }
    html = html.replace(regElement, '');
  }
  return html;
}

function wrapEnml(html, md){
  // let enmlHead = "<?xml version='1.0' encoding='UTF-8'?>";
  let enmlHead = "";
  let enmlDoctype = "<!DOCTYPE en-note SYSTEM 'http://xml.evernote.com/pub/enml2.dtd'>";
  let enNoteStart = "<en-note>";
  let hiddenMD = "<center style='display:none !important;visibility:collapse !important;height:0 !important;white-space:nowrap;width:100%;overflow:hidden'>"+encodeURIComponent(md)+"</center>";
  let enNoteEnd = "</en-note>";
  let filteredHtml = filter(html);
  let finalEnml = new String();
  finalEnml = finalEnml.concat(enmlHead, enmlDoctype, enNoteStart, filteredHtml, hiddenMD, enNoteEnd);
  return finalEnml;
  //.replace(/\s*class\s*=\s*([\'\"])[^\1]+?\1/ig, '');
  //replace(/<p.*?>.*?<\/p>/ig, '');
}

export const getMDFromEnml = (enml) => {
  //get the center tag include the content
  let regCenter = new RegExp("<center.*?>.*?<\\/center>", 'ig');
  let arr = regCenter.exec(enml);
  if(arr !== null && arr.length > 0){
  	//get the content from the center tag
  	let regCenterContent = new RegExp("<center.*?>(.+)<\\/center>", 'ig');
  	let res = regCenterContent.exec(arr[0]);
  	if(res !== null && res.length > 0){
  		return decodeURIComponent(res[1]);
  	}else{
  		return '';
  	}
  }else{
    return '';
  }
}

export const htmltoenml = (previewHtml, md) => {
  const juiceOpts = {
    preserveMediaQueries: true,
    removeStyleTags: true,
    webResources: {
      images: false
    }
  };

  let html = '<div class="tui-editor-contents">'+previewHtml+'</div>';
  let styledHtml = juice.inlineContent(html, cssFilesText, juiceOpts);
  let finalEnml = wrapEnml(styledHtml, md);
  return finalEnml;
}

