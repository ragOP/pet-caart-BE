const htmlToPdf = require('html-pdf-node');
const { sendEmail } = require('../nodeMailer');
const orderModel = require('../../models/orderModel');

exports.generateOrderBill = async (orderId, user, address) => {
   const order = await orderModel
      .findById(orderId)
      .populate('items.productId')
      .populate('items.variantId');

   const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmation - Petcaart</title>

  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: #f2f4f7;
      margin: 0;
      padding: 20px;
      color: #333;
    }

    .container {
      max-width: 720px;
      margin: auto;
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
      border: 1px solid #f0f0f0;
    }

    /* HEADER */
    .header {
      background: linear-gradient(135deg, #ff77a9, #ffb3cd);
      text-align: center;
      padding: 40px 20px;
      color: #fff;
    }
    .header img {
      max-width: 160px;
      margin-bottom: 10px;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
    }
    .tagline {
      font-size: 15px;
      opacity: 0.9;
      letter-spacing: 0.5px;
    }

    /* BODY */
    .body {
      padding: 34px 35px 40px;
    }
    h2 {
      color: #e91e63;
      margin-bottom: 10px;
      font-size: 22px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
    }

    /* SECTIONS */
    .section {
      margin-top: 30px;
    }
    .section-title {
      font-weight: 700;
      color: #222;
      margin-bottom: 10px;
      font-size: 16px;
      letter-spacing: 0.2px;
    }
    .section-box {
      background: #fafbfd;
      border-radius: 14px;
      padding: 18px 20px;
      font-size: 14px;
      line-height: 1.7;
      border: 1px solid #f1f1f1;
    }

    /* PRODUCTS */
    .product {
      display: flex;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid #eee;
    }
    .product:last-child {
      border-bottom: none;
    }
    .product-info {
      max-width: 70%;
    }
    .product-title {
      font-weight: 600;
      font-size: 14.5px;
      color: #222;
    }
    .product-weight {
      font-size: 13px;
      color: #777;
      margin-top: 2px;
    }

    /* SUMMARY */
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin: 6px 0;
      font-size: 14px;
    }
    .total {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      padding-top: 10px;
      font-weight: 700;
      font-size: 17px;
      border-top: 1px solid #e8e8e8;
      color: #111;
    }

    /* CTA BUTTON */
    .btn {
      display: block;
      width: fit-content;
      margin: 26px auto 0;
      padding: 12px 28px;
      background: #e91e63;
      color: #fff;
      text-decoration: none;
      border-radius: 30px;
      font-size: 15px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(233, 30, 99, 0.4);
      transition: 0.25s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(233, 30, 99, 0.45);
    }

    /* FOOTER */
    .footer {
      text-align: center;
      padding: 24px;
      background: #fafafa;
      font-size: 13px;
      color: #777;
      border-top: 1px solid #eee;
    }
  </style>

</head>

<body>

  <div class="container">

    <div class="header">
      <img src="https://www.petcaart.com/_next/static/media/pet.f54eb0cd.png" alt="Petcaart Logo" />
      <div class="tagline">Your pet deserves only the best 🐾</div>
    </div>

    <div class="body">

      <h2>Thank you for your order, ${user.name}! 🎉</h2>
      <p>Your order has been placed successfully. Here are your order details:</p>

      <!-- ORDER ID -->
      <div class="section">
        <div class="section-title">Order ID</div>
        <div class="section-box">${order._id}</div>
      </div>

      <!-- ADDRESS -->
      <div class="section">
        <div class="section-title">Shipping Address</div>
        <div class="section-box">
          ${address.name} <br />
          ${address.address}, ${address.city} <br />
          ${address.state}, ${address.country} - ${address.pincode} <br />
          Phone: ${address.mobile} <br />
          Email: ${address.email}
        </div>
      </div>

      <!-- PAYMENT METHOD -->
      <div class="section">
        <div class="section-title">Payment Method</div>
        <div class="section-box">${order.paymentMethod}</div>
      </div>

      <!-- PRODUCTS -->
      <div class="section">
        <div class="section-title">Items in Your Order</div>
        <div class="section-box">
          ${order.items.map(item => `
            <div class="product">
              <div class="product-info">
                <div class="product-title">${item.productId.title}</div>
                <div class="product-weight">${item.productId.weight}g × ${item.quantity}</div>
              </div>
              <div><strong>₹${item.total}</strong></div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="section">
        <div class="section-title">Order Summary</div>
        <div class="section-box">

          <div class="summary-item">
            <span>Total MRP:&nbsp; </span> <span>&nbsp;₹${order.totalMRP}</span>
          </div>

          <div class="summary-item">
            <span>Discount on MRP&nbsp;: </span> <span>&nbsp; - ₹${Math.abs(order.rawPrice - order.totalMRP)}</span>
          </div>

          ${
            order.discountedAmount > 0
            ? `<div class="summary-item"><span>Coupon Discount:&nbsp; </span> <span> &nbsp;- ₹${order.discountedAmount}</span></div>`
            : ''
          }

          <div class="summary-item">
            <span>Platform Fee:&nbsp; </span> <span>&nbsp;₹${order.platformFee}</span>
          </div>

          <div class="summary-item">
            <span>Shipping:&nbsp; </span> <span>&nbsp;₹${order.shippingCharge}</span>
          </div>

          ${order.walletDiscount > 0 ? `<div class="summary-item">
            <span>Wallet Discount:&nbsp; </span> <span>&nbsp; - ₹${Math.ceil(order.walletDiscount)}</span>
          </div>` : ''}

          <div class="total">
            <span>Total Amount:&nbsp; </span>
            <span>&nbsp;₹${Math.ceil(order.totalAmount)}</span>
          </div>

        </div>
      </div>

      <a class="btn" href="https://petcaart.com/account/orders">
        View Your Order
      </a>

      <p style="text-align:center; margin-top:25px; color:#666;">
        We’ll notify you once your order is shipped 🐶🐾  
      </p>

    </div>

    <div class="footer">
      © 2025 Petcaart. All rights reserved. <br />
      Made with love for pets 🐾
    </div>

  </div>

</body>
</html>
`;


   const emailOptions = {
      from: `"Petcaart 🐾" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order Received - ${order._id}`,
      html: htmlContent,
   };

   const emailSent = await sendEmail(emailOptions);
   if (emailSent.accepted.length > 0) {
      return {
         success: true,
         message: 'Email sent successfully',
         data: emailSent,
         statusCode: 200,
      };
   }

   return {
      success: false,
      message: 'Email not sent',
      data: emailSent,
      statusCode: 500,
   };
};

exports.sendEmailReminder = async (user, content, subject) => {
   const defaultContent = `
    <p>Looks like you left some pawsome items in your cart at <strong>PetCaart</strong>!</p>
    <p>Don't miss out on pampering your furry friend — hurry, this special offer expires soon.</p>
    <p>Complete your order now and make your pet’s day special. 🐶🐱</p>

    <a href="https://petcaart.com/cart" class="cta-btn">🛒 Complete My Order</a>
  `;

   const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>${subject || 'We Miss You! 🐾'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          background: #f8f8fc;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .email-container {
          max-width: 650px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .email-header {
          background: #ffe6ec;
          padding: 24px;
          text-align: center;
        }

        .email-header img {
          max-width: 140px;
          margin-bottom: 10px;
        }

        .tagline {
          font-size: 14px;
          color: #e91e63;
          font-style: italic;
        }

        .email-body {
          padding: 30px;
        }

        h2 {
          color: #e91e63;
          margin-bottom: 12px;
        }

        p {
          font-size: 15px;
          line-height: 1.6;
          color: #555;
        }

        .cta-btn {
          display: inline-block;
          background-color: #e91e63;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 20px;
        }

        .cta-btn:hover {
          background-color: #d81b60;
        }

        .footer {
          padding: 20px;
          text-align: center;
          font-size: 13px;
          color: #999;
          border-top: 1px solid #eee;
        }
      </style>
    </head>

    <body>
      <div class="email-container">
        <div class="email-header">
          <img src="https://pet-cart-admin.vercel.app/logo-light.jpg" alt="Petcaart Logo" />
          <div class="tagline">Your pet deserve the best</div>
        </div>

        <div class="email-body">
          <h2>Hello, ${user.name || 'Valued Customer'} 🐾</h2>
          ${content || defaultContent}

          <a href="https://petcaart.com" class="cta-btn">🛒 Visit PetCaart</a>
        </div>

        <div class="footer">
          © 2025 Petcaart. All rights reserved. <br />
          Powered by love for pets 🐾
        </div>
      </div>
    </body>
  </html>
  `;

   const emailOptions = {
      from: `"Petcaart 🐾" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject || `A Special Treat for You, ${user.name || 'Pet Lover'}! 🐾`,
      html: htmlContent,
   };

   const emailSent = await sendEmail(emailOptions);

   if (emailSent.accepted?.length > 0) {
      return {
         success: true,
         message: 'Reminder email sent successfully',
         data: emailSent,
         statusCode: 200,
      };
   }

   return {
      success: false,
      message: 'Failed to send reminder email',
      data: emailSent,
      statusCode: 500,
   };
};
