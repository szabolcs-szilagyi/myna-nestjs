import { Controller, NotFoundException, Get, Req, Query } from '@nestjs/common';
import { Request } from 'express';
import got from 'got';
import { isEmpty, pick } from 'lodash';
import { AddressDataDto } from '../address/dto/address-data.dto';
import { LegacyAddressDto } from './dto/legacy-address.dto';

enum PartOption {
  GetProductData = 'getproductdata',
  GetCurrency = 'getcurrency',
  LoginMail = 'loginmail',
  Login = 'login',
  Ping = 'ping',
  AmILoggedIn = 'amiloggedin',
  Logout = 'logout', // not used!
  GetUserData = 'getuserdata',
  UpdateUserData = 'updateuserdata',
  GetShippingInfo = 'getshippinginfo',
  GetEmail = 'getemail',
  GetAddressData = 'getaddressdata',
  SetAddressData = 'setaddressdata',
  DelAddressData = 'deladdressdata', // not implemented
  SetSessionToken = 'setsessiontoken',
  SetNewsletterSubscription = 'setnewslettersubscription',
  GetNewsletterSubscription = 'getnewslettersubscription',
  ConfirmNewsletterSubscription = 'confirmnewslettersubscription',
  DelNewsletterSubscription = 'delnewslettersubscription',
  AddProductToCart = 'addproducttocart',
  DelProductFromCart = 'delproductfromcart',
  GetProductToMail = 'getproducttomail',
  GetProductsInCart = 'getproductsincart',
  GetProductsNumberInCart = 'getproductsnumberincart',
  SetProductPaid = 'setproductpaid',
  Availability = 'availability',
  AvailabilityExact = 'availabilityexact',
  OnStock = 'onstock',
  TotalCheckout = 'totalcheckout',
  ReduceStock = 'reducestock',
  GetAmountInCart = 'getamountincart',
  SetAmountInCart = 'setamountincart',
}

@Controller()
export class AppController {
  @Get('legacy')
  async legacyRouter(
    @Req() req: Request,
    @Query('part') part: PartOption,
  ) {
    switch (part) {
      case PartOption.GetProductData:
        const result = await got.get('http://localhost:3000/api/product', {
          searchParams: { idName: req.query.productname },
        }).json()

        return { productdetails: result[0] };

      case PartOption.GetCurrency:
        return { currency: '€' };

      case PartOption.LoginMail:
        return got.post('http://localhost:3000/api/token/mail-login', {
          isStream: true,
          json: { email: req.query.email },
        });

      case PartOption.Login:
        return got.post('http://localhost:3000/api/token/login', {
          isStream: true,
          json: { email: req.query.email },
          headers: {
            'session-token': req.query.sessiontoken,
            'login-token': req.query.logintoken,
          },
        });

      case PartOption.Ping:
        return got.get('http://localhost:3000/api/token/ping', {
          isStream: true,
          headers: {
            'session-token': req.query.sessiontoken,
          },
        });

      case PartOption.AmILoggedIn:
        return got.get('http://localhost:3000/api/token/am-i-logged-in', {
          isStream: true,
          headers: {
            'session-token': req.query.sessiontoken,
          },
        });

      case PartOption.GetUserData:
        return got.get('http://localhost:3000/api/token/get-user-data', {
          headers: {
            'session-token': req.query.sessiontoken,
            'email': req.query.email,
          },
          responseType: 'json',
        })
            .then(({ body }) => {
              const {
                email,
                firstName: firstname,
                lastName: lastname,
                lastLogin: lastlogin,
                birthday
              } = body as any;

              return {
                userdata: { email, firstname, lastname, lastlogin, birthday },
              };
            });

      case PartOption.UpdateUserData:
        return got.post('http://localhost:3000/api/token/update-user-data', {
          isStream: true,
          headers: {
            'session-token': req.query.sessiontoken,
          },
          json: {
            email: req.query.email,
            firstName: req.query.firstname,
            lastName: req.query.lastname,
            birthday: req.query.birthday,
          }
        });

      case PartOption.GetShippingInfo:
        return got.get('http://localhost:3000/api/address/shipping-info', {
          isStream: true,
          headers: {
            'session-token': req.query.sessiontoken,
          },
        });

      case PartOption.GetEmail:
        return got.get('http://localhost:3000/api/token/get-email', {
          isStream: true,
          headers: {
            'session-token': req.query.sessiontoken,
          },
        });

      case PartOption.GetAddressData:
        return got.get('http://localhost:3000/api/address/address-data', {
          headers: {
            'session-token': req.query.sessiontoken,
            'email': req.query.email,
          },
          responseType: 'json',
        })
            .then(({ body }) => {
              if(isEmpty(body)) return { addressdata: '0', success: '0', email: req.query.email }
              return  {
                addressdata: {
                  type: body.type.toString(),
                  email: req.query.email,
                  session_token: req.query.sessiontoken,
                  mobile: body.mobile,
                  address1: body.addressLine1,
                  address2: body.addressLine2,
                  city: body.city,
                  state: body.state,
                  zip: body.zip,
                  country: body.country,
                  comment: body.comment,
                },
                success: '1',
                email: req.query.email,
              }
            })

      case PartOption.SetAddressData:
        return got.post('http://localhost:3000/api/address/address-data', {
          headers: {
            'session-token': req.query.sessiontoken,
          },
          responseType: 'json',
          json: <AddressDataDto>{
            name: req.query.name,
            mobile: req.query.mobile,
            email: req.query.email,
            addressLine1: req.query.address1,
            addressLine2: req.query.address2,
            city: req.query.city,
            state: req.query.state,
            country: req.query.country,
            zip: req.query.zip,
            comment: req.query.comment,
            type: 1,
          }
        })
            .then(({ body }) => ({ success: body.success ? '1' : '0' }))

      case PartOption.SetSessionToken:
        return got.get('http://localhost:3000/api/token/session', { isStream: true });


      default:
        throw new NotFoundException();
    }
  }
}