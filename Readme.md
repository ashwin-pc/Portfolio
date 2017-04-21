# Portfolio

This website will feature a fixed storyline which will have a database plug-able link to accentuate the story.

The story about a nerd who had a flair for art. went crazy at the opportunity to realize his inner creativity (graphic design). was ecstatic a the thought of the things he could do with just a few words (coding) and how he could take these two amazing powers and combine them with the power of the internet to realise almost any evil thing he could conjure of (web design).

## How to Use

First Install all dependencies using `npm install` and globally  install gulp using `npm install -g gulp-cli` if not already installed

### 1. Web Section

Googles `Firebase` was used for storing website metadata and preview images. Preview images were generated using screen capture  `Shift + Cmd + 4`  and photoshops `Scripts > Image Processor` function.

### 2. Blog Section

This sections data is automatically pulled from Wrodpress. the Latest 3 posts are queried. to attach image to them, use featured image feature.

### 3. Graphics Section

`Firebase's` `Storage` is used to store images and thumbnails. a photoshop script is used to generate thumbnails.

The download URL of these files must be saved in firebase `Database`

## Firebase database structure

````json
    {
      "graphics" : [ {
          "fullLink" : "",
          "link" : "",
          "name" : ""
      },{
          ...
      }],
      "websites" : [ {
          "img" : "",
          "link" : "",
          "name" : ""
      }, {
          ...
      } ]
    }

````

## Gulp tasks

1. Gulp watch: during development, builds all dependencies and compiles all files and also starts watching the files.
2. Gulp dist: to build a distributable copy of the project into a folder named dist.

## To Do

- [x] Remove hamburger
- [x] Improve Blog Images
- [x] Add Favicon
- [x] Loader for loading sections
- [ ] My Section change (not broken anymore)
- [x] Graphics randomize
- [x] Graphics Image Viewer animation and controls
- [x] Firebase using AJAX call only (refer to designedbyashw.in)
- [ ] Improve or change snow section
- [x] Add slight animation for blog
- [x] Add error message toast
