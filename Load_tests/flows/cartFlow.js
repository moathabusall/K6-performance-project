import http from 'k6/http';
import { group } from 'k6';
import { BASE, think, login } from './common.js';

export default function cartFlow(){

 login();

 group('cart journey',()=>{

   http.get(`${BASE}/products`);

   http.get(
`${BASE}/add_to_cart/2?quantity=1`
   );

   http.get(`${BASE}/view_cart`);

   think(2,4);

 });

}