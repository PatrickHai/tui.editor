/**
 * @author Patrick for the first version of yx editor
 */
import ToastUIEditor from './editor';
import enml from 'enml-js';

class YXEditor {
  constructor(options) {
    this.editor = new ToastUIEditor(options);
  }

  setup(content) {
    let plaintext = enml.PlainTextOfENML(content);

    return this.editor.setValue(plaintext);
  }

  getValue() {
    let plaintext = this.editor.getValue();

    return enml.ENMLOfPlainText(plaintext);
  }

  getPlainText() {
    return this.editor.getValue();
  }

  cleanup() {
    this.editor = null;
  }

  execCommand(content) {
    let html = enml.HTMLOfENML(content);

    return this.editor.setHtml(html);
  }
}
module.exports = YXEditor;
