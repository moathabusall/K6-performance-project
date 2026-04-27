import http from 'k6/http';
import { group } from 'k6';
import { BASE, think, login } from './common.js';

export default function browseFlow(){

 login();

 group('browse',()=>{

   http.get(`${BASE}/products`);
   think(2,5);

   http.get(`${BASE}/category_products/3`);
   think(2,5);

   http.get(`${BASE}/product_details/2`);
   think(3,6);

 });

}