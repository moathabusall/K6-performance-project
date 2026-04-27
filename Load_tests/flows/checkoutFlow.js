import http from 'k6/http';
import { check, group } from 'k6';
import { BASE, login, think, payments } from './common.js';

export default function checkoutFlow() {

  const user = login();

  group('browse products', function () {

    let products = http.get(`${BASE}/products`);

    check(products, {
      'products loaded': r =>
        r &&
        r.status >= 200 &&
        r.status < 400
    });

    think();
  });


  group('add cart', function () {

    let cart = http.get(`${BASE}/add_to_cart/1`);

    check(cart, {
      'cart add ok': r =>
        r &&
        r.status >= 200 &&
        r.status < 400
    });

    think();
  });


  group('checkout', function () {

    let checkoutPage =
      http.get(`${BASE}/checkout`);

    check(checkoutPage, {
      'checkout page loaded': r =>
        r &&
        r.status >= 200 &&
        r.status < 400
    });

    think();


    let payment =
      payments[
        __VU % payments.length
      ];


    let paymentRes =
      http.post(
        `${BASE}/payment`,
        {
          name_on_card: payment.name,
          card_number: payment.card_number,
          cvc: payment.cvc,
          expiry_month: payment.exp_month,
          expiry_year: payment.exp_year
        }
      );


    check(paymentRes, {
      'payment success': r =>
        r &&
        r.status >= 200 &&
        r.status < 400
    });

    think();
  });

}