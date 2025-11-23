const htmlToPdf = require("html-pdf-node");
const { sendEmail } = require('../nodeMailer');

exports.generateOrderBill = async (order, user, address) => {
  const htmlContent = `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation - Petcaart</title>
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

      .section {
        margin-bottom: 24px;
      }

      .section-title {
        font-weight: 600;
        margin-bottom: 6px;
        color: #555;
      }

      .section-content {
        background: #fafafa;
        padding: 16px;
        border-radius: 8px;
        font-size: 14px;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        margin: 4px 0;
      }

      .total {
        font-weight: 600;
        color: #000;
      }

      .footer {
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: #999;
        border-top: 1px solid #eee;
      }

      @media (max-width: 600px) {
        .email-body {
          padding: 20px;
        }

        .email-header {
          padding: 20px;
        }
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
        <h2>Thank you for your order, ${user.name}! 🎉</h2>
        <p>Your order has been successfully placed. Here's a quick summary:</p>

        <div class="section">
          <div class="section-title">Order ID</div>
          <div class="section-content">${order._id}</div>
        </div>

        <div class="section">
          <div class="section-title">Shipping Address</div>
          <div class="section-content">
            ${address.name}<br />
            ${address.address}, ${address.city}<br />
            ${address.state}, ${address.country} - ${address.pincode}<br />
            Mobile: ${address.mobile}<br />
            Email: ${address.email}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Payment Method</div>
          <div class="section-content">${order.paymentMethod}</div>
        </div>

        <div class="section">
          <div class="section-title">Order Summary</div>
          <div class="section-content">
            <div class="summary-item"><span>Raw Price:</span> ₹${order.rawPrice}</div>
            <div class="summary-item"><span>Discount:</span> ₹${order.discountedAmount}</div>
            <div class="summary-item"><span>Subtotal:</span> ₹${order.discountedAmountAfterCoupon}</div>
            <div class="summary-item"><span>Tax:</span> ₹${order.tax}</div>
            <div class="summary-item"><span>Shipping:</span> ₹${order.shippingCost}</div>
            <div class="summary-item total"><span>Total:</span> ₹${order.totalAmount}</div>
          </div>
        </div>

        <p>A detailed invoice PDF has been attached to this email.</p>
        <p>We’ll notify you once your order is shipped. 🐶</p>
      </div>

      <div class="footer">
        © 2025 Petcaart. All rights reserved. <br />
        Powered by love for pets 🐾
      </div>
    </div>
  </body>
</html>

  `;

  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();

  const emailOptions = {
    from: `"Petcaart 🐾" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Order Received - ${order._id}`,
    html: htmlContent,
    attachments: [
      {
        filename: `order-${order._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
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
      <title>${subject || "We Miss You! 🐾"}</title>
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
          <h2>Hello, ${user.name || "Valued Customer"} 🐾</h2>
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
    subject: subject || `A Special Treat for You, ${user.name || "Pet Lover"}! 🐾`,
    html: htmlContent,
  };

  const emailSent = await sendEmail(emailOptions);

  if (emailSent.accepted?.length > 0) {
    return {
      success: true,
      message: "Reminder email sent successfully",
      data: emailSent,
      statusCode: 200,
    };
  }

  return {
    success: false,
    message: "Failed to send reminder email",
    data: emailSent,
    statusCode: 500,
  };
};
