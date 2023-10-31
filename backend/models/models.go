package models

import "github.com/google/uuid"

// Define your data models here
type User struct {
	Id uuid.UUID
	// Email must be no more than 254 characters
	Email string
	// Handle must be no more than 32 characters
	Handle string
}
