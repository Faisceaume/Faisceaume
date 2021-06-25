// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser

      captureConsole: false // Hide the messages in the console
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/faisceaume'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DISABLE,
    autoWatch: true,
    // Change according to your needs
    //browsers: ['Chrome'],
    browsers: ['Firefox'],
    singleRun: false,
    restartOnFileChange: true
  });
};
