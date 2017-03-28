zen-3d
========

[![Latest NPM release][npm-badge]][npm-badge-url]
[![License][license-badge]][license-badge-url]
[![Issues][issues-badge]][issues-badge-url]
![Dev Dependencies][devDependencies-badge]

![image](./examples/resources/screen_shot2.png)

### JavaScript 3D library ###

The aim of the project is to create an easy to use, lightweight, 3D/2D library. The library only provides WebGL renderers.

[Examples](https://shawn0326.github.io/zen-3d/examples/) &mdash;
[RoadMap](https://trello.com/b/7Ie3DDBP) &mdash;
[Documentation](https://shawn0326.github.io/zen-3d/docs/) &mdash;
[Tests](https://shawn0326.github.io/zen-3d/test/)

### Build ###

zen3d is built by [gulp](http://gulpjs.com/).
first run:

````
npm install
````

and then, run:

````
gulp build
````

or:

````
gulp watch
````

build path is `./build`.

### Usage ###

you can use `zen3d.js` or `zen3d.min.js` in your page simply by this:

````html
<script src="zen3d.min.js"></script>
````

zen-3d use JSON([assimp2json](https://github.com/acgessler/assimp2json)) as default supported format of model.

About Me
--
* Blog: [Half Lab](http://www.halflab.me)
* Email: shawn0326@163.com
* Weibo: [@谢帅shawn](http://weibo.com/shawn0326)

[npm-badge]: https://img.shields.io/npm/v/zen-3d.svg
[npm-badge-url]: https://www.npmjs.com/package/zen-3d
[license-badge]: https://img.shields.io/npm/l/zen-3d.svg
[license-badge-url]: ./LICENSE
[issues-badge]: https://img.shields.io/github/issues/shawn0326/zen-3d.svg
[issues-badge-url]: https://github.com/shawn0326/zen-3d/issues
[devDependencies-badge]: https://img.shields.io/librariesio/github/shawn0326/zen-3d.svg