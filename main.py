from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles  
from pydantic import BaseModel
import mysql.connector
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# FastAPI app
app = FastAPI(
    title="Portfolio Contact API",
    description="This API stores contact form submissions and sends email notifications.",
    version="1.0.0"
)

# Mount static folder (CSS, JS, Images)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

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
def send_email_notification(name: str, email: str, subject: str, message: str):
    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECEIVER_EMAIL
    msg["Subject"] = f"New Contact Form Submission: {subject}"

    body = f"""
    Name: {name}
    Email: {email}
    Subject: {subject}
    Message: {message}
    """
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print("Email sent successfully!")
    except Exception as e:
        print("Error sending email:", e)

# Pydantic model for validation
class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# Home route
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Submit route
@app.post("/submit")
def submit_form(data: ContactForm):
    # Save to DB
    query = "INSERT INTO messages (name, email, subject, message) VALUES (%s, %s, %s, %s)"
    values = (data.name, data.email, data.subject, data.message)
    cursor.execute(query, values)
    db.commit()

    # Send email
    send_email_notification(data.name, data.email, data.subject, data.message)

    return JSONResponse(content={
        "status": "success",
        "message": f"Thanks {data.name}, your message has been saved and emailed!"
    })
