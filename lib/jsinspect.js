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

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'jsinspect:toggle': () => this.toggle(),
      'jsinspect:close': () => this.closePanel()
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
    if(this.bottomPanel){
      if(this.bottomPanel.isVisible()){
        this.bottomPanel.hide();
      }else{
        this.run();
      }
    }else{
      this.run();
    }
  },

  closePanel(){
    if(this.bottomPanel){
      if(this.bottomPanel.isVisible()){
        this.bottomPanel.hide();
      }
    }
  },

  run(){
    var scriptdir = __filename.replace("lib/jsinspect.js","node_modules/jsinspect/bin/");
    var currentFile = atom.workspace.getActiveTextEditor().getPath();
    var projectList = atom.project.getPaths();
    var currentDirectory = "";
    for(var i = 0; i < projectList.length;i++){
      if(currentFile.includes(projectList[i])){
        currentDirectory = projectList[i];
        break;
      }
    }

    const child = require('child_process');
    //TODO: Add folder path to command
    console.log(scriptdir);
    console.log(currentDirectory);
    const task1 = child.exec("cd "+scriptdir+"; jsinspect -r json -i "+currentDirectory, (error, stdout, stderr) => {
      if (stderr) {
        this.jsinspectView.setError(stderr);
      }
      stdout = JSON.parse(stdout);
      console.log(stdout);
      this.jsinspectView.setError(stdout);

      if(!this.bottomPanel){
        this.bottomPanel = atom.workspace.addBottomPanel({
          item: this.jsinspectView.getElement(),
        });
      }

      this.bottomPanel.show();
    });
  }

};
