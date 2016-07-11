'use babel';

import JsinspectView from './jsinspect-view';
import { CompositeDisposable } from 'atom';
import { execFile } from 'child_process';

export default {

  jsinspectView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.jsinspectView = new JsinspectView(state.jsinspectViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.jsinspectView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'jsinspect:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.jsinspectView.destroy();
  },

  serialize() {
    return {
      jsinspectViewState: this.jsinspectView.serialize()
    };
  },

  toggle() {
    var scriptdir = __filename.replace("lib/jsinspect.js","node_modules/jsinspect/bin/");
    console.log('Jsinspect was toggled!');
    /*async function sh(cmd) {
      return new Promise(function (resolve, reject) {
        execFile(cmd, (err, stdout, stderr) => {
          if (err) {
            reject(err);
          } else {
            resolve({ stdout, stderr });
          }
        });
      });
    }

    async function main() {
      console.log(script);
      let { stdout } = await sh('/Users/harriet/github/jsinspect/node_modules/jsinspect/bin/jsinspect');
      for (let line of stdout.split('\n')) {
        console.log(`Return: ${line}`);
      }
    }

    main();*/
    const child = require('child_process');
    //TODO: Add folder path to command
    const task1 = child.exec("cd "+scriptdir+"; jsinspect", (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
    });
  }

};
