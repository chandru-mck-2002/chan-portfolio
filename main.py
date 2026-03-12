from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# FastAPI app
app = FastAPI(
    title="Portfolio Contact API",
    description="This API sends email notifications from contact form.",
    version="1.0.0"
)

# Mount static folder
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Load .env variables
load_dotenv()

# Email credentials
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

Message:
{message}
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


# Pydantic model
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

    # Send email only
    send_email_notification(
        data.name,
        data.email,
        data.subject,
        data.message
    )

    return JSONResponse(content={
        "status": "success",
        "message": f"Thanks {data.name}, your message has been sent!"
    })


# Run app
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
