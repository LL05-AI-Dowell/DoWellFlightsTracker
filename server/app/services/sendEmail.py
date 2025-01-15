import requests

def send_email(toname, toemail, customer_id, product_id, user_id, password, help_link, direct_login_link):
    url = "https://100085.pythonanywhere.com/api/email/"
    
    email_content = f"""
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Registration Email</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}

            table {{
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
            }}

            h2 {{
                color: #333333;
                font-size: 22px;
                margin-bottom: 10px;
            }}

            p {{
                font-size: 16px;
                color: #333333;
                line-height: 1.5;
                margin-bottom: 10px;
            }}

            .credentials-box {{
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                padding: 20px;
                margin: 20px 0;
            }}

            .credential-item {{
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #dee2e6;
            }}

            .credential-item:last-child {{
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }}

            .credential-label {{
                font-weight: bold;
                color: #495057;
                display: block;
                margin-bottom: 5px;
            }}

            .credential-value {{
                color: #007BFF;
                font-size: 18px;
                font-family: monospace;
            }}

            .button {{
                display: inline-block;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 20px;
                border-radius: 4px;
                font-size: 16px;
                text-align: center;
                margin-top: 15px;
            }}
        </style>
    </head>

    <body>
        <table>
            <tr>
                <td style="text-align: center; padding-bottom: 20px;">
                    <img src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png" alt="DoWell Logo"
                        style="max-width: 150px; height: auto;">
                </td>
            </tr>
            <tr>
                <td>
                    <h2>Hello {toname},</h2>
                    <p>Welcome! We're excited to have you on board.</p>

                    <div class="credentials-box">
                        <div class="credential-item">
                            <span class="credential-label">Product ID</span>
                            <span class="credential-value">{product_id}</span>
                        </div>
                        <div class="credential-item">
                            <span class="credential-label">User ID</span>
                            <span class="credential-value">{user_id}</span>
                        </div>
                        <div class="credential-item">
                            <span class="credential-label">Password</span>
                            <span class="credential-value">{password}</span>
                        </div>
                    </div>

                    <p>Your Customer ID is: <strong>{customer_id}</strong></p>
                    <p>Your registered email ID is: <strong>{toemail}</strong></p>
                    <p>Please use {customer_id} when you interact with us. Always email us from your registered email to ensure a quick response.</p>

                    <p style="text-align: center;">
                        <a href="{direct_login_link}" class="button">Login Now</a>
                    </p>

                    <p>If you have any trouble or need help, please use the button below:</p>
                    <p style="text-align: center;">
                        <a href="{help_link}" class="button">Help & Support</a>
                    </p>

                    <p>If you have any questions or need assistance, feel free to reach out. We're here to help!</p>

                    <p>Best regards,<br>The DoWell Team</p>
                </td>
            </tr>
        </table>
    </body>

    </html>
    """
    payload = {
        "toname": toname,
        "toemail": toemail,
        "subject": "Welcome to DoWell Flight Tracker",
        "email_content": email_content
    }
    
    response = requests.post(url, json=payload)
    print(response.text)
    return response.text