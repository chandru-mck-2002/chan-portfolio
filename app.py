from flask import Flask, request, render_template, jsonify
import mysql.connector
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="chandru",
    database="contact_db"
)
cursor = db.cursor(dictionary=True)

# Email credentials
SENDER_EMAIL = "chanmck449@gmail.com"
SENDER_PASSWORD = "tefw jmyg mhre rzlm"
RECEIVER_EMAIL = "chandru2002mck@gmail.com"

# Function to send email
def send_email_notification(name, email, subject, message):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECEIVER_EMAIL
    msg['Subject'] = f"New Contact Form Submission: {subject}"

    body = f"""
    Name: {name}
    Email: {email}
    Subject: {subject}
    Message: {message}
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print("Email sent successfully!")
    except Exception as e:
        print("Error sending email:", e)

# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Submit route
@app.route('/submit', methods=['POST'])
def submit_form():
    data = request.get_json()  # since JS sends JSON
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    # Save to database
    query = "INSERT INTO messages (name, email, subject, message) VALUES (%s, %s, %s, %s)"
    values = (name, email, subject, message)
    cursor.execute(query, values)
    db.commit()

    # Send email notification
    send_email_notification(name, email, subject, message)

    return jsonify({
        "status": "success",
        "message": f"Thanks {name}, your message has been saved and emailed!"
    })

if __name__ == '__main__':
    app.run(debug=True)
