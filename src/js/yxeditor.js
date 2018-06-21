/**
 * @author Patrick for the first version of yx editor
 */
import ToastUIEditor from './editor';
import enml from 'enml-js';

class YXEditor {
  constructor(options) {
    this.editor = new ToastUIEditor(options);
    this.editor.on('focus', () => {
      this.onEditorFocus();
    });
    this.editor.on('setMarkdownAfter', () => {
      setTimeout(() => {
        console.log('contentLoaded');
        this.notify('contentLoaded', { module: 'content' });
      }, 0);
    });
    this.editor.on('contentChangedFromMarkdown', () => {
      console.log('content changes');
      this.notify('contentChanged', { module: 'content' });
    });
  }

  setup(content) {
    console.log(JSON.parse(content));
    let plaintext = enml.PlainTextOfENML(JSON.parse(content).rte.enml);
    this.editor.setMarkdown(plaintext);
    console.log('setup');

    return true;
  }

  getValue() {
    let plaintext = this.editor.getValue();

    return enml.ENMLOfPlainText(plaintext);
  }

  getPlainText() {
    return this.editor.getValue();
  }

  getHtml() {
    let html = this.editor.preview.getHTML();

    return html;
  }

  cleanup() {
    this.editor = null;
  }

  onEditorFocus() {
    this.notify('focusChanged', {
      focus: true, module: 'content',
      showInput: true
    });
  }

  execCommand(content) {
    let html = enml.HTMLOfENML(content);

    return this.editor.setHtml(html);
  }

  queryCommandValue(command, opt) {
    let data = {};
    let result = '';
    data.success = true;
    data.value = enml.ENMLOfPlainText(this.editor.getValue());
    // let encodedMd = encodeURIComponent(this.editor.getValue());
    // data.value = this.getHtml() + '<center style="display:none !important;visibility:collapse !important;height:0 !important;white-space:nowrap;width:100%;overflow:hidden">'+encodedMd+'</center>'
    
    if (command === 'focus' || command === 'content') {
      result = JSON.stringify(data);
    } else if(command === 'rte.changes'){
      result = true;
    } else {
      result = '[]';
    }

    return result;
  }

  queryCommandState(command = '', opt) {

    return this.queryCommandValue(command, opt || null);
  }

  notify(name, info) {
    info = info || {};
    info.version = '1.0';

    if (window.Evernote && window.Evernote.handleJavascriptEvent) {
      window.Evernote.handleJavascriptEvent(name, JSON.stringify({
        name: name,
        info: info
      }));
    } else if (window.evernoteClient && window.evernoteClient.postNotification) {
      window.evernoteClient.postNotification(name, JSON.stringify(info));
    } else if (window.noteEditor && window.noteEditor.handleJavascriptEvent) {
      window.noteEditor.handleJavascriptEvent(name, JSON.stringify(info) || null);
    } else if (window.evernoteClient && window.evernoteClient.handleNotificationInfo) {
      window.evernoteClient.handleNotificationInfo(name, info);
    }
  }
}
module.exports = YXEditor;
