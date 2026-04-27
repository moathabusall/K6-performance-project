import { browser } from 'k6/browser';
import { SharedArray } from 'k6/data';
import Papa from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE='https://automationexercise.com';

const users = new SharedArray('users', function () {
 return Papa.parse(
  open('../data/users.csv'),
  {header:true}
 ).data.filter(u=>u.email);
});

const payments = new SharedArray('payments', function () {
 return Papa.parse(
  open('../data/payments.csv'),
  {header:true}
 ).data.filter(p=>p.card_number);
});

export default async function uiFlow(){

 const user=users[0];
 const payment=payments[0];

 const context=await browser.newContext({
  acceptDownloads:true
 });

 const page=await context.newPage();

 try{

  await page.goto(BASE,{waitUntil:'networkidle'});

  await page.locator(
   'a[href="/login"]'
  ).click();

  await page.locator(
   'input[data-qa="login-email"]'
  ).fill(user.email);

  await page.locator(
   'input[data-qa="login-password"]'
  ).fill(user.password);

  await Promise.all([
   page.waitForNavigation(),
   page.locator(
    'button[data-qa="login-button"]'
   ).click()
  ]);

  await page.goto(
   `${BASE}/products`,
   {waitUntil:'networkidle'}
  );

  await page.goto(
   `${BASE}/product_details/2`,
   {waitUntil:'networkidle'}
  );

  await page.locator(
   '.btn.btn-default.cart'
  ).click();

  await page.goto(
   `${BASE}/view_cart`
  );

  await page.goto(
   `${BASE}/checkout`
  );

  await page.goto(
   `${BASE}/payment`
  );

  await page.locator(
'input[data-qa="name-on-card"]'
  ).fill(payment.name_on_card);

  await page.locator(
'input[data-qa="card-number"]'
  ).fill(payment.card_number);

  await page.locator(
'input[data-qa="cvc"]'
  ).fill(payment.cvc);

  await page.locator(
'input[data-qa="expiry-month"]'
  ).fill(payment.expiry_month);

  await page.locator(
'input[data-qa="expiry-year"]'
  ).fill(payment.expiry_year);

  await Promise.all([
   page.waitForNavigation(),
   page.locator(
'button[data-qa="pay-button"]'
   ).click()
  ]);

  await page.goto(
   `${BASE}/logout`
  );

 } finally {

  await page.close();
  await context.close();

 }

}