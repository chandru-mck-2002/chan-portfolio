from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles  
from pydantic import BaseModel
import mysql.connector
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# FastAPI app
app = FastAPI(
    title="Portfolio Contact API",
    description="This API stores contact form submissions and sends email notifications.",
    version="1.0.0"
)

# Mount static folder
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Load .env variables
load_dotenv()

# Connect to MySQL (AWS RDS)
db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS"),
    database=os.getenv("DB_NAME"),
    port=int(os.getenv("DB_PORT", 3306))
)
cursor = db.cursor(dictionary=True)

# Email credentials (use Render environment variables for safety)
SENDER_EMAIL = os.environ.get("SENDER_EMAIL")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD")
RECEIVER_EMAIL = os.environ.get("RECEIVER_EMAIL")

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

# Run app
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Render provides $PORT
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
