# Sasicae

Realtime Markdown Viewer Engine with Wiki-like internal link based on Isomorphic JavaScript


## Features

- Realtime view (*fine-grained* automatic reloading without page transition)
- Isomorphic JavaScript (spectrum from "100% client side" to "100% server side")
  * Available as a Single Page Application (SPA)
  * Available as a Server Side Rendering (SSR)
  * Available as a Static Site Generator (SSG)
- Support Wiki-like "BracketName" as internal link
- Simple OSS license (MIT)
- Inspired by [MDwiki](http://www.mdwiki.info)


## Development Policy

### Major Policy

- Priority:
  1. Testability (including "non-functional requirements")
  1. Isomorphic JavaScript
  1. Speed (first view, navigation response, static file generation, test)
- Modern Web Standards: ES6 (ECMAScript2015), HTML5 APIs (History, WebWorker, WebSocket)
- No online editor (you can use your favorite text editor, like "Vim")
- No version control (you can use your favorite VCS, like "Git")
- No collaborative working support (you can use file sharing services, like "Dropbox")
- No styling theme (you can use own CSS files explicitly)
- For developers only (you *must build* your own html/js files because we do not provide any archives including other software)


### Minor Policy

- Minimum dependency (no jQuery, no Bootstrap)
- Free from "single file deployment"
- No build system (no webpack, no Browserify)
- No polyfill (no Modernizr, no html5shiv)
- No transpiler (no Babel, no CofeeScript, no TypeScript)
- No CSS preprocessor (no SASS, no LESS)
- Follow [the AMP project](https://www.ampproject.org) as one of the best practice
- Avoid FOUC (Flash of Unstyled Content)


## License

MIT


## Author

Seaoak

https://seaoak.jp
