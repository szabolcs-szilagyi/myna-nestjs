import { Controller, NotFoundException, Get, Req, Query, BadRequestException, InternalServerErrorException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import got from 'got';
import { isEmpty, pick } from 'lodash';
import { AddressDataDto } from './address/dto/address-data.dto';
import { AddToCartDto } from './cart/dto/add-to-cart.dto';
import { CartEntity } from './cart/entities/cart.entity';
import { PurchaseEmailDto } from './email/dto/purchase-email.dto';
import { ProductEntity } from './product/entities/product.entity';

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
  GetNewsletterSubscription = 'getnewslettersubscription', // not used
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
  OnStock = 'onstock', // not used
  TotalCheckout = 'totalcheckout',
  ReduceStock = 'reducestock', // not used
  GetAmountInCart = 'getamountincart', // not used
  SetAmountInCart = 'setamountincart', // not used

  PurchasedEmail = 'purchased',
}

@Controller()
export class AppController {
  private readonly host: string;
  private readonly forwardGot: typeof got;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.host = this.configService.get('app.host');
    this.forwardGot = got.extend({
      prefixUrl: this.host,
    });
  }

  @Get('legacy')
  async legacyRouter(
      @Res() res: Response,
    @Req() req: Request,
    @Query('part') part: PartOption,
  ) {
    switch (part) {
      case PartOption.GetProductData:
        return this.forwardGot.get('product', {
          searchParams: { idName: <string>req.query.productname },
          responseType: 'json',
        })
            .then(({ body }) => {
              const product = (body[0] as unknown) as ProductEntity;
              const productdetails = {
                id: product.id,
                productname: product.name,
                productcolor: product.color,
                productprice: product.price,
                desclong: product.description,
                compcare: product.compCare,
                availability: product.availability,
                is_one_size: product.isOneSize,
                pic1: product.pic1,
                pic2: product.pic2,
                pic3: product.pic3,
                pic4: product.pic4,
                pic5: product.pic5,
                pic6: product.pic6,
                pic7: product.pic7,
                pic8: product.pic8,
                pic9: product.pic9,
              };

              return res.json({ productdetails });
            });

      case PartOption.GetCurrency:
        return res.json({ currency: '€' });

      case PartOption.LoginMail:
        return this.forwardGot.post('token/mail-login', {
          isStream: true,
          json: { email: req.query.email },
        }).pipe(res);

      case PartOption.Login:
        return this.forwardGot.post('token/login', {
          isStream: true,
          json: { email: req.query.email },
          headers: {
            'session-token': <string>req.query.sessiontoken,
            'login-token': <string>req.query.logintoken,
          },
        }).pipe(res);

      case PartOption.Ping:
        return this.forwardGot.get('token/ping', {
          isStream: true,
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
        }).pipe(res);

      case PartOption.AmILoggedIn:
        return this.forwardGot.get('token/am-i-logged-in', {
          isStream: true,
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
        }).pipe(res);

      case PartOption.GetUserData:
        return this.forwardGot.get('token/get-user-data', {
          headers: {
            'session-token': <string>req.query.sessiontoken,
            email: <string>req.query.email,
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

              return res.json({
                userdata: { email, firstname, lastname, lastlogin, birthday },
              });
            });

      case PartOption.UpdateUserData:
        return this.forwardGot.post('token/update-user-data', {
          isStream: true,
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
          json: {
            email: req.query.email,
            firstName: req.query.firstname,
            lastName: req.query.lastname,
            birthday: req.query.birthday,
          }
        }).pipe(res);

      case PartOption.GetShippingInfo:
        return this.forwardGot.get('address/shipping-info', {
          isStream: true,
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
        }).pipe(res);

      case PartOption.GetEmail:
        return this.forwardGot.get('token/get-email', {
          isStream: true,
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
        }).pipe(res);

      case PartOption.GetAddressData:
        return this.forwardGot.get('address/address-data', {
          headers: {
            'session-token': <string>req.query.sessiontoken,
            email: <string>req.query.email,
          },
          responseType: 'json',
        })
            .then(({ body }) => {
              if(isEmpty(body)) return res.send({
                addressdata: '0',
                success: '0',
                email: req.query.email
              })

              const addressData = (<unknown>body) as AddressDataDto;

              return  res.json({
                addressdata: {
                  type: addressData.type.toString(),
                  email: req.query.email,
                  session_token: <string>req.query.sessiontoken,
                  mobile: addressData.mobile,
                  address1: addressData.addressLine1,
                  address2: addressData.addressLine2,
                  city: addressData.city,
                  state: addressData.state,
                  zip: addressData.zip,
                  country: addressData.country,
                  comment: addressData.comment,
                },
                success: '1',
                email: req.query.email,
              })
            })

      case PartOption.SetAddressData:
        return this.forwardGot.post('address/address-data', {
          headers: {
            'session-token': <string>req.query.sessiontoken,
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
            type: true,
          }
        })
            .then(({ body }) => res.json({ success: (<any>body).success ? '1' : '0' }))

      case PartOption.SetSessionToken:
            return this.forwardGot.get('token/session', { isStream: true }).pipe(res);

      case PartOption.SetNewsletterSubscription:
        return this.forwardGot.post('newsletter/subscribe', {
          isStream: true,
          throwHttpErrors: false,
          json: {
            email: <string>req.query.email,
          }
        }).pipe(res);

      case PartOption.ConfirmNewsletterSubscription:
        return this.forwardGot.get('newsletter/confirm', {
          isStream: true,
          throwHttpErrors: false,
          searchParams: {
            email: <string>req.query.email,
            token: <string>req.query.token,
          }
        }).pipe(res);

      case PartOption.DelNewsletterSubscription:
        return this.forwardGot.get('newsletter/unsubscribe', {
          isStream: true,
          throwHttpErrors: false,
          searchParams: {
            email: <string>req.query.email,
            token: <string>req.query.token,
          }
        }).pipe(res);

      case PartOption.AddProductToCart:
        return this.forwardGot.post('cart', {
          isStream: true,
          throwHttpErrors: false,
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
          json: <AddToCartDto>{
            idName: req.query.idname,
            size: req.query.size === 'one_size' ? 'onesize' : req.query.size,
          },
        }).pipe(res);

      case PartOption.DelProductFromCart:
        return this.forwardGot.delete('cart/' + req.query.id, {
          throwHttpErrors: false,
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
        })
            .then(({ statusCode }) => {
              if(statusCode === 200) return res.json({ success: '1' });
              if(statusCode === 400) throw new BadRequestException();
            });

      case PartOption.GetProductToMail:
        return this.forwardGot.get('cart/products-in-cart', {
          throwHttpErrors: false,
          responseType: 'json',
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
        })
            .then(({ statusCode, body }) => {
              if(statusCode < 300) {
                const products = (<Partial<CartEntity>[]>(<unknown>body)).reduce(
                  (memo, product: Partial<CartEntity>) => {
                    memo += `${product.idName} - ${product.size}, `;
                    return memo;
                  },
                  ''
                );

                return res.json({ products });
              } else if (statusCode < 500) {
                throw new BadRequestException();
              } else {
                throw new InternalServerErrorException();
              }
            });

      case PartOption.GetProductsInCart:
        return this.forwardGot.get('cart/products-in-cart', {
          throwHttpErrors: false,
          responseType: 'json',
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
        })
            .then(({ statusCode, body }) => {
              if(statusCode < 300) {
                const products = (<Partial<CartEntity>[]>(<unknown>body)).reduce(
                  (memo, product: Partial<CartEntity>, index) => {
                    memo[index] = {
                      id: product.id,
                      idname: product.idName,
                      size: product.size,
                      session_token: product.sessionToken,
                      amount: product.amount.toString(),
                      paid: product.paid ? '1' : '0',
                    };
                    return memo;
                  },
                  {}
                );

                return res.json({ products });
              } else if (statusCode < 500) {
                throw new BadRequestException();
              } else {
                throw new InternalServerErrorException();
              }
            });

      case PartOption.GetProductsNumberInCart:
        return this.forwardGot.get('cart/products-in-cart', {
          throwHttpErrors: false,
          responseType: 'json',
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
        })
            .then(({ statusCode, body }) => {
              if(statusCode < 300) {
                return res.json({ nr: (<CartEntity[]>(<unknown>body)).length.toString() })
              } else if (statusCode < 500) {
                throw new BadRequestException();
              } else {
                throw new InternalServerErrorException();
              }
            });

      case PartOption.SetProductPaid:
        return this.forwardGot.post('cart/products-paid', {
          throwHttpErrors: false,
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
        })
            .then(({ statusCode }) => {
              if(statusCode < 300) return res.json({ success: '1' });
              if(statusCode < 500) throw new BadRequestException();
            });

      case PartOption.Availability:
        return this.forwardGot.get('cart/availability', {
          throwHttpErrors: false,
          isStream: true,
          searchParams: {
            idName: <string>req.query.idname,
            size: req.query.size === 'one_size' ? 'oneSize' : <string>req.query.size,
          },
        }).pipe(res);

      case PartOption.AvailabilityExact:
        return this.forwardGot.get('cart/more-accurate-availability', {
          throwHttpErrors: false,
          isStream: true,
          headers: {
            'session-token': <string>req.query.sessiontoken,
          },
          searchParams: {
            idName: <string>req.query.idname,
            size: req.query.size === 'one_size' ? 'oneSize' : <string>req.query.size,
          },
        }).pipe(res);

      case PartOption.TotalCheckout:
        return this.forwardGot.get('cart/total', {
          throwHttpErrors: false,
          isStream: true,
          headers: {
            'session-token': <string>req.query.sessiontoken,
            coupon: <string>req.query.coupon,
          },
        }).pipe(res);

      case PartOption.PurchasedEmail:
        return this.forwardGot.post('email', {
          throwHttpErrors: false,
          json: {
            price: req.query.price,
            customerEmail: req.query.email,
            firstName: req.query.firstname,
            lastName: req.query.lastname,
            birthday: req.query.birthday,
            mobile: req.query.mobile,
            address1: req.query.address1,
            address2: req.query.address2,
            city: req.query.city,
            state: req.query.state,
            zip: req.query.zip,
            country: req.query.country,
            comment: req.query.comment,
            products: req.query.products,
          },
        })
            .then(({ statusCode }) => {
              if(statusCode < 300) return res.json();
              if(statusCode < 500) throw new BadRequestException();
            });

      default:
        throw new NotFoundException();
    }
  }
}
