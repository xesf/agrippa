# agrippa
Agrippa - X-Files The Game Reimplementation for the Web

The aim of this project is to provide a full reimplementation for the Web of the X-Files The Game created by HyperBole Studios and Fox Interactive.

![X-Files The Game](xfiles.jpg)

## Purpose
- Re-implementation of the X-Files The Game PC version;

- Create a new web-based authoring tool capable of replicating the game engine;

- Document the file formats and enconding scripts;

- Focus on taking advantage of the modern web development languages and frameworks like Javascript and React;

- Use as a sandbox to try new features of those frameworks during the process;

- Have fun implementing it!!

## Enhancements

* Multi-language support (subtitles)
* Adaptive streaming (bitrate streaming quality) - Video upscale to standard resolutions
* Play Full Story Sequence like a TV Show episode
* Time-based actions
* Number of full complete stories played worldwide
* Total hours worldwide played
* Player's choice statistics while playing
    * Amount of Artificial Intuition used
    * Stats per Emotion types used
    * Stats per Action types used
    * Stats per Game over
    * Number of times going Forward, Backwards, Left, Right during a gameplay

![Editor Mode](x-files_editor.png)

## Assets Encoding

The game assets need to be converted using the following tools:
- ffmpeg/ffprobe: brew install libvpx ffmpeg
- str-vtt: https://github.com/nwoltman/srt-to-vtt-cl

In the root folder, there is a file called dumpdata.
Copy this file to the main X-Files folder directory and set permissions to execute. The folder should contain the full installation which includes all 7 CDs.

> chmod +x dumpdata

Run as

> ./dumpdata

Note, this process can take few minutes to convert all the data from the game and the cpu usage will be high.

When complete, copy the new created data folder in to the root of this app.
The subtitles will need some extra effort to bundle multiple subtitles into a single file. The game uses multiple streams but there are some duplicate data as well.

## Usage

This project uses node, yarn and lerna CLI to manage multiple applications and packages in a mono repository.

Install:
* nodejs: https://nodejs.org/en/
* yarn: https://yarnpkg.com/en/

Run this commands in the root folder:

> yarn install
> yarn start
