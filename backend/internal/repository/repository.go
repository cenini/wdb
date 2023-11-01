package repository

import (
	"wdb/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) *Repository {
	return &Repository{
		db: db,
	}
}

func (r *Repository) GetUsers(c *gin.Context) ([]models.User, error) {
	var users []models.User
	_, err := r.db.NewSelect().Model(&users).Exec(c)
	if err != nil {
		return users, err
	}
	return users, nil
}

func (r *Repository) CreateUser(user models.User, c *gin.Context) (models.CreatedUser, error) {
	var createdUser models.CreatedUser
	statement, err := r.db.Prepare(`INSERT INTO users(email, handle) VALUES ($1, $2) returning id`)
	if err != nil {
		return createdUser, err
	}
	defer statement.Close()

	var id uuid.UUID
	err = statement.QueryRow(
		user.Email,
		user.Handle,
	).Scan(&id)

	if err != nil {
		return createdUser, err
	}
	createdUser.Id = id
	return createdUser, nil
}

func (r *Repository) DeleteUser() {

}

func (r *Repository) CreateItem() {

}

func (r *Repository) UpdateItem() {

}

func (r *Repository) DeleteItem() {

}

func (r *Repository) CreatePhoto() {

}

func (r *Repository) UpdatePhoto() {

}

func (r *Repository) DeletePhoto() {

}
