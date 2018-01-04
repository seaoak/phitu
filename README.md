# Scribblable

Realtime Markdown Viewer Engine with Wiki-like internal link based on Isomorphic JavaScript


## Features

- Realtime preview (fine-grained automatic refresh without page transition)
- Isomorphic JavaScript (covers a wide spectrum from "100% client side" to "100% server side", even "Static Site Generator")
- Available as a Single Page Application (SPA)
- Available as a Static Site Generator (SSG)
- Support Wiki-like "BracketName" as internal link
- AMP ready
- SEO aware
- Simple OSS license (MIT)
- Inspired by [MDwiki](http://www.mdwiki.info)


## Development Policy

### Major Policy

- Modern Web Standards: ES6 (ECMAScript2015), HTML5 APIs (History, WebWorker, WebSocket)
- First priority: Testability (including "non-functional requirements")
- Second priority: Isomorphic JavaScript
- Third priority: Speed (first view, navigation, static file generation, test)
- No online editor (you can use your favorite text editor, like "Vim")
- No version control (you can use your favorite VCS, like "Git")
- No collaborative working support (you can use file sharing services, like "Dropbox")
- No styling theme (you can use own CSS files explicitly)
- For developers only (you *must build* your own html/js files because we do not provide any archives including other software)


### Minor Policy

- Minimize dependency (no jQuery, no Bootstrap)
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
