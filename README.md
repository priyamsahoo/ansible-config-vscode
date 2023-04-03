# Ansible Config VSCode Extension

This contains a vscode extension that used language server behind the scenes to give ide features for ansible configuration file, i.e., `ansible.cfg`.

This server as an example for my talk on **Building Rich IDE Features Using Language Server Protocol** at FOSSASIA Summit 2023

## Functionality

This Language Server identifies an ansible config file and provides the following language features:

- Completions
- [TODO] Diagnostics

It also includes an End-to-End test.

## Running the Sample

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to start compiling the client and server in [watch mode](https://code.visualstudio.com/docs/editor/tasks#:~:text=The%20first%20entry%20executes,the%20HelloWorld.js%20file.).
- Switch to the Run and Debug View in the Sidebar (Ctrl+Shift+D).
- Select `Launch Client` from the drop down (if it is not already).
- Press ▷ to run the launch config (F5).
- In the [Extension Development Host](https://code.visualstudio.com/api/get-started/your-first-extension#:~:text=Then%2C%20inside%20the%20editor%2C%20press%20F5.%20This%20will%20compile%20and%20run%20the%20extension%20in%20a%20new%20Extension%20Development%20Host%20window.) instance of VSCode, open an `ansible.cfg` file to use the language features.
