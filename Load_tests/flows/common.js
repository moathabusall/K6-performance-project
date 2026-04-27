import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import { parseHTML } from 'k6/html';
import Papa from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export const BASE='https://automationexercise.com';


export const users = new SharedArray(
'users',
()=> Papa.parse(
open('../data/users.csv'),
{header:true}
).data.filter(x=>x.email)
);


export const payments = new SharedArray(
'payments',
()=> Papa.parse(
open('../data/payments.csv'),
{header:true}
).data.filter(x=>x.card_number)
);


export function think(min=1,max=4){
 sleep(
 Math.random()*(max-min)+min
 );
}


function extractCSRF(html){

 const doc=parseHTML(html);

 return doc.find(
'input[name="csrfmiddlewaretoken"]'
 ).first().attr('value');
}


export function login(){

 let user=
 users[__VU % users.length];

 /* Step 1:
    open login page first
 */
 let loginPage=
 http.get(
 `${BASE}/login`
 );

 check(loginPage,{
 'login page loaded':
 r=>r && r.status===200
 });


 let csrf=
 extractCSRF(
 loginPage.body
 );

 /* fallback from cookies */
 if(!csrf){

 const jar=
 http.cookieJar();

 const cookies=
 jar.cookiesForURL(BASE);

 csrf=
 cookies.csrftoken &&
 cookies.csrftoken[0];
 }


 /* Step 2:
    real login request
 */
 let res=http.post(
 `${BASE}/login`,
 {
  csrfmiddlewaretoken:csrf,
  email:user.email,
  password:user.password
 },
 {
 headers:{
'Content-Type':
'application/x-www-form-urlencoded',
 Referer:`${BASE}/login`
 },
 redirects:5
 }
 );


 check(res,{
 'login ok':r =>
   r &&
   (
    r.status===200 ||
    r.status===302
   )
 });

 return user;
}