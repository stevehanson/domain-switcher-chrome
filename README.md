Domain Switcher
======================

[Download in the Chrome Webstore](https://chrome.google.com/webstore/detail/domain-switcher/lbehdhpgigdlinfkidifkbhjnaglfojc?hl=en-US)

The Domain Switcher Chrome extension allows developers to easily switch between various environments

As a developer, it can be a hassle to switch between various environments (e.g. dev, uat, prod). This extension is designed to allow the developer to quickly switch between environments when they are on a page.

Domain Switcher allows you to organize the environments for the various projects you work on. Simply create a "project" on the options page and enter the associated domains for the various environments for the project. We'll do the rest, and you'll be able to simply switch between environments by clicking the arrow icon in your address bar when you are on a page that matches one of your project environments.

For example, if you are working on a project about "coffee", you could enter environments: "localhost:3000", "test.coffee.com", "coffee.com". Then, when you are on any of these domains, you will have an icon in your URL bar that will allow you to switch to the other environments. The path of the page you are on is preserved in the URL.

## Contributing

This project was set up using the Yeoman [generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension). To build:

* npm install
* bower install
* grunt build

Pull requests are welcome!