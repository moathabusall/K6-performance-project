import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend, Rate } from 'k6/metrics';
import { parseHTML } from 'k6/html';
import Papa from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE='https://automationexercise.com';

/* ---------- Metrics ---------- */

export const loginDuration =
new Trend('login_duration');

export const addCartDuration =
new Trend('add_to_cart_duration');

export const checkoutDuration =
new Trend('checkout_duration');

export const orderSuccessRate =
new Rate('order_success_rate');

export const iterationFailure =
new Rate('iteration_failure');


/* ---------- Test Data ---------- */

const users = new SharedArray('users', function () {
 return Papa.parse(
   open('../data/users.csv'),
   { header:true }
 ).data.filter(u => u.email);
});

const payments = new SharedArray('payments', function () {
 return Papa.parse(
   open('../data/payments.csv'),
   { header:true }
 ).data.filter(p => p.card_number);
});


/* ---------- Helpers ---------- */

function think(){
 sleep(Math.random()*2+1);
}

function extractCSRF(html){
 const doc=parseHTML(html);

 return doc.find(
 'input[name="csrfmiddlewaretoken"]'
 ).first().attr('value');
}

function extractOrderId(body){
 const match=
 body.match(/payment_done\/(\d+)/);

 return match ? match[1] : null;
}


/* ---------- Main Flow ---------- */

export function apiFlow(){

 const jar=http.cookieJar();

 const user=
 users[__VU % users.length];

 const payment=
 payments[__VU % payments.length];

 let res;
 let csrf;


/* Home */

group('Home Page',()=>{

 res=http.get(`${BASE}/`);

 check(res,{
  'home page loaded':
  r=>r && r.status===200
 });

 think();

});


/* Login Page */

group('Open Login Page',()=>{

 res=http.get(
 `${BASE}/login`
 );

 check(res,{
  'login page loaded':
  r=>r && r.status===200
 });

 csrf=extractCSRF(res.body);

 if(!csrf){
   const cookies=
   jar.cookiesForURL(BASE);

   csrf=
   cookies.csrftoken &&
   cookies.csrftoken[0];
 }

 think();

});


/* Login */

group('Login',()=>{

 const payload={
  csrfmiddlewaretoken:csrf,
  email:user.email,
  password:user.password
 };

 const params={
  headers:{
   'Content-Type':
'application/x-www-form-urlencoded',
   Referer:`${BASE}/login`
  },
  redirects:5
 };

 const start=Date.now();

 res=http.post(
 `${BASE}/login`,
 payload,
 params
 );

 loginDuration.add(
 Date.now()-start
 );

 check(res,{
  'login success':
  r=>r &&
  (
   r.status===200 ||
   r.status===302
  )
 });

 think();

});


/* Browse */

group('Browse Products',()=>{

 http.get(`${BASE}/products`);
 http.get(`${BASE}/category_products/3`);
 http.get(`${BASE}/product_details/2`);

 think();

});


/* Add To Cart */

group('Add To Cart',()=>{

 const start=Date.now();

 res=http.get(
`${BASE}/add_to_cart/2?quantity=2`,
{
 headers:{
 'X-Requested-With':
 'XMLHttpRequest',
 Referer:
`${BASE}/product_details/2`
 }
}
 );

 addCartDuration.add(
 Date.now()-start
 );

 check(res,{
 'product added':
 r=>r &&
 r.status===200
 });

 http.get(`${BASE}/view_cart`);

 think();

});


/* Checkout */

group('Checkout',()=>{

 const start=Date.now();

 http.get(`${BASE}/checkout`);

 res=http.get(
`${BASE}/payment`
 );

 csrf=
 extractCSRF(res.body) || csrf;

 const payload={
 csrfmiddlewaretoken:csrf,
 name_on_card:
 payment.name_on_card,
 card_number:
 payment.card_number,
 cvc:
 payment.cvc,
 expiry_month:
 payment.expiry_month,
 expiry_year:
 payment.expiry_year
 };

 res=http.post(
`${BASE}/payment`,
payload,
{
 headers:{
'Content-Type':
'application/x-www-form-urlencoded',
 Referer:
`${BASE}/payment`
},
redirects:5
}
);

checkoutDuration.add(
Date.now()-start
);

check(res,{
'payment processed':
r=>r &&
(
r.status===200 ||
r.status===302
)
});

let orderId=
extractOrderId(
 res.body || ''
);

if(
 !orderId &&
 res.url &&
 res.url.includes(
 '/payment_done/'
 )
){
 orderId=
 res.url.split(
 '/payment_done/'
 )[1];
}

orderSuccessRate.add(
orderId!==null
);

iterationFailure.add(
orderId===null
);

if(orderId){
http.get(
`${BASE}/download_invoice/${orderId}`
);
}

think();

});


/* Logout */

group('Logout',()=>{

res=http.get(
`${BASE}/logout`
);

const loginPage=
http.get(
`${BASE}/login`
);

check(loginPage,{
 'logout success': r =>
   r &&
   r.status===200 &&
   r.body &&
   r.body.includes(
   'Login to your account'
   )
});

});

}

export default apiFlow;