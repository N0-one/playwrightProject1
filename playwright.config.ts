import { defineConfig, devices } from '@playwright/test';
import {TestOptions} from './test-options'


require('dotenv').config()

export default defineConfig<TestOptions>({
  timeout: 15000,
  //globalTimeout: 60000,
  expect:{
    timeout: 2000,
    toMatchSnapshot: {maxDiffPixels: 50}
  },

  retries: 1,
  reporter: [
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    //['allure-playwright'],
    ['html']
],

  use: {
     globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
     baseURL: process.env.DEV === '1' ? 'http://localhost:4200/'
          : process.env.STAGING === '1' ? 'http://localhost:4202/'
          : 'http://localhost:4200/',

    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 7000,
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
  },

  projects: [
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use:{
        browserName:'chromium',
        viewport: {width: 1920, height: 1080}
      }
    },
    {
      name: 'chromium'
    },

    {
      name: 'firefox',
      use: { 
        browserName: 'firefox'
       },
    },
    {
      name: 'dev',
      use: { ...devices['Desktop Chrome'], 
      baseURL: 'http://localhost:4201/'}
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 15 Pro']
      }
    },
    

  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
    timeout: 120 * 1000,
  }

});
