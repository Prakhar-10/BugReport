const puppeteer = require("puppeteer");
const getBugs = require("./bugs");
const id = "randomaccount7" ;
const pw = "random_71" ;
const search = "pyppeteer/pyppeteer";
const title = "Leak in browser.close()";
const text = "There is a leak in browser.close()";




async function login(){
  let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
      slowMo:100
      
    });
  let pages = await browser.pages();
  let tab = pages[0];

  await tab.goto("https://github.com/");
  await tab.waitForSelector(".HeaderMenu-link.flex-shrink-0.no-underline.mr-3");
  await tab.click(".HeaderMenu-link.flex-shrink-0.no-underline.mr-3");
  await tab.type("#login_field",id);
  await tab.type("#password",pw);
  await tab.click(".btn.btn-primary.btn-block");
  await tab.waitForSelector(".form-control.input-sm.header-search-input.jump-to-field.js-jump-to-field.js-site-search-focus");

  await tab.waitForTimeout(1000);

  await tab.type(".form-control.input-sm.header-search-input.jump-to-field.js-jump-to-field.js-site-search-focus",search);
  await tab.keyboard.press("Enter");

  await tab.waitForTimeout(1000);

  await tab.waitForSelector('.v-align-middle');
  let pupTags = await tab.$$('.v-align-middle');
  let pupLink = await tab.evaluate(function(elem){return elem.getAttribute("href");},pupTags[13]);
  pupLink = "https://github.com" + pupLink ;
  await tab.goto(pupLink);
  
  await tab.waitForSelector('a[data-tab-item="i1issues-tab"]');
  await tab.click('a[data-tab-item="i1issues-tab"]');
  
  await tab.waitForSelector('.js-selected-navigation-item.subnav-item');

  let aTags = await tab.$$('.js-selected-navigation-item.subnav-item');
  let link =  await tab.evaluate(function(elem){return elem.getAttribute("href");},aTags[0]);
  link = "https://github.com" + link;
  
  await tab.goto(link);

  await tab.waitForTimeout(1000);

  await tab.waitForSelector('.IssueLabel.hx_IssueLabel.IssueLabel--big.lh-condensed.js-label-link.d-inline-block.v-align-top');
  let divTags = await tab.$$('.IssueLabel.hx_IssueLabel.IssueLabel--big.lh-condensed.js-label-link.d-inline-block.v-align-top');
  let bugs =  await tab.evaluate(function(elem){return elem.getAttribute("href");},divTags[1]);
  bugs = "https://github.com" + bugs;
  
  await tab.goto(bugs);
  await tab.waitForSelector('.ml-3.d-flex.flex-justify-between.width-full.width-md-auto');
  await tab.click('.ml-3.d-flex.flex-justify-between.width-full.width-md-auto');

  await tab.waitForSelector('.form-control.input-lg.input-block.input-contrast.required.title.js-session-resumable.js-quick-submit');
  await tab.type('.form-control.input-lg.input-block.input-contrast.required.title.js-session-resumable.js-quick-submit',title);
  await tab.type('#issue_body',text);
  let submit = await tab.$$('.btn.btn-primary');
  await submit[1].click('.btn.btn-primary');


  await tab.waitForTimeout(1000);
  await getBugs(bugs);
  

  
}
login(); 





  





  
  
  


 


