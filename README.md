# Deluge SD Card Updater
### Update v3 Deluge SD Cards to v4+ spec

This is a simple electron app to update older deluge SD cards to match the file system used in later Deluge firmwares.

### This tool can do the following:
1. Rename old factory synths and kits to the proper v4 names. ie `SYNT003` becomes `003 Synthwave Bass`.
2. Update song files to show the new names when loaded.
3. Update v3 songs that use the tags `presetSlot="0"` and `presetSubSlot="-1"` to use proper v4+ name and folder tags `presetName="000 TR-808"` and `presetFolder="KITS"`.
4. Rename any existing presets that you have made and update the songs using them.
5. Prettify any old names on your SD card. ie. `SYNT141B` becomes `141 Synth 2`. 
5. View the instruments used in each song to verify that the names are correctly updated.

## Disclaimer (Please Read This!!)
This software is being provided as an early alpha version for development testing. I'm providing this so that the community can be part of the development process and help me find any bugs or issues that I may have missed.

While I have tried my hardest to ensure that it runs as expected, I can't guarantee that it works flawlessly on all systems with all Deluge SD cards. It is absolutely essential that you make a backup of your existing SD card before using this app!

I can, however, guarantee that this won't mess up your computer! All of the functions relating to renaming and updating files will only ever work within the SD card or directory that you have provided and some basic checks have been put in place to ensure that we are indeed looking at a Deluge SD card and not `C:\windows\system32`.

I have only tested this app with **firmware version 3.0.0** SD cards and above. If you have an SD card that was for a firmware older than that, this tool may not work. (If you do though, I'd love you to get in touch with me so that I can have a look at some of the file structure!!)

## System Requirements
* SD card reader
* **macOS** (Catalina and up). Should work fine on Intel and Arm machines.
* **Windows** (Windows 10 and up).
* **Linux**: The prebuilt binaries of Electron are built on Ubuntu 20.04. They have also been verified to work on:
  * Ubuntu 18.04 and newer
  * Fedora 32 and newer
  * Debian 10 and newer
* Approx 250mb of free space.

## Deluge Requirements
* A deluge (7 segment or OLED) running **firmware version 4.0.0** or above. All versions of the **Community Firmware** are ok for this.
* If you are using an older firmware than **4.0.0** this tool will not work for your Deluge.


## Installation
As this app is in Alpha phase, the binaries are not currently signed. Have a look at the following guides to see how to run unsigned apps on your operating system.
* Windows: https://www.process.st/how-to/download-non-microsoft-verified-apps/
* MacOS: https://support.apple.com/en-au/guide/mac-help/mh40616/mac
* Linux: I can't find a guide, but I had no real problems installing this on Ubuntu apart from clicking a couple of dialog boxes.

**Getting the app**
1. Go to the **releases** section on the right hand side of the screen.
2. Download the appropriate binary for your system. (You may have to bypass some security restrictions to download the app)
3. Install the app on your system using one of the guides above for reference.

## Usage

### Basic Usage
1. First, back up your SD card by copying all of the contents to a folder on your computer.
2. Open the app.
3. Open either your deluge SD card or a backup folder by dragging and dropping it into the dashed box on the app. You can also browse for a folder or SD card using the **'Click here to browse instead'** button
4. Select either the **"Synths"** or **"Kits"** tab at the top of the screen 
5. Rename any instruments that you wish by clicking on the name and typing in the name that you want then pressing enter.
6. Go to the **"Songs"** tab and have a quick look to make sure that the names have been updated appropriately.
7. Click on the **"Update files"** button at the bottom right of the screen.
8. In the pop up window you will be shown what is being changed with your files.
9. Check the **"I have backed up my SD card"** check box, and then click on **"Update Deluge Files"** to complete the update process.
10. Close the app.
11. Enjoy! :-)

### Automatically Rename Old v3 Presets
Once you have opened the app and opened your SD card, you can click on the **"Load V4 Names"** button to load in the proper v4+ preset names.

### Prettify Old Preset names
Once you have opened the app and opened your SD card, you can click on the **"Prettify Old Names"** button to remap any old style names to a more v4+ friendly naming structure. ie. `SYNT141B` becomes `141 Synth 2`.

## Development Roadmap
If this tool is sufficient for most people's needs, I'll forge ahead with more updates. These will kost likely include:

- Folder management
- Song renaming
- Sample management
- Support for older SD card formats
- Support for anything new that the Open Source team cooks up.

## Legal
Portions of this software are dervived from https://github.com/cawa-93/vite-electron-builder and all appropriate liscences apply to those portions of the software.

**CC BY-NC License**

This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License.

You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material

Under the following terms:
- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- NonCommercial — You may not use the material for commercial purposes.
- No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

This is a human-readable summary of (and not a substitute for) the license. For the full license text, please visit https://creativecommons.org/licenses/by-nc/4.0/legalcode.

Copyright (c) 2024 Alex Reid
