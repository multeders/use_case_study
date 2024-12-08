package main

import (
	"encoding/json"
	"log"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"github.com/streadway/amqp"
	"github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
)

type Notification struct {
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Message string `json:"message"`
}

func main() {
	conn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %v", err)
	}
	defer ch.Close()

	queue, err := ch.QueueDeclare(
		"notifications", true, false, false, false, nil,
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %v", err)
	}

	msgs, err := ch.Consume(queue.Name, "", true, false, false, false, nil)
	if err != nil {
		log.Fatalf("Failed to register a consumer: %v", err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			var notification Notification
			err := json.Unmarshal(d.Body, &notification)
			if err != nil {
				log.Printf("Failed to parse message: %v", err)
				continue
			}

			if os.Getenv("ENV") == "development" {
				log.Printf("Mail should be sent to: %s", notification.Email)
				log.Printf("Text message should be sent to: %s", notification.Phone)
			} else {
				sendEmail(notification.Email, notification.Message)
				sendSMS(notification.Phone, notification.Message)
			}

		}
	}()

	log.Println("Waiting for messages...")
	<-forever
}

func sendEmail(to, message string) {
	if os.Getenv("SENDGRID_API_KEY") != "" {
		from := mail.NewEmail("Notification Service", "no-reply@example.com")
		toEmail := mail.NewEmail("User", to)
		subject := "New Notification"
		content := mail.NewContent("text/plain", message)
		m := mail.NewV3MailInit(from, subject, toEmail, content)

		client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
		_, err := client.Send(m)
		if err != nil {
			log.Printf("Failed to send email: %v", err)
		} else {
			log.Printf("Email sent to %s", to)
		}
	} else {
		log.Println("No SENDGRID_API_KEY provided")
	}
}

func sendSMS(to, message string) {
	if os.Getenv("SENDGRID_API_KEY") != "" {
		client := twilio.NewRestClient()
		params := &openapi.CreateMessageParams{}
		params.SetTo(to)
		params.SetFrom(os.Getenv("TWILIO_PHONE_NUMBER"))
		params.SetBody(message)

		_, err := client.Api.CreateMessage(params)
		if err != nil {
			log.Printf("Failed to send SMS: %v", err)
		} else {
			log.Printf("SMS sent to %s", to)
		}
	} else {
		log.Println("No TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN provided")
	}

}
